import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "../types/auth";
import { authService } from "../services/auth.service";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  verificationToken: string | null;
  isLoading: boolean;
  error: string | null;

  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  login: (data: Record<string, any>) => Promise<User | null>;
  register: (data: Record<string, any>) => Promise<void>;
  fetchProfile: () => Promise<void>;
  logout: () => Promise<void>;
  setError: (error: string | null) => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      verificationToken: null,
      isLoading: false,
      error: null,

      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),

      setUser: (user) => set({ user }),

      setError: (error) => set({ error }),

      checkAuth: () => {
        // Just validates that token exists in store (persisted from localStorage)
        const { accessToken } = get();
        if (!accessToken) {
          set({ user: null, accessToken: null, refreshToken: null });
        }
      },

      login: async (data: Record<string, any>) => {
        set({ isLoading: true, error: null, accessToken: null });
        try {
          const response = await authService.login(data);
          const payload = (response as any)?.data ?? response;
          const accessToken = payload?.accessToken;
          const userObj = payload?.user;

          if (!accessToken) throw new Error("No access token received");

          set({
            accessToken,
            user: userObj ?? null,
            isLoading: false,
          });

          return userObj;
        } catch (error: any) {
          set({
            error:
              error.response?.data?.message || error.message || "Login failed",
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (data: Record<string, any>) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.register(data);
          // Server returns: { success, message, data: { token } }
          const token = (response as any)?.data?.token ?? null;
          set({ isLoading: false, verificationToken: token });
        } catch (error: any) {
          set({
            error:
              error.response?.data?.message ||
              error.message ||
              "Registration failed",
            isLoading: false,
          });
          throw error;
        }
      },

      fetchProfile: async () => {
        set({ isLoading: true, error: null });
        try {
          const user = await authService.getProfile();
          set({ user: user as any, isLoading: false });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Failed to fetch profile",
            isLoading: false,
          });
        }
      },

      logout: async () => {
        try {
          await authService.logout();
        } catch {
          // ignore
        }
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          verificationToken: null,
        });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    },
  ),
);
