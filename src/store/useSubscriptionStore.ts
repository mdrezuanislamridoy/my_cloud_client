import { create } from 'zustand';
import type { SubscriptionPlan, UserSubscription } from '../types/subscription';
import { subscriptionService } from '../services/subscription.service';

interface SubscriptionState {
  plans: SubscriptionPlan[];
  userSubscription: UserSubscription | null;
  isLoading: boolean;
  error: string | null;

  fetchPlans: () => Promise<void>;
  fetchUserSubscription: () => Promise<void>;
  subscribe: (planId: string) => Promise<string | undefined>;
  unsubscribe: (planId: string) => Promise<void>;
  clearError: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  plans: [],
  userSubscription: null,
  isLoading: false,
  error: null,

  fetchPlans: async () => {
    set({ isLoading: true, error: null });
    try {
      const plans = await subscriptionService.getAllPlans();
      set({ plans: Array.isArray(plans) ? plans : [], isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch plans', isLoading: false });
    }
  },

  fetchUserSubscription: async () => {
    set({ isLoading: true });
    try {
      const sub = await subscriptionService.getUserSubscription();
      set({ userSubscription: sub ?? null, isLoading: false });
    } catch {
      set({ userSubscription: null, isLoading: false });
    }
  },

  subscribe: async (planId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await subscriptionService.subscribe(planId);
      set({ isLoading: false });
      // server returns { checkoutSessionId, checkoutUrl }
      return response?.checkoutUrl ?? (response as any)?.url;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to initiate subscription',
        isLoading: false,
      });
      throw error;
    }
  },

  unsubscribe: async (planId: string) => {
    set({ isLoading: true, error: null });
    try {
      await subscriptionService.unsubscribe(planId);
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to cancel subscription',
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null })
}));
