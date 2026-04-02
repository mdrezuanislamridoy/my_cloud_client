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
  (error) => {
    // Check if it's an unauthorized error
    if (error.response?.status === 401) {
      // Clear store to force re-login if unauthorized
      useAuthStore.setState({
        user: null,
        accessToken: null,
        refreshToken: null,
        verificationToken: null,
      });
    }
    return Promise.reject(error);
  }
);

export default api;
