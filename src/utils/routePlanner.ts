import { getLocalizedStationName, type Language } from '../i18n';
import type { RouteInterchange, RoutePlan, RouteSortMode, RouteStationDetail } from '../types/route';
import type { StationInfo } from '../types/station';
import SVGPathUtils from './index';

import rawEdges from '../data/edge.json';
import rawStations from '../data/stations-lite.json';

type StationWithCoordinates = StationInfo & {
  Latitude: number;
  Longitude: number;
};

type MetroEdge = {
  from: string;
  to: string;
  stroke: string;
  path: string;
};

export const stations = (rawStations as StationInfo[]).filter((station) => station.id && station.text);
export const edges = rawEdges as MetroEdge[];
const AIRPORT_LINE_COLOR = '#eb8923';
const AIRPORT_LINE_STATIONS = ['NDI', 'SJSU', 'DKV', 'DACY', 'APOT', 'DSTO', 'IICC'] as const;
const AIRPORT_LINE_STATION_SET = new Set<string>(AIRPORT_LINE_STATIONS);
const RAPID_METRO_LINE_COLOR = '#015b97';
const RAPID_METRO_DIRECTED_EDGES = new Set([
  'SKRP>DL2',
  'DL2>SKRP',
  'DL2>BEL',
  'BEL>GAT',
  'GAT>MAL',
  'MAL>DL3',
  'DL3>DL2',
]);
const AIRPORT_LINE_FARES: Record<string, number> = {
  'NDI>SJSU': 21,
  'NDI>DKV': 43,
  'NDI>DACY': 54,
  'NDI>APOT': 64,
  'NDI>DSTO': 64,
  'NDI>IICC': 75,
  'SJSU>DKV': 21,
  'SJSU>DACY': 32,
  'SJSU>APOT': 54,
  'SJSU>DSTO': 64,
  'SJSU>IICC': 75,
  'DKV>DACY': 21,
  'DKV>APOT': 32,
  'DKV>DSTO': 54,
  'DKV>IICC': 64,
  'DACY>APOT': 21,
  'DACY>DSTO': 32,
  'DACY>IICC': 43,
  'APOT>DSTO': 21,
  'APOT>IICC': 32,
  'DSTO>IICC': 21,
};

class GraphNode {
  value: string;
  edges: Map<GraphNode, number>;

  constructor(value: string) {
    this.value = value;
    this.edges = new Map();
  }

  addEdge(node: GraphNode, weight: number) {
    this.edges.set(node, weight);
  }

  getEdges() {
    return this.edges;
  }
}

class WeightedGraph {
  nodes: Map<string, GraphNode>;

  constructor() {
    this.nodes = new Map();
  }

  addNode(value: string) {
    this.nodes.set(value, new GraphNode(value));
  }

  getNode(value: string) {
    return this.nodes.get(value);
  }

  addEdge(source: string, destination: string, weight: number) {
    const sourceNode = this.getNode(source);
    const destinationNode = this.getNode(destination);
    if (sourceNode && destinationNode) {
      sourceNode.addEdge(destinationNode, weight);
      destinationNode.addEdge(sourceNode, weight);
    }
  }

  addDirectedEdge(source: string, destination: string, weight: number) {
    const sourceNode = this.getNode(source);
    const destinationNode = this.getNode(destination);
    if (sourceNode && destinationNode) {
      sourceNode.addEdge(destinationNode, weight);
    }
  }

  findShortestPath(start: string, end: string): { path: string[]; distance: number } | null {
    const distances: Map<string, number> = new Map();
    const previous: Map<string, string | null> = new Map();
    const visited: Set<string> = new Set();

    for (const [key] of this.nodes) {
      distances.set(key, Infinity);
      previous.set(key, null);
    }
    distances.set(start, 0);

    while (visited.size !== this.nodes.size) {
      const currentNode = this.getMinDistanceNode(distances, visited);
      if (!currentNode) break;

      visited.add(currentNode.value);

      for (const [neighbor, weight] of currentNode.getEdges()) {
        const totalDistance = distances.get(currentNode.value)! + weight;
        if (totalDistance < distances.get(neighbor.value)!) {
          distances.set(neighbor.value, totalDistance);
          previous.set(neighbor.value, currentNode.value);
        }
      }
    }

    const path: string[] = [];
    let currentNode: string | null = end;
    while (currentNode !== null) {
      path.unshift(currentNode);
      currentNode = previous.get(currentNode)!;
    }

    if (path.length === 1 && path[0] !== start) return null;
    return { path, distance: distances.get(end)! };
  }

