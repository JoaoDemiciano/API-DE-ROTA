import { apiClient } from './apiClient';
import type { AuthResponse } from '../types/api';

export const authService = {
  async login(email: string, password: string) {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', { email, password });
    return data;
  },
  async register(name: string, email: string, password: string) {
    const { data } = await apiClient.post<AuthResponse>('/auth/register', { name, email, password });
    return data;
  },
  async refresh(refreshToken: string) {
    const { data } = await apiClient.post<AuthResponse>('/auth/refresh', { refreshToken });
    return data;
  }
};
