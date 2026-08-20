import React, { useState, useEffect } from 'react';
import AssetQRScanner from '../components/qr/AssetQRScanner';
import AssetQRTagModal from '../components/qr/AssetQRTagModal';
import { Package, QrCode, Tag, Sparkles, CheckCircle2, ArrowLeft, Layers, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function AssetScanner() {
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [assetList, setAssetList] = useState([]);
  const [tagModalAsset, setTagModalAsset] = useState(null);

  useEffect(() => {
    loadSampleAssets();
  }, []);

  const loadSampleAssets = async () => {
    try {
      const { data } = await api.get('/assets');
      const list = Array.isArray(data) ? data : (data?.data || []);
      setAssetList(list.slice(0, 10));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Breadcrumb & Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
            <Link to="/assets" className="hover:underline flex items-center gap-1 text-zinc-400 hover:text-zinc-200">
              <ArrowLeft className="w-3 h-3" /> Gestion des Actifs
            </Link>
            <span>/</span>
            <span>Scan &amp; Identification Rapide</span>
          </div>
          <h1 className="text-2xl font-bold font-display uppercase tracking-widest text-zinc-50 flex items-center gap-3">
            Scanner QR &amp; Maintenance Rapide
          </h1>
          <p className="text-sm font-mono text-zinc-400 mt-1">
            Scannez le tag QR de n'importe quel équipement sur site pour inspecter sa télémétrie et mettre à jour son statut instantanément.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/assets"
            className="px-3 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 text-xs font-mono uppercase tracking-wider"
          >
            Liste des Actifs
          </Link>
        </div>
      </div>

      {/* Main Scanner Component */}
      <AssetQRScanner
        onAssetSelected={(asset) => setSelectedAsset(asset)}
      />

      {/* Printable Tag Catalog Section */}
      <div className="bg-surface border border-zinc-800 p-6">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-4">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-amber-400" />
            <h3 className="font-display font-bold uppercase tracking-widest text-zinc-100 text-sm md:text-base">
              Générateur d'Étiquettes QR d'Équipements
            </h3>
          </div>
          <span className="text-xs font-mono text-zinc-500">
            {assetList.length} équipements chargés
          </span>
        </div>

        <p className="text-xs font-mono text-zinc-400 mb-4">
          Besoin d'étiqueter vos installations physiques ? Cliquez sur n'importe quel actif ci-dessous pour générer, télécharger ou imprimer son étiquette code-barres &amp; QR industrielle.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {assetList.map((asset) => (
            <div
              key={asset.id}
              className="p-3 bg-zinc-950 border border-zinc-800/90 hover:border-zinc-700 transition flex items-center justify-between"
            >
              <div className="overflow-hidden pr-2">
                <p className="text-xs font-mono font-bold text-zinc-200 truncate">{asset.name}</p>
                <p className="text-[10px] font-mono text-zinc-500 truncate">
                  {asset.category} • SN: {asset.serialNumber}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setTagModalAsset(asset)}
                className="p-2 bg-zinc-900 hover:bg-cyan-950/40 border border-zinc-800 hover:border-cyan-500/50 text-cyan-400 transition shrink-0"
                title="Générer &amp; Imprimer Étiquette QR"
              >
                <QrCode className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Asset QR Tag Modal */}
      <AssetQRTagModal
        open={Boolean(tagModalAsset)}
        asset={tagModalAsset}
        onClose={() => setTagModalAsset(null)}
      />
    </div>
  );
}
