import api from '@/config/axios';
import type { LoginResponse, ProfileResponse, RegisterResponse, User } from '@/features/auth/types';

export const authService = {
  async register(data: Record<string, any>): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>('/auth/register', data);
    return response.data;
  },

  async login(data: Record<string, any>): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  async verifyEmail(data: { token: string; code: string }): Promise<any> {
    const response = await api.post('/auth/verify-email', data);
    return response.data;
  },

  async resendVerification(data: { email: string }): Promise<any> {
    const response = await api.post('/auth/resend-verification', data);
    return response.data;
  },

  async forgotPassword(data: { email: string }): Promise<any> {
    const response = await api.post('/auth/forgot-password', data);
    return response.data;
  },

  async resetPassword(data: Record<string, any>): Promise<any> {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get<ProfileResponse>('/auth/profile');
    // Server returns: { success, message, data: { id, name, ... } }
    return (response.data as any)?.data ?? response.data;
  },

  async changePassword(data: Record<string, any>): Promise<any> {
    const response = await api.post('/auth/change-password', data);
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async validateApp(data: { appId: string; apiKey: string; secretKey: string }): Promise<any> {
    const response = await api.post('/api/v1/validate', data);
    return response.data;
  }
};
