import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8888';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh-token') &&
      !originalRequest.url?.includes('/auth/logout')
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (!refreshToken) {
          await useAuthStore.getState().logout();
          return Promise.reject(error);
        }

        // Server expects { refreshToken } in body
        const response = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });

        // Server returns: { success, message, data: { accessToken } }
        const newAccessToken = response.data?.data?.accessToken;

        if (!newAccessToken) {
          await useAuthStore.getState().logout();
          return Promise.reject(error);
        }

        useAuthStore.getState().setTokens(newAccessToken, refreshToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch {
        await useAuthStore.getState().logout();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
