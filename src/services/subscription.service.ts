import api from '../config/axios';
import type { SubscriptionPlan, CheckoutSessionResponse } from '../types/subscription';

export const subscriptionService = {
  async getAllPlans(): Promise<SubscriptionPlan[]> {
    const response = await api.get('/subscription');
    return response.data?.data ?? response.data?.plans ?? response.data ?? [];
  },

  async getPlanById(id: string): Promise<SubscriptionPlan> {
    const response = await api.get(`/subscription/${id}`);
    return response.data?.data ?? response.data?.plan ?? response.data;
  },

  async createPlan(data: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
    const response = await api.post('/subscription', data);
    return response.data?.plan || response.data;
  },

  async updatePlan(id: string, data: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
    const response = await api.put(`/subscription/${id}`, data);
    return response.data?.plan || response.data;
  },

  async deletePlan(id: string): Promise<void> {
    await api.delete(`/subscription/${id}`);
  },

  async getUserSubscription(): Promise<any> {
    const response = await api.get('/subscription/my');
    return response.data?.data ?? response.data ?? null;
  },

  async subscribe(planId: string): Promise<CheckoutSessionResponse> {
    const response = await api.post(`/subscription/${planId}/subscribe`);
    return response.data?.data ?? response.data;
  },

  async unsubscribe(planId: string): Promise<void> {
    await api.post(`/subscription/${planId}/unsubscribe`);
  }
};
