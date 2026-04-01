import api from '../config/axios';
import type { CloudFile } from '../types/cloud';

export const cloudService = {
  async getFiles(): Promise<CloudFile[]> {
    const response = await api.get('/cloud');
    return response.data?.data ?? response.data ?? [];
  },

  async getFileById(id: string): Promise<CloudFile> {
    const response = await api.get(`/cloud/${id}`);
    return response.data?.data ?? response.data;
  },

  async uploadFile(file: File, folder?: string): Promise<CloudFile> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(
      `/cloud/upload${folder ? `?folder=${encodeURIComponent(folder)}` : ''}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data?.data ?? response.data;
  },

  async deleteFile(id: string): Promise<void> {
    await api.delete(`/cloud/${id}`);
  },

  async downloadFile(id: string, name: string): Promise<void> {
    const response = await api.get(`/cloud/${id}/download`, {
      responseType: 'blob',
    });
    const url = URL.createObjectURL(response.data);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};
