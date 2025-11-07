import { PrismaClient } from '@prisma/client';
import {
  fetchRoutes,
  geocodeLocation,
  normalizeAddress,
  RouteAlternative,
  suggestWaypoints
} from '../../services/routeProviders';

const prisma = new PrismaClient();

export interface RouteRequestInput {
  userId: string;
  origin: string;
  destination: string;
  waypoints?: string[];
  avoidTolls?: boolean;
  avoidTraffic?: boolean;
}

export interface RouteResponse {
  selected: RouteAlternative;
  alternatives: RouteAlternative[];
  suggestions: string[];
  corrections: { origin?: string; destination?: string; notes: string[] };
}

export const requestRoute = async (input: RouteRequestInput): Promise<RouteResponse> => {
  const originNormalized = normalizeAddress(input.origin);
  const destinationNormalized = normalizeAddress(input.destination);

  const corrections: RouteResponse['corrections'] = { notes: [] };
  if (originNormalized.note) corrections.notes.push(originNormalized.note);
  if (destinationNormalized.note) corrections.notes.push(destinationNormalized.note);
  if (originNormalized.corrected !== input.origin) corrections.origin = originNormalized.corrected;
  if (destinationNormalized.corrected !== input.destination)
    corrections.destination = destinationNormalized.corrected;

  const originGeocode = await geocodeLocation(originNormalized.corrected);
  const destinationGeocode = await geocodeLocation(destinationNormalized.corrected);
  const waypointGeocodes = input.waypoints
    ? await Promise.all(input.waypoints.map((wp) => geocodeLocation(wp)))
    : [];

  waypointGeocodes.forEach((geo) => {
    if (geo.note) corrections.notes.push(geo.note);
  });
  if (originGeocode.note) corrections.notes.push(originGeocode.note);
  if (destinationGeocode.note) corrections.notes.push(destinationGeocode.note);
  if (originGeocode.formatted !== input.origin) corrections.origin = originGeocode.formatted;
  if (destinationGeocode.formatted !== input.destination)
    corrections.destination = destinationGeocode.formatted;

  const alternatives = await fetchRoutes(originGeocode.coordinates, destinationGeocode.coordinates, {
    waypoints: waypointGeocodes.map((geo) => geo.coordinates),
    avoidTolls: input.avoidTolls,
    avoidTraffic: input.avoidTraffic,
    locale: 'pt-BR'
  });

  if (!alternatives.length) {
    throw new Error('Nenhuma rota encontrada');
  }

  const selected = alternatives[0];
  const suggestions = suggestWaypoints(selected.distanceKm);

  await prisma.routeRequest.create({
    data: {
      userId: input.userId,
      origin: originGeocode.formatted,
      destination: destinationGeocode.formatted,
      waypoints: waypointGeocodes.map((geo) => geo.formatted),
      distanceKm: selected.distanceKm,
      durationSec: selected.durationSec,
      provider: selected.provider,
      data: selected
    }
  });

  return { selected, alternatives, suggestions, corrections };
};

export const getRouteById = async (id: string, userId: string) => {
  const route = await prisma.routeRequest.findFirst({ where: { id, userId } });
  if (!route) {
    throw new Error('Rota não encontrada');
  }
  return route;
};
