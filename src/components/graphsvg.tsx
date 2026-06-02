'use client';
import {
  DiscIcon,
  EnterFullScreenIcon,
  PauseIcon,
  PlayIcon,
  ResetIcon,
  UpdateIcon,
  VideoIcon,
} from '@radix-ui/react-icons';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import * as React from 'react';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import edges from '../data/edge.json';
import stationLabels from '../data/stations-lite.json';
import MetroTrain from '../assets/metro.svg?react';
import Map, { type MapControls, type MapTransform } from './metromap';
import { getLocalizedStationName, useI18n } from '../i18n';
import type { CinematicZoomLevel, RouteAnimationMode, RouteSummary } from '../types/route';

gsap.registerPlugin(useGSAP);

const VIEWBOX_WIDTH = 1500;
const VIEWBOX_HEIGHT = 1450;
const ROUTE_CAMERA_SCALE = 12.6;
const MIN_MAP_SCALE = 1.8;
const MAX_MAP_SCALE = ROUTE_CAMERA_SCALE;
const WHEEL_ZOOM_IN_SCALE = 1.1625;
const WHEEL_ZOOM_OUT_SCALE = 0.9125;
const STATION_DWELL_SECONDS = 0.55;
const EXPORT_FONT_STACK = '"Hiragino Maru Gothic ProN", "Hiragino Sans", "Yu Gothic", "Meiryo", system-ui, sans-serif';
const SHORTS_WIDTH = 1080;
const SHORTS_HEIGHT = 1920;
const SHORTS_FRAME_RATE = 30;
const ENABLE_SHORTS_EXPORT = import.meta.env.DEV
  && typeof window !== 'undefined'
  && ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);

const fitTransform: MapTransform = {
  scaleX: 1,
  scaleY: 1,
  translateX: 0,
  translateY: 0,
};

const transformToString = ({ scaleX, scaleY, translateX, translateY }: MapTransform) =>
  `matrix(${scaleX} 0 0 ${scaleY} ${translateX} ${translateY})`;

const coordinatePattern = /[-+]?\d*\.?\d+/g;

const extractEdgePoints = (path: string) => {
  const coordinates = [...path.matchAll(coordinatePattern)].map(Number);
  return {
    first: { x: coordinates[0], y: coordinates[1] },
    last: {
      x: coordinates[coordinates.length - 2],
      y: coordinates[coordinates.length - 1],
    },
  };
};

const pointKey = ({ x, y }: { x: number; y: number }) => `${x.toFixed(3)},${y.toFixed(3)}`;

const resolveStationCoordinates = () => {
  const incidentPoints: Record<string, Array<{ x: number; y: number }>> = {};
  const edgePoints = edges.map((edge) => {
    const points = extractEdgePoints(edge.path);
    incidentPoints[edge.from] = [...(incidentPoints[edge.from] || []), points.first, points.last];
    incidentPoints[edge.to] = [...(incidentPoints[edge.to] || []), points.first, points.last];

    return { ...edge, ...points };
  });

  const coordinates: Record<string, { x: number; y: number }> = {};

  for (const [stationId, points] of Object.entries(incidentPoints)) {
    const counts = points.reduce<Record<string, { count: number; point: { x: number; y: number } }>>((acc, point) => {
      const key = pointKey(point);
      acc[key] = { count: (acc[key]?.count || 0) + 1, point };
      return acc;
    }, {});

    const sharedPoint = Object.values(counts).sort((a, b) => b.count - a.count)[0];
    if (sharedPoint && sharedPoint.count > 1) {
      coordinates[stationId] = sharedPoint.point;
    }
  }

  for (const edge of edgePoints) {
    const fromCoordinate = coordinates[edge.from];
    const toCoordinate = coordinates[edge.to];

    if (!fromCoordinate && toCoordinate) {
      coordinates[edge.from] = pointKey(edge.first) === pointKey(toCoordinate) ? edge.last : edge.first;
    }

    if (!toCoordinate && fromCoordinate) {
      coordinates[edge.to] = pointKey(edge.first) === pointKey(fromCoordinate) ? edge.last : edge.first;
    }
  }

  return coordinates;
};

const stationCoordinates = resolveStationCoordinates();

const normalizeLabelText = (text: string) => text.replace(/\s+/g, ' ').trim();

const stationByEnglishName = new globalThis.Map(stationLabels.map((station) => [station.text, station]));
const stationBySvgLabel = new globalThis.Map([
  ['Major Mohit Sharma Rajendra Nagar', 'RJNM'],
  ['Vishweshwaraiah Moti', 'SVMB'],
  ['Sadar Bazar Cantonment', 'SABR'],
  ['Terminal-1 IGI Airport', 'IGDA'],
]);
const stationBySvgClass = new globalThis.Map([
  ['SABR-PALM IGDA-SABR', 'SABR'],
  ['IGDA-SABR SKVR-IGDA', 'IGDA'],
]);

const createFocusTransform = (point: { x: number; y: number }, scale = ROUTE_CAMERA_SCALE): MapTransform => ({
  scaleX: scale,
  scaleY: scale,
  translateX: VIEWBOX_WIDTH / 2 - point.x * scale,
  translateY: VIEWBOX_HEIGHT / 2 - point.y * scale,
});

const createRouteFitTransform = (measure: SVGPathElement, pathLength: number): MapTransform => {
  const sampleCount = 160;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (let index = 0; index <= sampleCount; index += 1) {
    const point = measure.getPointAtLength((pathLength * index) / sampleCount);
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  }

  if (![minX, minY, maxX, maxY].every(Number.isFinite)) return fitTransform;

  const padding = 180;
  const routeWidth = Math.max(maxX - minX, 1);
  const routeHeight = Math.max(maxY - minY, 1);
  const routeCenterX = minX + routeWidth / 2;
  const routeCenterY = minY + routeHeight / 2;
  const scale = clamp(
    Math.min(
      (VIEWBOX_WIDTH - padding * 2) / routeWidth,
      (VIEWBOX_HEIGHT - padding * 2) / routeHeight
    ),
    1,
    ROUTE_CAMERA_SCALE
  );

  return {
    scaleX: scale,
    scaleY: scale,
    translateX: VIEWBOX_WIDTH / 2 - routeCenterX * scale,
    translateY: VIEWBOX_HEIGHT / 2 - routeCenterY * scale,
  };
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const getEventPoint = (
  event: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>
) => {
  const source = 'touches' in event ? event.touches[0] || event.changedTouches[0] : event;
  return { x: source.clientX, y: source.clientY };
};

const getTouchPoint = (touch: React.Touch) => ({
  x: touch.clientX,
  y: touch.clientY,
});

const getTouchDistance = (touches: React.TouchList) => {
  const first = getTouchPoint(touches[0]);
  const second = getTouchPoint(touches[1]);
  return Math.hypot(second.x - first.x, second.y - first.y);
};

const getTouchMidpoint = (touches: React.TouchList) => {
  const first = getTouchPoint(touches[0]);
  const second = getTouchPoint(touches[1]);
  return {
    x: (first.x + second.x) / 2,
    y: (first.y + second.y) / 2,
  };
};

const toSvgPoint = (
  event: Pick<React.MouseEvent<SVGSVGElement> | React.WheelEvent<SVGSVGElement>, 'clientX' | 'clientY'>,
  svg: SVGSVGElement
) => {
  const rect = svg.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * VIEWBOX_WIDTH,
    y: ((event.clientY - rect.top) / rect.height) * VIEWBOX_HEIGHT,
  };
};

const makePathElement = (path: string) => {
  const element = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  element.setAttribute('d', path);
  return element;
};

const distanceSquared = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  (a.x - b.x) ** 2 + (a.y - b.y) ** 2;

const findClosestProgressOnPath = (
  measure: SVGPathElement,
  pathLength: number,
  point: { x: number; y: number }
) => {
  const sampleCount = 180;
  let bestLength = 0;
  let bestDistance = Infinity;

  for (let index = 0; index <= sampleCount; index += 1) {
    const sampleLength = (pathLength * index) / sampleCount;
    const samplePoint = measure.getPointAtLength(sampleLength);
    const sampleDistance = distanceSquared(samplePoint, point);

    if (sampleDistance < bestDistance) {
      bestDistance = sampleDistance;
      bestLength = sampleLength;
    }
  }

  let low = clamp(bestLength - pathLength / sampleCount, 0, pathLength);
  let high = clamp(bestLength + pathLength / sampleCount, 0, pathLength);

  for (let index = 0; index < 16; index += 1) {
    const left = low + (high - low) / 3;
    const right = high - (high - low) / 3;
    const leftDistance = distanceSquared(measure.getPointAtLength(left), point);
    const rightDistance = distanceSquared(measure.getPointAtLength(right), point);

    if (leftDistance < rightDistance) {
      high = right;
    } else {
      low = left;
    }
  }

  return clamp((low + high) / 2 / pathLength, 0, 1);
};

