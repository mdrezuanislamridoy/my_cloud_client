import { create } from "zustand";
import type { SecretKey, AppId } from "../types/secrets";
import { secretsService } from "../services/secrets.service";

interface SecretsState {
  secretKey: SecretKey | null;
  apiKey: SecretKey | null;
  appIds: AppId[];
  isLoading: boolean;
  error: string | null;

  fetchSecretKey: () => Promise<void>;
  fetchApiKey: () => Promise<void>;
  generateSecretKey: () => Promise<void>;
  updateSecretKey: () => Promise<void>;

  fetchAppIds: () => Promise<void>;
  generateAppId: (name: string) => Promise<void>;
  deleteAppId: (id: string) => Promise<void>;

  clearError: () => void;
}

export const useSecretsStore = create<SecretsState>((set) => ({
  secretKey: null,
  apiKey: null,
  appIds: [],
  isLoading: false,
  error: null,

  fetchSecretKey: async () => {
    set({ isLoading: true, error: null });
    try {
      const secretKey = await secretsService.getSecretKey();
      set({ secretKey, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch secret key",
        isLoading: false,
      });
    }
  },

  fetchApiKey: async () => {
    set({ isLoading: true, error: null });
    try {
      const apiKey = await secretsService.getApiKey();
      set({ apiKey, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch API key",
        isLoading: false,
      });
    }
  },

  generateSecretKey: async () => {
    set({ isLoading: true, error: null });
    try {
      const secretKey = await secretsService.generateSecretKey();
      set({ secretKey, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to generate secret key",
        isLoading: false,
      });
      throw error;
    }
  },

  updateSecretKey: async () => {
    set({ isLoading: true, error: null });
    try {
      const secretKey = await secretsService.updateSecretKey();
      set({ secretKey, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to update secret key",
        isLoading: false,
      });
      throw error;
    }
  },

  fetchAppIds: async () => {
    set({ isLoading: true, error: null });
    try {
      const appIds = await secretsService.getAppIds();
      set({ appIds: Array.isArray(appIds) ? appIds : [], isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch app IDs",
        isLoading: false,
      });
    }
  },

  generateAppId: async (name: string) => {
    set({ isLoading: true, error: null });
    try {
      const newApp = await secretsService.generateAppId({ name });
      set((state) => ({ appIds: [...state.appIds, newApp], isLoading: false }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to generate app ID",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteAppId: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await secretsService.deleteAppId(id);
      set((state) => ({
        appIds: state.appIds.filter((app) => app.id !== id && app.appId !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to delete app ID",
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