  findShortestPaths(start: string, end: string, limit = 3): Array<{ path: string[]; distance: number }> {
    if (start === end) return [{ path: [start], distance: 0 }];
    if (!this.nodes.has(start) || !this.nodes.has(end)) return [];

    const routes: Array<{ path: string[]; distance: number }> = [];
    const seenRoutes = new Set<string>();
    const queue: Array<{ path: string[]; distance: number }> = [{ path: [start], distance: 0 }];
    let maxDistance = Infinity;

    while (queue.length && routes.length < limit) {
      queue.sort((left, right) => left.distance - right.distance || left.path.length - right.path.length);
      const candidate = queue.shift()!;
      const currentStationId = candidate.path[candidate.path.length - 1];

      if (candidate.distance > maxDistance) continue;

      if (currentStationId === end) {
        const routeKey = candidate.path.join('>');
        if (!seenRoutes.has(routeKey)) {
          seenRoutes.add(routeKey);
          routes.push(candidate);

          if (routes.length === 1) {
            maxDistance = candidate.distance + Math.max(8, Math.ceil(candidate.distance * 0.35));
          }
        }
        continue;
      }

      const currentNode = this.getNode(currentStationId);
      if (!currentNode) continue;

      const visitedStations = new Set(candidate.path);
      const nextStations = [...currentNode.getEdges()]
        .map(([node, weight]) => ({ stationId: node.value, weight }))
        .sort((left, right) => left.stationId.localeCompare(right.stationId));

      for (const nextStation of nextStations) {
        if (visitedStations.has(nextStation.stationId)) continue;

        const nextDistance = candidate.distance + nextStation.weight;
        if (nextDistance > maxDistance) continue;

        queue.push({
          path: [...candidate.path, nextStation.stationId],
          distance: nextDistance,
        });
      }

      if (queue.length > 20000) {
        queue.length = 20000;
      }
    }

    return routes;
  }

  private getMinDistanceNode(distances: Map<string, number>, visited: Set<string>): GraphNode | null {
    let minDistance = Infinity;
    let minNode: GraphNode | null = null;
    for (const [key, value] of distances) {
      if (!visited.has(key) && value < minDistance) {
        minDistance = value;
        minNode = this.getNode(key)!;
      }
    }
    return minNode;
  }
}

const graph = new WeightedGraph();
const stationById = new Map(stations.map((station) => [station.id, station]));

const toRadians = (degrees: number) => degrees * (Math.PI / 180);

const isValidCoordinatePair = (station: StationInfo | undefined): station is StationWithCoordinates =>
  typeof station?.Latitude === 'number' &&
  typeof station?.Longitude === 'number' &&
  station.Latitude >= 27.5 &&
  station.Latitude <= 29.5 &&
  station.Longitude >= 76 &&
  station.Longitude <= 78.5;

const distanceBetweenStationsKm = (from: string, to: string) => {
  const fromStation = stationById.get(from);
  const toStation = stationById.get(to);

  if (!isValidCoordinatePair(fromStation) || !isValidCoordinatePair(toStation)) return 1;

  const earthRadiusKm = 6371;
  const latitudeDelta = toRadians(toStation.Latitude - fromStation.Latitude);
  const longitudeDelta = toRadians(toStation.Longitude - fromStation.Longitude);
  const fromLatitude = toRadians(fromStation.Latitude);
  const toLatitude = toRadians(toStation.Latitude);
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(fromLatitude) * Math.cos(toLatitude) * Math.sin(longitudeDelta / 2) ** 2;

  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
};

