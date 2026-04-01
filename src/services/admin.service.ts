import api from '../config/axios';
import type { AdminUser, AdminSubscriptionPlan } from '../types/admin';

export const adminService = {
  // User Management
  async getAllUsers(): Promise<AdminUser[]> {
    const response = await api.get('/admin-dashboard/user-management');
    return response.data?.users || response.data;
  },

  async updateUser(id: string, data: Partial<AdminUser>): Promise<AdminUser> {
    const response = await api.patch(`/admin-dashboard/user-management/${id}`, data);
    return response.data?.user || response.data;
  },

  async updateBlockStatus(id: string, isBlocked: boolean): Promise<AdminUser> {
    const response = await api.patch(`/admin-dashboard/user-management/${id}/update-block-status`, { isBlocked });
    return response.data?.user || response.data;
  },

  // Subscription Management
  async getAllPlans(): Promise<AdminSubscriptionPlan[]> {
    const response = await api.get('/admin-dashboard/subscription');
    return response.data?.plans || response.data;
  },

  async updatePlan(id: string, data: Partial<AdminSubscriptionPlan>): Promise<AdminSubscriptionPlan> {
    const response = await api.patch(`/admin-dashboard/subscription/${id}`, data);
    return response.data?.plan || response.data;
  },
  // Dashboard Overview
  async getDashboardStats(): Promise<any> {
    const response = await api.get('/admin-dashboard/overview/stats');
    return response.data;
  }
};
