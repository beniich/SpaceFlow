import { useEffect, useState } from 'react';
import api from '../services/api';
import { Search, Plus, Package } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const statusColors = {
  OPERATIONAL: 'bg-green-100 text-green-700',
  MAINTENANCE: 'bg-orange-100 text-orange-700',
  BREAKDOWN: 'bg-red-100 text-red-700',
  RETIRED: 'bg-slate-100 text-slate-700'
};

const statusLabels = {
  OPERATIONAL: 'Opérationnel',
  MAINTENANCE: 'En maintenance',
  BREAKDOWN: 'En panne',
  RETIRED: 'Retiré'
};

export default function Assets() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    api.get('/assets', { params: { search, status: statusFilter } })
      .then(({ data }) => setAssets(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, statusFilter]);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestion des actifs</h1>
          <p className="text-slate-500">{assets.length} actifs enregistrés</p>
        </div>
        <button className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
          <Plus className="w-4 h-4" /> Nouvel actif
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr className="text-left text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-3 font-medium">Actif</th>
              <th className="px-6 py-3 font-medium">Catégorie</th>
              <th className="px-6 py-3 font-medium">Santé</th>
              <th className="px-6 py-3 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? <tr><td colSpan="4" className="p-6 text-center">Chargement...</td></tr> : assets.map(asset => (
              <tr key={asset.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 flex items-center gap-3">
                  <Package className="w-5 h-5 text-primary-500" />
                  <div>
                    <div className="font-medium">{asset.name}</div>
                    <div className="text-xs text-slate-500">{asset.serialNumber}</div>
                  </div>
                </td>
                <td className="px-6 py-4">{asset.category}</td>
                <td className="px-6 py-4">{asset.healthScore}%</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[asset.status]}`}>
                    {statusLabels[asset.status] || asset.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