const edgeDistanceKey = (from: string, to: string) => [from, to].sort().join('>');
const edgeDistanceKm = new Map<string, number>();

const rapidMetroDirectedKey = (from: string, to: string) => `${from}>${to}`;
const getRapidMetroDirectedEndpoints = (edge: MetroEdge) => {
  const forwardKey = rapidMetroDirectedKey(edge.from, edge.to);
  const reverseKey = rapidMetroDirectedKey(edge.to, edge.from);

  if (RAPID_METRO_DIRECTED_EDGES.has(forwardKey)) return [edge.from, edge.to] as const;
  if (RAPID_METRO_DIRECTED_EDGES.has(reverseKey)) return [edge.to, edge.from] as const;

  return null;
};

for (const station of stations) {
  graph.addNode(station.id);
}

for (const edge of edges) {
  const distanceKm = distanceBetweenStationsKm(edge.from, edge.to);
  const routeWeight = edge.stroke.toLowerCase() === AIRPORT_LINE_COLOR
    ? Math.max(0.5, distanceKm * 0.28)
    : distanceKm;

  edgeDistanceKm.set(edgeDistanceKey(edge.from, edge.to), distanceKm);

  if (edge.stroke.toLowerCase() === RAPID_METRO_LINE_COLOR) {
    const directedEndpoints = getRapidMetroDirectedEndpoints(edge);
    if (directedEndpoints) {
      graph.addDirectedEdge(directedEndpoints[0], directedEndpoints[1], routeWeight);
      continue;
    }
  }

  graph.addEdge(edge.from, edge.to, routeWeight);
}

const uniqueColors = (colors: string[]) => [...new Set(colors.filter(Boolean))];

export const slugifyStationName = (name: string) =>
  name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const getStationSlug = (stationId: string) => {
  const station = stations.find((item) => item.id === stationId);
  return station ? slugifyStationName(station.text) : stationId.toLowerCase();
};

export const getStationBySlug = (slug: string) =>
  stations.find((station) => getStationSlug(station.id) === slug);

export const getStationById = (stationId: string | null | undefined) =>
  stationId ? stationById.get(stationId) : undefined;

export const isStationId = (stationId: string | null | undefined) =>
  Boolean(getStationById(stationId));

export const getRoutePathname = (from: string, to: string) =>
  `/routes/${getStationSlug(from)}-to-${getStationSlug(to)}/`;

export const getStationPathname = (stationId: string) =>
  `/stations/${getStationSlug(stationId)}/`;

export const parseRoutePathname = (pathname: string) => {
  const match = pathname.match(/^\/routes\/(.+)-to-(.+)\/?$/);
  if (!match) return null;

  const from = getStationBySlug(match[1]);
  const to = getStationBySlug(match[2]);
  if (!from || !to) return null;

  return { from: from.id, to: to.id };
};

export const estimateFare = (distanceKm: number, holiday = false) => {
  if (distanceKm <= 2) return 11;
  if (distanceKm <= 5) return holiday ? 11 : 21;
  if (distanceKm <= 12) return holiday ? 21 : 32;
  if (distanceKm <= 21) return holiday ? 32 : 43;
  if (distanceKm <= 32) return holiday ? 43 : 54;
  return holiday ? 54 : 64;
};

export const getFareTimeLimitMinutes = (distanceKm: number) => {
  if (distanceKm <= 12) return 65;
  if (distanceKm <= 21) return 100;
  return 180;
};

const getAirportFareKey = (from: string, to: string) => {
  const fromIndex = AIRPORT_LINE_STATIONS.indexOf(from as typeof AIRPORT_LINE_STATIONS[number]);
  const toIndex = AIRPORT_LINE_STATIONS.indexOf(to as typeof AIRPORT_LINE_STATIONS[number]);

  if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return '';

  return fromIndex < toIndex ? `${from}>${to}` : `${to}>${from}`;
};

