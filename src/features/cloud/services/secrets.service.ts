import api from '@/config/axios';
import type { SecretKey, AppId } from '@/features/cloud/types/secrets';

export const secretsService = {
  async getSecretKey(): Promise<SecretKey> {
    const response = await api.get('/secrets/get-secret-key');
    return response.data?.data ?? response.data;
  },

  async getApiKey(): Promise<SecretKey> {
    const response = await api.get('/secrets/get-api-key');
    return response.data?.data ?? response.data;
  },

  async generateSecretKey(): Promise<SecretKey> {
    const response = await api.post('/secrets/generate-secret');
    return response.data?.data ?? response.data;
  },

  async updateSecretKey(): Promise<SecretKey> {
    const response = await api.patch('/secrets/update-secret-key');
    return response.data?.data ?? response.data;
  },

  async getAppIds(): Promise<AppId[]> {
    const response = await api.get('/secrets/get-app-ids');
    return response.data?.data?.appIds ?? [];
  },

  async getAppDetails(appId: string): Promise<AppId> {
    const response = await api.get(`/secrets/get-app-details/${appId}`);
    return response.data?.data ?? response.data;
  },

  async generateAppId(data: { name: string }): Promise<AppId> {
    const response = await api.post('/secrets/generate-app-id', data);
    return response.data?.data ?? response.data;
  },

  async deleteAppId(appId: string): Promise<void> {
    await api.patch(`/secrets/delete-app-id/${appId}`);
  }
};
