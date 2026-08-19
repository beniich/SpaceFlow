import { useState, useEffect, useCallback } from 'react';
import {
  signInWithGoogle,
  firebaseSignOut,
  onFirebaseAuthStateChanged,
  getCurrentIdToken
} from '../lib/firebase';
import crmApi from '../services/crmApi';
import { useCrmAuthStore } from '../store/crmAuthStore';

/**
 * Hook qui gère l'authentification Firebase (Google Sign-In)
 * et synchronise avec le backend CRM via idToken
 */
export const useFirebaseAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setAuth, logout } = useCrmAuthStore();

  /**
   * Google Sign-In → vérif backend → JWT CRM
   */
  const loginWithGoogle = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { idToken } = await signInWithGoogle();

      // Échanger idToken Firebase contre JWT CRM
      const { data } = await crmApi.post('/auth/firebase', { idToken });

      setAuth(data.token, data.user);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Erreur Google Sign-In';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setAuth]);

  const logoutAll = useCallback(async () => {
    await firebaseSignOut().catch(() => {});
    logout();
  }, [logout]);

  return { loginWithGoogle, logoutAll, loading, error };
};
