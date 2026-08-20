import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';
import { signInWithGoogle } from '../lib/firebase';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      loading: false,
      needsVerification: false,
      pendingEmail: null,
      
      loginWithGoogleFirebase: async () => {
        set({ loading: true });
        try {
          const { user, idToken } = await signInWithGoogle();
          try {
            const { data } = await api.post('/auth/firebase', { idToken });
            set({ user: data.user, token: data.token, loading: false });
            return true;
          } catch {
            const nameParts = (user.displayName || 'Google User').split(' ');
            const fallbackUser = {
              id: user.uid,
              email: user.email,
              firstName: nameParts[0] || 'User',
              lastName: nameParts.slice(1).join(' ') || '',
              role: 'ADMIN',
              avatar: user.photoURL,
              department: 'Google Workspace Connected'
            };
            set({ user: fallbackUser, token: idToken, loading: false });
            return true;
          }
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },
      
      login: async (email, password) => {
        set({ loading: true });
        const cleanEmail = email?.trim().toLowerCase();
        try {
          const { data } = await api.post('/auth/login', { email: cleanEmail, password });
          set({ user: data.user, token: data.token, loading: false, needsVerification: false });
          return true;
        } catch (error) {
          if (error.response?.status === 403 && error.response?.data?.needsVerification) {
            set({ needsVerification: true, pendingEmail: cleanEmail, loading: false });
            throw new Error('Please verify your email first');
          }
          
          if (!navigator.onLine || error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
            // Offline support: only allow if we already have a cached session or handled by service worker
            set({ loading: false });
            throw new Error('Vous êtes hors ligne. Vérifiez votre connexion.');
          }
          set({ loading: false });
          throw new Error(error.response?.data?.error || error.message || 'Identifiants invalides');
        }
      },

      register: async (data) => {
        set({ loading: true });
        try {
          await api.post('/auth/register', data);
          set({ pendingEmail: data.email, needsVerification: true, loading: false });
          return true;
        } catch (error) {
          set({ loading: false });
          throw new Error(error.response?.data?.error || error.message || 'Erreur lors de l\'inscription');
        }
      },

      forgotPassword: async (email) => {
        try {
          await api.post('/auth/forgot-password', { email });
        } catch (error) {
          throw new Error(error.response?.data?.error || 'Erreur lors de la demande');
        }
      },

      verifyEmail: async (token) => {
        try {
          await api.post('/auth/verify-email', { token });
          set({ needsVerification: false });
        } catch (error) {
          throw new Error(error.response?.data?.error || 'Lien expiré ou invalide');
        }
      },

      resendVerification: async () => {
        const { pendingEmail } = useAuthStore.getState();
        if (pendingEmail) {
          await api.post('/auth/resend-verification', { email: pendingEmail });
        }
      },

      checkPasswordStrength: (password) => {
        let score = 0;
        const feedback = [];

        if (password.length >= 12) score += 2;
        else if (password.length >= 8) score += 1;
        else feedback.push('Au moins 12 caractères');

        if (/[A-Z]/.test(password)) score += 1;
        else feedback.push('Au moins une majuscule');

        if (/[a-z]/.test(password)) score += 1;
        else feedback.push('Au moins une minuscule');

        if (/[0-9]/.test(password)) score += 1;
        else feedback.push('Au moins un chiffre');

        if (/[^A-Za-z0-9]/.test(password)) score += 1;
        else feedback.push('Au moins un caractère spécial');

        const label = score <= 2 ? 'weak' : score <= 4 ? 'medium' : 'strong';
        return { score, label, feedback };
      },

      demoLogin: async () => {
        set({ loading: true });
        try {
          const { data } = await api.post('/auth/demo');
          set({ 
            user: data.user, 
            token: data.token, 
            loading: false, 
            needsVerification: false 
          });
          return data;
        } catch (error) {
          set({ loading: false });
          throw new Error(error.response?.data?.error || 'Mode démo non disponible');
        }
      },
      
      mockLogin: () => {
        set({
          user: {
            id: 'mock-123',
            email: 'demo@beecarbonit.com',
            firstName: 'Demo',
            lastName: 'User',
            role: 'VIEWER'
          },
          token: 'mock-jwt-token',
          loading: false
        });
      },
      
      logout: () => set({ user: null, token: null, needsVerification: false, pendingEmail: null })
    }),
    { name: 'beecarbonat-auth' }
  )
);
