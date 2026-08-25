import { create } from 'zustand';
import { authService, LoginResponse } from '../services/auth.service';
import { tokenStorage } from '../services/api';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  pendingTwoFactor: string | null;

  login: (email: string, password: string) => Promise<LoginResponse>;
  verifyTwoFactor: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  loadStoredAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  pendingTwoFactor: null,

  async login(email, password) {
    set({ isLoading: true });
    try {
      const response = await authService.login({ email, password });

      if (response.requiresTwoFactor) {
        set({
          pendingTwoFactor: response.user.id,
          isLoading: false,
        });
        return response;
      }

      set({
        user: response.user as unknown as User,
        isAuthenticated: true,
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  async verifyTwoFactor(token) {
    set({ isLoading: true });
    try {
      const response = await authService.verifyTwoFactor(token);
      set({
        user: response.user as unknown as User,
        isAuthenticated: true,
        pendingTwoFactor: null,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  async logout() {
    await authService.logout();
    set({ user: null, isAuthenticated: false });
  },

  async loadStoredAuth() {
    try {
      const token = await tokenStorage.getAccessToken();
      if (!token) {
        set({ isLoading: false });
        return;
      }
      const { data } = await (await import('../services/api')).api.get('/api/users/me');
      set({
        user: data,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },
}));
