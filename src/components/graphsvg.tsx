'use client';
import {
  DiscIcon,
  EnterFullScreenIcon,
  ResetIcon,
  UpdateIcon,
} from '@radix-ui/react-icons';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import * as React from 'react';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import edges from '../data/edge.json';
import Map, { type MapControls, type MapTransform } from './metromap';

gsap.registerPlugin(useGSAP);

const VIEWBOX_WIDTH = 1500;
const VIEWBOX_HEIGHT = 1450;
const ROUTE_CAMERA_SCALE = 3.15;
const WHEEL_ZOOM_IN_SCALE = 1.65;
const WHEEL_ZOOM_OUT_SCALE = 0.65;
const INITIAL_MAP_SCALE = 4.5;

const fitTransform: MapTransform = {
  scaleX: 1,
  scaleY: 1,
  translateX: 0,
  translateY: 0,
};

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

const createFocusTransform = (point: { x: number; y: number }, scale = INITIAL_MAP_SCALE): MapTransform => ({
  scaleX: scale,
  scaleY: scale,
  translateX: VIEWBOX_WIDTH / 2 - point.x * scale,
  translateY: VIEWBOX_HEIGHT / 2 - point.y * scale,
});

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const getEventPoint = (
  event: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>
) => {
  const source = 'touches' in event ? event.touches[0] || event.changedTouches[0] : event;
  return { x: source.clientX, y: source.clientY };
};

