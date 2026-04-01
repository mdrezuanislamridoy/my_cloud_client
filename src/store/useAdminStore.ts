import { create } from 'zustand';
import type { AdminUser, AdminSubscriptionPlan, AdminDashboardStats } from '../types/admin';
import { adminService } from '../services/admin.service';

interface AdminState {
  users: AdminUser[];
  stats: AdminDashboardStats;
  loading: boolean;
  error: string | null;

  fetchAllUsers: () => Promise<void>;
  fetchAdminStats: () => Promise<void>;
  updateUser: (id: string, data: Partial<AdminUser>) => Promise<void>;
  toggleUserBlock: (id: string, isBlocked: boolean) => Promise<void>;
  updateUserSubscription: (id: string, data: any) => Promise<void>;
  fetchAdminPlans: () => Promise<void>;
  updateAdminPlan: (id: string, data: Partial<AdminSubscriptionPlan>) => Promise<void>;
  clearError: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  users: [],
  stats: {
    totalUsers: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    totalStorageUsed: 0
  },
  loading: false,
  error: null,

  fetchAllUsers: async () => {
    set({ loading: true, error: null });
    try {
      const users = await adminService.getAllUsers();
      set({ users: Array.isArray(users) ? users : [], loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch users',
        loading: false,
      });
    }
  },

  fetchAdminStats: async () => {
    set({ loading: true, error: null });
    try {
      const stats = await adminService.getDashboardStats();
      set({ stats, loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch stats',
        loading: false,
      });
    }
  },

  updateUser: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const updatedUser = await adminService.updateUser(id, data);
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? updatedUser : u)),
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update user',
        loading: false,
      });
      throw error;
    }
  },

  toggleUserBlock: async (id, isBlocked) => {
    set({ loading: true, error: null });
    try {
      const updatedUser = await adminService.updateBlockStatus(id, isBlocked);
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? updatedUser : u)),
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to toggle block status',
        loading: false,
      });
      throw error;
    }
  },

  updateUserSubscription: async (id, data) => {
    // For now, mapping this to updateUser since the service is similar
    set({ loading: true, error: null });
    try {
      const updatedUser = await adminService.updateUser(id, data);
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? updatedUser : u)),
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update subscription',
        loading: false,
      });
      throw error;
    }
  },

  fetchAdminPlans: async () => {
    set({ loading: true, error: null });
    try {
      const plans = await adminService.getAllPlans();
      // Store plans in a separate state if needed, but not required by Admin.tsx current usage
      set({ loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch admin plans',
        loading: false,
      });
    }
  },

  updateAdminPlan: async (id, data) => {
    set({ loading: true, error: null });
    try {
      await adminService.updatePlan(id, data);
      set({ loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update plan',
        loading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null })
}));
