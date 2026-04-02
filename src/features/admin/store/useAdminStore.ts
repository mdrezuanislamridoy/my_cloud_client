import { create } from 'zustand';
import { adminService } from '@/features/admin/services/admin.service';

interface AdminStats {
  totalUsers: number;
  totalFiles: number;
  totalRevenue: number;
  totalStorageUsed: number;
  activeSubscriptions: number;
}

interface AdminState {
  stats: AdminStats;
  subscriptions: any[];
  subMeta: { total: number; page: number; totalPages: number } | null;
  loading: boolean;
  error: string | null;

  fetchStats: () => Promise<void>;
  fetchSubscriptions: (params?: any) => Promise<void>;
  updateSubscription: (id: string, data: any) => Promise<void>;
  clearError: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  stats: { totalUsers: 0, totalFiles: 0, totalRevenue: 0, totalStorageUsed: 0, activeSubscriptions: 0 },
  subscriptions: [],
  subMeta: null,
  loading: false,
  error: null,

  fetchStats: async () => {
    set({ loading: true, error: null });
    try {
      const stats = await adminService.getDashboardStats();
      set({ stats, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch stats', loading: false });
    }
  },

  fetchSubscriptions: async (params) => {
    set({ loading: true, error: null });
    try {
      const res = await adminService.getSubscriptions(params);
      set({ subscriptions: res?.data ?? [], subMeta: res?.meta ?? null, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch subscriptions', loading: false });
    }
  },

  updateSubscription: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const updated = await adminService.updateSubscription(id, data);
      set((state) => ({
        subscriptions: state.subscriptions.map((s) => (s.id === id ? { ...s, ...updated } : s)),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to update subscription', loading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
