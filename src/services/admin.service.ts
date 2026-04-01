import api from '../config/axios';

export const adminService = {
  async getDashboardStats(): Promise<any> {
    const response = await api.get('/admin-dashboard/overview/stats');
    return response.data?.data ?? response.data;
  },

  async getSubscriptions(params?: { page?: number; limit?: number; search?: string; status?: string }): Promise<any> {
    const response = await api.get('/admin-dashboard/subscription', { params });
    return response.data?.data ?? response.data;
  },

  async updateSubscription(id: string, data: any): Promise<any> {
    const response = await api.patch(`/admin-dashboard/subscription/${id}`, data);
    return response.data?.data ?? response.data;
  },

  async getUsers(params?: { page?: number; limit?: number; search?: string; role?: string }): Promise<any> {
    const response = await api.get('/admin-dashboard/user-management', { params });
    return response.data?.data ?? response.data;
  },

  async toggleBlockStatus(id: string): Promise<any> {
    const response = await api.patch(`/admin-dashboard/user-management/${id}/update-block-status`);
    return response.data?.data ?? response.data;
  },

  async getAllApps(): Promise<any[]> {
    const response = await api.get('/admin-dashboard/overview/apps');
    return response.data?.data ?? response.data ?? [];
  },

  async getAnalytics(): Promise<any[]> {
    const response = await api.get('/admin-dashboard/overview/analytics');
    return response.data?.data ?? [];
  },

  async getRecentUsers(): Promise<any[]> {
    const response = await api.get('/admin-dashboard/overview/recent-users');
    return response.data?.data ?? [];
  },
};
