import { useEffect, useState } from 'react';
import api from '../services/api';
import {
  Download, FileSpreadsheet, Package, Wrench, Activity,
  CalendarDays, FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Exports() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    try {
      const { data } = await api.get('/export/summary');
      setSummary(data);
    } catch (err) {
      toast.error('Erreur de chargement du résumé d\'export');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (endpoint, filename) => {
    try {
      // Pour le téléchargement de fichiers, on utilise fetch/axios en mode blob
      const response = await api.get(endpoint, { responseType: 'blob' });
      
      // Créer un lien temporaire pour télécharger
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      
      // Nettoyage
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Export réussi');
    } catch (err) {
      toast.error('Erreur lors de l\'export');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="p-8 bg-slate-50 min-h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Download className="w-6 h-6 text-primary-600" />
            Exports & Rapports
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Générez et téléchargez des rapports complets au format CSV.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Rapports disponibles</h2>
          
          <div className="bg-white rounded-xl border border-slate-200 p-6 flex items-start gap-4 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
              <Wrench className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900">Ordres de travail</h3>
              <p className="text-sm text-slate-500 mt-1">
                Export complet de l'historique des interventions, coûts associés et temps de résolution.
              </p>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => handleExport('/export/work-orders', 'ordres-travail')}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800"
                >
                  <FileSpreadsheet className="w-4 h-4" /> Export CSV ({summary?.summary.totalWO} lignes)
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 flex items-start gap-4 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900">Inventaire des actifs</h3>
              <p className="text-sm text-slate-500 mt-1">
                Liste détaillée de tous les équipements, leur état de santé, localisation et dates de garantie.
              </p>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => handleExport('/export/assets', 'actifs')}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800"
                >
                  <FileSpreadsheet className="w-4 h-4" /> Export CSV ({summary?.summary.totalAssets} lignes)
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 flex items-start gap-4 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
              <CalendarDays className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900">Plannings de maintenance</h3>
              <p className="text-sm text-slate-500 mt-1">
                Aperçu des interventions préventives programmées et de leur récurrence.
              </p>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => handleExport('/export/maintenance', 'plannings-maintenance')}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800"
                >
                  <FileSpreadsheet className="w-4 h-4" /> Export CSV ({summary?.summary.schedules} lignes)
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary-500" />
              Générateur PDF
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Pour des rapports PDF complets avec graphiques, utilisez la fonction d'impression (Ctrl+P) du navigateur sur le Tableau de bord.
            </p>
            <button
              onClick={() => window.print()}
              className="w-full flex justify-center items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50"
            >
              Imprimer / Sauver en PDF
            </button>
          </div>

          <div className="bg-gradient-to-br from-primary-50 to-indigo-50 p-5 rounded-xl border border-primary-100">
            <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary-600" />
              Info Base de données
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 mt-4">
              <li className="flex justify-between"><span>Dernier snapshot:</span> <strong>{new Date().toLocaleTimeString('fr-FR')}</strong></li>
              <li className="flex justify-between"><span>Taille estimée:</span> <strong>~2.4 MB</strong></li>
              <li className="flex justify-between"><span>Baux actifs:</span> <strong>{summary?.summary.leases}</strong></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
