/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-unused-expressions */

import SVGPathUtils from '../utils/index';

import { Controller, useForm } from 'react-hook-form';
import Select, { type SingleValue, type StylesConfig } from 'react-select';
import { create } from 'zustand';

import edges from '../data/edge.json';
import stations from '../data/labels.json';




const utils = SVGPathUtils;

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

  getNodes() {
    return this.nodes;
  }

  findShortestPath(
    start: string,
    end: string
  ): { path: string[]; distance: number } | null {
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
    let currentNode = end;
    while (currentNode !== null) {
      path.unshift(currentNode);
      currentNode = previous.get(currentNode)!;
    }

    if (path.length === 1 && path[0] !== start) return null; // No path found
    return { path, distance: distances.get(end)! };
  }

  private getMinDistanceNode(
    distances: Map<string, number>,
    visited: Set<string>
  ): GraphNode | null {
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

for (const station of stations) {
  graph.addNode(station.id);
}

for (const edge of edges) {
  graph.addEdge(edge.from, edge.to, 1);
}


export const usePath = create((set) => {
  return {
    path: '',
    route: null,
    selectedFrom: stations[0]?.id || '',
    setSelectedFrom: (stationId: string) => set(() => ({ selectedFrom: stationId })),
    setRoute: (newPath: string, route: RouteSummary) =>
      set(() => ({ path: newPath, route })),
    setPath: (newPath: string) => set(() => ({ path: newPath })),
    setInverse: (newPath: string) => set(() => ({ path: newPath })),
  };
});

export interface RouteSummary {
  from: string;
  to: string;
  fromName: string;
  toName: string;
  stops: string[];
  stationDetails: RouteStationDetail[];
  interchanges: RouteInterchange[];
  distance: number;
  fare: number;
  estimatedMinutes: number;
}

export interface RouteStationDetail {
  id: string;
  name: string;
  lineColors: string[];
}

export interface RouteInterchange {
  id: string;
  name: string;
  fromColor: string;
  toColor: string;
}

const stationName = (id: string) =>
  stations.find((station) => station.id === id)?.text || id;

const estimateFare = (stops: number) => {
  if (stops <= 2) return 10;
  if (stops <= 5) return 20;
  if (stops <= 12) return 30;
  if (stops <= 21) return 40;
  if (stops <= 32) return 50;
  return 60;
};

interface StationOption {
  label: string;
  value: string;
  lineColors: string[];
}

const getRouteEdge = (from: string, to: string) =>
  edges.find((edge) => edge.from === from && edge.to === to) ||
  edges.find((edge) => edge.from === to && edge.to === from);

const uniqueColors = (colors: string[]) => [...new Set(colors.filter(Boolean))];

const getRouteStationDetails = (routePath: string[]): RouteStationDetail[] =>
  routePath.map((stationId, index) => {
    const previousEdge = index > 0 ? getRouteEdge(routePath[index - 1], stationId) : undefined;
    const nextEdge = index < routePath.length - 1 ? getRouteEdge(stationId, routePath[index + 1]) : undefined;

    return {
      id: stationId,
      name: stationName(stationId),
      lineColors: uniqueColors([previousEdge?.stroke || '', nextEdge?.stroke || '']),
    };
  });

const getRouteInterchanges = (routePath: string[]): RouteInterchange[] =>
  routePath.slice(1, -1).flatMap((stationId, index) => {
    const routeIndex = index + 1;
    const previousEdge = getRouteEdge(routePath[routeIndex - 1], stationId);
    const nextEdge = getRouteEdge(stationId, routePath[routeIndex + 1]);

    if (!previousEdge || !nextEdge || previousEdge.stroke === nextEdge.stroke) return [];

    return [{
      id: stationId,
      name: stationName(stationId),
      fromColor: previousEdge.stroke,
      toColor: nextEdge.stroke,
    }];
  });

const getStationLineColors = (stationId: string) =>
  uniqueColors(edges
    .filter((edge) => edge.from === stationId || edge.to === stationId)
    .map((edge) => edge.stroke));

const stationOptions: StationOption[] = stations.map((station) => ({
  label: station.text,
  value: station.id,
  lineColors: getStationLineColors(station.id),
}));

const selectStyles: StylesConfig<StationOption, false> = {
  control: (base) => ({
    ...base,
    minHeight: 58,
    border: 0,
    borderRadius: 999,
    backgroundColor: 'white',
    boxShadow: 'none',
    paddingLeft: 14,
    paddingRight: 6,
  }),
  valueContainer: (base) => ({
    ...base,
    padding: 0,
  }),
  indicatorsContainer: (base) => ({
    ...base,
    display: 'none',
  }),
  menu: (base) => ({
    ...base,
    borderRadius: 16,
    overflow: 'hidden',
    zIndex: 30,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? '#f5f5f5' : 'white',
    color: '#111',
  }),
};

function ToggleIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="15" cy="15" r="15" fill="white" />
      <path d="M10.022 12.3254L11.9038 9.23479L13.8412 12.3254" stroke="black" strokeLinecap="round" />
      <path d="M11.9343 19.7286L11.9391 9.69627" stroke="black" strokeLinecap="round" />
      <path d="M15.7609 16.6381L17.8596 19.7286L19.9221 16.7408" stroke="black" strokeLinecap="round" />
      <path d="M17.8901 9.23479L17.8949 19.2671" stroke="black" strokeLinecap="round" />
    </svg>
  );
}

