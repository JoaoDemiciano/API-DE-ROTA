export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  isActive?: boolean;
  createdAt?: string;
}

export interface AuthResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface RouteLeg {
  distance: number;
  duration: number;
  summary: string;
}

export interface RouteAlternative {
  id: string;
  provider: string;
  profile: string;
  distanceKm: number;
  durationSec: number;
  legs: RouteLeg[];
  geometry: GeoJSON.Geometry;
  rationale: string;
  points: Array<[number, number]>;
}

export interface RouteResponse {
  selected: RouteAlternative;
  alternatives: RouteAlternative[];
  suggestions: string[];
  corrections: {
    origin?: string;
    destination?: string;
    notes: string[];
  };
}

export interface RouteQuery {
  origin: string;
  destination: string;
  waypoints?: string[];
  avoidTolls?: boolean;
  avoidTraffic?: boolean;
}

export interface RouteRequestHistory {
  id: string;
  origin: string;
  destination: string;
  waypoints: string[];
  distanceKm: number;
  durationSec: number;
  provider: string;
  createdAt: string;
  data?: unknown;
}
