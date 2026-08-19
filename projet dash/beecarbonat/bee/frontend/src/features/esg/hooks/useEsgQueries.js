import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../services/api';
import toast from 'react-hot-toast';

export function useEsgSummary(year) {
  return useQuery({
    queryKey: ['esg', 'summary', year],
    queryFn: async () => {
      const { data } = await api.get('/energy/summary', { params: { year } });
      return data;
    }
  });
}

export function useEsgReadings(from, to) {
  return useQuery({
    queryKey: ['esg', 'readings', from, to],
    queryFn: async () => {
      const { data } = await api.get('/energy/readings', { params: { from, to } });
      return data;
    }
  });
}

export function useSeedEsg() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/energy/seed');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['esg'] });
      toast.success('Données ESG générées avec succès !');
    },
    onError: (error) => {
      toast.error('Erreur lors de la génération des données ESG : ' + error.message);
    }
  });
}
