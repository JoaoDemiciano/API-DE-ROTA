import { apiClient } from './apiClient';
import type { RouteRequestHistory, User } from '../types/api';

export const adminService = {
  async listUsers(search?: string) {
    const { data } = await apiClient.get<User[]>('/admin/users', { params: { search } });
    return data;
  },
  async updateUser(id: string, isActive: boolean) {
    const { data } = await apiClient.patch<User>(`/admin/users/${id}`, { isActive });
    return data;
  },
  async history(filters: { userId?: string; from?: string; to?: string }) {
    const { data } = await apiClient.get<(RouteRequestHistory & { user: User })[]>(
      '/admin/history',
      { params: filters }
    );
    return data;
  },
  async exportHistory(filters: { userId?: string; from?: string; to?: string }) {
    const { data } = await apiClient.get<Blob>('/admin/export/history.csv', {
      params: filters,
      responseType: 'blob'
    });
    return data;
  },
  async metrics() {
    const { data } = await apiClient.get('/admin/metrics');
    return data as { routesPerDay: { date: string; total: number }[]; averageDistance: number; averageDurationSec: number };
  }
};
