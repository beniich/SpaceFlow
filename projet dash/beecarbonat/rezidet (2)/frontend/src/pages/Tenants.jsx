import { useEffect, useState } from 'react';
import api from '../services/api';
import { Building, Shield, Globe, Users, Plus, CheckCircle, Package } from 'lucide-react';

export default function Tenants() {
  const [tenants, setTenants] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', slug: '', plan: 'ENTERPRISE' });

  useEffect(() => {
    loadTenants();
  }, []);

  const loadTenants = async () => {
    try {
      const { data } = await api.get('/tenants');
      setTenants(data);
    } catch (err) {
      setTenants([
        { id: '1', name: 'HerboFerme Industries', slug: 'herboferme', plan: 'ENTERPRISE', createdAt: '2026-01-15', _count: { users: 24, buildings: 3, assets: 142 } },
        { id: '2', name: 'Résidence Beniich', slug: 'beniich', plan: 'PRO', createdAt: '2026-03-10', _count: { users: 12, buildings: 1, assets: 45 } }
      ]);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tenants', formData);
      setShowModal(false);
      loadTenants();
    } catch (err) {
      setTenants(prev => [...prev, {
        id: Date.now().toString(),
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
        plan: formData.plan,
        createdAt: new Date().toISOString(),
        _count: { users: 1, buildings: 0, assets: 0 }
      }]);
      setShowModal(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 bg-zinc-950 text-zinc-100 min-h-screen font-sans">
      <div className="pb-4 border-b border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display uppercase tracking-widest text-zinc-50 flex items-center gap-2">
            <Building className="w-7 h-7 text-cyan-400" />
            Gestion Multi-Tenant / Organisations
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">Supervision multi-entités, domaines et quotas d'accès</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-mono text-xs font-bold uppercase transition shadow-sm"
        >
          <Plus className="w-4 h-4" /> Nouvelle Organisation
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs">
        {tenants.map(tenant => (
          <div key={tenant.id} className="bg-zinc-900 border border-zinc-800 p-6 flex flex-col justify-between space-y-4 hover:border-zinc-700 transition">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-zinc-950 border border-zinc-700 flex items-center justify-center font-bold text-cyan-400 text-lg">
                  {tenant.name[0]}
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 uppercase border ${
                  tenant.plan === 'ENTERPRISE' ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40' : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                }`}>
                  {tenant.plan}
                </span>
              </div>

              <h3 className="font-bold text-zinc-100 text-base font-sans mb-1">{tenant.name}</h3>
              <p className="text-[11px] text-zinc-400 font-mono mb-4">slug: {tenant.slug}</p>

              <div className="grid grid-cols-3 gap-2 py-3 border-y border-zinc-800 text-center mb-2">
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase">Utilisateurs</p>
                  <p className="font-bold text-zinc-100 text-sm mt-0.5">{tenant._count?.users || 0}</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase">Bâtiments</p>
                  <p className="font-bold text-zinc-100 text-sm mt-0.5">{tenant._count?.buildings || 0}</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase">Actifs</p>
                  <p className="font-bold text-zinc-100 text-sm mt-0.5">{tenant._count?.assets || 0}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-2 border-t border-zinc-800/60">
              <span className="flex items-center gap-1 font-mono">
                <Globe className="w-3.5 h-3.5 text-cyan-400" /> {tenant.slug}.cafm.com
              </span>
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <CheckCircle className="w-3.5 h-3.5" /> Actif
              </span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleCreate} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-md shadow-2xl font-mono text-xs">
            <h3 className="font-bold font-display text-sm text-zinc-50 uppercase tracking-widest mb-4 pb-2 border-b border-zinc-800">
              Créer une nouvelle organisation Tenant
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-zinc-400 mb-1">Nom de l'organisation</label>
                <input
                  required
                  type="text"
                  placeholder="ex: Acme Corp"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-700 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-cyan-500 font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Slug URL</label>
                <input
                  type="text"
                  placeholder="ex: acme-corp"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-700 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-cyan-500 font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Plan</label>
                <select
                  value={formData.plan}
                  onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-cyan-500 font-mono text-xs"
                >
                  <option value="PRO">PRO</option>
                  <option value="ENTERPRISE">ENTERPRISE</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-6 pt-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-zinc-400 hover:text-zinc-100 uppercase transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold uppercase transition"
              >
                Créer l'organisation
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
