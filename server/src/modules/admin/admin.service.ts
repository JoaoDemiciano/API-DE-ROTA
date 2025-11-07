import { PrismaClient } from '@prisma/client';
import { Parser } from 'json2csv';

const prisma = new PrismaClient();

export const listUsers = async (query: { search?: string }) => {
  return prisma.user.findMany({
    where: query.search
      ? {
          OR: [
            { email: { contains: query.search, mode: 'insensitive' } },
            { name: { contains: query.search, mode: 'insensitive' } }
          ]
        }
      : undefined,
    orderBy: { createdAt: 'desc' }
  });
};

export const updateUserStatus = async (id: string, isActive: boolean) => {
  return prisma.user.update({ where: { id }, data: { isActive } });
};

export const auditHistory = async (filters: { userId?: string; from?: string; to?: string }) => {
  return prisma.routeRequest.findMany({
    where: {
      userId: filters.userId,
      createdAt: {
        gte: filters.from ? new Date(filters.from) : undefined,
        lte: filters.to ? new Date(filters.to) : undefined
      }
    },
    include: { user: true },
    orderBy: { createdAt: 'desc' }
  });
};

export const exportHistoryCsv = async (filters: { userId?: string; from?: string; to?: string }) => {
  const rows = await auditHistory(filters);
  const parser = new Parser({
    fields: ['id', 'user.email', 'origin', 'destination', 'distanceKm', 'durationSec', 'provider', 'createdAt']
  });
  return parser.parse(rows);
};

export const metrics = async () => {
  const [perDay, averages] = await Promise.all([
    prisma.routeRequest.groupBy({
      by: ['createdAt'],
      _count: { _all: true }
    }),
    prisma.routeRequest.aggregate({
      _avg: { distanceKm: true, durationSec: true }
    })
  ]);

  return {
    routesPerDay: perDay.map((item) => ({ date: item.createdAt, total: item._count._all })),
    averageDistance: averages._avg.distanceKm || 0,
    averageDurationSec: averages._avg.durationSec || 0
  };
};
