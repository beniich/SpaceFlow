import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      loading: false,
      
      login: async (email, password) => {
        set({ loading: true });
        try {
          const { data } = await api.post('/auth/login', { email, password });
          set({ user: data.user, token: data.token, loading: false });
          return true;
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },
      
      signup: async (formData) => {
        set({ loading: true });
        try {
          const { data } = await api.post('/auth/register', formData);
          set({ user: data.user, token: data.token, loading: false });
          return true;
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },
      
      logout: () => set({ user: null, token: null })
    }),
    { name: 'cafm-auth' }
  )
);