function LineBadge({ colors }: { colors: string[] }) {
  const color = colors[0] || '#d1d5db';

  return (
    <span className="flex h-9 min-w-9 items-center justify-center rounded-full px-2 text-sm font-semibold" style={{ backgroundColor: color }}>
      L
    </span>
  );
}

function StationOptionLabel({ option }: { option: StationOption }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="truncate text-lg font-medium">{option.label}</span>
      <LineBadge colors={option.lineColors} />
    </div>
  );
}


export function SearchBox({
  onFromChange,
  onRoutePlan,
}: {
  onFromChange?: () => void;
  onRoutePlan?: () => void;
}) {
  const { control, getValues, handleSubmit, setValue } = useForm({
    defaultValues: {
      from: stationOptions[0]?.value || '',
      to: stationOptions[1]?.value || stationOptions[0]?.value || '',
    },
  });
  const setRoute = usePath((state: any) => state.setRoute);
  const setSelectedFrom = usePath((state: any) => state.setSelectedFrom);

  const swapStations = () => {
    const fromValue = getValues('from');
    const toValue = getValues('to');

    setValue('from', toValue);
    setValue('to', fromValue);
    setSelectedFrom(toValue);
    onFromChange?.();
  };

  return (
    <form
      onSubmit={handleSubmit((e) => {
        const shortedPath = graph.findShortestPath(e.from, e.to);

        if (!shortedPath) return;

        shortedPath.path;

        const nPath = shortedPath.path;
        const newPath = nPath
          .map((i, num) => {
            if (i === e.to) return '';
            const toRoute = nPath[num + 1];

            const item = edges.find(
              (item) => item.from === i && item.to === toRoute
            )?.path;

            console.log(i, toRoute, item);
            if (item) return item;
            else {
              const second = edges.find(
                (item) => item.from === toRoute && item.to === i
              )?.path || "";
              const inversePath = utils.inversePath(second);
              return inversePath;
            }
          })
          .filter((e) => e !== undefined);

        const newpt = newPath.reverse().join('');
        const inversepath = utils.inversePath(newpt);
        setRoute(inversepath, {
          from: e.from,
          to: e.to,
          fromName: stationName(e.from),
          toName: stationName(e.to),
          stops: shortedPath.path.map(stationName),
          stationDetails: getRouteStationDetails(shortedPath.path),
          interchanges: getRouteInterchanges(shortedPath.path),
          distance: shortedPath.distance,
          fare: estimateFare(shortedPath.distance),
          estimatedMinutes: Math.max(2, shortedPath.distance * 2),
        });
        onRoutePlan?.();

        console.log(shortedPath.path, newPath, newpt);
      })}
      className='grid gap-4'
    >
      <div className='grid grid-cols-[minmax(0,1fr)_44px_minmax(0,1fr)] items-center gap-3'>
        <Controller
          control={control}
          name="from"
          render={({ field }) => (
            <Select
              instanceId="from-station"
              options={stationOptions}
              value={stationOptions.find((option) => option.value === field.value)}
              onChange={(option: SingleValue<StationOption>) => {
                const nextValue = option?.value || '';
                field.onChange(nextValue);
                setSelectedFrom(nextValue);
                onFromChange?.();
              }}
              formatOptionLabel={(option) => <StationOptionLabel option={option} />}
              styles={selectStyles}
              isSearchable
            />
          )}
        />
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm transition hover:scale-105"
          onClick={swapStations}
          title="Swap stations"
        >
          <ToggleIcon />
        </button>
        <Controller
          control={control}
          name="to"
          render={({ field }) => (
            <Select
              instanceId="to-station"
              options={stationOptions}
              value={stationOptions.find((option) => option.value === field.value)}
              onChange={(option: SingleValue<StationOption>) => field.onChange(option?.value || '')}
              formatOptionLabel={(option) => <StationOptionLabel option={option} />}
              styles={selectStyles}
              isSearchable
            />
          )}
        />
      </div>
      <button className='h-12 rounded-full bg-neutral-950 px-4 text-sm font-semibold text-white transition hover:bg-neutral-800'>
        Plan journey
      </button>
    </form>
  );
}
