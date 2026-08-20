import { create } from 'zustand';
import crmApi from '../services/crmApi';

export const useCrmStore = create((set) => ({
  // ─── Dashboard ──────────────────────────────────────────────────────────────
  dashboard: null,
  dashboardLoading: false,

  fetchDashboard: async () => {
    set({ dashboardLoading: true });
    try {
      const res = await crmApi.get('/dashboard');
      set({ dashboard: res.data, dashboardLoading: false });
    } catch {
      set({ dashboardLoading: false });
    }
  },

  // ─── Deals ──────────────────────────────────────────────────────────────────
  deals: [],
  dealsLoading: false,

  fetchDeals: async () => {
    set({ dealsLoading: true });
    try {
      const res = await crmApi.get('/deals');
      set({ deals: res.data, dealsLoading: false });
    } catch {
      set({ dealsLoading: false });
    }
  },

  // ─── Contacts ───────────────────────────────────────────────────────────────
  contacts: [],
  contactsLoading: false,

  fetchContacts: async () => {
    set({ contactsLoading: true });
    try {
      const res = await crmApi.get('/contacts');
      set({ contacts: res.data, contactsLoading: false });
    } catch {
      set({ contactsLoading: false });
    }
  },
}));
