/**
 * Hook TanStack Query pour les Work Orders
 * Remplace les appels fetch/axios directs dans tous les composants WO.
 * Supporte les filtres avancés, la pagination et le cache intelligent.
 */
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import api from '../services/api';
import { addToOutbox } from '../lib/db';
import toast from 'react-hot-toast';

// ── Clés de cache ─────────────────────────────────────────────────────────────
export const WO_KEYS = {
  all: ['workorders'],
  list: (filters) => ['workorders', 'list', filters],
  detail: (id) => ['workorders', 'detail', id],
  stats: ['workorders', 'stats'],
  templates: (type) => ['workorders', 'templates', type]
};

// ── Liste des WO avec filtres avancés ─────────────────────────────────────────
export function useWorkOrders(filters = {}) {
  return useQuery({
    queryKey: WO_KEYS.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams(
        Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== undefined && v !== ''))
      ).toString();
      const res = await api.get(`/workorders?${params}`);
      return res.data;
    },
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000 // 1 min
  });
}

// ── Détail d'un WO ────────────────────────────────────────────────────────────
export function useWorkOrder(id) {
  return useQuery({
    queryKey: WO_KEYS.detail(id),
    queryFn: async () => {
      const res = await api.get(`/workorders/${id}`);
      return res.data;
    },
    enabled: Boolean(id),
    staleTime: 30 * 1000
  });
}

// ── Stats dashboard WO ────────────────────────────────────────────────────────
export function useWorkOrderStats() {
  return useQuery({
    queryKey: WO_KEYS.stats,
    queryFn: async () => {
      const res = await api.get('/workorders/stats');
      return res.data;
    },
    staleTime: 2 * 60 * 1000
  });
}

// ── Templates WO ──────────────────────────────────────────────────────────────
export function useWOTemplates(type) {
  return useQuery({
    queryKey: WO_KEYS.templates(type),
    queryFn: async () => {
      const res = await api.get(`/workorders/templates${type ? `?type=${type}` : ''}`);
      return res.data;
    },
    staleTime: 10 * 60 * 1000
  });
}

// ── Création WO (offline-first) ───────────────────────────────────────────────
export function useCreateWorkOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      if (!navigator.onLine) {
        await addToOutbox('CREATE', 'workorders', data);
        throw new Error('OFFLINE');
      }
      const res = await api.post('/workorders', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WO_KEYS.all });
      queryClient.invalidateQueries({ queryKey: WO_KEYS.stats });
      toast.success('Work Order créé');
    },
    onError: (err) => {
      if (err.message === 'OFFLINE') {
        toast('📦 Hors-ligne : WO en file d\'attente locale.', { icon: '📡', duration: 5000 });
      } else {
        toast.error('Erreur création WO');
      }
    }
  });
}

// ── Mise à jour WO ────────────────────────────────────────────────────────────
export function useUpdateWorkOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      if (!navigator.onLine) {
        await addToOutbox('UPDATE', 'workorders', { id, ...data });
        throw new Error('OFFLINE');
      }
      const res = await api.put(`/workorders/${id}`, data);
      return res.data;
    },
    onSuccess: (wo) => {
      queryClient.invalidateQueries({ queryKey: WO_KEYS.all });
      queryClient.invalidateQueries({ queryKey: WO_KEYS.detail(wo.id) });
      queryClient.invalidateQueries({ queryKey: WO_KEYS.stats });
      toast.success('Work Order mis à jour');
    },
    onError: (err) => {
      if (err.message === 'OFFLINE') {
        toast('📦 Hors-ligne : modification en file.', { icon: '📡', duration: 5000 });
      } else {
        toast.error('Erreur mise à jour WO');
      }
    }
  });
}

// ── Clôture terrain ───────────────────────────────────────────────────────────
export function useCloseWorkOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, closureData }) => {
      if (!navigator.onLine) {
        await addToOutbox('CLOSE', 'workorders', { id, ...closureData });
        throw new Error('OFFLINE');
      }
      const res = await api.post(`/workorders/${id}/close`, closureData);
      return res.data;
    },
    onSuccess: (wo) => {
      queryClient.invalidateQueries({ queryKey: WO_KEYS.all });
      queryClient.invalidateQueries({ queryKey: WO_KEYS.detail(wo.id) });
      queryClient.invalidateQueries({ queryKey: WO_KEYS.stats });
      toast.success('✅ Intervention clôturée');
    },
    onError: (err) => {
      if (err.message === 'OFFLINE') {
        toast('📦 Clôture en file locale — sync auto au retour réseau.', { icon: '📡', duration: 6000 });
      } else {
        toast.error('Erreur clôture WO');
      }
    }
  });
}

// ── Ajouter un commentaire ────────────────────────────────────────────────────
export function useAddComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ workOrderId, content }) => {
      const res = await api.post(`/workorders/${workOrderId}/comments`, { content });
      return res.data;
    },
    onSuccess: (_, { workOrderId }) => {
      queryClient.invalidateQueries({ queryKey: WO_KEYS.detail(workOrderId) });
    }
  });
}
