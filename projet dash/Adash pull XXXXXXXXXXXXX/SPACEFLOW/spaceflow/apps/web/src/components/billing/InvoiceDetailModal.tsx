import { useState } from 'react';
import { X, Download, Check, Calendar, User, FileText } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { invoiceService } from '../../services/invoiceService';
import { Invoice } from '../../types/billing';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const STATUS_CONFIG: Record<string, { label: string; class: string }> = {
  open:  { label: 'En attente', class: 'bg-amber-100 text-amber-700' },
  paid:  { label: 'Payée',      class: 'bg-green-100 text-green-700' },
  void:  { label: 'Annulée',    class: 'bg-slate-100 text-slate-500' },
  draft: { label: 'Brouillon',  class: 'bg-slate-100 text-slate-700' }
};

interface Props { invoice: Invoice; onClose: () => void; onUpdate: () => void; }

function DetailRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="font-medium text-slate-800">{value}</p>
      </div>
    </div>
  );
}

export function InvoiceDetailModal({ invoice, onClose, onUpdate }: Props) {
  const [loading, setLoading] = useState(false);
  const status = STATUS_CONFIG[invoice.status] || STATUS_CONFIG.open;
  const memberName = invoice.member?.companyName
    || `${invoice.member?.firstName ?? ''} ${invoice.member?.lastName ?? ''}`.trim()
    || invoice.member?.email || '—';

  const handleMarkPaid = async () => {
    setLoading(true);
    try {
      await invoiceService.markPaid(invoice.id);
      toast.success('Facture marquée payée');
      onUpdate();
    } catch {
      toast.error('Erreur');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      await invoiceService.downloadPDF(invoice.id, invoice.number);
      toast.success('PDF téléchargé');
    } catch {
      toast.error('Erreur téléchargement');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 border-b flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500 font-mono">{invoice.number}</p>
            <h2 className="text-xl font-bold mt-0.5">{memberName}</h2>
            <span className={clsx('text-xs px-2 py-0.5 rounded-full mt-2 inline-block', status.class)}>
              {status.label}
            </span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Details grid */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <DetailRow icon={User} label="Member" value={memberName} />
            <DetailRow icon={Calendar} label="Émise le" value={format(parseISO(invoice.issueDate || invoice.createdAt), 'dd MMM yyyy', { locale: fr })} />
            <DetailRow icon={Calendar} label="Échéance" value={format(parseISO(invoice.dueDate), 'dd MMM yyyy', { locale: fr })} />
            <DetailRow icon={FileText} label="Total TTC" value={`${(invoice.totalCents / 100).toFixed(2)}€`} />
          </div>

          {/* Items */}
          {invoice.items && invoice.items.length > 0 && (
            <div>
              <h3 className="font-medium mb-3 text-slate-800">Lignes de facture</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 border-b text-xs uppercase">
                    <th className="py-2">Description</th>
                    <th className="py-2 text-right">Qté</th>
                    <th className="py-2 text-right">Prix unit.</th>
                    <th className="py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {invoice.items.map((item, i) => (
                    <tr key={i}>
                      <td className="py-2">{item.description}</td>
                      <td className="py-2 text-right">{item.quantity}</td>
                      <td className="py-2 text-right">{(item.unitPriceCents / 100).toFixed(2)}€</td>
                      <td className="py-2 text-right font-medium">{(item.amountCents / 100).toFixed(2)}€</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Totals */}
          <div className="border-t pt-4 space-y-1 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Sous-total HT</span>
              <span>{(invoice.subtotalCents / 100).toFixed(2)}€</span>
            </div>
            {invoice.taxCents > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>TVA (20%)</span>
                <span>{(invoice.taxCents / 100).toFixed(2)}€</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold pt-2 border-t">
              <span>Total TTC</span>
              <span>{(invoice.totalCents / 100).toFixed(2)}€</span>
            </div>
            {invoice.amountPaidCents > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Payé</span>
                <span>{(invoice.amountPaidCents / 100).toFixed(2)}€</span>
              </div>
            )}
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-600">
              <p className="font-medium mb-1">Notes</p>
              <p>{invoice.notes}</p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-6 border-t flex gap-2">
          <button onClick={handleDownload} className="flex-1 border border-slate-200 rounded-xl py-2 font-medium text-slate-700 hover:bg-slate-50 transition flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            Télécharger PDF
          </button>
          {invoice.status !== 'paid' && invoice.status !== 'void' && (
            <button
              onClick={handleMarkPaid}
              disabled={loading}
              className="flex-1 bg-green-600 text-white rounded-xl py-2 font-medium hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              Marquer payée
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