const toSvgPoint = (
  event: React.MouseEvent<SVGSVGElement> | React.WheelEvent<SVGSVGElement>,
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

function SvgComponent({
  setPlay,
  play,
  path,
  selectedStationId,
}: {
  setPlay: React.Dispatch<React.SetStateAction<boolean>>;
  play: boolean;
  path: string;
  selectedStationId: string;
}) {
  const [transform, setTransform] = useState<MapTransform>(fitTransform);
  const [isDragging, setIsDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const trainRef = useRef<SVGGElement | null>(null);
  const routePathRef = useRef<SVGPathElement | null>(null);
  const pathMeasureRef = useRef<SVGPathElement | null>(null);
  const pathLengthRef = useRef(0);
  const dragRef = useRef({
    x: 0,
    y: 0,
    translateX: 0,
    translateY: 0,
  });
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const playRef = useRef(play);

  useEffect(() => {
    playRef.current = play;
  }, [play]);

  const setCameraForProgress = React.useCallback((progress: number) => {
    const measure = pathMeasureRef.current;
    const train = trainRef.current;
    const pathLength = pathLengthRef.current;
    if (!measure || !train || !pathLength) return;

    const distance = pathLength * progress;
    const point = measure.getPointAtLength(distance);
    const nextPoint = measure.getPointAtLength(clamp(distance + 4, 0, pathLength));
    const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * (180 / Math.PI);
    const targetScale = ROUTE_CAMERA_SCALE;

    train.setAttribute('transform', `translate(${point.x} ${point.y}) rotate(${angle})`);
    setTransform({
      scaleX: targetScale,
      scaleY: targetScale,
      translateX: VIEWBOX_WIDTH / 2 - point.x * targetScale,
      translateY: VIEWBOX_HEIGHT / 2 - point.y * targetScale,
    });
  }, []);

  useLayoutEffect(() => {
    tweenRef.current?.kill();
    tweenRef.current = null;
    pathMeasureRef.current = null;
    pathLengthRef.current = 0;

    if (!path) {
      return;
    }

    const measure = makePathElement(path);
    pathMeasureRef.current = measure;
    const length = measure.getTotalLength();
    pathLengthRef.current = length;

    const firstPoint = measure.getPointAtLength(0);
    trainRef.current?.setAttribute('transform', `translate(${firstPoint.x} ${firstPoint.y})`);
    requestAnimationFrame(() => {
      setTransform({
        scaleX: ROUTE_CAMERA_SCALE,
        scaleY: ROUTE_CAMERA_SCALE,
        translateX: VIEWBOX_WIDTH / 2 - firstPoint.x * ROUTE_CAMERA_SCALE,
        translateY: VIEWBOX_HEIGHT / 2 - firstPoint.y * ROUTE_CAMERA_SCALE,
      });
    });
  }, [path]);

  useGSAP(() => {
    const focusPoint = stationCoordinates[selectedStationId];
    if (!focusPoint || play) return;

    const proxy = { ...transform };
    const focusedTransform = createFocusTransform(focusPoint);
    const tween = gsap.to(proxy, {
      ...focusedTransform,
      duration: 1,
      ease: 'power3.out',
      onUpdate: () => {
        setTransform({
          scaleX: proxy.scaleX,
          scaleY: proxy.scaleY,
          translateX: proxy.translateX,
          translateY: proxy.translateY,
        });
      },
    });

    return () => tween.kill();
  }, { dependencies: [selectedStationId, play], revertOnUpdate: true });

  useGSAP(() => {
    tweenRef.current?.kill();
    tweenRef.current = null;
    const pathLength = pathLengthRef.current;
    if (!path || !pathLength) return;

    const proxy = { progress: 0 };
    tweenRef.current = gsap.to(proxy, {
      progress: 1,
      duration: clamp(pathLength / 95, 3.5, 18),
      ease: 'power2.inOut',
      paused: true,
      onUpdate: () => setCameraForProgress(proxy.progress),
      onComplete: () => setPlay(false),
    });

    if (playRef.current) tweenRef.current.play(0);

    return () => {
      tweenRef.current?.kill();
      tweenRef.current = null;
    };
  }, { dependencies: [path, setCameraForProgress, setPlay], revertOnUpdate: true });

  useEffect(() => {
    if (!tweenRef.current) return;
    if (play) tweenRef.current.play();
    else tweenRef.current.pause();
  }, [play]);

  const mapControls = useMemo<MapControls>(() => ({
    transform,
    isDragging,
    dragStart: (event) => {
      const point = getEventPoint(event);
      dragRef.current = {
        x: point.x,
        y: point.y,
        translateX: transform.translateX,
        translateY: transform.translateY,
      };
      setIsDragging(true);
    },
    dragMove: (event) => {
      if (!isDragging) return;
      const point = getEventPoint(event);
      const rect = svgRef.current?.getBoundingClientRect();
      const scaleX = rect ? VIEWBOX_WIDTH / rect.width : 1;
      const scaleY = rect ? VIEWBOX_HEIGHT / rect.height : 1;

      setTransform((current) => ({
        ...current,
        translateX: dragRef.current.translateX + (point.x - dragRef.current.x) * scaleX,
        translateY: dragRef.current.translateY + (point.y - dragRef.current.y) * scaleY,
      }));
    },
    dragEnd: () => setIsDragging(false),
    zoomAt: (scale, event) => {
      if (!svgRef.current) return;
      const point = toSvgPoint(event, svgRef.current);
      setTransform((current) => {
        const nextScale = clamp(current.scaleX * scale, 0.45, 3.5);
        const factor = nextScale / current.scaleX;
        return {
          scaleX: nextScale,
          scaleY: nextScale,
          translateX: point.x - (point.x - current.translateX) * factor,
          translateY: point.y - (point.y - current.translateY) * factor,
        };
      });
    },
    wheelZoom: (event) => {
      event.preventDefault();
      if (!svgRef.current) return;

      const point = toSvgPoint(event, svgRef.current);
      const wheelScale = event.deltaY < 0 ? WHEEL_ZOOM_IN_SCALE : WHEEL_ZOOM_OUT_SCALE;

      setTransform((current) => {
        const nextScale = clamp(current.scaleX * wheelScale, 0.45, 4.5);
        const factor = nextScale / current.scaleX;

        return {
          scaleX: nextScale,
          scaleY: nextScale,
          translateX: point.x - (point.x - current.translateX) * factor,
          translateY: point.y - (point.y - current.translateY) * factor,
        };
      });
    },
  }), [isDragging, transform]);

  const zoomBy = (scale: number) => {
    setTransform((current) => {
      const nextScale = clamp(current.scaleX * scale, 0.45, 3.5);
      return {
        scaleX: nextScale,
        scaleY: nextScale,
        translateX: VIEWBOX_WIDTH / 2 - (VIEWBOX_WIDTH / 2 - current.translateX) * (nextScale / current.scaleX),
        translateY: VIEWBOX_HEIGHT / 2 - (VIEWBOX_HEIGHT / 2 - current.translateY) * (nextScale / current.scaleY),
      };
    });
  };

  const focusSelectedStation = () => {
    const focusPoint = stationCoordinates[selectedStationId];
    setTransform(focusPoint ? createFocusTransform(focusPoint) : fitTransform);
  };

  const selectedStationPoint = stationCoordinates[selectedStationId];

  return (
    <div className="absolute inset-0">
      <Map
        style={{
          width: '100%',
          height: '100%',
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'none',
        }}
        train={
          <>
            {path ? (
            <>
              <path ref={routePathRef} stroke="transparent" d={path} />
              <path stroke="white" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" d={path} />
              <path stroke="#111827" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" d={path} />
              <g ref={trainRef}>
                <circle r={18} fill="rgba(255,255,255,0.28)" />
                <image
                  width={34}
                  height={30}
                  href="/images/metro.png"
                  transform="translate(-17 -15)"
                />
              </g>
            </>
            ) : null}
            {selectedStationPoint ? (
              <g transform={`translate(${selectedStationPoint.x} ${selectedStationPoint.y})`} pointerEvents="none">
                <circle r={16} fill="#dc2626" opacity={0.16}>
                  <animate attributeName="r" values="10;24;10" dur="1.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.28;0.04;0.28" dur="1.8s" repeatCount="indefinite" />
                </circle>
                <circle r={7} fill="#dc2626" stroke="#fff" strokeWidth={2.5} />
              </g>
            ) : null}
          </>
        }
        ref={svgRef}
        zoomFunction={mapControls}
      />

      <div className="absolute right-4 top-4">
        <div className="flex flex-col gap-2 rounded-md border border-white/15  p-2 shadow-lg backdrop-blur">
          <button
            onClick={() => path && setPlay((p) => !p)}
            className="flex h-9 w-9 items-center justify-center rounded bg-white text-sm font-semibold text-neutral-950 disabled:opacity-40"
            disabled={!path}
            title={play ? 'Pause route' : 'Play route'}
          >
            {play ? 'II' : '▶'}
          </button>
          <button onClick={() => zoomBy(1.2)} className="h-9 w-9 rounded bg-white text-lg font-semibold text-neutral-950" title="Zoom in">
            +
          </button>
          <button onClick={() => zoomBy(0.8)} className="h-9 w-9 rounded bg-white text-lg font-semibold text-neutral-950" title="Zoom out">
            -
          </button>
          <button type="button" className="flex h-9 w-9 items-center justify-center rounded bg-white text-neutral-950" onClick={focusSelectedStation} title="Center map">
            <DiscIcon />
          </button>
          <button type="button" className="flex h-9 w-9 items-center justify-center rounded bg-white text-neutral-950" onClick={() => {
            tweenRef.current?.restart().pause();
            setPlay(false);
            if (pathLengthRef.current) setCameraForProgress(0);
          }} title="Reset route">
            <ResetIcon />
          </button>
          <button type="button" className="flex h-9 w-9 items-center justify-center rounded bg-white text-neutral-950" onClick={focusSelectedStation} title="Reset map">
            <UpdateIcon />
          </button>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded bg-white text-neutral-950"
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
        </div>
      </div>
    </div>
  );
}

export default SvgComponent;