const calculateRouteFare = (routePath: string[]) => {
  let airportFare = 0;
  let regularDistanceKm = 0;
  let airportStart = '';
  let airportEnd = '';

  routePath.slice(0, -1).forEach((stationId, index) => {
    const nextStationId = routePath[index + 1];
    const edge = getRouteEdge(stationId, nextStationId);
    const segmentDistanceKm = edgeDistanceKm.get(edgeDistanceKey(stationId, nextStationId)) || 1;
    const isAirportSegment = edge?.stroke.toLowerCase() === AIRPORT_LINE_COLOR;

    if (isAirportSegment && AIRPORT_LINE_STATION_SET.has(stationId) && AIRPORT_LINE_STATION_SET.has(nextStationId)) {
      airportStart ||= stationId;
      airportEnd = nextStationId;
      return;
    }

    regularDistanceKm += segmentDistanceKm;
  });

  if (airportStart && airportEnd) {
    airportFare = AIRPORT_LINE_FARES[getAirportFareKey(airportStart, airportEnd)] || 0;
  }

  if (!airportFare) {
    const distanceKm = roundDistanceKm(getRouteDistanceKm(routePath));
    return {
      fare: estimateFare(distanceKm),
      holidayFare: estimateFare(distanceKm, true),
      fareType: 'regular' as const,
    };
  }

  const regularDistance = roundDistanceKm(regularDistanceKm);
  return {
    fare: airportFare + (regularDistance > 0 ? estimateFare(regularDistance) : 0),
    holidayFare: airportFare + (regularDistance > 0 ? estimateFare(regularDistance, true) : 0),
    fareType: 'airport-express' as const,
  };
};

const calculateEstimatedMinutes = (routePath: string[], interchangeCount: number) => {
  const hasAirportExpress = routePath.slice(0, -1).some((stationId, index) => {
    const nextStationId = routePath[index + 1];
    return getRouteEdge(stationId, nextStationId)?.stroke.toLowerCase() === AIRPORT_LINE_COLOR;
  });

  if (!hasAirportExpress) return Math.max(2, (routePath.length - 1) * 2);

  const totalMinutes = routePath.slice(0, -1).reduce((minutes, stationId, index) => {
    const nextStationId = routePath[index + 1];
    const isAirportSegment = getRouteEdge(stationId, nextStationId)?.stroke.toLowerCase() === AIRPORT_LINE_COLOR;
    return minutes + (isAirportSegment ? 3.9 : 2.2);
  }, interchangeCount * 5);

  return Math.max(2, Math.round(totalMinutes));
};

const getRouteTimeLimitMinutes = (distanceKm: number, fareType: 'regular' | 'airport-express') => {
  if (fareType === 'airport-express') return 180;
  return getFareTimeLimitMinutes(distanceKm);
};

export const getStationLineColors = (stationId: string) =>
  uniqueColors(edges
    .filter((edge) => edge.from === stationId || edge.to === stationId)
    .map((edge) => edge.stroke));

const stationName = (id: string, language: Language) => {
  const fallbackName = stations.find((station) => station.id === id)?.text || id;
  return getLocalizedStationName(id, fallbackName, language);
};

const getRouteEdge = (from: string, to: string) =>
  edges.find((edge) => edge.from === from && edge.to === to) ||
  edges.find((edge) => edge.from === to && edge.to === from);

const getRouteDistanceKm = (routePath: string[]) =>
  routePath.slice(0, -1).reduce((totalDistance, stationId, index) => {
    const nextStationId = routePath[index + 1];
    return totalDistance + (edgeDistanceKm.get(edgeDistanceKey(stationId, nextStationId)) || 1);
  }, 0);

const roundDistanceKm = (distanceKm: number) => Math.round(distanceKm * 10) / 10;

