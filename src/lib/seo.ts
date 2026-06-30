import { readFileSync, statSync } from 'node:fs';
import path from 'node:path';

type Station = {
  id: string;
  text: string;
  layout?: string;
  interchange?: boolean;
  description?: string;
  Latitude?: number;
  Longitude?: number;
  contact?: { mobile?: string; landline?: string };
  gates?: Array<Record<string, unknown>>;
  platforms?: Array<Record<string, unknown>>;
  facilities?: Array<Record<string, unknown>>;
  stationFacilities?: string[];
  parking?: Array<Record<string, unknown>>;
  nearbyPlaces?: Array<Record<string, unknown>>;
  lifts?: Array<Record<string, unknown>>;
};

type Edge = {
  from: string;
  to: string;
  stroke: string;
};

export type SeoRoute = {
  from: string;
  to: string;
  fromName: string;
  toName: string;
  pathIds: string[];
  stops: number;
  distanceKm: number;
  fare: number;
  holidayFare: number;
  timeLimitMinutes: number;
  estimatedMinutes: number;
  interchanges: string[];
};

export type SeoPage = {
  title: string;
  description: string;
  keywords: string;
  canonicalPath: string;
  body: string;
  schema: unknown;
  hydrationData?: { from?: string; to?: string };
};

const rootDir = process.cwd();
const baseUrl = (process.env.SITE_URL || 'https://metro.coolhead.in').replace(/\/$/, '');
const showcaseImagePath = '/images/showcase-1200x630.png';
const sitemapUrlLimit = 10000;

const readJson = <T>(filePath: string) =>
  JSON.parse(readFileSync(path.join(rootDir, filePath), 'utf8')) as T;

export const stations = readJson<Station[]>('src/data/labels.json').filter((station) => station.id && station.text);
export const edges = readJson<Edge[]>('src/data/edge.json');
export const stationById = new Map(stations.map((station) => [station.id, station]));

export const escapeHtml = (value: unknown) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const slugifyStationName = (name: string) =>
  name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const stationSlug = (stationId: string) => slugifyStationName(stationById.get(stationId)?.text || stationId);
export const stationPathname = (stationId: string) => `/stations/${stationSlug(stationId)}/`;
export const routePathname = (from: string, to: string) => `/routes/${stationSlug(from)}-to-${stationSlug(to)}/`;
export const stationName = (stationId: string) => stationById.get(stationId)?.text || stationId;

const toRadians = (degrees: number) => degrees * (Math.PI / 180);
const isValidCoordinatePair = (station: Station | undefined) =>
  typeof station?.Latitude === 'number' &&
  typeof station?.Longitude === 'number' &&
  station.Latitude >= 27.5 &&
  station.Latitude <= 29.5 &&
  station.Longitude >= 76 &&
  station.Longitude <= 78.5;

const stationDistanceKm = (from: string, to: string) => {
  const fromStation = stationById.get(from);
  const toStation = stationById.get(to);
  if (!isValidCoordinatePair(fromStation) || !isValidCoordinatePair(toStation)) return 1;

  const earthRadiusKm = 6371;
  const latitudeDelta = toRadians(toStation.Latitude! - fromStation.Latitude!);
  const longitudeDelta = toRadians(toStation.Longitude! - fromStation.Longitude!);
  const fromLatitude = toRadians(fromStation.Latitude!);
  const toLatitude = toRadians(toStation.Latitude!);
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(fromLatitude) * Math.cos(toLatitude) * Math.sin(longitudeDelta / 2) ** 2;

  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
};

const edgeDistanceKey = (from: string, to: string) => [from, to].sort().join('>');
const edgeDistanceKm = new Map(edges.map((edge) => [
  edgeDistanceKey(edge.from, edge.to),
  stationDistanceKm(edge.from, edge.to),
]));

const routeDistanceKm = (pathIds: string[]) =>
  Math.round(pathIds.slice(0, -1).reduce((totalDistance, stationId, index) => {
    const nextStationId = pathIds[index + 1];
    return totalDistance + (edgeDistanceKm.get(edgeDistanceKey(stationId, nextStationId)) || 1);
  }, 0) * 10) / 10;

