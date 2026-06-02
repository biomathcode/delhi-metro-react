import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const indexPath = path.join(distDir, 'index.html');
const baseUrl = (process.env.SITE_URL || 'https://metro.coolhead.in').replace(/\/$/, '');
const showcaseImagePath = '/images/showcase-1200x630.png';
const sitemapUrlLimit = 45000;
const today = new Date().toISOString().slice(0, 10);

const stations = JSON.parse(await readFile(path.join(rootDir, 'src/data/labels.json'), 'utf8'))
  .filter((station) => station.id && station.text);
const edges = JSON.parse(await readFile(path.join(rootDir, 'src/data/edge.json'), 'utf8'));
const template = await readFile(indexPath, 'utf8');

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const slugifyStationName = (name) =>
  name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const stationById = new Map(stations.map((station) => [station.id, station]));
const stationSlug = (stationId) => slugifyStationName(stationById.get(stationId)?.text || stationId);
const stationPathname = (stationId) => `/stations/${stationSlug(stationId)}/`;
const routePathname = (from, to) => `/routes/${stationSlug(from)}-to-${stationSlug(to)}/`;
const stationName = (stationId) => stationById.get(stationId)?.text || stationId;
const toRadians = (degrees) => degrees * (Math.PI / 180);
const isValidCoordinatePair = (station) =>
  typeof station?.Latitude === 'number' &&
  typeof station?.Longitude === 'number' &&
  station.Latitude >= 27.5 &&
  station.Latitude <= 29.5 &&
  station.Longitude >= 76 &&
  station.Longitude <= 78.5;
