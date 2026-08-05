import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Download, FileText, Check } from 'lucide-react';
import { invoiceService } from '../services/invoiceService';
import { CreateInvoiceModal } from '../components/billing/CreateInvoiceModal';
import { InvoiceDetailModal } from '../components/billing/InvoiceDetailModal';
import { Invoice } from '../types/billing';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import clsx from 'clsx';

const STATUS_CONFIG: Record<string, { label: string; class: string }> = {
  draft:         { label: 'Brouillon',  class: 'bg-slate-100 text-slate-700' },
  open:          { label: 'En attente', class: 'bg-amber-100 text-amber-700' },
  paid:          { label: 'Payée',      class: 'bg-green-100 text-green-700' },
  void:          { label: 'Annulée',    class: 'bg-slate-100 text-slate-500' },
  uncollectible: { label: 'Impayable',  class: 'bg-red-100 text-red-700' }
};

export default function InvoicesPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['invoices', search, statusFilter],
    queryFn: () => invoiceService.list({ search: search || undefined, status: statusFilter || undefined })
  });

  const { data: stats } = useQuery({
    queryKey: ['invoice-stats'],
    queryFn: () => invoiceService.stats()
  });

  const markPaidMutation = useMutation({
    mutationFn: (id: string) => invoiceService.markPaid(id),
    onSuccess: () => {
      toast.success('Facture marquée payée');
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice-stats'] });
    }
  });

  const handleDownloadPDF = async (inv: Invoice, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await invoiceService.downloadPDF(inv.id, inv.number);
      toast.success('PDF téléchargé');
    } catch {
      toast.error('Erreur téléchargement');
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Factures</h1>
          <p className="text-slate-500 mt-1">Gérez vos factures et paiements</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:bg-indigo-700 transition"
        >
          <Plus className="w-4 h-4" />
          Nouvelle facture
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total ce mois', value: `${((stats.thisMonthTotal || 0) / 100).toFixed(0)}€`, color: 'text-slate-900' },
            { label: 'Payées', value: stats.paid, color: 'text-green-600' },
            { label: 'En retard', value: stats.overdue, color: 'text-red-600' },
            { label: 'En attente', value: `${((stats.pendingAmount || 0) / 100).toFixed(0)}€`, color: 'text-amber-600' }
          ].map(s => (
            <div key={s.label} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <p className="text-sm text-slate-500">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="w-full border border-slate-200 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-44"
        >
          <option value="">Tous statuts</option>
          {Object.entries(STATUS_CONFIG).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="text-center py-12 text-slate-500">Chargement...</div>
      ) : !data?.invoices?.length ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-16 text-center">
          <FileText className="w-12 h-12 mx-auto text-slate-300 mb-4" />
          <h3 className="font-semibold text-slate-700">Aucune facture</h3>
          <p className="text-sm text-slate-500 mt-1">Créez votre première facture pour démarrer</p>
          <button onClick={() => setShowCreateModal(true)} className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition">
            Créer une facture
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr className="text-left text-xs uppercase text-slate-500">
                <th className="px-6 py-3">Numéro</th>
                <th className="px-6 py-3">Member</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Échéance</th>
                <th className="px-6 py-3 text-right">Montant</th>
                <th className="px-6 py-3">Statut</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.invoices.map((inv: Invoice) => {
                const status = STATUS_CONFIG[inv.status] || STATUS_CONFIG.open;
                const isOverdue = inv.status === 'open' && new Date(inv.dueDate) < new Date();
                const memberName = inv.member?.companyName
                  || `${inv.member?.firstName ?? ''} ${inv.member?.lastName ?? ''}`.trim()
                  || inv.member?.email;
                return (
                  <tr key={inv.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => setSelectedInvoice(inv)}>
                    <td className="px-6 py-3 font-mono text-sm text-indigo-600">{inv.number}</td>
                    <td className="px-6 py-3 text-sm text-slate-700">{memberName}</td>
                    <td className="px-6 py-3 text-sm text-slate-600">
                      {format(parseISO(inv.createdAt), 'dd MMM yyyy', { locale: fr })}
                    </td>
                    <td className={clsx('px-6 py-3 text-sm', isOverdue ? 'text-red-600 font-medium' : 'text-slate-600')}>
                      {format(parseISO(inv.dueDate), 'dd MMM yyyy', { locale: fr })}
                    </td>
                    <td className="px-6 py-3 text-right font-medium text-slate-900">
                      {(inv.totalCents / 100).toFixed(2)}€
                    </td>
                    <td className="px-6 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${status.class}`}>{status.label}</span>
                    </td>
                    <td className="px-6 py-3" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center gap-1">
                        <button onClick={e => handleDownloadPDF(inv, e)} className="p-1.5 hover:bg-slate-100 rounded" title="PDF">
                          <Download className="w-4 h-4 text-slate-500" />
                        </button>
                        {inv.status !== 'paid' && inv.status !== 'void' && (
                          <button
                            onClick={e => { e.stopPropagation(); markPaidMutation.mutate(inv.id); }}
                            className="p-1.5 hover:bg-green-50 rounded"
                            title="Marquer payée"
                          >
                            <Check className="w-4 h-4 text-green-500" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showCreateModal && (
        <CreateInvoiceModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            queryClient.invalidateQueries({ queryKey: ['invoices'] });
            queryClient.invalidateQueries({ queryKey: ['invoice-stats'] });
          }}
        />
      )}

      {selectedInvoice && (
        <InvoiceDetailModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          onUpdate={() => { queryClient.invalidateQueries({ queryKey: ['invoices'] }); setSelectedInvoice(null); }}
        />
      )}
    </div>
  );
}
