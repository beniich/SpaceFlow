import axios from 'axios';

const crmApi = axios.create({
  baseURL: 'http://localhost:8081/api/crm',
  timeout: 10000
});

crmApi.interceptors.request.use((config) => {
  const raw = localStorage.getItem('crm-auth-storage');
  if (raw) {
    try {
      const { state } = JSON.parse(raw);
      if (state?.token) {
        config.headers.Authorization = `Bearer ${state.token}`;
      }
    } catch (e) {}
  }
  return config;
});

crmApi.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('crm-auth-storage');
      window.location.href = '/crm/login';
    }
    return Promise.reject(err);
  }
);

export default crmApi;
