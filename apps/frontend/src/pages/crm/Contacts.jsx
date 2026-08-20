import React, { useState, useEffect } from 'react';
import crmApi from '../../services/crmApi';
import { 
  Users, Search, Plus, Filter, Download, Upload,
  MoreVertical, Edit2, Trash2, Mail, Phone, Building2 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function CRMContacts() {
  const [data, setData] = useState({
    contacts: [],
    pagination: { total: 0, page: 1, pages: 1 },
    stats: { total: 0, byType: {} }
  });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', type: '', status: '', page: 1 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const fileInputRef = React.useRef(null);
  
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', company: '', jobTitle: '', type: 'LEAD', status: 'ACTIVE'
  });

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await crmApi.get(`/contacts?${query}`);
      setData(res.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [filters]);

  const handleExport = async () => {
    try {
      const res = await crmApi.get('/contacts/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `contacts-${format(new Date(), 'yyyy-MM-dd')}.csv`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      toast.error("Erreur lors de l'export");
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const text = ev.target.result;
        // Basic CSV parsing
        const lines = text.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim());
        const contacts = lines.slice(1).map(line => {
          const values = line.split(',');
          let obj = {};
          headers.forEach((h, i) => { obj[h] = values[i]?.trim(); });
          return obj;
        }).filter(c => c.firstName || c.lastName); // basic validation

        if (contacts.length === 0) {
          toast.error("Aucun contact valide trouve dans le fichier.");
          return;
        }

        await crmApi.post('/contacts/import', { contacts });
        toast.success(`${contacts.length} contacts importes avec succes`);
        fetchContacts();
      } catch (error) {
        toast.error(error.response?.data?.error || "Erreur lors de l'import");
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingContact) {
        await crmApi.put(`/contacts/${editingContact.id}`, formData);
        toast.success('Contact mis a jour');
      } else {
        await crmApi.post('/contacts', formData);
        toast.success('Contact cree');
      }
      setIsModalOpen(false);
      setEditingContact(null);
      setFormData({ firstName: '', lastName: '', email: '', phone: '', company: '', jobTitle: '', type: 'LEAD', status: 'ACTIVE' });
      fetchContacts();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erreur lors de la sauvegarde');
    }
  };

  const openEdit = (contact) => {
    setEditingContact(contact);
    setFormData({
      firstName: contact.firstName || '',
      lastName: contact.lastName || '',
      email: contact.email || '',
      phone: contact.phone || '',
      company: contact.company || '',
      jobTitle: contact.jobTitle || '',
      type: contact.type || 'LEAD',
      status: contact.status || 'ACTIVE'
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce contact ?')) return;
    try {
      await crmApi.delete(`/contacts/${id}`);
      toast.success('Contact supprime');
      fetchContacts();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      LEAD: 'bg-zinc-800 text-zinc-300 border border-zinc-700',
      PROSPECT: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
      CUSTOMER: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      PARTNER: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
      VENDOR: 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
    };
    return colors[type] || colors.LEAD;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 relative z-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center tracking-tight">
            <Users className="mr-3 text-indigo-400" />
            Gestion des Contacts
          </h1>
          <p className="text-zinc-400 text-sm mt-1">Gerez vos prospects, clients et partenaires en toute simplicite.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <input 
            type="file" 
            accept=".csv" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleImport} 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center px-4 py-2 bg-[#18181b]/80 border border-zinc-700 text-zinc-300 rounded-lg font-medium hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <Upload size={18} className="mr-2" />
            Importer
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center px-4 py-2 bg-[#18181b]/80 border border-zinc-700 text-zinc-300 rounded-lg font-medium hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <Download size={18} className="mr-2" />
            Exporter
          </button>
          <button 
            onClick={() => {
              setEditingContact(null);
              setFormData({ firstName: '', lastName: '', email: '', phone: '', company: '', jobTitle: '', type: 'LEAD', status: 'ACTIVE' });
              setIsModalOpen(true);
            }}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-500 transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)]"
          >
            <Plus size={18} className="mr-2" />
            Nouveau Contact
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-[#18181b]/60 backdrop-blur-md p-4 rounded-xl border border-zinc-800/60">
          <p className="text-sm text-zinc-500 font-medium">Total</p>
          <p className="text-2xl font-bold text-white">{data.stats.total}</p>
        </div>
        <div className="bg-[#18181b]/60 backdrop-blur-md p-4 rounded-xl border border-zinc-800/60">
          <p className="text-sm text-blue-400 font-medium">Prospects</p>
          <p className="text-2xl font-bold text-white">{data.stats.byType?.PROSPECT || 0}</p>
        </div>
        <div className="bg-[#18181b]/60 backdrop-blur-md p-4 rounded-xl border border-zinc-800/60">
          <p className="text-sm text-emerald-400 font-medium">Clients</p>
          <p className="text-2xl font-bold text-white">{data.stats.byType?.CUSTOMER || 0}</p>
        </div>
        <div className="bg-[#18181b]/60 backdrop-blur-md p-4 rounded-xl border border-zinc-800/60">
          <p className="text-sm text-zinc-400 font-medium">Leads</p>
          <p className="text-2xl font-bold text-white">{data.stats.byType?.LEAD || 0}</p>
        </div>
        <div className="bg-[#18181b]/60 backdrop-blur-md p-4 rounded-xl border border-zinc-800/60">
          <p className="text-sm text-purple-400 font-medium">Partenaires</p>
          <p className="text-2xl font-bold text-white">{data.stats.byType?.PARTNER || 0}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#18181b]/60 backdrop-blur-md p-4 rounded-xl border border-zinc-800/60 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-2.5 text-zinc-500" size={20} />
          <input 
            type="text" 
            placeholder="Rechercher un contact..." 
            className="w-full pl-10 pr-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-white placeholder-zinc-500"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="text-zinc-500" size={20} />
          <select 
            className="bg-zinc-900/50 border border-zinc-700 text-zinc-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value, page: 1 })}
          >
            <option value="">Tous les types</option>
            <option value="LEAD">Lead</option>
            <option value="PROSPECT">Prospect</option>
            <option value="CUSTOMER">Client</option>
            <option value="PARTNER">Partenaire</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#18181b]/60 backdrop-blur-md rounded-xl border border-zinc-800/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-900/50 border-b border-zinc-800 text-sm text-zinc-400 font-medium uppercase tracking-wider">
                <th className="p-4">Contact</th>
                <th className="p-4">Entreprise</th>
                <th className="p-4">Type</th>
                <th className="p-4">Proprietaire</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {loading ? (
                <tr><td colSpan="5" className="p-8 text-center text-zinc-500">Chargement...</td></tr>
              ) : data.contacts.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-zinc-500">Aucun contact trouve.</td></tr>
              ) : (
                data.contacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-zinc-800/30 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-bold flex items-center justify-center mr-3">
                          {contact.firstName[0]}{contact.lastName[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{contact.firstName} {contact.lastName}</p>
                          <div className="flex items-center text-xs text-zinc-400 mt-1 gap-2">
                            {contact.email && <span className="flex items-center"><Mail size={12} className="mr-1 text-zinc-500"/> {contact.email}</span>}
                            {contact.phone && <span className="flex items-center"><Phone size={12} className="mr-1 text-zinc-500"/> {contact.phone}</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {contact.company ? (
                        <div>
                          <p className="font-medium text-zinc-300 flex items-center"><Building2 size={14} className="mr-1 text-zinc-500"/> {contact.company}</p>
                          <p className="text-xs text-zinc-500">{contact.jobTitle}</p>
                        </div>
                      ) : <span className="text-zinc-600">-</span>}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getTypeColor(contact.type)}`}>
                        {contact.type}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-zinc-300">{contact.owner?.firstName} {contact.owner?.lastName}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(contact)} className="p-1.5 text-zinc-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-md transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(contact.id)} className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-zinc-800/50 flex items-center justify-between bg-zinc-900/30">
          <p className="text-sm text-zinc-500">
            Page {data.pagination.page} sur {data.pagination.pages}
          </p>
          <div className="flex gap-2">
            <button 
              disabled={data.pagination.page === 1}
              onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
              className="px-3 py-1 bg-[#18181b] border border-zinc-700 text-zinc-300 rounded-lg text-sm disabled:opacity-50 hover:bg-zinc-800"
            >
              Precedent
            </button>
            <button 
              disabled={data.pagination.page === data.pagination.pages}
              onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
              className="px-3 py-1 bg-[#18181b] border border-zinc-700 text-zinc-300 rounded-lg text-sm disabled:opacity-50 hover:bg-zinc-800"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>

      {/* Modal CRUD */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#18181b] border border-zinc-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
              <h2 className="text-xl font-bold text-white">
                {editingContact ? 'Modifier le contact' : 'Nouveau contact'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors text-2xl leading-none">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-400">Prenom *</label>
                  <input required type="text" className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none" 
                    value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-400">Nom *</label>
                  <input required type="text" className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none" 
                    value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-400">Email</label>
                  <input type="email" className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none" 
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-400">Telephone</label>
                  <input type="text" className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none" 
                    value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-400">Entreprise</label>
                  <input type="text" className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none" 
                    value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-400">Poste</label>
                  <input type="text" className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none" 
                    value={formData.jobTitle} onChange={e => setFormData({...formData, jobTitle: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-400">Type de contact</label>
                  <select className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                    <option value="LEAD">Lead</option>
                    <option value="PROSPECT">Prospect</option>
                    <option value="CUSTOMER">Client</option>
                    <option value="PARTNER">Partenaire</option>
                    <option value="VENDOR">Fournisseur</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-400">Statut</label>
                  <select className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    <option value="ACTIVE">Actif</option>
                    <option value="INACTIVE">Inactif</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-zinc-800 text-zinc-300 font-medium rounded-lg hover:bg-zinc-700 transition-colors">
                  Annuler
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-500 transition-colors shadow-[0_0_10px_rgba(99,102,241,0.3)]">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
