import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const listHistory = async (userId: string, limit = 10, offset = 0) => {
  return prisma.routeRequest.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    skip: offset,
    take: limit
  });
};

export const duplicateHistory = async (id: string, userId: string) => {
  const original = await prisma.routeRequest.findFirst({ where: { id, userId } });
  if (!original) {
    throw new Error('Registro não encontrado');
  }

  return prisma.routeRequest.create({
    data: {
      userId,
      origin: original.origin,
      destination: original.destination,
      waypoints: original.waypoints,
      distanceKm: original.distanceKm,
      durationSec: original.durationSec,
      provider: original.provider,
      data: original.data
    }
  });
};
