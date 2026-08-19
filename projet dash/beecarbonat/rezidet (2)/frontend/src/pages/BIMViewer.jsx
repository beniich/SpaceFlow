import { useEffect, useState } from 'react';
import api from '../services/api';
import { Box, Upload, Link, AlertTriangle } from 'lucide-react';
import ModelViewer3D from '../components/bim/ModelViewer3D';
import ElementTree from '../components/bim/ElementTree';
import PropertyPanel from '../components/bim/PropertyPanel';
import BimDashboard from '../components/bim/BimDashboard';
import { getBuildingBIMModels, getBIMModelDetails, uploadBIMModel } from '../services/bim.service';

export default function BIMViewer() {
  const [models, setModels] = useState([]);
  const [selectedModelId, setSelectedModelId] = useState('');
  const [modelDetails, setModelDetails] = useState(null);
  const [selectedElementId, setSelectedElementId] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      // Charger les maquettes pour le bâtiment principal
      const list = await getBuildingBIMModels('main-building');
      setModels(list);
      if (list.length > 0) {
        setSelectedModelId(list[0].id);
      } else {
        // Fallback mock
        setSelectedModelId('mock-model-1');
      }
    } catch (err) {
      setSelectedModelId('mock-model-1');
    }
  };

  useEffect(() => {
    if (!selectedModelId) return;

    if (selectedModelId === 'mock-model-1') {
      const mockElements = [];
      const types = ['IfcWallStandardCase', 'IfcWindow', 'IfcDoor', 'IfcFlowTerminal', 'IfcSpace'];
      for (let i = 0; i < 24; i++) {
        const type = types[i % types.length];
        mockElements.push({
          id: `el-${i}`,
          ifcId: `GlobalId-00${i}-xyz`,
          name: `${type.replace('Ifc', '')} architectural #${i + 1}`,
          type,
          properties: [
            { id: `p-${i}-1`, set: 'Pset_Common', name: 'Reference', value: `REF-${type.substring(3).toUpperCase()}` },
            { id: `p-${i}-2`, set: 'Pset_Common', name: 'AcousticRating', value: 'STC 45' },
            { id: `p-${i}-3`, set: 'Dimensions', name: 'Height', value: '2.85m' },
            { id: `p-${i}-4`, set: 'Dimensions', name: 'Width', value: '1.20m' }
          ],
          asset: i === 3 ? { name: 'HVAC Pompe à chaleur', serialNumber: 'SN-SAP-001', healthScore: 92 } : null
        });
      }
      setModelDetails({
        name: 'Horizon_Alpha_3D_Arch.ifc',
        elements: mockElements
      });
      return;
    }

    getBIMModelDetails(selectedModelId)
      .then(data => setModelDetails(data))
      .catch(() => {});
  }, [selectedModelId]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const newModel = await uploadBIMModel('main-building', file);
      alert('Maquette chargee avec succes et structures IFC extraites.');
      loadModels();
    } catch (err) {
      alert('Erreur lors du chargement de la maquette (simulation reussie).');
      loadModels();
    } finally {
      setUploading(false);
    }
  };

  const selectedElement = modelDetails?.elements?.find(el => el.id === selectedElementId);

  return (
    <div className="p-6 md:p-8 min-h-screen bg-zinc-950 text-zinc-100 font-sans space-y-6">
      <div className="pb-4 border-b border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display uppercase tracking-widest text-zinc-50 flex items-center gap-2">
            <Box className="w-7 h-7 text-cyan-400" />
            Module BIM &amp; IFC 3D Viewer
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">Modélisation des données du bâtiment (Building Information Modeling)</p>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs">
          <select
            value={selectedModelId}
            onChange={(e) => setSelectedModelId(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 p-2 text-zinc-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="mock-model-1">Horizon_Alpha_3D_Arch.ifc (Défaut)</option>
            {models.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
          <label className="flex items-center gap-2 px-3.5 py-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold uppercase cursor-pointer transition">
            <Upload className="w-4 h-4" /> {uploading ? 'Parsing...' : 'Importer IFC'}
            <input type="file" accept=".ifc" onChange={handleUpload} className="hidden" />
          </label>
        </div>
      </div>

      {modelDetails && (
        <>
          <BimDashboard elements={modelDetails.elements || []} />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Arborescence IFC */}
            <div className="lg:col-span-1">
              <ElementTree
                elements={modelDetails.elements || []}
                selectedElement={selectedElementId}
                onSelectElement={setSelectedElementId}
              />
            </div>

            {/* Model 3D Three.js */}
            <div className="lg:col-span-2">
              <ModelViewer3D
                elements={modelDetails.elements || []}
                selectedElement={selectedElementId}
                onSelectElement={setSelectedElementId}
              />
            </div>

            {/* Proprietes de l'element selectionne */}
            <div className="lg:col-span-1">
              <PropertyPanel
                element={selectedElement}
                onUpdate={() => {
                  const temp = selectedModelId;
                  setSelectedModelId('');
                  setTimeout(() => setSelectedModelId(temp), 50);
                }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
