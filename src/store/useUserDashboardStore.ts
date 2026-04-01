import { create } from 'zustand';
import type { DashboardOverview, DashboardAnalytics, DashboardFolder, DashboardApp } from '../types/user-dashboard';
import type { CloudFile } from '../types/cloud';
import { userDashboardService } from '../services/user-dashboard.service';

interface UserDashboardState {
  overview: DashboardOverview | null;
  analytics: DashboardAnalytics | null;
  recentUploads: CloudFile[];
  apps: DashboardApp[];
  folders: DashboardFolder[];
  assets: CloudFile[];
  isLoading: boolean;
  error: string | null;

  fetchOverview: () => Promise<void>;
  fetchAnalytics: () => Promise<void>;
  fetchRecentUploads: () => Promise<void>;
  fetchApps: () => Promise<void>;
  fetchFolders: () => Promise<void>;
  fetchAssets: () => Promise<void>;

  createApp: (name: string) => Promise<void>;
  deleteApp: (id: string) => Promise<void>;

  createFolder: (name: string, parentId?: string) => Promise<void>;
  updateFolder: (id: string, name: string) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;

  deleteAsset: (id: string) => Promise<void>;

  clearError: () => void;
}

export const useUserDashboardStore = create<UserDashboardState>((set) => ({
  overview: null,
  analytics: null,
  recentUploads: [],
  apps: [],
  folders: [],
  assets: [],
  isLoading: false,
  error: null,

  fetchOverview: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await userDashboardService.getOverview();
      // server returns { totalFiles, totalUsed, totalFolders, totalStorage }
      // normalize to consistent shape
      const overview = {
        ...res,
        totalStorageUsed: res?.totalUsed ?? res?.totalStorageUsed ?? 0,
        totalStorageAllowed: res?.totalStorage ?? res?.totalStorageAllowed ?? 0,
      };
      set({ overview, isLoading: false });
    } catch (error: any) {
      set({ error: 'Failed to fetch overview', isLoading: false });
    }
  },

  fetchAnalytics: async () => {
    set({ isLoading: true, error: null });
    try {
      const analytics = await userDashboardService.getAnalytics();
      set({ analytics, isLoading: false });
    } catch (error: any) {
      set({ error: 'Failed to fetch analytics', isLoading: false });
    }
  },

  fetchRecentUploads: async () => {
    set({ isLoading: true, error: null });
    try {
      const files = await userDashboardService.getRecentUploads();
      set({ recentUploads: files, isLoading: false });
    } catch (error: any) {
      set({ error: 'Failed to fetch recent uploads', isLoading: false });
    }
  },

  fetchApps: async () => {
    set({ isLoading: true, error: null });
    try {
      const apps = await userDashboardService.getApps();
      set({ apps, isLoading: false });
    } catch (error: any) {
      set({ error: 'Failed to fetch apps', isLoading: false });
    }
  },

  fetchFolders: async () => {
    set({ isLoading: true, error: null });
    try {
      const folders = await userDashboardService.getFolders();
      set({ folders, isLoading: false });
    } catch (error: any) {
      set({ error: 'Failed to fetch folders', isLoading: false });
    }
  },

  fetchAssets: async () => {
    set({ isLoading: true, error: null });
    try {
      const assets = await userDashboardService.getAssets();
      set({ assets, isLoading: false });
    } catch (error: any) {
      set({ error: 'Failed to fetch assets', isLoading: false });
    }
  },

  createApp: async (name) => {
    set({ isLoading: true, error: null });
    try {
      const newApp = await userDashboardService.createApp({ name });
      set((state) => ({ apps: [...state.apps, newApp], isLoading: false }));
    } catch (error: any) {
      set({ error: 'Failed to create app', isLoading: false });
      throw error;
    }
  },

  deleteApp: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await userDashboardService.deleteApp(id);
      set((state) => ({ apps: state.apps.filter((a) => a.id !== id), isLoading: false }));
    } catch (error: any) {
      set({ error: 'Failed to delete app', isLoading: false });
      throw error;
    }
  },

  createFolder: async (name, parentId) => {
    set({ isLoading: true, error: null });
    try {
      const newFolder = await userDashboardService.createFolder({ name, parentId });
      set((state) => ({ folders: [...state.folders, newFolder], isLoading: false }));
    } catch (error: any) {
      set({ error: 'Failed to create folder', isLoading: false });
      throw error;
    }
  },

  updateFolder: async (id, name) => {
    set({ isLoading: true, error: null });
    try {
      const updatedFolder = await userDashboardService.updateFolder(id, name);
      set((state) => ({
        folders: state.folders.map((f) => (f.id === id ? updatedFolder : f)),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: 'Failed to update folder', isLoading: false });
      throw error;
    }
  },

  deleteFolder: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await userDashboardService.deleteFolder(id);
      set((state) => ({ folders: state.folders.filter((f) => f.id !== id), isLoading: false }));
    } catch (error: any) {
      set({ error: 'Failed to delete folder', isLoading: false });
      throw error;
    }
  },

  deleteAsset: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await userDashboardService.deleteAsset(id);
      set((state) => ({ assets: state.assets.filter((a) => a.id !== id), isLoading: false }));
    } catch (error: any) {
      set({ error: 'Failed to delete asset', isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null })
}));
