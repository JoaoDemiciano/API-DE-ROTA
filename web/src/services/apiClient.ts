import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL,
  withCredentials: true
});

apiClient.interceptors.request.use((config) => {
  const stored = localStorage.getItem('rotaperfeita_auth');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed?.tokens?.accessToken) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${parsed.tokens.accessToken}`;
      }
    } catch {
      // ignore parsing errors
    }
  }
  return config;
});