const getRouteStationDetails = (routePath: string[], language: Language): RouteStationDetail[] =>
  routePath.map((stationId, index) => {
    const previousEdge = index > 0 ? getRouteEdge(routePath[index - 1], stationId) : undefined;
    const nextEdge = index < routePath.length - 1 ? getRouteEdge(stationId, routePath[index + 1]) : undefined;

    return {
      id: stationId,
      name: stationName(stationId, language),
      lineColors: uniqueColors([previousEdge?.stroke || '', nextEdge?.stroke || '']),
    };
  });

const getRouteInterchanges = (routePath: string[], language: Language): RouteInterchange[] =>
  routePath.slice(1, -1).flatMap((stationId, index) => {
    const routeIndex = index + 1;
    const previousEdge = getRouteEdge(routePath[routeIndex - 1], stationId);
    const nextEdge = getRouteEdge(stationId, routePath[routeIndex + 1]);

    if (!previousEdge || !nextEdge || previousEdge.stroke === nextEdge.stroke) return [];

    return [{
      id: stationId,
      name: stationName(stationId, language),
      fromColor: previousEdge.stroke,
      toColor: nextEdge.stroke,
    }];
  });

const buildRoutePlan = (
  from: string,
  to: string,
  language: Language,
  routePath: string[],
  optionIndex: number
): RoutePlan => {
  const newPath = routePath
    .map((stationId, index) => {
      if (stationId === to) return '';

      const nextStationId = routePath[index + 1];
      const forwardEdge = edges.find(
        (edge) => edge.from === stationId && edge.to === nextStationId
      )?.path;

      if (forwardEdge) return forwardEdge;

      const reverseEdge = edges.find(
        (edge) => edge.from === nextStationId && edge.to === stationId
      )?.path || '';

      return SVGPathUtils.inversePath(reverseEdge);
    })
    .filter((pathSegment) => pathSegment !== undefined);

  const combinedPath = newPath.reverse().join('');
  const svgPath = SVGPathUtils.inversePath(combinedPath);
  const interchanges = getRouteInterchanges(routePath, language);
  const stopCount = Math.max(0, routePath.length - 1);
  const distanceKm = roundDistanceKm(getRouteDistanceKm(routePath));
  const routeFare = calculateRouteFare(routePath);

  return {
    svgPath,
    route: {
      optionId: routePath.join('>') || `${from}>${to}>${optionIndex}`,
      from,
      to,
      fromName: stationName(from, language),
      toName: stationName(to, language),
      stops: routePath.map((stationId) => stationName(stationId, language)),
      stationDetails: getRouteStationDetails(routePath, language),
      interchanges,
      distance: stopCount,
      distanceKm,
      fare: routeFare.fare,
      holidayFare: routeFare.holidayFare,
      fareType: routeFare.fareType,
      timeLimitMinutes: getRouteTimeLimitMinutes(distanceKm, routeFare.fareType),
      estimatedMinutes: calculateEstimatedMinutes(routePath, interchanges.length),
    },
  };
};

export const buildRoutes = (from: string, to: string, language: Language, limit = 3): RoutePlan[] => {
  const routePaths = limit <= 1
    ? [graph.findShortestPath(from, to)].filter((routePath): routePath is { path: string[]; distance: number } => Boolean(routePath))
    : graph.findShortestPaths(from, to, limit);

  return routePaths.map((routePath, index) =>
    buildRoutePlan(from, to, language, routePath.path, index)
  );
};

export const buildRoute = (from: string, to: string, language: Language): RoutePlan | null => {
  const [route] = buildRoutes(from, to, language, 1);

  return route || null;
};

export const sortRoutePlans = (routePlans: RoutePlan[], sortMode: RouteSortMode = 'interchanges') =>
  [...routePlans].sort((left, right) => {
    if (sortMode === 'stops') {
      return left.route.distance - right.route.distance
        || left.route.interchanges.length - right.route.interchanges.length
        || left.route.distanceKm - right.route.distanceKm;
    }

    return left.route.interchanges.length - right.route.interchanges.length
      || left.route.distanceKm - right.route.distanceKm
      || left.route.distance - right.route.distance
      || left.route.estimatedMinutes - right.route.estimatedMinutes;
  });
