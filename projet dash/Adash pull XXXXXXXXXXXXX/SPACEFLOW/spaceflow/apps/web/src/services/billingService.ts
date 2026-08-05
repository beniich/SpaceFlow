import api from './api';

export const billingService = {
  getPlans: () => api.get('/billing/plans').then(r => r.data),
  getSubscription: () => api.get('/billing/subscription').then(r => r.data),
  createCheckout: (plan: string, billingInterval: 'month' | 'year') =>
    api.post('/billing/checkout', { plan, billingInterval }).then(r => r.data),
  openPortal: () => api.post('/billing/portal').then(r => r.data),
  cancel: () => api.post('/billing/cancel').then(r => r.data),
  getInvoices: () => api.get('/billing/invoices').then(r => r.data)
};
