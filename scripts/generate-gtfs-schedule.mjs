import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const gtfsRoot = path.join(root, 'dmrc_static_gtfs_v1 (2)');

const readJson = (relativePath) =>
  JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));

const readCsv = (filename) => {
  const text = fs.readFileSync(path.join(gtfsRoot, filename), 'utf8').trim();
  const [headerLine, ...lines] = text.split(/\r?\n/);
  const headers = parseCsvLine(headerLine);

  return lines.map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']));
  });
};

const parseCsvLine = (line) => {
  const values = [];
  let current = '';
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      quoted = !quoted;
      continue;
    }

    if (char === ',' && !quoted) {
      values.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  values.push(current);
  return values;
};

const normalizeName = (value) =>
  value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\bsec\b/g, 'sector')
    .replace(/\s*\([^)]*\)/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const stationNameAliases = new Map(Object.entries({
  'seelam pur': 'seelampur',
  'pul bangash': 'pulbangash',
  'peera garhi': 'peeragarhi',
  'guru tegh bahadur nagar': 'guru teg bahadur nagar',
  'jorbagh': 'jor bagh',
  'chhattarpur': 'chhatarpur',
  'gurudronacharya': 'guru dronacharya',
  'anand vihar': 'anand vihar i s b t',
  'mayur vihar ext': 'mayur vihar extension',
  'mayur vihar i': 'mayur vihar 1',
  'barakhamba': 'barakhamba road',
  'rk ashram marg': 'ramakrishna ashram marg',
  'subash nagar': 'subhash nagar',
  'janak puri east': 'janakpuri east',
  'janak puri west': 'janakpuri west',
  'jawahar lal nehru stadium': 'jln stadium',
  'mg road': 'm g road',
  'escorts mujesar': 'ecorts mujesar',
  'igi airport': 'airport',
  'south extension': 'south extention',
  'mansrover park': 'mansarovar park',
  'netaji subash place': 'netaji subhash place',
  'inder lok': 'inderlok',
  'pulbangash': 'pulbangash',
  'chandni chowk': 'chandni chowk',
  'hoshiar singh': 'brig hoshiar singh',
  'guru dronacharya': 'guru dronacharya',
  'huda city centre': 'millennium city centre gurugram',
  'iffco chowk': 'iffco chowk',
  'delhi aerocity': 'delhi aerocity',
  'airport': 'airport',
  'dwarka sector 25': 'yashobhoomi dwarka sector 25',
  'phase i': 'phase 1',
  'majaraja surajmal stadium': 'maharaja surajmal stadium',
  'shakurpur': 'shakurpur',
  'esi basai darapur': 'esi basaidarapur',
  'rk puram': 'r k puram',
  'sadar bazar contonment': 'sadar bazar cantonment',
  'dashrath puri': 'dashrathpuri',
  'punjabi bagh west': 'punjabi bagh west',
  'sir vishweshwaraiah moti bagh': 'sir m vishweshwaraiah moti bagh',
  'brigadier hoshiyar singh': 'brig hoshiar singh',
  'delhi haat ina': 'dilli haat ina',
  'durgabai deshmukh south campus': 'durgabai deshmukh south campus',
  'sarai kale khan nizamuddin': 'sarai kale khan nizamuddin',
  'east vinod nagar mayur vihar ii': 'east vinod nagar mayur vihar ii',
  'mayur vihar pocket 1': 'mayur vihar pocket 1',
  'major mohit sharma rajender nagar': 'rajendra nagar',
  'noida sec 34': 'sector 34 noida',
  'noida sec 52': 'sector 52 noida',
  'noida sector 34': 'sector 34 noida',
  'noida sector 52': 'sector 52 noida',
  'noida sec 61': 'sector 61 noida',
  'noida sec 59': 'sector 59 noida',
  'noida sec 62': 'sector 62 noida',
  'noida sector 61': 'sector 61 noida',
  'noida sector 59': 'sector 59 noida',
  'noida sector 62': 'sector 62 noida',
  'nhpc chowk': 'nhpc chowk',
  'nsez': 'nsez',
  'greater kailash': 'greater kailash',
  'terminal 1 igi airport': 'terminal 1 igi airport',
  'i i t': 'iit',
  'jamia millia islamia': 'jamia millia islamia',
  'okhla vihar': 'okhla vihar',
  'kalindi kunj': 'kalindi kunj',
  'noida sector 142': 'noida sector 142',
}));

