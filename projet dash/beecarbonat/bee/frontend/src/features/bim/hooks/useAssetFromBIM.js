/**
 * Hook unifié : récupère les métadonnées d'un asset à partir de son GUID IFC.
 * Suit le pattern TanStack Query pour le cache + invalidation.
 * Utilisé dans la vue 2D/3D couplée (clic plan → données asset).
 */
import { useQuery } from '@tanstack/react-query';
import api from '../../../services/api';

/**
 * @param {string|null} ifcGuid - GUID IFC de l'élément sélectionné
 */
export function useAssetFromBIM(ifcGuid) {
  return useQuery({
    queryKey: ['asset-from-bim', ifcGuid],
    queryFn: async () => {
      if (!ifcGuid) return null;
      const res = await api.get(`/assets/by-ifc-guid/${ifcGuid}`);
      return res.data;
    },
    enabled: Boolean(ifcGuid),
    staleTime: 5 * 60 * 1000, // 5 min
    placeholderData: null
  });
}
