import api from '@/config/axios';
import type { DashboardOverview, DashboardAnalytics, DashboardFolder, DashboardApp } from '@/features/cloud/types/user-dashboard';
import type { CloudFile } from '@/features/cloud/types';

export const userDashboardService = {
  async getOverview(): Promise<DashboardOverview> {
    const response = await api.get('/overview');
    return response.data?.data ?? response.data;
  },

  async getAnalytics(): Promise<DashboardAnalytics> {
    const response = await api.get('/overview/analytics');
    return response.data?.data ?? response.data;
  },

  async getRecentUploads(): Promise<CloudFile[]> {
    const response = await api.get('/overview/recent-uploads');
    return response.data?.data ?? response.data ?? [];
  },

  async getApps(): Promise<DashboardApp[]> {
    const response = await api.get('/apps');
    return response.data?.data ?? response.data ?? [];
  },

  async getAppById(id: string): Promise<DashboardApp> {
    const response = await api.get(`/apps/${id}`);
    return response.data?.data ?? response.data;
  },

  async createApp(data: { name: string }): Promise<DashboardApp> {
    const response = await api.post('/apps', data);
    return response.data?.data ?? response.data;
  },

  async deleteApp(id: string): Promise<void> {
    await api.delete(`/apps/${id}`);
  },

  async getFolders(): Promise<DashboardFolder[]> {
    const response = await api.get('/folders');
    return response.data?.data ?? response.data ?? [];
  },

  async getFolderById(id: string): Promise<DashboardFolder> {
    const response = await api.get(`/folders/${id}`);
    return response.data?.data ?? response.data;
  },

  async createFolder(data: { name: string; parentId?: string }): Promise<DashboardFolder> {
    const response = await api.post('/folders', { folderName: data.name, parentFolderId: data.parentId });
    return response.data?.data ?? response.data;
  },

  async updateFolder(id: string, name: string): Promise<DashboardFolder> {
    const response = await api.put(`/folders/${id}`, { folderName: name });
    return response.data?.data ?? response.data;
  },

  async deleteFolder(id: string): Promise<void> {
    await api.delete(`/folders/${id}`);
  },

  async getAssets(): Promise<CloudFile[]> {
    const response = await api.get('/assets');
    return response.data?.data ?? response.data ?? [];
  },

  async getAssetById(id: string): Promise<CloudFile> {
    const response = await api.get(`/assets/${id}`);
    return response.data?.data ?? response.data;
  },

  async deleteAsset(id: string): Promise<void> {
    await api.delete(`/assets/${id}`);
  }
};