const stationDistanceKm = (from, to) => {
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
const edgeDistanceKey = (from, to) => [from, to].sort().join('>');
const edgeDistanceKm = new Map(edges.map((edge) => [
  edgeDistanceKey(edge.from, edge.to),
  stationDistanceKm(edge.from, edge.to),
]));
const routeDistanceKm = (pathIds) =>
  Math.round(pathIds.slice(0, -1).reduce((totalDistance, stationId, index) => {
    const nextStationId = pathIds[index + 1];
    return totalDistance + (edgeDistanceKm.get(edgeDistanceKey(stationId, nextStationId)) || 1);
  }, 0) * 10) / 10;
const featuredStationIds = [
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

const adjacency = new Map(stations.map((station) => [station.id, []]));
for (const edge of edges) {
  adjacency.get(edge.from)?.push(edge.to);
  adjacency.get(edge.to)?.push(edge.from);
}

const buildShortestPathTree = (from) => {
  const queue = [from];
  const previous = new Map([[from, null]]);

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

const pathFromTree = (previous, to) => {
  if (!previous.has(to)) return null;

  const path = [];
  let current = to;
  while (current) {
    path.unshift(current);
    current = previous.get(current);
  }

  return path;
};

const estimateFare = (distanceKm, holiday = false) => {
  if (distanceKm <= 2) return 11;
  if (distanceKm <= 5) return holiday ? 11 : 21;
  if (distanceKm <= 12) return holiday ? 21 : 32;
  if (distanceKm <= 21) return holiday ? 32 : 43;
  if (distanceKm <= 32) return holiday ? 43 : 54;
  return holiday ? 54 : 64;
};

const getFareTimeLimitMinutes = (distanceKm) => {
  if (distanceKm <= 12) return 65;
  if (distanceKm <= 21) return 100;
  return 180;
};

const edgeFor = (from, to) =>
  edges.find((edge) => edge.from === from && edge.to === to) ||
  edges.find((edge) => edge.from === to && edge.to === from);

const routeSummary = (from, to, previous) => {
  const pathIds = pathFromTree(previous, to);
  if (!pathIds) return null;

  const interchanges = pathIds.slice(1, -1).filter((stationId, index) => {
    const routeIndex = index + 1;
    const previousEdge = edgeFor(pathIds[routeIndex - 1], stationId);
    const nextEdge = edgeFor(stationId, pathIds[routeIndex + 1]);
    return previousEdge && nextEdge && previousEdge.stroke !== nextEdge.stroke;
  });

  const distance = Math.max(0, pathIds.length - 1);
  const distanceKm = routeDistanceKm(pathIds);

  return {
    from,
    to,
    fromName: stationName(from),
    toName: stationName(to),
    pathIds,
    stops: distance,
    distanceKm,
    fare: estimateFare(distanceKm),
    holidayFare: estimateFare(distanceKm, true),
    timeLimitMinutes: getFareTimeLimitMinutes(distanceKm),
    estimatedMinutes: Math.max(2, distance * 2),
    interchanges,
  };
};

const setTag = (html, pattern, replacement) => html.replace(pattern, replacement);

const renderHtml = ({ title, description, keywords, canonicalPath, body, schema, hydrationData }) => {
  const canonicalUrl = `${baseUrl}${canonicalPath}`;
  let html = template;

  html = setTag(html, /<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`);
  html = setTag(html, /<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`);
  html = setTag(html, /<meta\s+name="description"[\s\S]*?\/>/, `<meta name="description" content="${escapeHtml(description)}" />`);
  html = setTag(html, /<meta\s+name="keywords"[\s\S]*?\/>/, `<meta name="keywords" content="${escapeHtml(keywords)}" />`);
  html = setTag(html, /<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`);
  html = setTag(html, /<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${escapeHtml(title)}" />`);
  html = setTag(html, /<meta\s+property="og:description"[\s\S]*?\/>/, `<meta property="og:description" content="${escapeHtml(description)}" />`);
  html = setTag(html, /<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${escapeHtml(title)}" />`);
  html = setTag(html, /<meta\s+name="twitter:description"[\s\S]*?\/>/, `<meta name="twitter:description" content="${escapeHtml(description)}" />`);
  html = html.replace(
    '</head>',
    `    ${hydrationData ? `<script>window.__DELHI_METRO_ROUTE__=${JSON.stringify(hydrationData)};</script>\n    ` : ''}<script type="application/ld+json">${JSON.stringify(schema)}</script>\n  </head>`
  );
  html = html.replace(/<div id="root">[\s\S]*?<\/div>/, `<div id="root">${body}</div>`);

  return html;
};

const writePage = async (pathname, html) => {
  const outputDir = path.join(distDir, pathname);
  await mkdir(outputDir, { recursive: true });
  await writeFile(path.join(outputDir, 'index.html'), html);
};

const hasItems = (items) => Array.isArray(items) && items.length > 0;
const renderList = (items, renderItem) => hasItems(items) ? `<ul>${items.map(renderItem).join('')}</ul>` : '<p>Not listed.</p>';
const renderStationGates = (station) => renderList(station.gates, (gate) => `
  <li>
    <strong>${escapeHtml(gate.gate || 'Gate')}</strong>
    ${gate.access ? ` (${escapeHtml(gate.access)})` : ''}
    ${gate.towards ? ` - ${escapeHtml(gate.towards)}` : ''}
    ${gate.status ? ` - ${escapeHtml(gate.status)}` : ''}
    ${gate.divyangFriendly ? ' - Divyang friendly' : ''}
  </li>`);
const renderStationPlatforms = (station) => renderList(station.platforms, (platform) => `
  <li>
    <strong>${escapeHtml(platform.name || 'Platform')}</strong>
    ${platform.towards ? ` - Towards ${escapeHtml(platform.towards)}` : ''}
    ${platform.secondTowards ? ` / ${escapeHtml(platform.secondTowards)}` : ''}
  </li>`);
const renderStationFacilities = (station) => {
  const facilityGroups = hasItems(station.facilities)
    ? station.facilities.map((group) => `
      <li>
        <strong>${escapeHtml(group.kind)}</strong>
        ${renderList(group.details, (detail) => `
          <li>
            ${escapeHtml(detail.name || detail.purpose || group.kind)}
            ${detail.location ? ` - ${escapeHtml(detail.location)}` : ''}
            ${detail.nearestGate ? ` - ${escapeHtml(detail.nearestGate)}` : ''}
          </li>`)}
      </li>`).join('')
    : '';
  const stationFacilities = hasItems(station.stationFacilities)
    ? `<p>${station.stationFacilities.map(escapeHtml).join(', ')}</p>`
    : '';

  return stationFacilities || facilityGroups ? `${stationFacilities}<ul>${facilityGroups}</ul>` : '<p>Not listed.</p>';
};
const renderStationParking = (station) => renderList(station.parking, (parking) => `
  <li>
    <strong>${escapeHtml(parking.provider || 'Parking')}</strong>
    ${parking.location ? ` - ${escapeHtml(parking.location)}` : ''}
    ${typeof parking.carCapacity === 'number' ? ` - Cars: ${parking.carCapacity}` : ''}
    ${typeof parking.motorcycleCapacity === 'number' ? ` - Bikes: ${parking.motorcycleCapacity}` : ''}
    ${typeof parking.cycleCapacity === 'number' ? ` - Cycles: ${parking.cycleCapacity}` : ''}
  </li>`);
const renderStationNearbyPlaces = (station) => renderList((station.nearbyPlaces || []).slice(0, 16), (place) => `
  <li>
    <strong>${escapeHtml(place.name || 'Nearby place')}</strong>
    ${place.type ? ` - ${escapeHtml(place.type)}` : ''}
    ${place.category ? ` - ${escapeHtml(place.category)}` : ''}
    ${typeof place.distanceKm === 'number' ? ` - ${place.distanceKm} km` : ''}
    ${typeof place.estimatedWalkingMinutes === 'number' ? ` - ${place.estimatedWalkingMinutes} min walk` : ''}
  </li>`);
const renderStationLifts = (station) => renderList(station.lifts, (lift) => `
  <li>
    <strong>${escapeHtml(lift.name || lift.type || 'Lift / Escalator')}</strong>
    ${lift.location ? ` - ${escapeHtml(lift.location)}` : ''}
    ${lift.insideOutside ? ` - ${escapeHtml(lift.insideOutside)}` : ''}
    ${lift.divyangFriendly ? ' - Divyang friendly' : ''}
  </li>`);

const stationPage = (station) => {
  const pathname = stationPathname(station.id);
  const title = `${station.text} Metro Station | Delhi Metro`;
  const description = `Check ${station.text} metro station gates, platforms, facilities, nearby places, parking, route links, fare planning, and Delhi Metro travel details.`;
  const keywords = `${station.text} metro station, ${station.text} gates, ${station.text} facilities, ${station.text} Delhi Metro route, metro from ${station.text}, Delhi Metro fare from ${station.text}`;
  const connectedStationIds = [...new Set(adjacency.get(station.id) || [])];
  const connectedStations = connectedStationIds.map(stationName);
  const routeLinkIds = [...new Set([
    ...connectedStationIds,
    ...featuredStationIds,
  ])].filter((stationId) => stationId !== station.id).slice(0, 8);
  const fromRouteLinks = routeLinkIds.slice(0, 5);
  const toRouteLinks = routeLinkIds.slice(0, 3);
  const body = `
    <main class="seo-prerender">
      <h1>${escapeHtml(station.text)} Metro Station</h1>
      <img src="${showcaseImagePath}" alt="Delhi Metro route planner map for ${escapeHtml(station.text)} station" width="1200" height="630" loading="lazy" />
      <p>${escapeHtml(description)}</p>
      <dl>
        <dt>Station code</dt><dd>${escapeHtml(station.id)}</dd>
        <dt>Layout</dt><dd>${escapeHtml(station.layout || 'Not listed')}</dd>
        <dt>Interchange</dt><dd>${station.interchange ? 'Yes' : 'No'}</dd>
        <dt>Mobile</dt><dd>${escapeHtml(station.contact?.mobile || 'Not listed')}</dd>
        <dt>Landline</dt><dd>${escapeHtml(station.contact?.landline || 'Not listed')}</dd>
      </dl>
      <p>
        ${escapeHtml(station.description || `${station.text} Metro Station is part of the Delhi Metro network and can be used as a starting point or destination in the route planner.`)}
      </p>
      <h2>Gates at ${escapeHtml(station.text)}</h2>
      ${renderStationGates(station)}
      <h2>Platforms</h2>
      ${renderStationPlatforms(station)}
      <h2>Facilities</h2>
      ${renderStationFacilities(station)}
      <h2>Parking</h2>
      ${renderStationParking(station)}
      <h2>Lifts and escalators</h2>
      ${renderStationLifts(station)}
      <h2>Nearby places</h2>
      ${renderStationNearbyPlaces(station)}
      <h2>Routes from ${escapeHtml(station.text)}</h2>
      <p>
        Popular route pages from this station:
        ${fromRouteLinks.map((stationId) => `<a href="${routePathname(station.id, stationId)}">${escapeHtml(station.text)} to ${escapeHtml(stationName(stationId))}</a>`).join(', ')}.
      </p>
      <h2>Routes to ${escapeHtml(station.text)}</h2>
      <p>
        You can also check routes ending at this station:
        ${toRouteLinks.map((stationId) => `<a href="${routePathname(stationId, station.id)}">${escapeHtml(stationName(stationId))} to ${escapeHtml(station.text)}</a>`).join(', ')}.
      </p>
      <h2>Connected stations</h2>
      <p>
        Nearby connected stations include ${escapeHtml(connectedStations.join(', ') || 'stations available in the route planner')}.
        These links help you move through the Delhi Metro route network and discover shorter station-to-station journeys.
        For a broader starting point, open the <a href="/">Delhi Metro Route Planner</a> homepage or browse key stations
        like <a href="/stations/rajiv-chowk/">Rajiv Chowk</a>, <a href="/stations/kashmere-gate/">Kashmere Gate</a>, and
        <a href="/stations/new-delhi/">New Delhi</a>.
      </p>
      <p>
        When planning from ${escapeHtml(station.text)}, compare the listed route pages with your destination and then open
        the full planner for a map view. The planner highlights the route on the network, shows the station sequence, and
        keeps the selected source and destination ready for sharing. This makes the page useful for commuters who visit
        the same station often and for visitors who are checking a Delhi Metro journey for the first time.
      </p>
      <p>
        Route estimates on this site are designed for quick planning and may differ from official operating conditions,
        service updates, or fare rules. For official passenger notices, network information, and metro service updates,
        visit the <a href="https://www.delhimetrorail.com/" target="_blank" rel="noopener noreferrer">Delhi Metro Rail Corporation</a>.
      </p>
    </main>`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TrainStation',
    name: `${station.text} Metro Station`,
    url: `${baseUrl}${pathname}`,
    containedInPlace: 'Delhi Metro',
    description: station.description || description,
    geo: isValidCoordinatePair(station) ? {
      '@type': 'GeoCoordinates',
      latitude: station.Latitude,
      longitude: station.Longitude,
    } : undefined,
  };

  return { pathname, html: renderHtml({ title, description, keywords, canonicalPath: pathname, body, schema }) };
};

const routePage = (route) => {
  const pathname = routePathname(route.from, route.to);
  const title = `${route.fromName} to ${route.toName} Metro Route | Fare, Time & Stops`;
  const interchangeText = route.interchanges.length
    ? ` Interchange at ${route.interchanges.map(stationName).join(', ')}.`
    : ' No interchange is usually needed for this route.';
  const description = `Plan the Delhi Metro route from ${route.fromName} to ${route.toName}. Estimated fare Rs ${route.fare}, ${route.estimatedMinutes} minutes, ${route.stops} stops, about ${route.distanceKm} km.${interchangeText}`;
  const keywords = `${route.fromName} to ${route.toName} metro route, ${route.fromName} to ${route.toName} metro fare, Delhi Metro ${route.fromName} ${route.toName}, ${route.fromName} to ${route.toName} travel time`;
  const intermediateStations = route.pathIds.slice(1, -1).map(stationName);
  const body = `
    <main class="seo-prerender">
      <h1>${escapeHtml(route.fromName)} to ${escapeHtml(route.toName)} Metro Route</h1>
      <img src="${showcaseImagePath}" alt="Delhi Metro route planner for ${escapeHtml(route.fromName)} to ${escapeHtml(route.toName)}" width="1200" height="630" loading="lazy" />
      <p>${escapeHtml(description)}</p>
      <dl>
        <dt>Fare</dt><dd>Rs ${route.fare}</dd>
        <dt>Sunday fare</dt><dd>Rs ${route.holidayFare}</dd>
        <dt>Travel time</dt><dd>${route.estimatedMinutes} minutes</dd>
        <dt>Stops</dt><dd>${route.stops}</dd>
        <dt>Distance</dt><dd>${route.distanceKm} km</dd>
      </dl>
      <h2>Route details</h2>
      <p>
        This Delhi Metro route starts at <a href="${stationPathname(route.from)}">${escapeHtml(route.fromName)}</a> and
        ends at <a href="${stationPathname(route.to)}">${escapeHtml(route.toName)}</a>. The route includes
        ${route.stops} stops, covers about ${route.distanceKm} km, and has an estimated journey time of ${route.estimatedMinutes} minutes.
        The estimated fare is Rs ${route.fare} from Monday to Saturday and Rs ${route.holidayFare} on Sundays and national holidays.
        ${route.interchanges.length
          ? `You may need to change metro lines at ${escapeHtml(route.interchanges.map(stationName).join(', '))}.`
          : 'A line change is usually not needed for this route.'}
      </p>
      <p>
        Stations on this route: ${escapeHtml(route.pathIds.map(stationName).join(' -> '))}.
        ${intermediateStations.length
          ? `Important stations between ${escapeHtml(route.fromName)} and ${escapeHtml(route.toName)} include ${escapeHtml(intermediateStations.slice(0, 6).join(', '))}.`
          : `This is a direct neighboring-station route between ${escapeHtml(route.fromName)} and ${escapeHtml(route.toName)}.`}
      </p>
      <h2>Plan this journey</h2>
      <p>
        Open the interactive planner for this journey:
        <a href="/?from=${encodeURIComponent(route.from)}&amp;to=${encodeURIComponent(route.to)}">${escapeHtml(route.fromName)} to ${escapeHtml(route.toName)}</a>.
        You can also check the reverse route:
        <a href="${routePathname(route.to, route.from)}">${escapeHtml(route.toName)} to ${escapeHtml(route.fromName)}</a>.
      </p>
      <p>
        Route estimates are intended for quick planning. For official service updates, timings, and passenger notices,
        visit the <a href="https://www.delhimetrorail.com/" target="_blank" rel="noopener noreferrer">Delhi Metro Rail Corporation</a>.
      </p>
    </main>`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Trip',
    name: `${route.fromName} to ${route.toName} Delhi Metro route`,
    url: `${baseUrl}${pathname}`,
    departureStation: {
      '@type': 'TrainStation',
      name: route.fromName,
    },
    arrivalStation: {
      '@type': 'TrainStation',
      name: route.toName,
    },
    itinerary: route.pathIds.map((stationId) => stationName(stationId)),
  };

  return {
    pathname,
    html: renderHtml({
      title,
      description,
      keywords,
      canonicalPath: pathname,
      body,
      schema,
      hydrationData: {
        from: route.from,
        to: route.to,
      },
    }),
  };
};

const routes = [];
for (const origin of stations) {
  const previous = buildShortestPathTree(origin.id);

  for (const destination of stations) {
    if (origin.id === destination.id) continue;

    const route = routeSummary(origin.id, destination.id, previous);
    if (route) routes.push(route);
  }
}

const pages = [
  ...stations.map(stationPage),
  ...routes.map(routePage),
];

for (const page of pages) {
  await writePage(page.pathname, page.html);
}

const sitemapUrls = [
  { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'weekly' },
  ...stations.map((station) => ({
    loc: `${baseUrl}${stationPathname(station.id)}`,
    priority: '0.8',
    changefreq: 'monthly',
  })),
  ...routes.map((route) => ({
    loc: `${baseUrl}${routePathname(route.from, route.to)}`,
    priority: '0.7',
    changefreq: 'monthly',
  })),
];

const sitemapChunks = [];
for (let index = 0; index < sitemapUrls.length; index += sitemapUrlLimit) {
  sitemapChunks.push(sitemapUrls.slice(index, index + sitemapUrlLimit));
}

for (const [index, urls] of sitemapChunks.entries()) {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>
    <loc>${escapeHtml(url.loc)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

  await writeFile(path.join(distDir, `sitemap-${index + 1}.xml`), sitemap);
}

const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapChunks.map((_, index) => `  <sitemap>
    <loc>${baseUrl}/sitemap-${index + 1}.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>
`;

await writeFile(path.join(distDir, 'sitemap.xml'), sitemapIndex);
await writeFile(path.join(distDir, 'robots.txt'), `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`);

console.log(`Generated ${stations.length} station pages, ${routes.length} route pages, ${sitemapChunks.length} sitemap files, and sitemap.xml index.`);
