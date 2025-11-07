import axios from 'axios';

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
  geometry: any;
  rationale: string;
  points: Array<[number, number]>;
}

export interface RouteQueryOptions {
  avoidTolls?: boolean;
  avoidTraffic?: boolean;
  waypoints?: Array<[number, number]>;
  locale?: string;
}

const mapboxBase = 'https://api.mapbox.com/directions/v5/mapbox';
const mapboxProfile = process.env.MAPBOX_PROFILE || 'driving';
const mapboxToken = process.env.MAPBOX_TOKEN;

const openRouteBase = 'https://api.openrouteservice.org/v2/directions';
const openRouteProfile = process.env.ORS_PROFILE || 'driving-car';
const openRouteToken = process.env.ORS_TOKEN;

const hasMapbox = Boolean(mapboxToken);
const hasORS = Boolean(openRouteToken);

const toQuery = (params: Record<string, string | number | boolean | undefined>) =>
  Object.entries(params)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join('&');

const pickProvider = () => {
  if (hasMapbox) return 'mapbox';
  if (hasORS) return 'ors';
  throw new Error('Nenhum provedor de rotas configurado');
};

const parseMapbox = (data: any, points: Array<[number, number]>): RouteAlternative[] => {
  return (data.routes || []).map((route: any, index: number) => ({
    id: route.id || `mapbox-${index}`,
    provider: 'mapbox',
    profile: route.weight_name,
    distanceKm: route.distance / 1000,
    durationSec: route.duration,
    legs: route.legs.map((leg: any) => ({
      distance: leg.distance,
      duration: leg.duration,
      summary: leg.summary
    })),
    geometry: route.geometry,
    rationale: index === 0 ? 'Opção recomendada' : route.weight_name || 'Alternativa',
    points
  }));
};

const parseORS = (data: any, points: Array<[number, number]>): RouteAlternative[] => {
  return (data.routes || []).map((route: any, index: number) => ({
    id: route.summary?.id || `ors-${index}`,
    provider: 'openrouteservice',
    profile: route.summary?.profile || 'driving-car',
    distanceKm: route.summary?.distance || 0,
    durationSec: route.summary?.duration ? route.summary.duration * 60 : 0,
    legs: (route.segments || []).map((segment: any) => ({
      distance: segment.distance,
      duration: segment.duration,
      summary: segment.steps?.map((step: any) => step.instruction).join(' -> ') || 'Segmento'
    })),
    geometry: route.geometry,
    rationale: index === 0 ? 'Opção recomendada' : 'Alternativa',
    points
  }));
};

export const fetchRoutes = async (
  origin: [number, number],
  destination: [number, number],
  options: RouteQueryOptions
): Promise<RouteAlternative[]> => {
  const provider = pickProvider();
  const waypoints = options.waypoints || [];

  if (provider === 'mapbox') {
    const coordinates = [origin, ...waypoints, destination]
      .map((point) => encodeURIComponent(`${point[0]},${point[1]}`))
      .join(';');

    const query = toQuery({
      access_token: mapboxToken,
      annotations: 'distance,duration',
      geometries: 'geojson',
      overview: 'full',
      alternatives: true,
      language: options.locale || 'pt-BR'
    });

    const url = `${mapboxBase}/${mapboxProfile}/${coordinates}?${query}`;
    const { data } = await axios.get(url);
    return parseMapbox(data, [origin, ...waypoints, destination]);
  }

  const url = `${openRouteBase}/${openRouteProfile}`;
  const body = {
    coordinates: [origin, ...waypoints, destination],
    instructions: true,
    language: options.locale || 'pt-BR',
    preference: options.avoidTolls ? 'shortest' : 'recommended',
    options: {
      avoid_features: options.avoidTolls ? ['tollways'] : [],
      avoid_polygons: []
    }
  };

  const { data } = await axios.post(url, body, {
    headers: {
      Authorization: openRouteToken,
      'Content-Type': 'application/json'
    }
  });

  return parseORS(data, [origin, ...waypoints, destination]);
};

export const suggestWaypoints = (distanceKm: number): string[] => {
  if (distanceKm < 100) {
    return ['Ponto de apoio rápido sugerido: Café ou posto após 50km'];
  }
  if (distanceKm < 300) {
    return ['Sugestão: Parada para abastecimento por volta da metade do trajeto'];
  }
  return ['Considere dividir a viagem em etapas e planejar paradas a cada 200km'];
};

export const normalizeAddress = (input: string): { corrected: string; note?: string } => {
  const trimmed = input.trim();
  const hasNumber = /\d/.test(trimmed);
  if (!hasNumber) {
    return {
      corrected: `${trimmed}, 100`,
      note: 'Endereço ajustado automaticamente (número aproximado)'
    };
  }
  return { corrected: trimmed };
};

const parseCoordinates = (value: string): [number, number] | null => {
  const parts = value.split(',').map((part) => Number(part.trim()));
  if (parts.length === 2 && parts.every((p) => Number.isFinite(p))) {
    return [parts[0], parts[1]];
  }
  return null;
};

export const geocodeLocation = async (
  query: string
): Promise<{ formatted: string; coordinates: [number, number]; note?: string }> => {
  const fallback = parseCoordinates(query);
  if (hasMapbox) {
    const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?${toQuery({
      access_token: mapboxToken!,
      limit: 1,
      language: 'pt-BR'
    })}`;
    const { data } = await axios.get(geocodeUrl);
    const feature = data.features?.[0];
    if (feature) {
      return {
        formatted: feature.place_name,
        coordinates: feature.center,
        note: feature.relevance < 1 ? 'Endereço aproximado (corrigido automaticamente)' : undefined
      };
    }
  }

  if (fallback) {
    return { formatted: query, coordinates: fallback };
  }

  throw new Error('Não foi possível geocodificar o endereço informado');
};
