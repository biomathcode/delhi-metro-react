export interface RouteSummary {
  optionId: string;
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

export interface RoutePlan {
  svgPath: string;
  route: RouteSummary;
}

export type RouteSortMode = 'interchanges' | 'stops';

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

export type RouteAnimationMode = 'smooth' | 'step';
export type CinematicZoomLevel = 1 | 2 | 3;
