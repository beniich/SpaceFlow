import React, { useState } from 'react';
import { Wrench, CheckCircle2, FileText, Camera, PenTool } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Intervention() {
  const [report, setReport] = useState({
    woNumber: 'WO-2026-089',
    technician: 'Tarik Benaich',
    findings: 'Remplacement effectué sur filtre F7 et vérification des tensions de courroie.',
    durationHours: 1.5,
    status: 'COMPLETED'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Rapport d\'intervention validé et transmis au registre BEECARBONAT !');
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6 bg-zinc-950 text-zinc-100 min-h-screen font-sans font-mono text-xs">
      <div className="pb-4 border-b border-zinc-800">
        <h1 className="text-2xl font-bold font-display uppercase tracking-widest flex items-center gap-2 text-zinc-50">
          <Wrench className="w-7 h-7 text-cyan-400" />
          Rapport d'Intervention Technique
        </h1>
        <p className="text-xs text-zinc-400 mt-1">Saisie du compte-rendu de maintenance de terrain</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] text-zinc-400 uppercase mb-1">N° Ordre de Travail</label>
            <input
              type="text"
              value={report.woNumber}
              onChange={(e) => setReport({ ...report, woNumber: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-700 px-3 py-2 text-zinc-100 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div>
            <label className="block text-[10px] text-zinc-400 uppercase mb-1">Technicien Intervenant</label>
            <input
              type="text"
              value={report.technician}
              onChange={(e) => setReport({ ...report, technician: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-700 px-3 py-2 text-zinc-100 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] text-zinc-400 uppercase mb-1">Compte-Rendu &amp; Observations</label>
          <textarea
            rows="4"
            value={report.findings}
            onChange={(e) => setReport({ ...report, findings: e.target.value })}
            className="w-full bg-zinc-950 border border-zinc-700 px-3 py-2 text-zinc-100 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] text-zinc-400 uppercase mb-1">Durée (Heures)</label>
            <input
              type="number"
              step="0.5"
              value={report.durationHours}
              onChange={(e) => setReport({ ...report, durationHours: Number(e.target.value) })}
              className="w-full bg-zinc-950 border border-zinc-700 px-3 py-2 text-zinc-100 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-800 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-bold uppercase transition"
          >
            Valider &amp; Clôturer Intervention
          </button>
        </div>
      </form>
    </div>
  );
}