export const featuredStationIds = [
  'RCK',
  'KG',
  'NDI',
  'CTST',
  'NSHP',
  'HKS',
  'BOTA',
  'DW21',
  'APOT',
  'ITO',
].filter((stationId) => stationById.has(stationId));

export const featuredRoutePairs = [
  ['RCK', 'KG'],
  ['NDI', 'APOT'],
  ['HKS', 'BOTA'],
  ['DW21', 'RITH'],
  ['CTST', 'KG'],
  ['NDI', 'RCK'],
  ['KG', 'BOTA'],
  ['NSHP', 'RCK'],
  ['ITO', 'KG'],
  ['BOTA', 'APOT'],
].filter(([from, to]) => stationById.has(from) && stationById.has(to));

const adjacency = new Map(stations.map((station) => [station.id, [] as string[]]));
for (const edge of edges) {
  adjacency.get(edge.from)?.push(edge.to);
  adjacency.get(edge.to)?.push(edge.from);
}

const buildShortestPathTree = (from: string) => {
  const queue = [from];
  const previous = new Map<string, string | null>([[from, null]]);

  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const current = queue[cursor];
    for (const next of adjacency.get(current) || []) {
      if (previous.has(next)) continue;
      previous.set(next, current);
      queue.push(next);
    }
  }

  return previous;
};

const pathFromTree = (previous: Map<string, string | null>, to: string) => {
  if (!previous.has(to)) return null;
  const pathIds: string[] = [];
  let current: string | null = to;
  while (current) {
    pathIds.unshift(current);
    current = previous.get(current) || null;
  }
  return pathIds;
};

const estimateFare = (distanceKm: number, holiday = false) => {
  if (distanceKm <= 2) return 11;
  if (distanceKm <= 5) return holiday ? 11 : 21;
  if (distanceKm <= 12) return holiday ? 21 : 32;
  if (distanceKm <= 21) return holiday ? 32 : 43;
  if (distanceKm <= 32) return holiday ? 43 : 54;
  return holiday ? 54 : 64;
};

const getFareTimeLimitMinutes = (distanceKm: number) => {
  if (distanceKm <= 12) return 65;
  if (distanceKm <= 21) return 100;
  return 180;
};

const edgeFor = (from: string, to: string) =>
  edges.find((edge) => edge.from === from && edge.to === to) ||
  edges.find((edge) => edge.from === to && edge.to === from);

const routeSummary = (from: string, to: string, previous: Map<string, string | null>): SeoRoute | null => {
  const pathIds = pathFromTree(previous, to);
  if (!pathIds) return null;

  const interchanges = pathIds.slice(1, -1).filter((stationId, index) => {
    const routeIndex = index + 1;
    const previousEdge = edgeFor(pathIds[routeIndex - 1], stationId);
    const nextEdge = edgeFor(stationId, pathIds[routeIndex + 1]);
    return previousEdge && nextEdge && previousEdge.stroke !== nextEdge.stroke;
  });
  const distanceKm = routeDistanceKm(pathIds);

  return {
    from,
    to,
    fromName: stationName(from),
    toName: stationName(to),
    pathIds,
    stops: Math.max(0, pathIds.length - 1),
    distanceKm,
    fare: estimateFare(distanceKm),
    holidayFare: estimateFare(distanceKm, true),
    timeLimitMinutes: getFareTimeLimitMinutes(distanceKm),
    estimatedMinutes: Math.max(2, Math.max(0, pathIds.length - 1) * 2),
    interchanges,
  };
};

let routesCache: SeoRoute[] | null = null;

export const getRoutes = () => {
  if (routesCache) return routesCache;

  const allRoutes: SeoRoute[] = [];
  for (const origin of stations) {
    const previous = buildShortestPathTree(origin.id);
    for (const destination of stations) {
      if (origin.id === destination.id) continue;
      const route = routeSummary(origin.id, destination.id, previous);
      if (route) allRoutes.push(route);
    }
  }

  routesCache = allRoutes;
  return allRoutes;
};

const hasItems = (items: unknown) => Array.isArray(items) && items.length > 0;
const renderList = (items: unknown[] | undefined, renderItem: (item: Record<string, unknown>) => string) =>
  hasItems(items) ? `<ul>${items!.map((item) => renderItem(item as Record<string, unknown>)).join('')}</ul>` : '<p>Not listed.</p>';