const stopIdOverrides = new Map(Object.entries({
  29: 'PVW',
  30: 'PVE',
}));

const timeToSeconds = (value) => {
  const [hours, minutes, seconds] = value.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

const extractPoints = (pathValue) => {
  const coordinates = [...pathValue.matchAll(/[-+]?\d*\.?\d+/g)].map(Number);
  return {
    first: { x: coordinates[0], y: coordinates[1] },
    last: { x: coordinates[coordinates.length - 2], y: coordinates[coordinates.length - 1] },
  };
};

const makeInversePath = (pathValue) => {
  const points = extractPoints(pathValue);
  return `M${points.last.x},${points.last.y} L${points.first.x},${points.first.y}`;
};

const routeColorByName = (routeName = '') => {
  const line = routeName.split('_')[0]?.toLowerCase();
  const colors = {
    red: '#c1282b',
    yellow: '#f5d618',
    blue: '#3e77bc',
    green: '#52aa55',
    violet: '#8115ff',
    pink: '#e692be',
    magenta: '#f0f',
    gray: '#d4d4d6',
    orange: '#eb8923',
    aqua: '#54fff3',
    rapid: '#015b97',
  };

  if (line.includes('orange') || line.includes('airport')) return colors.orange;

  return colors[line] || '#111827';
};

const stations = readJson('src/data/stations-lite.json');
const edges = readJson('src/data/edge.json');
const gtfsStops = readCsv('stops.txt');
const gtfsRoutes = readCsv('routes.txt');
const gtfsTrips = readCsv('trips.txt');
const gtfsStopTimes = readCsv('stop_times.txt');

const stationByNormalizedName = new Map();
for (const station of stations) {
  stationByNormalizedName.set(normalizeName(station.text), station);
}

const stopToStation = new Map();
const unmatchedStops = [];
for (const stop of gtfsStops) {
  const override = stopIdOverrides.get(stop.stop_id);
  if (override) {
    stopToStation.set(stop.stop_id, override);
    continue;
  }

  const normalized = normalizeName(stop.stop_name);
  const aliased = stationNameAliases.get(normalized) || normalized;
  const station = stationByNormalizedName.get(aliased);

  if (station) {
    stopToStation.set(stop.stop_id, station.id);
  } else {
    unmatchedStops.push({ stop_id: stop.stop_id, stop_name: stop.stop_name });
  }
}

const edgeByDirection = new Map();
const neighborsByStation = new Map();
for (const edge of edges) {
  edgeByDirection.set(`${edge.from}>${edge.to}`, edge.path);
  edgeByDirection.set(`${edge.to}>${edge.from}`, makeInversePath(edge.path));
  neighborsByStation.set(edge.from, [...(neighborsByStation.get(edge.from) || []), edge.to]);
  neighborsByStation.set(edge.to, [...(neighborsByStation.get(edge.to) || []), edge.from]);
}

const findShortestEdgePath = (from, to) => {
  if (from === to) return [from];

  const queue = [[from]];
  const visited = new Set([from]);

  while (queue.length) {
    const routePath = queue.shift();
    const stationId = routePath[routePath.length - 1];

    for (const neighbor of neighborsByStation.get(stationId) || []) {
      if (visited.has(neighbor)) continue;

      const nextPath = [...routePath, neighbor];
      if (neighbor === to) return nextPath;

      visited.add(neighbor);
      queue.push(nextPath);
    }
  }

  return null;
};

const routeById = new Map(gtfsRoutes.map((route) => [route.route_id, route]));
const tripById = new Map(gtfsTrips.map((trip) => [trip.trip_id, trip]));
const stopTimesByTrip = new Map();
for (const stopTime of gtfsStopTimes) {
  const stationId = stopToStation.get(stopTime.stop_id);
  if (!stationId) continue;

  const rows = stopTimesByTrip.get(stopTime.trip_id) || [];
  rows.push({
    stationId,
    arrival: timeToSeconds(stopTime.arrival_time),
    departure: timeToSeconds(stopTime.departure_time),
    sequence: Number(stopTime.stop_sequence),
    distance: Number(stopTime.shape_dist_traveled || 0),
  });
  stopTimesByTrip.set(stopTime.trip_id, rows);
}

const buildSvgPath = (stationIds) => {
  const segments = [];
  const missingEdges = [];
  const expandedStationIds = [stationIds[0]];

  for (let index = 0; index < stationIds.length - 1; index += 1) {
    const from = stationIds[index];
    const to = stationIds[index + 1];
    const edgePath = findShortestEdgePath(from, to);

    if (!edgePath) {
      missingEdges.push(`${from}>${to}`);
      continue;
    }

    for (let edgeIndex = 0; edgeIndex < edgePath.length - 1; edgeIndex += 1) {
      const segmentFrom = edgePath[edgeIndex];
      const segmentTo = edgePath[edgeIndex + 1];
      const segment = edgeByDirection.get(`${segmentFrom}>${segmentTo}`);

      if (!segment) {
        missingEdges.push(`${segmentFrom}>${segmentTo}`);
        continue;
      }

      segments.push(segment);
      expandedStationIds.push(segmentTo);
    }
  }

  return {
    svgPath: segments.join(' '),
    expandedStationIds,
    missingEdges,
  };
};

const patternByKey = new Map();
const patterns = [];
const trips = [];
const services = ['weekday', 'saturday', 'sunday'];
const serviceIndexById = new Map(services.map((serviceId, index) => [serviceId, index]));
const colors = [];
const colorIndexByHex = new Map();
const missingEdgeCounts = new Map();
const skipped = {
  noTrip: 0,
  tooFewStops: 0,
  missingPath: 0,
};

for (const [tripId, rows] of stopTimesByTrip) {
  const trip = tripById.get(tripId);
  if (!trip) {
    skipped.noTrip += 1;
    continue;
  }

  const stops = rows
    .sort((left, right) => left.sequence - right.sequence)
    .filter((stop, index, all) => index === 0 || stop.stationId !== all[index - 1].stationId);

  if (stops.length < 2) {
    skipped.tooFewStops += 1;
    continue;
  }

  const stationIds = stops.map((stop) => stop.stationId);
  const key = stationIds.join('>');
  let patternId = patternByKey.get(key);

  if (patternId === undefined) {
    const { svgPath, expandedStationIds, missingEdges } = buildSvgPath(stationIds);

    if (missingEdges.length || !svgPath) {
      skipped.missingPath += 1;
      for (const edge of missingEdges) {
        missingEdgeCounts.set(edge, (missingEdgeCounts.get(edge) || 0) + 1);
      }
      continue;
    }

    const firstDistance = stops[0].distance;
    const lastDistance = stops[stops.length - 1].distance;
    const distanceSpan = Math.max(1, lastDistance - firstDistance);

    patternId = patterns.length;
    patternByKey.set(key, patternId);
    patterns.push({
      s: stationIds,
      e: expandedStationIds,
      p: svgPath,
      x: stops.map((stop) =>
        Number(((stop.distance - firstDistance) / distanceSpan).toFixed(6))
      ),
    });
  }

  const route = routeById.get(trip.route_id);
  const color = routeColorByName(route?.route_long_name);
  let colorIndex = colorIndexByHex.get(color);
  if (colorIndex === undefined) {
    colorIndex = colors.length;
    colors.push(color);
    colorIndexByHex.set(color, colorIndex);
  }

  trips.push([
    serviceIndexById.get(trip.service_id) ?? 0,
    patternId,
    colorIndex,
    stops[0].departure,
    stops[stops.length - 1].arrival,
    stops.flatMap((stop) => [stop.arrival, stop.departure]),
  ]);
}

const output = {
  generatedAt: new Date().toISOString(),
  source: 'dmrc_static_gtfs_v1 (2)',
  stats: {
    gtfsStops: gtfsStops.length,
    matchedStops: stopToStation.size,
    unmatchedStops: unmatchedStops.length,
    trips: trips.length,
    patterns: patterns.length,
    skipped,
  },
  unmatchedStops,
  services,
  colors,
  patterns,
  trips,
};

fs.writeFileSync(
  path.join(root, 'src/data/gtfs-schedule.json'),
  `${JSON.stringify(output)}\n`
);

console.log(`Wrote ${trips.length} trips across ${patterns.length} patterns.`);
console.log(`Matched ${stopToStation.size}/${gtfsStops.length} GTFS stops.`);
if (unmatchedStops.length) {
  console.log('Unmatched stops:');
  for (const stop of unmatchedStops) console.log(`- ${stop.stop_id}: ${stop.stop_name}`);
}
if (missingEdgeCounts.size) {
  console.log('Top missing edges:');
  for (const [edge, count] of [...missingEdgeCounts].sort((a, b) => b[1] - a[1]).slice(0, 20)) {
    console.log(`- ${edge}: ${count}`);
  }
}
