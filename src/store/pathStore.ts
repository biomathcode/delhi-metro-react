/* eslint-disable @typescript-eslint/no-explicit-any */

import { create } from 'zustand';

import type { RoutePlan, RouteSummary } from '../types/route';
import { isStationId, parseRoutePathname, stations } from '../utils/routePlanner';

declare global {
  interface Window {
    __DELHI_METRO_ROUTE__?: {
      from?: string;
      to?: string;
    };
  }
}

export const getInitialRouteParams = () => {
  if (typeof window === 'undefined') {
    return {
      from: stations[0]?.id || '',
      to: stations[1]?.id || stations[0]?.id || '',
      hasRouteQuery: false,
    };
  }

  const params = new URLSearchParams(window.location.search);
  const from = params.get('from');
  const to = params.get('to');
  const seoRouteParams = window.__DELHI_METRO_ROUTE__;
  const seoFrom = seoRouteParams?.from;
  const seoTo = seoRouteParams?.to;
  const routePathParams = parseRoutePathname(window.location.pathname);

  if (isStationId(seoFrom) && isStationId(seoTo)) {
    return {
      from: seoFrom!,
      to: seoTo!,
      hasRouteQuery: true,
    };
  }

  if (routePathParams) {
    return {
      from: routePathParams.from,
      to: routePathParams.to,
      hasRouteQuery: true,
    };
  }

  return {
    from: isStationId(from) ? from! : stations[0]?.id || '',
    to: isStationId(to) ? to! : stations[1]?.id || stations[0]?.id || '',
    hasRouteQuery: isStationId(from) && isStationId(to),
  };
};

export const usePath = create((set: any) => {
  const initialRouteParams = getInitialRouteParams();

  return {
    path: '',
    route: null,
    routeOptions: [],
    selectedFrom: initialRouteParams.from,
    setSelectedFrom: (stationId: string) => set(() => ({ selectedFrom: stationId })),
    setRoute: (newPath: string, route: RouteSummary, routeOptions?: RoutePlan[]) =>
      set(() => ({
        path: newPath,
        route,
        routeOptions: routeOptions?.length ? routeOptions : [{ svgPath: newPath, route }],
      })),
    setPath: (newPath: string) => set(() => ({ path: newPath })),
    setInverse: (newPath: string) => set(() => ({ path: newPath })),
  };
});