const textField = (item: Record<string, unknown>, key: string) => typeof item[key] === 'string' ? item[key] as string : '';
const numberField = (item: Record<string, unknown>, key: string) => typeof item[key] === 'number' ? item[key] as number : null;

const renderStationGates = (station: Station) => renderList(station.gates, (gate) => `
  <li><strong>${escapeHtml(textField(gate, 'gate') || 'Gate')}</strong>${textField(gate, 'access') ? ` (${escapeHtml(textField(gate, 'access'))})` : ''}${textField(gate, 'towards') ? ` - ${escapeHtml(textField(gate, 'towards'))}` : ''}${textField(gate, 'status') ? ` - ${escapeHtml(textField(gate, 'status'))}` : ''}${gate.divyangFriendly ? ' - Divyang friendly' : ''}</li>`);
const renderStationPlatforms = (station: Station) => renderList(station.platforms, (platform) => `
  <li><strong>${escapeHtml(textField(platform, 'name') || 'Platform')}</strong>${textField(platform, 'towards') ? ` - Towards ${escapeHtml(textField(platform, 'towards'))}` : ''}${textField(platform, 'secondTowards') ? ` / ${escapeHtml(textField(platform, 'secondTowards'))}` : ''}</li>`);
const renderStationFacilities = (station: Station) => hasItems(station.stationFacilities)
  ? `<p>${station.stationFacilities!.map(escapeHtml).join(', ')}</p>`
  : renderList(station.facilities, (group) => `<li><strong>${escapeHtml(textField(group, 'kind') || 'Facility')}</strong></li>`);
const renderStationParking = (station: Station) => renderList(station.parking, (parking) => `
  <li><strong>${escapeHtml(textField(parking, 'provider') || 'Parking')}</strong>${textField(parking, 'location') ? ` - ${escapeHtml(textField(parking, 'location'))}` : ''}${numberField(parking, 'carCapacity') !== null ? ` - Cars: ${numberField(parking, 'carCapacity')}` : ''}${numberField(parking, 'motorcycleCapacity') !== null ? ` - Bikes: ${numberField(parking, 'motorcycleCapacity')}` : ''}${numberField(parking, 'cycleCapacity') !== null ? ` - Cycles: ${numberField(parking, 'cycleCapacity')}` : ''}</li>`);
const renderStationNearbyPlaces = (station: Station) => renderList((station.nearbyPlaces || []).slice(0, 16), (place) => `
  <li><strong>${escapeHtml(textField(place, 'name') || 'Nearby place')}</strong>${textField(place, 'type') ? ` - ${escapeHtml(textField(place, 'type'))}` : ''}${textField(place, 'category') ? ` - ${escapeHtml(textField(place, 'category'))}` : ''}${numberField(place, 'distanceKm') !== null ? ` - ${numberField(place, 'distanceKm')} km` : ''}${numberField(place, 'estimatedWalkingMinutes') !== null ? ` - ${numberField(place, 'estimatedWalkingMinutes')} min walk` : ''}</li>`);
const renderStationLifts = (station: Station) => renderList(station.lifts, (lift) => `
  <li><strong>${escapeHtml(textField(lift, 'name') || textField(lift, 'type') || 'Lift / Escalator')}</strong>${textField(lift, 'location') ? ` - ${escapeHtml(textField(lift, 'location'))}` : ''}${textField(lift, 'insideOutside') ? ` - ${escapeHtml(textField(lift, 'insideOutside'))}` : ''}${lift.divyangFriendly ? ' - Divyang friendly' : ''}</li>`);

