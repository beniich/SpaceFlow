import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Mail, Settings, Send, Calendar, CheckCircle2,
  AlertTriangle, FileText, Plus, X, Eye
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { usePlan } from '../hooks/usePlan';
import FeatureGate from '../components/ui/FeatureGate';

export default function ReportsPage() {
  const { subscription, setSubscription, addLog, teamMembers } = useStore();
  const { isElite } = usePlan();
  
  const [newEmail, setNewEmail] = useState('');
  const [sendingTest, setSendingTest] = useState(false);

  const handleToggleWeekly = (enabled: boolean) => {
    setSubscription({ weeklyReportEnabled: enabled });
    addLog(
      enabled ? 'success' : 'warn',
      `📧 Envoi hebdomadaire des rapports ${enabled ? 'activé' : 'désactivé'}.`
    );
  };

  const handleAddRecipient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;

    if (subscription.reportRecipients.includes(newEmail)) {
      alert("Cet email est déjà dans la liste.");
      return;
    }

    setSubscription({
      reportRecipients: [...subscription.reportRecipients, newEmail]
    });
    addLog('info', `📧 Destinataire ajouté aux rapports : ${newEmail}`);
    setNewEmail('');
  };

  const handleRemoveRecipient = (emailToRemove: string) => {
    setSubscription({
      reportRecipients: subscription.reportRecipients.filter(e => e !== emailToRemove)
    });
    addLog('info', `📧 Destinataire retiré : ${emailToRemove}`);
  };

  const handleSendTestReport = () => {
    setSendingTest(true);
    setTimeout(() => {
      addLog('success', `📧 Rapport d'audit de test envoyé avec succès aux ${subscription.reportRecipients.length} destinataires.`);
      setSendingTest(false);
      alert(`Rapport test envoyé à :\n${subscription.reportRecipients.join('\n')}`);
    }, 1500);
  };

  const mockPastReports = [
    { id: 'REP-2026-22', date: '2026-06-01', type: 'Hebdomadaire', status: 'sent', size: '2.4 MB' },
    { id: 'REP-2026-21', date: '2026-05-25', type: 'Hebdomadaire', status: 'sent', size: '2.3 MB' },
    { id: 'REP-2026-20', date: '2026-05-18', type: 'Hebdomadaire', status: 'sent', size: '2.5 MB' },
  ];

  return (
    <FeatureGate feature="reports" message="L'automatisation et la personnalisation des rapports par e-mail hebdomadaires nécessitent le plan ELITE.">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-black text-white">Rapports Hebdomadaires Automatises</h1>
          <p className="text-slate-400 text-xs mt-1">
            Configurez l'envoi hebdomadaire automatique des rapports d'audit de conformité et de santé des cultures aux administrateurs de votre choix.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Scheduling Configuration */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Main Toggle & Trigger */}
            <div className="bg-[#0d1c2d] border border-white/10 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Status de l'envoi automatique</h2>
                  <p className="text-xs text-slate-500">Chaque lundi matin à 08:00 UTC</p>
                </div>
                
                <button
                  onClick={() => handleToggleWeekly(!subscription.weeklyReportEnabled)}
                  className={`w-12 h-6 rounded-full p-1 transition-all flex items-center ${
                    subscription.weeklyReportEnabled ? 'bg-emerald-500 justify-end' : 'bg-slate-800 justify-start'
                  }`}
                >
                  <motion.div layout className="w-4 h-4 rounded-full bg-white shadow-md" />
                </button>
              </div>

              <div className="w-full h-px bg-white/5" />

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p className="text-xs font-bold text-slate-300">Déclencher un rapport test immédiat</p>
                  <p className="text-[10px] text-slate-500">Génère et envoie la version actuelle du tableau de bord de conformité.</p>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSendTestReport}
                  disabled={sendingTest || subscription.reportRecipients.length === 0}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all disabled:opacity-50"
                >
                  <Send size={13} />
                  {sendingTest ? 'Envoi...' : 'Envoyer un test'}
                </motion.button>
              </div>
            </div>

            {/* Recipient list */}
            <div className="bg-[#0d1c2d] border border-white/10 rounded-2xl p-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Destinataires des rapports</h3>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {subscription.reportRecipients.map((rec) => (
                  <div key={rec} className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-xs text-slate-300">
                    <Mail size={12} className="text-slate-500" />
                    <span>{rec}</span>
                    <button 
                      onClick={() => handleRemoveRecipient(rec)}
                      className="p-0.5 hover:bg-white/10 hover:text-white rounded-full transition-all text-slate-500"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add recipient form */}
              <form onSubmit={handleAddRecipient} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="nom@agromatre.io"
                  className="flex-1 bg-slate-900 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="px-4 bg-white text-slate-950 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-1.5"
                >
                  <Plus size={14} /> Ajouter
                </button>
              </form>
            </div>
          </div>

          {/* History / Past Reports */}
          <div className="bg-[#0d1c2d] border border-white/10 rounded-2xl p-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Calendar size={14} className="text-slate-500" /> Historique des rapports
            </h3>
            
            <div className="space-y-3">
              {mockPastReports.map((rep) => (
                <div key={rep.id} className="p-3 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-all flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2.5">
                    <FileText size={16} className="text-slate-500" />
                    <div>
                      <p className="font-bold text-white">{rep.id}</p>
                      <p className="text-[10px] text-slate-500">{rep.date} • {rep.size}</p>
                    </div>
                  </div>
                  <button className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all">
                    <Eye size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </FeatureGate>
  );
}
