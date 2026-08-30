import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { addPendingAction } from './syncService';
import { v4 as uuidv4 } from 'uuid';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => {
    if (res.headers && res.headers['x-subscription-warning'] === 'past_due') {
      useAuthStore.getState().setSubscriptionWarning(true);
    } else {
      useAuthStore.getState().setSubscriptionWarning(false);
    }
    return res;
  },
  async (err) => {
    if (err.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
      return Promise.reject(err);
    }
    
    // Intercept network errors (offline) for mutations (POST/PUT/DELETE)
    const isMutation = ['post', 'put', 'patch', 'delete'].includes(err.config?.method?.toLowerCase());
    const isNetworkError = !err.response || err.code === 'ERR_NETWORK';
    const isRetry = err.config?.headers?.['X-Offline-Retry'];

    if (isMutation && isNetworkError && !isRetry) {
      console.log('[Offline] Network error detected. Queueing mutation for later sync.');
      
      const config = err.config;
      let data = config.data ? JSON.parse(config.data) : null;
      
      await addPendingAction(config.method, config.url, data);

      // Create a fake successful response so the UI doesn't crash
      return Promise.resolve({
        status: 200,
        statusText: 'OK (Offline Queued)',
        data: { 
          // Inject a temporary ID if it's a creation so the UI can render it immediately
          id: config.method.toLowerCase() === 'post' ? `temp-${uuidv4()}` : undefined,
          ...data,
          _isOfflineQueued: true
        }
      });
    }

    return Promise.reject(err);
  }
);

export default api;
