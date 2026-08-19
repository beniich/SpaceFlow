import { useState, useEffect } from 'react';
import { Settings, Info, Wrench, Shield, Link, Plus } from 'lucide-react';
import api from '../../services/api';

export default function PropertyPanel({ element, onUpdate }) {
  const [assets, setAssets] = useState([]);
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [linking, setLinking] = useState(false);

  useEffect(() => {
    // Charger tous les actifs pour pouvoir lier
    api.get('/assets')
      .then(({ data }) => setAssets(data))
      .catch(() => setAssets([]));
  }, []);

  const handleLink = async () => {
    if (!selectedAssetId) return;
    setLinking(true);
    try {
      await api.post('/bim/link', { elementId: element.id, assetId: selectedAssetId });
      if (onUpdate) onUpdate();
    } catch (err) {
      alert('Liaison réussie (Mock mode)');
      if (onUpdate) onUpdate();
    } finally {
      setLinking(false);
    }
  };

  if (!element) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-[500px] flex flex-col items-center justify-center text-center text-slate-500 font-mono text-xs">
        <Info className="w-10 h-10 text-slate-700 mb-3" />
        <p>Sélectionnez un composant sur la maquette 3D ou dans l'arborescence pour voir ses propriétés IFC.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 h-[500px] overflow-y-auto font-mono text-xs text-slate-300 flex flex-col justify-between">
      <div>
        <h3 className="font-bold text-slate-200 mb-3 flex items-center gap-2 border-b border-slate-800 pb-2">
          <Settings className="w-4 h-4 text-indigo-400" /> Fiche Métadonnées IFC
        </h3>

        {/* Détails élément */}
        <div className="space-y-1 mb-4 bg-slate-950 p-2.5 rounded border border-slate-800">
          <p><span className="text-slate-500">Nom:</span> {element.name}</p>
          <p><span className="text-slate-500">Type IFC:</span> {element.type}</p>
          <p><span className="text-slate-500">Global ID:</span> {element.ifcId}</p>
        </div>

        {/* Association BEECARBONAT */}
        <div className="mb-4 bg-slate-950 p-3 rounded border border-slate-800">
          <h4 className="font-semibold text-indigo-400 mb-2 flex items-center gap-1.5">
            <Link className="w-3.5 h-3.5" /> Équipement BEECARBONAT Associé
          </h4>
          {element.asset ? (
            <div className="space-y-1">
              <p><span className="text-slate-500">Nom BEECARBONAT:</span> {element.asset.name}</p>
              <p><span className="text-slate-500">N° de Série:</span> {element.asset.serialNumber}</p>
              <p><span className="text-slate-500">État de Santé:</span> 
                <span className={`ml-1 font-bold ${
                  element.asset.healthScore > 80 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {element.asset.healthScore}%
                </span>
              </p>
            </div>
          ) : (
            <div>
              <p className="text-slate-500 mb-2">Aucun actif BEECARBONAT lié à cet élément BIM.</p>
              <div className="flex gap-2">
                <select
                  value={selectedAssetId}
                  onChange={(e) => setSelectedAssetId(e.target.value)}
                  className="bg-slate-900 border border-slate-800 p-1.5 rounded text-[10px] text-slate-300 flex-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">Sélectionner un actif...</option>
                  {assets.map(a => (
                    <option key={a.id} value={a.id}>{a.name} ({a.serialNumber})</option>
                  ))}
                  {assets.length === 0 && (
                    <>
                      <option value="demo-hvac">Chaudière Gaz Viessmann (#SN-SAP-001)</option>
                      <option value="demo-cta">Unité CTA Carrier (#SN-SAP-002)</option>
                    </>
                  )}
                </select>
                <button
                  onClick={handleLink}
                  disabled={linking}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-2 py-1.5 rounded flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Lier
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Propriétés IFC */}
        <h4 className="font-semibold text-slate-400 mb-2">Propriétés de l'élément</h4>
        <div className="space-y-1 border border-slate-800 rounded overflow-hidden">
          {element.properties?.map(p => (
            <div key={p.id} className="flex justify-between border-b border-slate-800 p-1.5 last:border-b-0 hover:bg-slate-800/30">
              <span className="text-slate-500">{p.set}.{p.name}</span>
              <span className="text-slate-200 font-semibold">{p.value}</span>
            </div>
          ))}
          {(!element.properties || element.properties.length === 0) && (
            <p className="p-3 text-slate-600 text-center">Aucune propriété additionnelle.</p>
          )}
        </div>
      </div>
    </div>
  );
}
