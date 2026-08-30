import axios, { AxiosInstance } from 'axios';

export interface BeeCarbonatConfig {
  apiKey?: string;
  accessToken?: string;
  baseURL?: string;
}

export class BeeCarbonatClient {
  private http: AxiosInstance;
  private refreshToken?: string;

  constructor(config: BeeCarbonatConfig) {
    this.http = axios.create({
      baseURL: config.baseURL || 'https://beecarbonat.ricecloud.net',
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        ...(config.apiKey && { 'X-API-Key': config.apiKey }),
        ...(config.accessToken && { 'Authorization': `Bearer ${config.accessToken}` }),
      },
    });

    // Auto-refresh interceptor
    this.http.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 && this.refreshToken) {
          const { data } = await axios.post(
            `${this.http.defaults.baseURL}/api/auth/refresh`,
            { refreshToken: this.refreshToken }
          );
          this.http.defaults.headers.Authorization = `Bearer ${data.accessToken}`;
          this.refreshToken = data.refreshToken;
          error.config.headers.Authorization = `Bearer ${data.accessToken}`;
          return this.http.request(error.config);
        }
        return Promise.reject(error);
      }
    );
  }

  // ============= TICKETS =============
  tickets = {
    list: (params?: any) => this.http.get('/api/tickets', { params }).then(r => r.data),
    get: (id: string) => this.http.get(`/api/tickets/${id}`).then(r => r.data),
    create: (data: any) => this.http.post('/api/tickets', data).then(r => r.data),
    update: (id: string, data: any) => this.http.patch(`/api/tickets/${id}`, data).then(r => r.data),
    delete: (id: string) => this.http.delete(`/api/tickets/${id}`).then(r => r.data),
  };

  // ============= WORK ORDERS =============
  workOrders = {
    list: (params?: any) => this.http.get('/api/workorders', { params }).then(r => r.data),
    get: (id: string) => this.http.get(`/api/workorders/${id}`).then(r => r.data),
    start: (id: string) => this.http.post(`/api/workorders/${id}/start`).then(r => r.data),
    complete: (id: string, data: any) => this.http.post(`/api/workorders/${id}/complete`, data).then(r => r.data),
  };

  // ============= ASSETS =============
  assets = {
    list: (params?: any) => this.http.get('/api/assets', { params }).then(r => r.data),
    getByQR: (qrCode: string) => this.http.get(`/api/assets/qr/${qrCode}`).then(r => r.data),
    create: (data: any) => this.http.post('/api/assets', data).then(r => r.data),
  };

  // ============= BILLING & PLANS =============
  billing = {
    getPlans: () => this.http.get('/api/billing/plans').then(r => r.data),
    getCurrentSubscription: () => this.http.get('/api/billing/current').then(r => r.data),
    createCheckout: (plan: string, interval: 'MONTHLY' | 'YEARLY') =>
      this.http.post('/api/billing/checkout', { plan, interval }).then(r => r.data),
  };
}

export default BeeCarbonatClient;