const getRouteStops = (
  measure: SVGPathElement,
  pathLength: number,
  routeStationIds: string[]
) => {
  const stationProgresses = routeStationIds
    .map((stationId) => {
      const point = stationCoordinates[stationId];
      if (!point) return null;

      return {
        stationId,
        progress: findClosestProgressOnPath(measure, pathLength, point),
      };
    })
    .filter((stop): stop is { stationId: string; progress: number } => Boolean(stop))
    .sort((a, b) => a.progress - b.progress);

  return stationProgresses.filter((stop, index) => (
    index === 0 || Math.abs(stop.progress - stationProgresses[index - 1].progress) > 0.001
  ));
};

const decodeBase64Audio = (audioBase64: string) => {
  const binary = window.atob(audioBase64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes.buffer;
};

const shortsLanguageCode = {
  en: 'en-IN',
  hi: 'hi-IN',
  mr: 'mr-IN',
  bn: 'bn-IN',
} as const;

const getRouteEdge = (from: string, to: string) =>
  edges.find((edge) => edge.from === from && edge.to === to) ||
  edges.find((edge) => edge.from === to && edge.to === from);

const lineNames: Record<string, Record<keyof typeof shortsLanguageCode, string>> = {
  '#c1282b': { en: 'Red Line', hi: 'रेड लाइन', mr: 'रेड लाइन', bn: 'রেড লাইন' },
  '#f5d618': { en: 'Yellow Line', hi: 'येलो लाइन', mr: 'येलो लाइन', bn: 'ইয়েলো লাইন' },
  '#3e77bc': { en: 'Blue Line', hi: 'ब्लू लाइन', mr: 'ब्लू लाइन', bn: 'ব্লু লাইন' },
  '#52aa55': { en: 'Green Line', hi: 'ग्रीन लाइन', mr: 'ग्रीन लाइन', bn: 'গ্রিন লাইন' },
  '#8115ff': { en: 'Violet Line', hi: 'वायलेट लाइन', mr: 'वायलेट लाइन', bn: 'ভায়োলেট লাইন' },
  '#e692be': { en: 'Pink Line', hi: 'पिंक लाइन', mr: 'पिंक लाइन', bn: 'পিঙ্ক লাইন' },
  '#FF00FF': { en: 'Magenta Line', hi: 'मजेंटा लाइन', mr: 'मजेंटा लाइन', bn: 'ম্যাজেন্টা লাইন' },
  '#d4d4d6': { en: 'Grey Line', hi: 'ग्रे लाइन', mr: 'ग्रे लाइन', bn: 'গ্রে লাইন' },
  '#eb8923': { en: 'Orange Line', hi: 'ऑरेंज लाइन', mr: 'ऑरेंज लाइन', bn: 'অরেঞ্জ লাইন' },
  '#015b97': { en: 'Airport Express Line', hi: 'एयरपोर्ट एक्सप्रेस लाइन', mr: 'एअरपोर्ट एक्सप्रेस लाइन', bn: 'এয়ারপোর্ট এক্সপ্রেস লাইন' },
};

const getLineName = (color: string, language: keyof typeof shortsLanguageCode) =>
  lineNames[color]?.[language] || 'Metro Line';

const getLineTerminal = (fromStationId: string, nextStationId: string, color: string, language: keyof typeof shortsLanguageCode) => {
  let previousStationId = fromStationId;
  let currentStationId = nextStationId;
  const visited = new Set([fromStationId]);

  while (!visited.has(currentStationId)) {
    visited.add(currentStationId);

    const nextEdge = edges.find((edge) =>
      edge.stroke === color &&
      (edge.from === currentStationId || edge.to === currentStationId) &&
      edge.from !== previousStationId &&
      edge.to !== previousStationId
    );

    if (!nextEdge) break;

    previousStationId = currentStationId;
    currentStationId = nextEdge.from === currentStationId ? nextEdge.to : nextEdge.from;
  }

  const fallbackName = stationLabels.find((station) => station.id === currentStationId)?.text || currentStationId;
  return getLocalizedStationName(currentStationId, fallbackName, language);
};

const getRouteDirectionSteps = (route: RouteSummary, language: keyof typeof shortsLanguageCode) => {
  const routeStations = route.stationDetails;

  return routeStations.slice(0, -1).flatMap((station, index) => {
    const nextStation = routeStations[index + 1];
    const previousEdge = index > 0 ? getRouteEdge(routeStations[index - 1].id, station.id) : undefined;
    const nextEdge = getRouteEdge(station.id, nextStation.id);
    if (!nextEdge) return [];

    const isNewLine = index === 0 || previousEdge?.stroke !== nextEdge.stroke;
    if (!isNewLine) return [];

    return [{
      stationId: station.id,
      stationName: station.name,
      lineName: getLineName(nextEdge.stroke, language),
      terminalName: getLineTerminal(station.id, nextStation.id, nextEdge.stroke, language),
    }];
  });
};

type ShortsScriptSegment = {
  text: string;
  stationId?: string;
};

const makeShortsScriptSegments = (
  route: RouteSummary,
  fromName: string,
  toName: string,
  language: keyof typeof shortsLanguageCode
): ShortsScriptSegment[] => {
  const directionSteps = getRouteDirectionSteps(route, language);
  const firstDirection = directionSteps[0];
  const interchangeDirections = directionSteps.slice(1);
  const routeIntro = {
    en: `We are travelling from ${fromName} to ${toName} by Delhi Metro.`,
    hi: `हम दिल्ली मेट्रो से ${fromName} से ${toName} तक यात्रा कर रहे हैं.`,
    mr: `आपण दिल्ली मेट्रोने ${fromName} ते ${toName} प्रवास करत आहोत.`,
    bn: `আমরা দিল্লি মেট্রোতে ${fromName} থেকে ${toName} যাচ্ছি.`,
  }[language];
  const directionSentence = firstDirection
    ? {
      en: `From ${fromName}, take the ${firstDirection.lineName} toward ${firstDirection.terminalName}.`,
      hi: `${fromName} से ${firstDirection.lineName} लें, ${firstDirection.terminalName} की ओर.`,
      mr: `${fromName} पासून ${firstDirection.lineName} घ्या, ${firstDirection.terminalName} च्या दिशेने.`,
      bn: `${fromName} থেকে ${firstDirection.lineName} ধরুন, ${firstDirection.terminalName} এর দিকে.`,
    }[language]
    : {
      en: `Start at ${fromName} and follow this route step by step.`,
      hi: `${fromName} से शुरू करें और इस रूट को स्टेप बाय स्टेप फॉलो करें.`,
      mr: `${fromName} पासून सुरू करा आणि हा मार्ग स्टेप बाय स्टेप फॉलो करा.`,
      bn: `${fromName} থেকে শুরু করুন এবং এই রুটটি ধাপে ধাপে ফলো করুন.`,
    }[language];
  const interchangeSegments = interchangeDirections.map((step) => ({
    text: {
      en: `At ${step.stationName}, change to the ${step.lineName} toward ${step.terminalName}.`,
      hi: `${step.stationName} पर ${step.lineName} बदलें, ${step.terminalName} की ओर.`,
      mr: `${step.stationName} येथे ${step.lineName} बदला, ${step.terminalName} च्या दिशेने.`,
      bn: `${step.stationName} এ ${step.lineName} বদলান, ${step.terminalName} এর দিকে.`,
    }[language],
    stationId: step.stationId,
  }));
  const noInterchangeSegment: ShortsScriptSegment = {
    text: {
      en: 'No line change is needed on this route.',
      hi: 'इस रूट में लाइन बदलने की जरूरत नहीं है.',
      mr: 'या मार्गावर लाइन बदलण्याची गरज नाही.',
      bn: 'এই রুটে লাইন বদলানোর দরকার নেই.',
    }[language],
  };

  const scripts = {
    en: [
      { text: routeIntro, stationId: route.from },
      { text: directionSentence, stationId: firstDirection?.stationId || route.from },
      { text: `You will pass ${route.distance} stations in about ${route.estimatedMinutes} minutes.` },
      { text: `The fare is around rupees ${route.fare}.` },
      ...(interchangeSegments.length ? interchangeSegments : [noInterchangeSegment]),
      { text: `Your final stop is ${toName}.`, stationId: route.to },
      { text: 'Plan your Delhi Metro trip at metro dot coolhead dot in.', stationId: route.to },
    ],
    hi: [
      { text: routeIntro, stationId: route.from },
      { text: directionSentence, stationId: firstDirection?.stationId || route.from },
      { text: `इस यात्रा में ${route.distance} स्टेशन हैं और लगभग ${route.estimatedMinutes} मिनट लगेंगे.` },
      { text: `किराया करीब ${route.fare} रुपये है.` },
      ...(interchangeSegments.length ? interchangeSegments : [noInterchangeSegment]),
      { text: `आपका आखिरी स्टेशन ${toName} है.`, stationId: route.to },
      { text: 'अपनी दिल्ली मेट्रो यात्रा metro dot coolhead dot in पर प्लान करें.', stationId: route.to },
    ],
    mr: [
      { text: routeIntro, stationId: route.from },
      { text: directionSentence, stationId: firstDirection?.stationId || route.from },
      { text: `या प्रवासात ${route.distance} स्थानके आहेत आणि सुमारे ${route.estimatedMinutes} मिनिटे लागतील.` },
      { text: `भाडे सुमारे ${route.fare} रुपये आहे.` },
      ...(interchangeSegments.length ? interchangeSegments : [noInterchangeSegment]),
      { text: `तुमचे शेवटचे स्थानक ${toName} आहे.`, stationId: route.to },
      { text: 'तुमचा दिल्ली मेट्रो प्रवास metro dot coolhead dot in वर प्लान करा.', stationId: route.to },
    ],
    bn: [
      { text: routeIntro, stationId: route.from },
      { text: directionSentence, stationId: firstDirection?.stationId || route.from },
      { text: `এই যাত্রায় ${route.distance}টি স্টেশন আছে এবং প্রায় ${route.estimatedMinutes} মিনিট লাগবে.` },
      { text: `ভাড়া প্রায় ${route.fare} টাকা.` },
      ...(interchangeSegments.length ? interchangeSegments : [noInterchangeSegment]),
      { text: `আপনার শেষ স্টেশন ${toName}.`, stationId: route.to },
      { text: 'আপনার দিল্লি মেট্রো যাত্রা metro dot coolhead dot in এ প্ল্যান করুন.', stationId: route.to },
    ],
  };

  return scripts[language];
};

const wrapCanvasText = (
  context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  text: string,
  maxWidth: number
) => {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (context.measureText(nextLine).width <= maxWidth || !currentLine) {
      currentLine = nextLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) lines.push(currentLine);
  return lines;
};

const makeShortsStats = (route: RouteSummary, language: keyof typeof shortsLanguageCode) => {
  const stats = {
    en: `${route.distance} stations • ${route.estimatedMinutes} mins • Rs ${route.fare}`,
    hi: `${route.distance} स्टेशन • ${route.estimatedMinutes} मिनट • ${route.fare} रुपये`,
    mr: `${route.distance} स्थानके • ${route.estimatedMinutes} मिनिटे • ${route.fare} रुपये`,
    bn: `${route.distance} স্টেশন • ${route.estimatedMinutes} মিনিট • ${route.fare} টাকা`,
  };

  return stats[language];
};

const getActiveRouteStation = (
  routeStops: Array<{ stationId: string; progress: number }>,
  route: RouteSummary,
  progress: number
) => {
  const activeStop = routeStops.reduce((closest, stop) => (
    Math.abs(stop.progress - progress) < Math.abs(closest.progress - progress) ? stop : closest
  ), routeStops[0]);

  return route.stationDetails.find((station) => station.id === activeStop?.stationId) || route.stationDetails[0];
};

const drawShortsJourneyTimeline = (
  context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  route: RouteSummary,
  routeStops: Array<{ stationId: string; progress: number }>,
  progress: number
) => {
  const panelX = 64;
  const panelY = SHORTS_HEIGHT - 350;
  const panelWidth = SHORTS_WIDTH - 128;
  const panelHeight = 230;
  const lineX = panelX + 72;
  const lineY = panelY + 126;
  const lineWidth = panelWidth - 144;
  const activeStation = getActiveRouteStation(routeStops, route, progress);
  const firstProgress = routeStops[0]?.progress || 0;
  const lastProgress = routeStops[routeStops.length - 1]?.progress || 1;
  const normalizedProgress = clamp((progress - firstProgress) / Math.max(lastProgress - firstProgress, 0.0001), 0, 1);
  const stationColor = (stationId: string, fallback = '#009b50') =>
    route.stationDetails.find((station) => station.id === stationId)?.lineColors[0] || fallback;

  context.fillStyle = 'rgba(255, 255, 255, 0.94)';
  context.fillRect(panelX, panelY, panelWidth, panelHeight);
  context.fillStyle = '#111827';
  context.font = `800 30px ${EXPORT_FONT_STACK}`;
  context.fillText('Journey timeline', panelX + 32, panelY + 50);
  context.fillStyle = '#525252';
  context.font = `700 24px ${EXPORT_FONT_STACK}`;
  context.fillText(activeStation?.name || route.fromName, panelX + 32, panelY + 88);

  context.lineWidth = 10;
  context.lineCap = 'round';

  routeStops.slice(0, -1).forEach((stop, index) => {
    const nextStop = routeStops[index + 1];
    const startProgress = clamp((stop.progress - firstProgress) / Math.max(lastProgress - firstProgress, 0.0001), 0, 1);
    const endProgress = clamp((nextStop.progress - firstProgress) / Math.max(lastProgress - firstProgress, 0.0001), 0, 1);
    const startX = lineX + lineWidth * startProgress;
    const endX = lineX + lineWidth * endProgress;
    const edgeColor = getRouteEdge(stop.stationId, nextStop.stationId)?.stroke || stationColor(stop.stationId);
    const visibleEndProgress = clamp(normalizedProgress, startProgress, endProgress);
    const visibleEndX = lineX + lineWidth * visibleEndProgress;

    context.strokeStyle = '#d4d4d4';
    context.beginPath();
    context.moveTo(startX, lineY);
    context.lineTo(endX, lineY);
    context.stroke();

    if (normalizedProgress >= startProgress) {
      context.strokeStyle = edgeColor;
      context.beginPath();
      context.moveTo(startX, lineY);
      context.lineTo(visibleEndX, lineY);
      context.stroke();
    }
  });

  routeStops.forEach((stop) => {
    const stationProgress = clamp((stop.progress - firstProgress) / Math.max(lastProgress - firstProgress, 0.0001), 0, 1);
    const x = lineX + lineWidth * stationProgress;
    const isPassed = stationProgress <= normalizedProgress + 0.002;
    const isInterchange = route.interchanges.some((interchange) => interchange.id === stop.stationId);
    const color = stationColor(stop.stationId);

    context.fillStyle = isPassed ? color : '#ffffff';
    context.strokeStyle = isInterchange ? '#dc2626' : isPassed ? color : '#a3a3a3';
    context.lineWidth = isInterchange ? 5 : 3;
    context.beginPath();
    context.arc(x, lineY, isInterchange ? 11 : 8, 0, Math.PI * 2);
    context.fill();
    context.stroke();
  });

  context.fillStyle = '#111827';
  context.font = `700 24px ${EXPORT_FONT_STACK}`;
  context.fillText(route.fromName, panelX + 32, panelY + 184);
  const toLabel = route.toName;
  context.fillText(toLabel, panelX + panelWidth - 32 - context.measureText(toLabel).width, panelY + 184);
};

const loadAudioAsset = async (url: string, audioContext: AudioContext) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not load audio asset: ${url}`);

  return audioContext.decodeAudioData(await response.arrayBuffer());
};

const mixVoiceoverWithSfx = async (
  voiceover: AudioBuffer,
  effects: Array<{ buffer: AudioBuffer; start: number; gain: number }>
) => {
  const duration = Math.max(
    voiceover.duration,
    ...effects.map((effect) => effect.start + effect.buffer.duration + 0.15)
  );
  const output = new OfflineAudioContext(
    voiceover.numberOfChannels,
    Math.ceil(duration * voiceover.sampleRate),
    voiceover.sampleRate
  );

  const voiceSource = output.createBufferSource();
  const voiceGain = output.createGain();
  voiceSource.buffer = voiceover;
  voiceGain.gain.value = 0.96;
  voiceSource.connect(voiceGain).connect(output.destination);
  voiceSource.start(0);

  effects.forEach((effect) => {
    const sfxSource = output.createBufferSource();
    const sfxGain = output.createGain();
    sfxSource.buffer = effect.buffer;
    sfxGain.gain.value = effect.gain;
    sfxSource.connect(sfxGain).connect(output.destination);
    sfxSource.start(Math.max(0, effect.start));
  });

  return output.startRendering();
};

function SvgComponent({
  setPlay,
  play,
  path,
  route,
  selectedStationId,
  routeStationIds,
  onActiveStationChange,
  onStationClick,
  animationMode,
  cinematicZoom,
  routeFitRequest,
  routePreviewMode = false,
}: {
  setPlay: React.Dispatch<React.SetStateAction<boolean>>;
  play: boolean;
  path: string;
  route: RouteSummary | null;
  selectedStationId: string;
  routeStationIds: string[];
  onActiveStationChange?: (stationId: string | null) => void;
  onStationClick?: (stationId: string) => void;
  animationMode: RouteAnimationMode;
  cinematicZoom: CinematicZoomLevel;
  routeFitRequest?: number;
  routePreviewMode?: boolean;
}) {
  const { language } = useI18n();
  const [isDragging, setIsDragging] = useState(false);
  const [isExportingVideo, setIsExportingVideo] = useState(false);
  const [isExportingShortsVideo, setIsExportingShortsVideo] = useState(false);
  const [canExportVideo, setCanExportVideo] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const mapGroupRef = useRef<SVGGElement | null>(null);
  const trainRef = useRef<SVGGElement | null>(null);
  const routePathRef = useRef<SVGPathElement | null>(null);
  const pathMeasureRef = useRef<SVGPathElement | null>(null);
  const pathLengthRef = useRef(0);
  const transformRef = useRef<MapTransform>(fitTransform);
  const pendingTransformRef = useRef<MapTransform | null>(null);
  const transformFrameRef = useRef<number | null>(null);
  const routeProgressRef = useRef(0);
  const dragRef = useRef({
    x: 0,
    y: 0,
    translateX: 0,
    translateY: 0,
  });
  const pinchRef = useRef({
    distance: 0,
    scale: 1,
    translateX: 0,
    translateY: 0,
  });
  const tweenRef = useRef<gsap.core.Timeline | null>(null);
  const playRef = useRef(play);
  const routeCameraScale = ROUTE_CAMERA_SCALE * (cinematicZoom / 3);

  useLayoutEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    svg.querySelectorAll<SVGTextElement>('g.label text').forEach((label) => {
      const stationId = label.dataset.stationId;
      const fallbackName = label.dataset.stationName || normalizeLabelText(label.textContent || '');
      const svgLabelStationId = stationBySvgLabel.get(fallbackName);
      const svgClassStationId = stationBySvgClass.get(label.getAttribute('class') || '');
      const station = stationId
        ? stationLabels.find((item) => item.id === stationId)
        : svgLabelStationId ? stationLabels.find((item) => item.id === svgLabelStationId)
          : svgClassStationId ? stationLabels.find((item) => item.id === svgClassStationId)
            : stationByEnglishName.get(fallbackName);

      if (!station) return;

      label.dataset.stationId = station.id;
      label.dataset.stationName = station.text;
      label.style.cursor = 'pointer';

      const localizedName = getLocalizedStationName(station.id, station.text, language);
      const tspans = Array.from(label.querySelectorAll('tspan'));

      if (!tspans.length) {
        label.textContent = localizedName;
        return;
      }

      tspans.forEach((tspan, index) => {
        tspan.textContent = index === 0 ? localizedName : '';
      });
    });
  }, [language]);

  useEffect(() => {
    playRef.current = play;
  }, [play]);

  useEffect(() => {
    document.body.classList.toggle('gesture-grabbing', isDragging);

    return () => document.body.classList.remove('gesture-grabbing');
  }, [isDragging]);

  useEffect(() => {
    setCanExportVideo(typeof VideoEncoder !== 'undefined');
  }, []);

  useEffect(() => () => {
    if (transformFrameRef.current !== null) {
      cancelAnimationFrame(transformFrameRef.current);
    }
  }, []);

  const applyTransform = React.useCallback((nextTransform: MapTransform, immediate = false) => {
    transformRef.current = nextTransform;
    pendingTransformRef.current = nextTransform;

    if (immediate) {
      if (transformFrameRef.current !== null) {
        cancelAnimationFrame(transformFrameRef.current);
        transformFrameRef.current = null;
      }

      mapGroupRef.current?.setAttribute('transform', transformToString(nextTransform));
      pendingTransformRef.current = null;
      return;
    }

    if (transformFrameRef.current !== null) return;

    transformFrameRef.current = requestAnimationFrame(() => {
      transformFrameRef.current = null;
      const pendingTransform = pendingTransformRef.current;
      if (!pendingTransform) return;

      mapGroupRef.current?.setAttribute('transform', transformToString(pendingTransform));
      pendingTransformRef.current = null;
    });
  }, []);

  const setCameraForProgress = React.useCallback((progress: number, cameraScale = routeCameraScale) => {
    const measure = pathMeasureRef.current;
    const train = trainRef.current;
    const pathLength = pathLengthRef.current;
    if (!measure || !train || !pathLength) return;

    const distance = pathLength * progress;
    const point = measure.getPointAtLength(distance);
    const nextPoint = measure.getPointAtLength(clamp(distance + 4, 0, pathLength));
    const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * (180 / Math.PI);
    const targetScale = cameraScale;

    routeProgressRef.current = progress;
    train.setAttribute('transform', `translate(${point.x} ${point.y}) rotate(${angle})`);
    applyTransform({
      scaleX: targetScale,
      scaleY: targetScale,
      translateX: VIEWBOX_WIDTH / 2 - point.x * targetScale,
      translateY: VIEWBOX_HEIGHT / 2 - point.y * targetScale,
    }, true);
  }, [applyTransform, routeCameraScale]);

  useLayoutEffect(() => {
    tweenRef.current?.kill();
    tweenRef.current = null;
    pathMeasureRef.current = null;
    pathLengthRef.current = 0;

    if (!path) {
      onActiveStationChange?.(null);
      return;
    }

    const measure = makePathElement(path);
    pathMeasureRef.current = measure;
    const length = measure.getTotalLength();
    pathLengthRef.current = length;

    const firstPoint = measure.getPointAtLength(0);
    const nextPoint = measure.getPointAtLength(clamp(4, 0, length));
    const angle = Math.atan2(nextPoint.y - firstPoint.y, nextPoint.x - firstPoint.x) * (180 / Math.PI);
    routeProgressRef.current = 0;
    trainRef.current?.setAttribute('transform', `translate(${firstPoint.x} ${firstPoint.y}) rotate(${angle})`);
    onActiveStationChange?.(routeStationIds[0] || null);
    const initialTransform = routePreviewMode
      ? createRouteFitTransform(measure, length)
      : {
        scaleX: routeCameraScale,
        scaleY: routeCameraScale,
        translateX: VIEWBOX_WIDTH / 2 - firstPoint.x * routeCameraScale,
        translateY: VIEWBOX_HEIGHT / 2 - firstPoint.y * routeCameraScale,
      };

    requestAnimationFrame(() => {
      applyTransform(initialTransform, true);
    });
  }, [path, routePreviewMode, routeStationIds, applyTransform, onActiveStationChange, routeCameraScale]);

  useEffect(() => {
    if (!pathLengthRef.current) return;
    setCameraForProgress(routeProgressRef.current);
  }, [routeCameraScale, setCameraForProgress]);

  useGSAP(() => {
    const focusPoint = stationCoordinates[selectedStationId];
    if (!focusPoint || play) return;

    const proxy = { ...transformRef.current };
    const focusedTransform = createFocusTransform(focusPoint, routeCameraScale);
    const tween = gsap.to(proxy, {
      ...focusedTransform,
      duration: 1,
      ease: 'power3.out',
      onUpdate: () =>
        applyTransform({
          scaleX: proxy.scaleX,
          scaleY: proxy.scaleY,
          translateX: proxy.translateX,
          translateY: proxy.translateY,
        }),
      onComplete: () => applyTransform(focusedTransform, true),
    });

    return () => tween.kill();
  }, { dependencies: [selectedStationId, applyTransform, routeCameraScale], revertOnUpdate: true });

  useGSAP(() => {
    tweenRef.current?.kill();
    tweenRef.current = null;
    const pathLength = pathLengthRef.current;
    if (!path || !pathLength) return;

    const proxy = { progress: 0 };
    const routeStops = getRouteStops(
      pathMeasureRef.current!,
      pathLength,
      routeStationIds
    );
    const timeline = gsap.timeline({
      paused: true,
      onComplete: () => {
        applyTransform(transformRef.current, true);
        setPlay(false);
      },
    });

    if (!routePreviewMode) {
      setCameraForProgress(0);
    }

    if (animationMode === 'smooth') {
      const firstStop = routeStops[0];
      const lastStop = routeStops[routeStops.length - 1];

      if (firstStop && lastStop) {
        proxy.progress = firstStop.progress;
        if (!routePreviewMode) {
          setCameraForProgress(firstStop.progress);
        }
        timeline.to(proxy, {
          progress: lastStop.progress,
          duration: clamp(Math.abs(lastStop.progress - firstStop.progress) * pathLength / 95, 0.7, 8),
          ease: 'power1.inOut',
          onUpdate: () => setCameraForProgress(proxy.progress),
        });
        timeline.call(() => onActiveStationChange?.(lastStop.stationId));
      }
    } else {
      for (let index = 1; index < routeStops.length; index += 1) {
        const previousStop = routeStops[index - 1];
        const nextStop = routeStops[index];
        const segmentLength = (nextStop.progress - previousStop.progress) * pathLength;

        timeline.to(proxy, {
          progress: nextStop.progress,
          duration: clamp(segmentLength / 95, 0.35, 5),
          ease: 'power2.inOut',
          onUpdate: () => setCameraForProgress(proxy.progress),
        });

        timeline.call(() => {
          onActiveStationChange?.(nextStop.stationId);
        });

        if (index < routeStops.length - 1) {
          timeline.to(proxy, {
            progress: nextStop.progress,
            duration: STATION_DWELL_SECONDS,
            ease: 'none',
          });
        }
      }
    }

    tweenRef.current = timeline;

    if (playRef.current) tweenRef.current.play(0);

    return () => {
      tweenRef.current?.kill();
      tweenRef.current = null;
    };
  }, { dependencies: [path, routePreviewMode, routeStationIds, setCameraForProgress, setPlay, applyTransform, onActiveStationChange, animationMode], revertOnUpdate: true });

  useEffect(() => {
    if (!tweenRef.current) return;
    if (play) {
      if (tweenRef.current.progress() >= 1) {
        tweenRef.current.play(0);
      } else {
        tweenRef.current.play();
      }
    } else {
      tweenRef.current.pause();
    }
  }, [play]);

  useEffect(() => {
    if (!routeFitRequest || !pathLengthRef.current || !pathMeasureRef.current) return;

    const measure = pathMeasureRef.current;
    const pathLength = pathLengthRef.current;
    const firstPoint = measure.getPointAtLength(0);
    const nextPoint = measure.getPointAtLength(clamp(4, 0, pathLength));
    const angle = Math.atan2(nextPoint.y - firstPoint.y, nextPoint.x - firstPoint.x) * (180 / Math.PI);

    tweenRef.current?.pause(0);
    routeProgressRef.current = 0;
    trainRef.current?.setAttribute('transform', `translate(${firstPoint.x} ${firstPoint.y}) rotate(${angle})`);
    onActiveStationChange?.(routeStationIds[0] || null);
    applyTransform(createRouteFitTransform(measure, pathLength), true);
  }, [applyTransform, onActiveStationChange, path, routeFitRequest, routeStationIds]);

  const mapControls = useMemo<MapControls>(() => ({
    transform: fitTransform,
    isDragging,
    dragStart: (event) => {
      if ('touches' in event && event.touches.length >= 2) {
        event.preventDefault();
        const current = transformRef.current;
        pinchRef.current = {
          distance: getTouchDistance(event.touches),
          scale: current.scaleX,
          translateX: current.translateX,
          translateY: current.translateY,
        };
        setIsDragging(false);
        return;
      }

      const point = getEventPoint(event);
      dragRef.current = {
        x: point.x,
        y: point.y,
        translateX: transformRef.current.translateX,
        translateY: transformRef.current.translateY,
      };
      setIsDragging(true);
    },
    dragMove: (event) => {
      if ('touches' in event && event.touches.length >= 2) {
        event.preventDefault();
        if (!svgRef.current || !pinchRef.current.distance) return;

        const currentPinch = pinchRef.current;
        const midpoint = getTouchMidpoint(event.touches);
        const point = toSvgPoint({ clientX: midpoint.x, clientY: midpoint.y }, svgRef.current);
        const nextScale = clamp(
          currentPinch.scale * (getTouchDistance(event.touches) / currentPinch.distance),
          MIN_MAP_SCALE,
          MAX_MAP_SCALE
        );
        const factor = nextScale / currentPinch.scale;

        applyTransform({
          scaleX: nextScale,
          scaleY: nextScale,
          translateX: point.x - (point.x - currentPinch.translateX) * factor,
          translateY: point.y - (point.y - currentPinch.translateY) * factor,
        });
        return;
      }

      if (!isDragging) return;
      if ('touches' in event) event.preventDefault();
      const point = getEventPoint(event);
      const rect = svgRef.current?.getBoundingClientRect();
      const scaleX = rect ? VIEWBOX_WIDTH / rect.width : 1;
      const scaleY = rect ? VIEWBOX_HEIGHT / rect.height : 1;

      applyTransform({
        ...transformRef.current,
        translateX: dragRef.current.translateX + (point.x - dragRef.current.x) * scaleX,
        translateY: dragRef.current.translateY + (point.y - dragRef.current.y) * scaleY,
      });
    },
    dragEnd: (event) => {
      if (event && 'touches' in event && event.touches.length === 1) {
        const point = getEventPoint(event);
        dragRef.current = {
          x: point.x,
          y: point.y,
          translateX: transformRef.current.translateX,
          translateY: transformRef.current.translateY,
        };
        setIsDragging(true);
        return;
      }

      setIsDragging(false);
      applyTransform(transformRef.current, true);
    },
    zoomAt: (scale, event) => {
      if (!svgRef.current) return;
      const point = toSvgPoint(event, svgRef.current);
      const current = transformRef.current;
      const nextScale = clamp(current.scaleX * scale, MIN_MAP_SCALE, MAX_MAP_SCALE);
      const factor = nextScale / current.scaleX;

      applyTransform({
        scaleX: nextScale,
        scaleY: nextScale,
        translateX: point.x - (point.x - current.translateX) * factor,
        translateY: point.y - (point.y - current.translateY) * factor,
      }, true);
    },
    wheelZoom: (event) => {
      event.preventDefault();
      if (!svgRef.current) return;

      const point = toSvgPoint(event, svgRef.current);
      const wheelScale = event.deltaY < 0 ? WHEEL_ZOOM_IN_SCALE : WHEEL_ZOOM_OUT_SCALE;

      const current = transformRef.current;
      const nextScale = clamp(current.scaleX * wheelScale, MIN_MAP_SCALE, MAX_MAP_SCALE);
      const factor = nextScale / current.scaleX;

      applyTransform({
        scaleX: nextScale,
        scaleY: nextScale,
        translateX: point.x - (point.x - current.translateX) * factor,
        translateY: point.y - (point.y - current.translateY) * factor,
      });
    },
  }), [applyTransform, isDragging]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    svg.addEventListener('wheel', mapControls.wheelZoom, { passive: false });

    return () => {
      svg.removeEventListener('wheel', mapControls.wheelZoom);
    };
  }, [mapControls]);

  const zoomBy = (scale: number) => {
    const current = transformRef.current;
    const nextScale = clamp(current.scaleX * scale, MIN_MAP_SCALE, MAX_MAP_SCALE);

    applyTransform({
      scaleX: nextScale,
      scaleY: nextScale,
      translateX: VIEWBOX_WIDTH / 2 - (VIEWBOX_WIDTH / 2 - current.translateX) * (nextScale / current.scaleX),
      translateY: VIEWBOX_HEIGHT / 2 - (VIEWBOX_HEIGHT / 2 - current.translateY) * (nextScale / current.scaleY),
    }, true);
  };

  const focusSelectedStation = () => {
    const focusPoint = stationCoordinates[selectedStationId];
    applyTransform(focusPoint ? createFocusTransform(focusPoint, routeCameraScale) : fitTransform, true);
  };

  const selectedStationPoint = stationCoordinates[selectedStationId];

  const handleMapClick = React.useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    const target = event.target as Element | null;
    const stationLabel = target?.closest('text[data-station-id]') as SVGTextElement | null;
    const stationId = stationLabel?.dataset.stationId;

    if (stationId) {
      event.stopPropagation();
      onStationClick?.(stationId);
      return;
    }

    const svg = svgRef.current;
    const mapGroup = mapGroupRef.current;
    const inverseMatrix = mapGroup?.getScreenCTM()?.inverse();
    if (!svg || !inverseMatrix) return;

    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const mapPoint = point.matrixTransform(inverseMatrix);
    const closestStation = Object.entries(stationCoordinates).reduce<{
      stationId: string;
      distance: number;
    } | null>((closest, [candidateStationId, coordinate]) => {
      const distance = Math.hypot(coordinate.x - mapPoint.x, coordinate.y - mapPoint.y);
      if (distance > 14 || (closest && closest.distance <= distance)) return closest;
      return { stationId: candidateStationId, distance };
    }, null);

    if (!closestStation) return;

    event.stopPropagation();
    onStationClick?.(closestStation.stationId);
  }, [onStationClick]);

  const drawSvgToCanvas = React.useCallback(async (
    canvas: HTMLCanvasElement | OffscreenCanvas,
    context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    if (!svgRef.current) return;

    const svgClone = svgRef.current.cloneNode(true) as SVGSVGElement;
    svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svgClone.setAttribute('width', String(width));
    svgClone.setAttribute('height', String(height));
    svgClone.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    style.textContent = `
      text,
      tspan {
        font-family: ${EXPORT_FONT_STACK};
      }
    `;
    svgClone.insertBefore(style, svgClone.firstChild);

    const svgText = new XMLSerializer().serializeToString(svgClone);
    const url = URL.createObjectURL(new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' }));

    try {
      const image = new Image();
      image.decoding = 'sync';
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error('Could not render map frame.'));
        image.src = url;
      });
      context.fillStyle = '#f4f0e8';
      context.fillRect(0, 0, width, height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
    } finally {
      URL.revokeObjectURL(url);
    }
  }, []);

  const downloadRouteVideo = React.useCallback(async () => {
    const svg = svgRef.current;
    const measure = pathMeasureRef.current;
    const pathLength = pathLengthRef.current;

    if (!path || !svg || !measure || !pathLength || isExportingVideo) return;

    setIsExportingVideo(true);
    tweenRef.current?.pause();
    setPlay(false);

    const previousTrainTransform = trainRef.current?.getAttribute('transform');
    const previousMapTransform = transformRef.current;

    try {
      const {
        BufferTarget,
        CanvasSource,
        Output,
        QUALITY_HIGH,
        WebMOutputFormat,
        canEncodeVideo,
      } = await import('mediabunny');

      const rect = svg.getBoundingClientRect();
      const aspectRatio = rect.width && rect.height ? rect.height / rect.width : VIEWBOX_HEIGHT / VIEWBOX_WIDTH;
      const width = 1280;
      const height = Math.round(width * aspectRatio);
      const frameRate = 30;
      const frameDuration = 1 / frameRate;
      const canvas = typeof OffscreenCanvas !== 'undefined'
        ? new OffscreenCanvas(width, height)
        : document.createElement('canvas');

      if (canvas instanceof HTMLCanvasElement) {
        canvas.width = width;
        canvas.height = height;
      }

      const context = canvas.getContext('2d') as CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null;

      if (!context) throw new Error('Canvas export is not supported in this browser.');

      await document.fonts?.ready;

      const codec = await canEncodeVideo('vp9', { width, height, bitrate: QUALITY_HIGH })
        ? 'vp9'
        : await canEncodeVideo('vp8', { width, height, bitrate: QUALITY_HIGH })
          ? 'vp8'
          : null;

      if (!codec) throw new Error('This browser cannot encode WebM video.');

      const target = new BufferTarget();
      const output = new Output({
        format: new WebMOutputFormat(),
        target,
      });
      const source = new CanvasSource(canvas, {
        codec,
        bitrate: QUALITY_HIGH,
      });

      output.addVideoTrack(source);
      await output.start();

      const routeStops = getRouteStops(measure, pathLength, routeStationIds);
      const firstStop = routeStops[0];
      const lastStop = routeStops[routeStops.length - 1];
      if (!firstStop || !lastStop) throw new Error('Route animation is not ready to export.');

      const smoothDuration = clamp(Math.abs(lastStop.progress - firstStop.progress) * pathLength / 95, 0.7, 8);
      const stepSegments = routeStops.slice(1).map((stop, index) => {
        const previousStop = routeStops[index];
        return {
          from: previousStop.progress,
          to: stop.progress,
          travelDuration: clamp((stop.progress - previousStop.progress) * pathLength / 95, 0.35, 5),
          dwellDuration: index < routeStops.length - 2 ? STATION_DWELL_SECONDS : 0,
        };
      });
      const stepDuration = stepSegments.reduce(
        (duration, segment) => duration + segment.travelDuration + segment.dwellDuration,
        0
      );
      const duration = animationMode === 'smooth' ? smoothDuration : stepDuration;
      const frameCount = Math.max(2, Math.ceil(duration * frameRate));
      const exportCameraScale = routeCameraScale;

      for (let frame = 0; frame <= frameCount; frame += 1) {
        const timestamp = frame * frameDuration;
        let progress = firstStop.progress;

        if (animationMode === 'smooth') {
          const linearProgress = clamp(timestamp / smoothDuration, 0, 1);
          const easedProgress = linearProgress < 0.5
            ? 2 * linearProgress * linearProgress
            : 1 - Math.pow(-2 * linearProgress + 2, 2) / 2;
          progress = firstStop.progress + (lastStop.progress - firstStop.progress) * easedProgress;
        } else {
          let remainingTime = timestamp;
          for (const segment of stepSegments) {
            if (remainingTime <= segment.travelDuration) {
              const segmentProgress = clamp(remainingTime / segment.travelDuration, 0, 1);
              const easedProgress = segmentProgress < 0.5
                ? 2 * segmentProgress * segmentProgress
                : 1 - Math.pow(-2 * segmentProgress + 2, 2) / 2;
              progress = segment.from + (segment.to - segment.from) * easedProgress;
              break;
            }

            remainingTime -= segment.travelDuration;
            progress = segment.to;

            if (remainingTime <= segment.dwellDuration) break;
            remainingTime -= segment.dwellDuration;
          }
        }

        setCameraForProgress(progress, exportCameraScale);
        await drawSvgToCanvas(canvas, context, width, height);
        await source.add(timestamp, frameDuration, { keyFrame: frame % frameRate === 0 });
      }

      await output.finalize();
      if (!target.buffer) throw new Error('Video export did not produce a file.');

      const blob = new Blob([target.buffer], { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `delhi-metro-route-${animationMode}.webm`;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 0);
    } catch (error) {
      console.error(error);
      window.alert(error instanceof Error ? error.message : 'Could not export route video.');
    } finally {
      if (previousTrainTransform) {
        trainRef.current?.setAttribute('transform', previousTrainTransform);
      } else {
        trainRef.current?.removeAttribute('transform');
      }
      applyTransform(previousMapTransform, true);
      setIsExportingVideo(false);
    }
  }, [
    animationMode,
    applyTransform,
    drawSvgToCanvas,
    isExportingVideo,
    path,
    routeCameraScale,
    routeStationIds,
    setCameraForProgress,
    setPlay,
  ]);

  const fetchShortsVoiceover = React.useCallback(async (script: string, targetLanguageCode: string) => {
    const response = await fetch('/api/sarvam-tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: script, targetLanguageCode }),
    });
    const payload = await response.json();

    if (!response.ok || !payload.audio) {
      throw new Error(payload.error || 'Could not generate Sarvam voiceover.');
    }

    const AudioContextClass = window.AudioContext
      || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) throw new Error('Audio decoding is not supported in this browser.');
    const audioContext = new AudioContextClass();

    try {
      return await audioContext.decodeAudioData(decodeBase64Audio(payload.audio).slice(0));
    } finally {
      await audioContext.close();
    }
  }, []);

  const drawShortsFrame = React.useCallback(async (
    canvas: HTMLCanvasElement | OffscreenCanvas,
    context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
    title: string,
    stats: string,
    caption: string,
    route: RouteSummary,
    routeStops: Array<{ stationId: string; progress: number }>,
    progress: number
  ) => {
    await drawSvgToCanvas(canvas, context, SHORTS_WIDTH, SHORTS_HEIGHT);

    context.fillStyle = 'rgba(255, 255, 255, 0.92)';
    context.fillRect(64, 96, SHORTS_WIDTH - 128, 430);
    context.fillStyle = '#dc2626';
    context.font = `700 34px ${EXPORT_FONT_STACK}`;
    context.fillText('DELHI METRO ROUTE', 96, 154);

    context.fillStyle = '#111827';
    context.font = `800 58px ${EXPORT_FONT_STACK}`;
    const titleLines = wrapCanvasText(context, title, SHORTS_WIDTH - 192).slice(0, 3);
    titleLines.forEach((line, index) => context.fillText(line, 96, 226 + index * 68));

    context.fillStyle = '#009b50';
    context.font = `700 36px ${EXPORT_FONT_STACK}`;
    context.fillText(stats, 96, 394);

    context.fillStyle = '#111827';
    context.font = `700 42px ${EXPORT_FONT_STACK}`;
    wrapCanvasText(context, caption, SHORTS_WIDTH - 192).slice(0, 2).forEach((line, index) => {
      context.fillText(line, 96, 456 + index * 52);
    });

    context.fillStyle = 'rgba(255, 255, 255, 0.86)';
    context.fillRect(SHORTS_WIDTH - 390, SHORTS_HEIGHT - 96, 326, 48);
    context.fillStyle = '#111827';
    context.font = `800 28px ${EXPORT_FONT_STACK}`;
    context.fillText('metro.coolhead.in', SHORTS_WIDTH - 366, SHORTS_HEIGHT - 64);
    drawShortsJourneyTimeline(context, route, routeStops, progress);
  }, [drawSvgToCanvas]);

  const downloadYoutubeShortsVideo = React.useCallback(async () => {
    const svg = svgRef.current;
    const measure = pathMeasureRef.current;
    const pathLength = pathLengthRef.current;

    if (!ENABLE_SHORTS_EXPORT || !path || !route || !svg || !measure || !pathLength || isExportingShortsVideo) return;

    setIsExportingShortsVideo(true);
    tweenRef.current?.pause();
    setPlay(false);

    const previousTrainTransform = trainRef.current?.getAttribute('transform');
    const previousMapTransform = transformRef.current;

    try {
      const {
        AudioBufferSource,
        BufferTarget,
        CanvasSource,
        Mp4OutputFormat,
        Output,
        QUALITY_HIGH,
        canEncodeAudio,
        canEncodeVideo,
      } = await import('mediabunny');

      const fromName = getLocalizedStationName(route.from, route.fromName, language);
      const toName = getLocalizedStationName(route.to, route.toName, language);
      const targetLanguageCode = shortsLanguageCode[language];
      const scriptSegments = makeShortsScriptSegments(route, fromName, toName, language);
      const script = scriptSegments.map((segment) => segment.text).join(' ');
      const voiceover = await fetchShortsVoiceover(script, targetLanguageCode);
      const AudioContextClass = window.AudioContext
        || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) throw new Error('Audio decoding is not supported in this browser.');
      const assetAudioContext = new AudioContextClass();
      const [whooshEffect, notificationEffect] = await Promise.all([
        loadAudioAsset('/music/whoosh.mp3', assetAudioContext),
        loadAudioAsset('/music/notification.mp3', assetAudioContext),
      ]);
      await assetAudioContext.close();
      const canvas = typeof OffscreenCanvas !== 'undefined'
        ? new OffscreenCanvas(SHORTS_WIDTH, SHORTS_HEIGHT)
        : document.createElement('canvas');

      if (canvas instanceof HTMLCanvasElement) {
        canvas.width = SHORTS_WIDTH;
        canvas.height = SHORTS_HEIGHT;
      }

      const context = canvas.getContext('2d') as CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null;
      if (!context) throw new Error('Canvas export is not supported in this browser.');

      await document.fonts?.ready;

      const videoCodec = await canEncodeVideo('avc', { width: SHORTS_WIDTH, height: SHORTS_HEIGHT, bitrate: QUALITY_HIGH })
        ? 'avc'
        : null;
      const audioCodec = await canEncodeAudio('aac', {
        numberOfChannels: voiceover.numberOfChannels,
        sampleRate: voiceover.sampleRate,
        bitrate: QUALITY_HIGH,
      })
        ? 'aac'
        : null;

      if (!videoCodec) throw new Error('This browser cannot encode MP4 video.');
      if (!audioCodec) throw new Error('This browser cannot encode AAC audio for the Shorts voiceover.');

      const target = new BufferTarget();
      const output = new Output({
        format: new Mp4OutputFormat({ fastStart: 'in-memory' }),
        target,
      });
      const videoSource = new CanvasSource(canvas, {
        codec: videoCodec,
        bitrate: QUALITY_HIGH,
      });
      const audioSource = new AudioBufferSource({
        codec: audioCodec,
        bitrate: QUALITY_HIGH,
      });

      output.addVideoTrack(videoSource);
      output.addAudioTrack(audioSource);
      await output.start();

      const routeStops = getRouteStops(measure, pathLength, routeStationIds);
      const firstStop = routeStops[0];
      const lastStop = routeStops[routeStops.length - 1];
      if (!firstStop || !lastStop) throw new Error('Route animation is not ready to export.');

      const wordCounts = scriptSegments.map((segment) => segment.text.split(/\s+/).filter(Boolean).length);
      const totalWords = wordCounts.reduce((total, count) => total + count, 0) || scriptSegments.length;
      const voiceoverDuration = voiceover.duration + 0.25;
      const segmentDurations = wordCounts.map((count) => voiceoverDuration * (count / totalWords));
      const segmentTimings = segmentDurations.map((segmentDuration, index) => {
        const start = segmentDurations.slice(0, index).reduce((total, duration) => total + duration, 0);

        return {
          start,
          end: start + segmentDuration,
        };
      });
      const interchangeStationIds = new Set(route.interchanges.map((interchange) => interchange.id));
      const firstInterchangeSegmentIndex = scriptSegments.findIndex((segment) =>
        Boolean(segment.stationId && interchangeStationIds.has(segment.stationId))
      );
      const notificationStart = firstInterchangeSegmentIndex >= 0
        ? segmentTimings[firstInterchangeSegmentIndex]?.start
        : segmentTimings[3]?.start;
      const mixedAudio = await mixVoiceoverWithSfx(voiceover, [
        { buffer: whooshEffect, start: segmentTimings[0]?.end || 0.8, gain: 0.34 },
        { buffer: notificationEffect, start: notificationStart || segmentTimings[2]?.end || 2.8, gain: 0.22 },
      ]);
      const duration = Math.max(voiceoverDuration, mixedAudio.duration);
      const frameDuration = 1 / SHORTS_FRAME_RATE;
      const frameCount = Math.max(2, Math.ceil(duration * SHORTS_FRAME_RATE));
      const title = `${fromName} to ${toName}`;
      const stats = makeShortsStats(route, language);
      const baseExportScale = routeCameraScale;
      const zoomedInScale = baseExportScale * 1.18;
      const zoomedOutScale = Math.max(MIN_MAP_SCALE, baseExportScale * 0.56);
      const routeAnimationDuration = clamp(duration * 0.88, 2.5, Math.max(2.5, duration - 0.55));
      const routeProgressDistance = Math.max(lastStop.progress - firstStop.progress, 0.0001);
      const routeStepSegments = routeStops.slice(1).map((stop, index) => {
        const previousStop = routeStops[index];
        return {
          from: previousStop.progress,
          to: stop.progress,
          duration: routeAnimationDuration * ((stop.progress - previousStop.progress) / routeProgressDistance),
        };
      });

      await audioSource.add(mixedAudio);

      for (let frame = 0; frame <= frameCount; frame += 1) {
        const timestamp = frame * frameDuration;
        const segmentIndex = segmentTimings.findIndex((segment) => timestamp >= segment.start && timestamp <= segment.end);
        const activeSegmentIndex = segmentIndex === -1 ? scriptSegments.length - 1 : segmentIndex;
        const routeClock = clamp(timestamp / routeAnimationDuration, 0, 1);
        const smoothRouteProgress = routeClock < 0.5
          ? 2 * routeClock * routeClock
          : 1 - Math.pow(-2 * routeClock + 2, 2) / 2;
        let progress = firstStop.progress + routeProgressDistance * smoothRouteProgress;

        if (animationMode === 'step') {
          let remainingTime = Math.min(timestamp, routeAnimationDuration);

          for (const segment of routeStepSegments) {
            if (remainingTime <= segment.duration) {
              const currentStepProgress = clamp(remainingTime / Math.max(segment.duration, frameDuration), 0, 1);
              const easedStepProgress = currentStepProgress < 0.5
                ? 2 * currentStepProgress * currentStepProgress
                : 1 - Math.pow(-2 * currentStepProgress + 2, 2) / 2;
              progress = segment.from + (segment.to - segment.from) * easedStepProgress;
              break;
            }

            remainingTime -= segment.duration;
            progress = segment.to;
          }
        }

        let cameraScale = baseExportScale;

        if (timestamp < 1.15) {
          const introZoomProgress = clamp(timestamp / 1.15, 0, 1);
          const easedIntroZoom = 1 - Math.pow(1 - introZoomProgress, 3);
          cameraScale = zoomedOutScale + (zoomedInScale - zoomedOutScale) * easedIntroZoom;
        } else if (timestamp >= routeAnimationDuration) {
          const zoomOutProgress = clamp((timestamp - routeAnimationDuration) / Math.max(duration - routeAnimationDuration, 0.4), 0, 1);
          const easedZoomOut = 1 - Math.pow(1 - zoomOutProgress, 3);
          cameraScale = baseExportScale + (zoomedOutScale - baseExportScale) * easedZoomOut;
        }

        setCameraForProgress(progress, cameraScale);
        await drawShortsFrame(
          canvas,
          context,
          title,
          stats,
          scriptSegments[activeSegmentIndex].text,
          route,
          routeStops,
          progress
        );
        await videoSource.add(timestamp, frameDuration, { keyFrame: frame % SHORTS_FRAME_RATE === 0 });
      }

      await output.finalize();
      if (!target.buffer) throw new Error('Shorts export did not produce a file.');

      const blob = new Blob([target.buffer], { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `delhi-metro-shorts-${route.from}-to-${route.to}.mp4`.toLowerCase();
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 0);
    } catch (error) {
      console.error(error);
      window.alert(error instanceof Error ? error.message : 'Could not export YouTube Shorts video.');
    } finally {
      if (previousTrainTransform) {
        trainRef.current?.setAttribute('transform', previousTrainTransform);
      } else {
        trainRef.current?.removeAttribute('transform');
      }
      applyTransform(previousMapTransform, true);
      setIsExportingShortsVideo(false);
    }
  }, [
    applyTransform,
    animationMode,
    drawShortsFrame,
    fetchShortsVoiceover,
    isExportingShortsVideo,
    language,
    path,
    route,
    routeCameraScale,
    routeStationIds,
    setCameraForProgress,
    setPlay,
  ]);

  return (
    <div className="absolute inset-0">
      <Map
        style={{
          width: '100%',
          height: '100%',
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'none',
        }}
        mapGroupRef={mapGroupRef}
        train={
          <>
            {selectedStationPoint ? (
              <g transform={`translate(${selectedStationPoint.x} ${selectedStationPoint.y})`} pointerEvents="none">
                <circle r={16} fill="#dc2626" opacity={0.16}>
                  <animate attributeName="r" values="10;24;10" dur="1.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.28;0.04;0.28" dur="1.8s" repeatCount="indefinite" />
                </circle>
                <circle r={7} fill="#dc2626" stroke="#fff" strokeWidth={2.5} />
              </g>
            ) : null}
            {path ? (
              <>
                <path ref={routePathRef} stroke="transparent" d={path} />
                <path className="route-highlight-halo" stroke="white" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" d={path} />
                <path className="route-highlight-line" stroke="#111827" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" d={path} />
                <g
                  ref={trainRef}
                  style={{ willChange: 'auto' }}
                  className={animationMode === 'step' ? 'route-train-step' : 'route-train-smooth'}
                >
                  <defs>
                    <linearGradient id="metro-train-headlight-beam" x1="12" x2="46" y1="0" y2="0" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="#fde68a" stopOpacity="0.42" />
                      <stop offset="0.55" stopColor="#fef3c7" stopOpacity="0.14" />
                      <stop offset="1" stopColor="#fefce8" stopOpacity="0" />
                    </linearGradient>
                    <radialGradient id="metro-train-headlight-glow" cx="0" cy="0" r="1" gradientTransform="matrix(4 0 0 2.8 14 0)" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="#fef9c3" stopOpacity="0.72" />
                      <stop offset="1" stopColor="#facc15" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <g className="train-headlight" pointerEvents="none" aria-hidden="true">
                    <path
                      d="M13 -4 C24 -9 36 -8 48 -3 L48 3 C36 8 24 9 13 4 Z"
                      fill="url(#metro-train-headlight-beam)"
                    />
                  </g>
                  <MetroTrain
                    width={34}
                    height={30}
                    x={-17}
                    y={-15}
                    aria-hidden="true"
                    focusable="false"
                  />
                </g>
              </>
            ) : null}


          </>
        }
        ref={svgRef}
        onMapClick={handleMapClick}
        zoomFunction={mapControls}
      />

      <div className="absolute right-0 top-0">
        <div className="flex flex-col gap-2 rounded-lg border border-white/15 p-2 shadow-lg backdrop-blur">
          <button
            onClick={() => path && setPlay((p) => !p)}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-sm font-semibold text-neutral-950 disabled:opacity-40 dark:bg-zinc-900 dark:text-zinc-100"
            disabled={!path}
            title={play ? 'Pause route' : 'Play route'}
          >
            {play ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
          </button>
          <button onClick={() => zoomBy(1.2)} className="h-10 w-10 rounded-lg bg-white text-lg font-semibold text-neutral-950 dark:bg-zinc-900 dark:text-zinc-100" title="Zoom in">
            +
          </button>
          <button onClick={() => zoomBy(0.8)} className="h-10 w-10 rounded-lg bg-white text-lg font-semibold text-neutral-950 dark:bg-zinc-900 dark:text-zinc-100" title="Zoom out">
            -
          </button>
          <button type="button" className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-neutral-950 dark:bg-zinc-900 dark:text-zinc-100" onClick={focusSelectedStation} title="Center map">
            <DiscIcon />
          </button>
          <button type="button" className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-neutral-950 dark:bg-zinc-900 dark:text-zinc-100" onClick={() => {
            tweenRef.current?.restart().pause();
            setPlay(false);
            onActiveStationChange?.(routeStationIds[0] || null);
            if (pathLengthRef.current) setCameraForProgress(0);
          }} title="Reset route">
            <ResetIcon />
          </button>
          <button type="button" className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-neutral-950 dark:bg-zinc-900 dark:text-zinc-100" onClick={focusSelectedStation} title="Reset map">
            <UpdateIcon />
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-neutral-950 dark:bg-zinc-900 dark:text-zinc-100"
            title="Fullscreen"
            onClick={() => {
              if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
              } else {
                document.exitFullscreen();
              }
            }}
          >
            <EnterFullScreenIcon />
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-neutral-950 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-900 dark:text-zinc-100"
            title={canExportVideo ? 'Download route video' : 'Video export is not supported in this browser'}
            aria-label="Download route video"
            aria-busy={isExportingVideo}
            disabled={!path || !canExportVideo || isExportingVideo}
            onClick={downloadRouteVideo}
          >
            {isExportingVideo ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-950 dark:border-zinc-700 dark:border-t-zinc-100" />
            ) : (
              <VideoIcon />
            )}
          </button>
          {ENABLE_SHORTS_EXPORT ? (
            <button
              type="button"
              className="flex h-10 items-center justify-center gap-1 rounded-lg bg-white px-2 text-xs font-bold text-neutral-950 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-900 dark:text-zinc-100"
              title={canExportVideo ? 'Generate YouTube Shorts video with Sarvam voiceover' : 'Shorts export is not supported in this browser'}
              aria-label="Generate YouTube Shorts video"
              aria-busy={isExportingShortsVideo}
              disabled={!path || !route || !canExportVideo || isExportingShortsVideo}
              onClick={downloadYoutubeShortsVideo}
            >
              {isExportingShortsVideo ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-950 dark:border-zinc-700 dark:border-t-zinc-100" />
              ) : (
                <>
                  <VideoIcon />
                  <span>Shorts</span>
                </>
              )}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default React.memo(SvgComponent);
