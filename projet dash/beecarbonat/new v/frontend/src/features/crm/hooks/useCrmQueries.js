import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../services/api';
import toast from 'react-hot-toast';

export const CRM_KEYS = {
  deals: ['crm', 'deals'],
  pipeline: ['crm', 'pipeline'],
  contacts: ['crm', 'contacts'],
  analytics: ['crm', 'analytics'],
  funnel: ['crm', 'funnel']
};

// ── DEALS & PIPELINE ──────────────────────────────────────────────────────

export function usePipeline() {
  return useQuery({
    queryKey: CRM_KEYS.pipeline,
    queryFn: async () => {
      const res = await api.get('/crm/deals/pipeline');
      return res.data;
    }
  });
}

export function useUpdateDealStage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, stage }) => {
      const res = await api.put(`/crm/deals/${id}/stage`, { stage });
      return res.data;
    },
    onMutate: async ({ id, stage }) => {
      // Optimistic Update
      await queryClient.cancelQueries({ queryKey: CRM_KEYS.pipeline });
      const previous = queryClient.getQueryData(CRM_KEYS.pipeline);

      queryClient.setQueryData(CRM_KEYS.pipeline, (old) => {
        if (!old) return old;
        const newPipeline = old.pipeline.map(col => ({ ...col, deals: [...col.deals] }));
        
        let dealToMove = null;
        // Retirer de l'ancienne colonne
        for (const col of newPipeline) {
          const idx = col.deals.findIndex(d => d.id === id);
          if (idx !== -1) {
            dealToMove = col.deals[idx];
            col.deals.splice(idx, 1);
            col.total -= dealToMove.amount;
            break;
          }
        }
        
        // Ajouter à la nouvelle colonne
        if (dealToMove) {
          dealToMove.status = stage;
          const targetCol = newPipeline.find(col => col.stage === stage);
          if (targetCol) {
            targetCol.deals.push(dealToMove);
            targetCol.total += dealToMove.amount;
          }
        }
        
        return { ...old, pipeline: newPipeline };
      });

      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(CRM_KEYS.pipeline, context.previous);
      }
      toast.error('Erreur lors du déplacement de l\'opportunité');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CRM_KEYS.pipeline });
      queryClient.invalidateQueries({ queryKey: CRM_KEYS.analytics });
      queryClient.invalidateQueries({ queryKey: CRM_KEYS.funnel });
    }
  });
}

export function useCreateDeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const res = await api.post('/crm/deals', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CRM_KEYS.pipeline });
      queryClient.invalidateQueries({ queryKey: CRM_KEYS.deals });
      toast.success('Opportunité créée');
    }
  });
}

// ── CONTACTS & LEADS ──────────────────────────────────────────────────────

export function useContacts(params = {}) {
  return useQuery({
    queryKey: [...CRM_KEYS.contacts, params],
    queryFn: async () => {
      const searchParams = new URLSearchParams(
        Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ''))
      );
      const res = await api.get(`/crm/contacts?${searchParams}`);
      return res.data;
    }
  });
}

export function useCreateContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const res = await api.post('/crm/contacts', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CRM_KEYS.contacts });
      toast.success('Contact/Lead ajouté');
    }
  });
}

// ── ANALYTICS ─────────────────────────────────────────────────────────────

export function useCrmAnalytics() {
  return useQuery({
    queryKey: CRM_KEYS.analytics,
    queryFn: async () => {
      const res = await api.get('/crm/analytics/kpis');
      return res.data;
    }
  });
}

export function useCrmFunnel() {
  return useQuery({
    queryKey: CRM_KEYS.funnel,
    queryFn: async () => {
      const res = await api.get('/crm/analytics/funnel');
      return res.data;
    }
  });
}
