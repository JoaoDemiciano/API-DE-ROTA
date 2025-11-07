import { apiClient } from './apiClient';
import type { RouteQuery, RouteResponse, RouteRequestHistory } from '../types/api';

export const routeService = {
  async create(query: RouteQuery) {
    const { data } = await apiClient.post<RouteResponse>('/routes', query);
    return data;
  },
  async get(id: string) {
    const { data } = await apiClient.get<RouteRequestHistory>(`/routes/${id}`);
    return data;
  },
  async history(params: { limit?: number; offset?: number }) {
    const { data } = await apiClient.get<{ items: RouteRequestHistory[]; pagination: any }>(
      '/history',
      { params }
    );
    return data;
  },
  async duplicate(id: string) {
    const { data } = await apiClient.post<RouteRequestHistory>(`/history/${id}/duplicate`, {});
    return data;
  }
};
