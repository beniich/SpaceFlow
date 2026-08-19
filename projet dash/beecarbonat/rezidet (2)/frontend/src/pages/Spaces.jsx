import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { MapPin, Building2, Eye, Plus } from 'lucide-react';
import FloorPlanViewer from '../components/bim/FloorPlanViewer';
import toast from 'react-hot-toast';

export default function Spaces() {
  const queryClient = useQueryClient();
  const [selectedBuildingId, setSelectedBuildingId] = useState(null);
  const [selectedFloorId, setSelectedFloorId] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // Récupérer les bâtiments
  const { data: buildings = [] } = useQuery({
    queryKey: ['buildings'],
    queryFn: async () => {
      const res = await api.get('/buildings');
      const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      if (list.length > 0 && !selectedBuildingId) setSelectedBuildingId(list[0].id);
      return list;
    }
  });

  // Récupérer la hiérarchie du bâtiment sélectionné (Étages -> Assets)
  const { data: hierarchy, isLoading } = useQuery({
    queryKey: ['assets', 'hierarchy', selectedBuildingId],
    queryFn: async () => {
      const res = await api.get(`/assets/hierarchy/${selectedBuildingId}`);
      const data = res.data;
      if (data.floors?.length > 0 && !selectedFloorId) {
        setSelectedFloorId(data.floors[0].id);
      }
      return data;
    },
    enabled: !!selectedBuildingId
  });

  // Récupérer les détails de l'étage sélectionné (pour le plan)
  const { data: floorDetails } = useQuery({
    queryKey: ['floors', selectedFloorId],
    queryFn: async () => {
      const res = await api.get(`/floors/${selectedFloorId}`);
      return res.data;
    },
    enabled: !!selectedFloorId
  });

  // Mutation pour uploader le plan 2D
  const uploadPlanMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('plan', file);
      formData.append('buildingId', selectedBuildingId);
      formData.append('floorId', selectedFloorId);
      const res = await api.post('/workorders/plans/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success('Plan 2D uploadé avec succès');
      queryClient.invalidateQueries({ queryKey: ['floors', selectedFloorId] });
    },
    onError: () => toast.error('Erreur lors de l\'upload du plan')
  });

  const handleUploadPlan = (e) => {
    const file = e.target.files[0];
    if (file) uploadPlanMutation.mutate(file);
  };

  const handleAddAnnotation = (ann) => {
    // Dans un vrai use-case, on envoie à l'API
    toast.success(`Annotation ajoutée : ${ann.label}`);
    setEditMode(false);
  };

  // Préparer les annotations à partir des assets de l'étage
  const annotations = [];
  if (floorDetails?.assets) {
    floorDetails.assets.forEach(asset => {
      if (asset.posX && asset.posY) {
        annotations.push({
          id: asset.id,
          x: asset.posX,
          y: asset.posY,
          type: asset.status === 'BREAKDOWN' ? 'alert' : 'asset',
          label: asset.name,
          ifcGuid: asset.ifcGuid
        });
      }
    });
  }

  const selectedBuilding = buildings.find(b => b.id === selectedBuildingId);
  const floors = hierarchy?.floors || [];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 bg-zinc-950 text-zinc-100 min-h-screen font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold font-display uppercase tracking-widest text-zinc-50 flex items-center gap-2">
            <MapPin className="w-7 h-7 text-brand-orange" />
            Plans 2D & Annotations
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">Gérez les plans d'étages et positionnez les équipements</p>
        </div>
        
        <div className="flex gap-2">
          <select
            value={selectedBuildingId || ''}
            onChange={e => setSelectedBuildingId(e.target.value)}
            className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 font-mono text-xs focus:outline-none focus:border-brand-orange"
          >
            {buildings.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>

          <button
            onClick={() => setEditMode(!editMode)}
            className={`px-3 py-2 border rounded-lg text-xs font-mono flex items-center gap-2 transition-colors ${
              editMode 
                ? 'bg-brand-orange text-white border-brand-orange'
                : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            {editMode ? <Eye className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {editMode ? 'Mode Visualisation' : 'Mode Édition'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar: Liste des étages */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
            <h3 className="font-sans font-semibold text-sm mb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-zinc-500" />
              Étages
            </h3>
            {isLoading ? (
              <div className="text-xs font-mono text-zinc-500 animate-pulse">Chargement...</div>
            ) : floors.length === 0 ? (
              <div className="text-xs font-mono text-zinc-500">Aucun étage trouvé.</div>
            ) : (
              <div className="space-y-1">
                {floors.map(floor => (
                  <button
                    key={floor.id}
                    onClick={() => setSelectedFloorId(floor.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-mono transition-colors ${
                      selectedFloorId === floor.id
                        ? 'bg-brand-orange/10 border border-brand-orange/30 text-brand-orange'
                        : 'text-zinc-400 hover:bg-zinc-800'
                    }`}
                  >
                    Niveau {floor.level} - {floor.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Contenu principal : Plan 2D */}
        <div className="lg:col-span-3">
          <div className="p-1 bg-zinc-900 border border-zinc-800 rounded-2xl">
            {!floorDetails?.floorPlanUrl && editMode ? (
              <div className="flex items-center justify-center min-h-[400px] border border-dashed border-zinc-700 rounded-xl bg-zinc-950/50">
                <label className="flex flex-col items-center gap-3 cursor-pointer group">
                  <div className="p-4 bg-zinc-900 rounded-full group-hover:bg-brand-orange/10 transition-colors">
                    <MapPin className="w-8 h-8 text-zinc-500 group-hover:text-brand-orange" />
                  </div>
                  <span className="text-sm font-mono text-zinc-400 group-hover:text-zinc-200">
                    Importer le plan 2D (PDF/IMG)
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.svg"
                    className="hidden"
                    onChange={handleUploadPlan}
                    disabled={uploadPlanMutation.isPending}
                  />
                </label>
              </div>
            ) : (
              <FloorPlanViewer
                planUrl={floorDetails?.floorPlanUrl}
                annotations={annotations}
                editMode={editMode}
                onAddAnnotation={handleAddAnnotation}
                className="w-full"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