export const homePage = (): SeoPage => {
  const title = 'Delhi Metro Route Planner | Map, Fare, Stops & Interchanges';
  const description = 'Plan Delhi Metro routes with station search, fare estimates, travel time, stop count, interchanges, and an interactive metro map.';
  return {
    title,
    description,
    keywords: 'Delhi Metro route planner, Delhi Metro map, Delhi Metro fare calculator, Delhi Metro station search, Delhi Metro interchanges, metro route from station to station, Delhi metro travel time, Delhi metro stops',
    canonicalPath: '/',
    body: `
      <main class="seo-prerender">
        <h1>Delhi Metro Route Planner</h1>
        <img src="${showcaseImagePath}" alt="Delhi Metro route planner with interactive map and journey details" width="1200" height="630" loading="lazy" decoding="async" fetchpriority="low" />
        <p>Delhi Metro Route Planner helps commuters find practical metro routes across Delhi NCR. Search by source and destination station to check the recommended route, estimated fare, travel time, stop count, interchange stations, and line-color guidance.</p>
        <p>Popular route examples include ${featuredRoutePairs.map(([from, to]) => `<a href="${routePathname(from, to)}">${escapeHtml(stationName(from))} to ${escapeHtml(stationName(to))}</a>`).join(', ')}.</p>
        <p>Browse the <a href="/routes/">Delhi Metro routes directory</a> or station pages such as ${featuredStationIds.slice(0, 5).map((stationId) => `<a href="${stationPathname(stationId)}">${escapeHtml(stationName(stationId))}</a>`).join(', ')}.</p>
      </main>`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Delhi Metro Route Planner',
      url: `${baseUrl}/`,
      applicationCategory: 'TravelApplication',
      operatingSystem: 'Web',
      inLanguage: ['en-IN', 'hi-IN', 'mr-IN', 'bn-IN'],
      image: `${baseUrl}${showcaseImagePath}`,
      description,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    },
  };
};

export const stationPage = (station: Station): SeoPage => {
  const pathname = stationPathname(station.id);
  const title = `${station.text} Metro Station | Delhi Metro`;
  const description = `Check ${station.text} metro station gates, platforms, facilities, nearby places, parking, route links, fare planning, and Delhi Metro travel details.`;
  const connectedStationIds = [...new Set(adjacency.get(station.id) || [])];
  const routeLinkIds = [...new Set([...connectedStationIds, ...featuredStationIds])].filter((stationId) => stationId !== station.id).slice(0, 8);

  return {
    title,
    description,
    keywords: `${station.text} metro station, ${station.text} gates, ${station.text} facilities, ${station.text} Delhi Metro route, metro from ${station.text}, Delhi Metro fare from ${station.text}`,
    canonicalPath: pathname,
    body: `
      <main class="seo-prerender">
        <h1>${escapeHtml(station.text)} Metro Station</h1>
        <img src="${showcaseImagePath}" alt="Delhi Metro route planner map for ${escapeHtml(station.text)} station" width="1200" height="630" loading="lazy" />
        <p>${escapeHtml(description)}</p>
        <dl><dt>Station code</dt><dd>${escapeHtml(station.id)}</dd><dt>Layout</dt><dd>${escapeHtml(station.layout || 'Not listed')}</dd><dt>Interchange</dt><dd>${station.interchange ? 'Yes' : 'No'}</dd><dt>Mobile</dt><dd>${escapeHtml(station.contact?.mobile || 'Not listed')}</dd><dt>Landline</dt><dd>${escapeHtml(station.contact?.landline || 'Not listed')}</dd></dl>
        <p>${escapeHtml(station.description || `${station.text} Metro Station is part of the Delhi Metro network and can be used as a starting point or destination in the route planner.`)}</p>
        <h2>Gates at ${escapeHtml(station.text)}</h2>${renderStationGates(station)}
        <h2>Platforms</h2>${renderStationPlatforms(station)}
        <h2>Facilities</h2>${renderStationFacilities(station)}
        <h2>Parking</h2>${renderStationParking(station)}
        <h2>Lifts and escalators</h2>${renderStationLifts(station)}
        <h2>Nearby places</h2>${renderStationNearbyPlaces(station)}
        <h2>Routes from ${escapeHtml(station.text)}</h2>
        <p>${routeLinkIds.slice(0, 5).map((stationId) => `<a href="${routePathname(station.id, stationId)}">${escapeHtml(station.text)} to ${escapeHtml(stationName(stationId))}</a>`).join(', ')}.</p>
        <h2>Connected stations</h2><p>Nearby connected stations include ${escapeHtml(connectedStationIds.map(stationName).join(', ') || 'stations available in the route planner')}.</p>
      </main>`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'TrainStation',
      name: `${station.text} Metro Station`,
      url: `${baseUrl}${pathname}`,
      containedInPlace: 'Delhi Metro',
      description: station.description || description,
      geo: isValidCoordinatePair(station) ? { '@type': 'GeoCoordinates', latitude: station.Latitude, longitude: station.Longitude } : undefined,
    },
  };
};

