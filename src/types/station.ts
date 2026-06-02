export interface StationGate {
  gate: string;
  gateCode?: string;
  access?: string;
  towards?: string;
  status?: string;
  divyangFriendly?: boolean;
  Latitude?: number | '';
  Longitude?: number | '';
}

export interface StationFacilityDetail {
  name?: string;
  purpose?: string;
  location?: string;
  nearestGate?: string;
  nearestGateCode?: string;
}

export interface StationFacilityGroup {
  kind: string;
  details: StationFacilityDetail[];
}

export interface StationPlatform {
  name: string;
  code?: string;
  towards?: string;
  towardsCode?: string;
  secondTowards?: string;
  secondTowardsCode?: string;
}

export interface StationParking {
  provider?: string;
  location?: string;
  carCapacity?: number | '';
  motorcycleCapacity?: number | '';
  cycleCapacity?: number | '';
}

export interface StationLift {
  type?: string;
  name?: string;
  code?: string;
  location?: string;
  insideOutside?: string;
  divyangFriendly?: boolean;
  status?: boolean;
}

export interface StationNearbyPlace {
  category?: string;
  type?: string;
  name: string;
  connectedWithMetro?: boolean;
  distanceKm?: number | '';
  nearestGate?: string;
  nearestGateCode?: string;
  estimatedWalkingMinutes?: number | '';
  estimatedPublicTransportMinutes?: number | '';
}

export interface StationContact {
  mobile?: string;
  landline?: string;
}

export interface StationInfo {
  id: string;
  text: string;
  dmrcName?: string;
  description?: string;
  layout?: string;
  interchange?: boolean;
  Latitude?: number | '';
  Longitude?: number | '';
  contact?: StationContact;
  gates?: StationGate[];
  stationFacilities?: string[];
  facilities?: StationFacilityGroup[];
  platforms?: StationPlatform[];
  parking?: StationParking[];
  lifts?: StationLift[];
  nearbyPlaces?: StationNearbyPlace[];
}
