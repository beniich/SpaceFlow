import api from './api';

export const invoiceService = {
  list: (params?: any) => api.get('/invoices', { params }).then(r => r.data),
  get: (id: string) => api.get(`/invoices/${id}`).then(r => r.data),
  stats: () => api.get('/invoices/stats').then(r => r.data),
  create: (data: any) => api.post('/invoices', data).then(r => r.data),
  markPaid: (id: string) => api.post(`/invoices/${id}/mark-paid`).then(r => r.data),
  delete: (id: string) => api.delete(`/invoices/${id}`).then(r => r.data),
  downloadPDF: async (id: string, number?: string) => {
    const response = await api.get(`/pdf/invoice/${id}`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `facture-${number || id}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
};
