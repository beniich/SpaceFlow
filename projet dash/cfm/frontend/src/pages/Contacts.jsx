import { useEffect, useState } from 'react';
import api from '../services/api';
import {
  Plus, Search, Download, Filter,
  Building, Edit, Trash2, Upload
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';

const TYPE_LABELS = {
  LEAD: 'Lead', PROSPECT: 'Prospect', CUSTOMER: 'Client', PARTNER: 'Partenaire', VENDOR: 'Fournisseur'
};
const TYPE_COLORS = {
  LEAD: 'bg-yellow-100 text-yellow-700',
  PROSPECT: 'bg-blue-100 text-blue-700',
  CUSTOMER: 'bg-green-100 text-green-700',
  PARTNER: 'bg-purple-100 text-purple-700',
  VENDOR: 'bg-slate-100 text-slate-700'
};

export default function Contacts() {
  const [data, setData] = useState({ contacts: [], pagination: {}, stats: {} });
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadContacts();
  }, [search, typeFilter, page]);

  const loadContacts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/contacts', {
        params: { search, type: typeFilter, page, limit: 25 }
      });
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce contact ?')) return;
    try {
      await api.delete(`/contacts/${id}`);
      toast.success('Contact supprimé');
      loadContacts();
    } catch (err) {
      toast.error('Erreur');
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.get('/contacts/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `contacts-${Date.now()}.csv`;
      link.click();
      toast.success('Export téléchargé');
    } catch (error) {
      toast.error('Erreur lors de l\'export');
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Contacts</h1>
          <p className="text-slate-500">
            {data.pagination?.total || 0} contacts • 
            {data.stats?.byType?.CUSTOMER || 0} clients
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExport} className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-slate-50">
            <Download className="w-4 h-4" /> Exporter
          </button>
          <button className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-slate-50 text-slate-400 cursor-not-allowed">
            <Upload className="w-4 h-4" /> Importer
          </button>
          <button
            onClick={() => { setEditingContact(null); setShowModal(true); }}
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
          >
            <Plus className="w-4 h-4" /> Nouveau contact
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border p-4 mb-4 flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            placeholder="Rechercher par nom, email, entreprise..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-3 py-2 border rounded-lg"
          />
        </div>
        <select
          value={typeFilter}
          onChange={e => { setTypeFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="">Tous les types</option>
          {Object.entries(TYPE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {/* Type stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
        {Object.entries(TYPE_LABELS).map(([type, label]) => (
          <div
            key={type}
            onClick={() => setTypeFilter(typeFilter === type ? '' : type)}
            className={`p-3 rounded-lg border-2 cursor-pointer transition ${
              typeFilter === type ? 'border-primary-500 bg-primary-50' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <p className="text-xs text-slate-500">{label}</p>
            <p className="text-xl font-bold">{data.stats?.byType?.[type] || 0}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b">
            <tr className="text-left text-xs font-medium text-slate-500 uppercase">
              <th className="px-6 py-3">Contact</th>
              <th className="px-6 py-3">Entreprise</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Deals</th>
              <th className="px-6 py-3">Propriétaire</th>
              <th className="px-6 py-3">Créé</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr><td colSpan="7" className="text-center py-8">Chargement...</td></tr>
            ) : data.contacts.length === 0 ? (
              <tr><td colSpan="7" className="text-center py-12 text-slate-400">
                Aucun contact. Créez-en un pour commencer.
              </td></tr>
            ) : data.contacts.map(c => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center text-sm font-semibold text-primary-700">
                      {c.firstName?.[0]}{c.lastName?.[0]}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{c.firstName} {c.lastName}</p>
                      <p className="text-xs text-slate-500">{c.email || '-'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  {c.company && <div className="flex items-center gap-1"><Building className="w-3 h-3" />{c.company}</div>}
                  {c.jobTitle && <p className="text-xs text-slate-500">{c.jobTitle}</p>}
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${TYPE_COLORS[c.type]}`}>
                    {TYPE_LABELS[c.type]}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">{c._count?.deals || 0}</td>
                <td className="px-6 py-4 text-sm">{c.owner?.firstName}</td>
                <td className="px-6 py-4 text-xs text-slate-500">
                  {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true, locale: fr })}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-1">
                    <button onClick={() => { setEditingContact(c); setShowModal(true); }} className="p-1 hover:bg-slate-100 rounded">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(c.id)} className="p-1 hover:bg-red-50 text-red-600 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {data.pagination?.pages > 1 && (
          <div className="p-4 border-t flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Page {data.pagination.page} sur {data.pagination.pages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >← Précédent</button>
              <button
                onClick={() => setPage(p => Math.min(data.pagination.pages, p + 1))}
                disabled={page >= data.pagination.pages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >Suivant →</button>
            </div>
          </div>
        )}
      </div>

      {showModal && <ContactModal contact={editingContact} onClose={() => setShowModal(false)} onSuccess={loadContacts} />}
    </div>
  );
}

function ContactModal({ contact, onClose, onSuccess }) {
  const [form, setForm] = useState(contact || {
    firstName: '', lastName: '', email: '', phone: '',
    company: '', jobTitle: '', type: 'LEAD', source: 'website',
    city: '', country: 'France'
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (contact) {
        await api.put(`/contacts/${contact.id}`, form);
        toast.success('Contact mis à jour');
      } else {
        await api.post('/contacts', form);
        toast.success('Contact créé');
      }
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">{contact ? 'Modifier' : 'Nouveau'} contact</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <input required placeholder="Prénom *" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} className="px-3 py-2 border rounded" />
              <input required placeholder="Nom *" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} className="px-3 py-2 border rounded" />
            </div>
            <input type="email" placeholder="Email" value={form.email || ''} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-3 py-2 border rounded" />
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Téléphone" value={form.phone || ''} onChange={e => setForm({...form, phone: e.target.value})} className="px-3 py-2 border rounded" />
              <input placeholder="Entreprise" value={form.company || ''} onChange={e => setForm({...form, company: e.target.value})} className="px-3 py-2 border rounded" />
            </div>
            <input placeholder="Poste" value={form.jobTitle || ''} onChange={e => setForm({...form, jobTitle: e.target.value})} className="w-full px-3 py-2 border rounded" />
            <div className="grid grid-cols-2 gap-3">
              <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="px-3 py-2 border rounded">
                {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <select value={form.source} onChange={e => setForm({...form, source: e.target.value})} className="px-3 py-2 border rounded">
                {['website', 'referral', 'cold_call', 'event', 'linkedin', 'other'].map(s => 
                  <option key={s} value={s}>{s}</option>
                )}
              </select>
            </div>
          </div>
          <div className="p-6 border-t flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 hover:bg-slate-100 rounded-lg">Annuler</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-primary-600 text-white rounded-lg disabled:opacity-50">
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
