import { create } from 'zustand';
import type { CloudFile } from '../types/cloud';
import { cloudService } from '../services/cloud.service';

interface CloudState {
  files: CloudFile[];
  isLoading: boolean;
  error: string | null;

  fetchFiles: () => Promise<void>;
  uploadFile: (file: File, folder?: string) => Promise<void>;
  deleteFile: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useCloudStore = create<CloudState>((set) => ({
  files: [],
  isLoading: false,
  error: null,

  fetchFiles: async () => {
    set({ isLoading: true, error: null });
    try {
      const files = await cloudService.getFiles();
      set({ files: Array.isArray(files) ? files : [], isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch files', isLoading: false });
    }
  },

  uploadFile: async (file: File, folder?: string) => {
    set({ isLoading: true, error: null });
    try {
      const uploaded = await cloudService.uploadFile(file, folder);
      set((state) => ({ files: [uploaded, ...state.files], isLoading: false }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Upload failed', isLoading: false });
      throw error;
    }
  },

  deleteFile: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await cloudService.deleteFile(id);
      set((state) => ({ files: state.files.filter((f) => f.id !== id), isLoading: false }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to delete file', isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