export const routePage = (route: SeoRoute): SeoPage => {
  const pathname = routePathname(route.from, route.to);
  const title = `${route.fromName} to ${route.toName} Metro Route Map | Fare, Time & Stops`;
  const interchangeText = route.interchanges.length
    ? ` Interchange at ${route.interchanges.map(stationName).join(', ')}.`
    : ' No interchange is usually needed for this route.';
  const description = `Check the ${route.fromName} to ${route.toName} Delhi Metro route map with estimated fare Rs ${route.fare}, travel time ${route.estimatedMinutes} minutes, ${route.stops} stops, distance about ${route.distanceKm} km, and interchange guidance.${interchangeText}`;

  return {
    title,
    description,
    keywords: `${route.fromName} to ${route.toName} metro route, ${route.fromName} to ${route.toName} metro route map, ${route.fromName} to ${route.toName} metro fare, ${route.fromName} to ${route.toName} metro time, Delhi Metro ${route.fromName} ${route.toName}, ${route.fromName} to ${route.toName} stops`,
    canonicalPath: pathname,
    hydrationData: { from: route.from, to: route.to },
    body: `
      <main class="seo-prerender">
        <h1>${escapeHtml(route.fromName)} to ${escapeHtml(route.toName)} Metro Route Map</h1>
        <img src="${showcaseImagePath}" alt="Delhi Metro route planner for ${escapeHtml(route.fromName)} to ${escapeHtml(route.toName)}" width="1200" height="630" loading="lazy" />
        <p>${escapeHtml(description)}</p>
        <dl><dt>Fare</dt><dd>Rs ${route.fare}</dd><dt>Sunday fare</dt><dd>Rs ${route.holidayFare}</dd><dt>Travel time</dt><dd>${route.estimatedMinutes} minutes</dd><dt>Stops</dt><dd>${route.stops}</dd><dt>Distance</dt><dd>${route.distanceKm} km</dd></dl>
        <h2>${escapeHtml(route.fromName)} to ${escapeHtml(route.toName)} route details</h2>
        <p>This Delhi Metro route starts at <a href="${stationPathname(route.from)}">${escapeHtml(route.fromName)}</a> and ends at <a href="${stationPathname(route.to)}">${escapeHtml(route.toName)}</a>. ${route.interchanges.length ? `You may need to change metro lines at ${escapeHtml(route.interchanges.map(stationName).join(', '))}.` : 'A line change is usually not needed for this route.'}</p>
        <p>Stations on this route: ${escapeHtml(route.pathIds.map(stationName).join(' -> '))}.</p>
        <p>Open the interactive planner for this journey: <a href="/?from=${encodeURIComponent(route.from)}&amp;to=${encodeURIComponent(route.to)}">${escapeHtml(route.fromName)} to ${escapeHtml(route.toName)}</a>. Reverse route: <a href="${routePathname(route.to, route.from)}">${escapeHtml(route.toName)} to ${escapeHtml(route.fromName)}</a>.</p>
      </main>`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Trip',
      name: `${route.fromName} to ${route.toName} Delhi Metro route`,
      url: `${baseUrl}${pathname}`,
      departureStation: { '@type': 'TrainStation', name: route.fromName },
      arrivalStation: { '@type': 'TrainStation', name: route.toName },
      itinerary: route.pathIds.map(stationName),
    },
  };
};

