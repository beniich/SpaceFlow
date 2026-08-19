import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import crmApi from '../services/crmApi';

export const useCrmAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const res = await crmApi.post('/auth/login', { email, password });
          set({
            user: res.data.user,
            token: res.data.token,
            isAuthenticated: true,
            isLoading: false
          });
          return true;
        } catch (err) {
          set({
            error: err.response?.data?.error || 'Erreur de connexion',
            isLoading: false
          });
          return false;
        }
      },

      signup: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const res = await crmApi.post('/auth/signup', data);
          set({
            user: res.data.user,
            token: res.data.token,
            isAuthenticated: true,
            isLoading: false
          });
          return true;
        } catch (err) {
          set({
            error: err.response?.data?.error || 'Erreur lors de la creation du compte',
            isLoading: false
          });
          return false;
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem('crm-auth-storage');
      },

      checkAuth: async () => {
        const { token } = get();
        if (!token) return false;
        try {
          const res = await crmApi.get('/auth/me');
          set({ user: res.data, isAuthenticated: true });
          return true;
        } catch (err) {
          get().logout();
          return false;
        }
      }
    }),
    {
      name: 'crm-auth-storage'
    }
  )
);
