import { FileText, Download, CheckCircle } from 'lucide-react';

export default function ReportPreview({ title, type, date, onDownload }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
            <FileText className="w-5 h-5 text-indigo-600" />
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 uppercase tracking-wider">
            {type}
          </span>
        </div>

        <h4 className="font-bold text-slate-900 text-lg mb-1">{title}</h4>
        <p className="text-xs text-slate-500 mb-4">Généré le {date || new Date().toLocaleDateString('fr-FR')}</p>

        <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
          <p className="flex items-center gap-2">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Format PDF optimisé impression
          </p>
          <p className="flex items-center gap-2">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Signature & horodatage inclus
          </p>
        </div>
      </div>

      <button
        onClick={onDownload}
        className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition"
      >
        <Download className="w-4 h-4" /> Imprimer / Télécharger PDF
      </button>
    </div>
  );
}