export const routeIndexPage = (): SeoPage => {
  const pathname = '/routes/';
  const description = 'Browse Delhi Metro station-to-station route pages with route map links, estimated fare, travel time, stop count, distance, and interchange guidance.';

  return {
    title: 'Delhi Metro Routes | Route Map, Fare, Time & Stops',
    description,
    keywords: 'Delhi Metro routes, Delhi Metro route map, Delhi Metro fare, Delhi Metro travel time, Delhi Metro station to station routes, Delhi Metro stops',
    canonicalPath: pathname,
    body: `
      <main class="seo-prerender">
        <h1>Delhi Metro Routes</h1>
        <img src="${showcaseImagePath}" alt="Delhi Metro route map and station-to-station planner" width="1200" height="630" loading="lazy" />
        <p>${escapeHtml(description)}</p>
        <h2>Popular Delhi Metro route pages</h2>
        <ul>${featuredRoutePairs.map(([from, to]) => `<li><a href="${routePathname(from, to)}">${escapeHtml(stationName(from))} to ${escapeHtml(stationName(to))} Metro route</a></li>`).join('')}</ul>
        ${featuredStationIds.map((from) => `<section><h2>Routes from ${escapeHtml(stationName(from))}</h2><ul>${featuredStationIds.filter((to) => to !== from).slice(0, 6).map((to) => `<li><a href="${routePathname(from, to)}">${escapeHtml(stationName(from))} to ${escapeHtml(stationName(to))} Metro route</a></li>`).join('')}</ul></section>`).join('')}
      </main>`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Delhi Metro Routes',
      url: `${baseUrl}${pathname}`,
      description,
    },
  };
};

export const legalPages = {
  privacy: {
    pathname: '/privacy-policy/',
    title: 'Privacy Policy | Delhi Metro Route Planner',
    description: 'Read the Privacy Policy for Delhi Metro Route Planner, including how usage data may be collected, used, retained, and protected.',
    keywords: 'Delhi Metro Route Planner privacy policy, metro.coolhead.in privacy, Delhi Metro app privacy',
    heading: 'Privacy Policy',
  },
  terms: {
    pathname: '/terms-and-conditions/',
    title: 'Terms and Conditions | Delhi Metro Route Planner',
    description: 'Read the Terms and Conditions for Delhi Metro Route Planner, including acceptable use, accuracy, limitations, and contact information.',
    keywords: 'Delhi Metro Route Planner terms, metro.coolhead.in terms and conditions, Delhi Metro route planner disclaimer',
    heading: 'Terms and Conditions',
  },
} as const;

export const legalPage = (kind: keyof typeof legalPages): SeoPage => {
  const page = legalPages[kind];
  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    canonicalPath: page.pathname,
    body: `<main class="seo-prerender"><h1>${escapeHtml(page.heading)}</h1><p>${escapeHtml(page.description)}</p><p><a href="/">Open Delhi Metro Route Planner</a></p></main>`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: page.heading,
      url: `${baseUrl}${page.pathname}`,
      description: page.description,
    },
  };
};

export const contentLastmod = (() => {
  const paths = ['index.html', 'src/lib/seo.ts', 'src/data/labels.json', 'src/data/edge.json'];
  const latest = Math.max(...paths.map((filePath) => statSync(path.join(rootDir, filePath)).mtimeMs));
  return new Date(latest).toISOString().slice(0, 10);
})();

export const sitemapFiles = () => {
  const coreUrls = [
    { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'weekly', lastmod: contentLastmod },
    { loc: `${baseUrl}/routes/`, priority: '0.9', changefreq: 'weekly', lastmod: contentLastmod },
    ...Object.values(legalPages).map((page) => ({ loc: `${baseUrl}${page.pathname}`, priority: '0.3', changefreq: 'yearly', lastmod: contentLastmod })),
  ];
  const stationUrls = stations.map((station) => ({ loc: `${baseUrl}${stationPathname(station.id)}`, priority: '0.8', changefreq: 'monthly', lastmod: contentLastmod }));
  const routeUrls = getRoutes().map((route) => ({ loc: `${baseUrl}${routePathname(route.from, route.to)}`, priority: '0.7', changefreq: 'monthly', lastmod: contentLastmod }));
  const files = [
    { filename: 'sitemap-core.xml', urls: coreUrls },
    { filename: 'sitemap-stations.xml', urls: stationUrls },
  ];

  for (let index = 0; index < routeUrls.length; index += sitemapUrlLimit) {
    const chunkNumber = String(Math.floor(index / sitemapUrlLimit) + 1).padStart(3, '0');
    files.push({ filename: `sitemap-routes-${chunkNumber}.xml`, urls: routeUrls.slice(index, index + sitemapUrlLimit) });
  }

  return files;
};

export const renderSitemap = (urls: ReturnType<typeof sitemapFiles>[number]['urls']) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>
    <loc>${escapeHtml(url.loc)}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

export const baseSiteUrl = baseUrl;
