import React, { useState } from 'react';
import { 
  Settings, Building2, Shield, Key, Bell, CheckCircle2, Save, Lock, Mail, CreditCard, Calendar, FileSpreadsheet, MessageSquare, ExternalLink
} from 'lucide-react';

interface SettingsViewProps {
  isDarkMode: boolean;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ isDarkMode }) => {
  const [orgName, setOrgName] = useState('Spaceflow Paris Central');
  const [orgSlug, setOrgSlug] = useState('spaceflow-paris-central');
  const [address, setAddress] = useState('42 Rue de la Paix, 75002 Paris');
  const [saved, setSaved] = useState(false);

  const cardBg = isDarkMode
    ? 'glass-card-purple text-slate-100 border-white/10 shadow-lg'
    : 'bg-white text-slate-900 border-slate-200 shadow-sm';
  const subText = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const mainTitleText = isDarkMode ? 'text-slate-100' : 'text-slate-900';
  const valueText = isDarkMode ? 'text-slate-100' : 'text-slate-800';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div>
        <h2 className={`text-xl font-black uppercase tracking-tight flex items-center gap-2.5 ${mainTitleText}`}>
          <Settings className="w-6 h-6 text-orange-500" />
          <span>PARAMÈTRES ORGANISATION & GOOGLE WORKSPACE</span>
        </h2>
        <p className={`text-xs ${subText}`}>Configuration multi-site, clés d'API et statut des intégrations Google Workspace</p>
      </div>

      {saved && (
        <div className={`p-3 rounded-xl border text-xs font-bold text-center animate-fade-in ${
          isDarkMode ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-emerald-50 text-emerald-800 border-emerald-300'
        }`}>
          ✅ Paramètres sauvegardés avec succès.
        </div>
      )}

      {/* Org Profile Form */}
      <div className={`${cardBg} p-6 rounded-2xl border space-y-4`}>
        <h3 className={`text-sm font-black uppercase border-b pb-3 flex items-center gap-2 ${mainTitleText} ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
          <Building2 className="w-4 h-4 text-orange-500" />
          <span>INFORMATIONS COWORKING SITE</span>
        </h3>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block font-bold mb-1 ${subText}`}>Nom de l'Espace / Organisation</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className={`w-full p-2.5 rounded-xl border ${isDarkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'} focus:outline-none focus:border-orange-500`}
              />
            </div>

            <div>
              <label className={`block font-bold mb-1 ${subText}`}>Slug URL Dédié</label>
              <input
                type="text"
                value={orgSlug}
                onChange={(e) => setOrgSlug(e.target.value)}
                className={`w-full p-2.5 rounded-xl border ${isDarkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'} focus:outline-none focus:border-orange-500 font-mono`}
              />
            </div>
          </div>

          <div>
            <label className={`block font-bold mb-1 ${subText}`}>Adresse Physique</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={`w-full p-2.5 rounded-xl border ${isDarkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'} focus:outline-none focus:border-orange-500`}
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl btn-gradient-orange text-white font-extrabold text-xs shadow-md hover:opacity-90 transition-all cursor-pointer flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>ENREGISTRER</span>
            </button>
          </div>
        </form>
      </div>

      {/* Google Workspace Integrations Status */}
      <div className={`${cardBg} p-6 rounded-2xl border space-y-4`}>
        <h3 className={`text-sm font-black uppercase border-b pb-3 flex items-center gap-2 ${mainTitleText} ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
          <Shield className="w-4 h-4 text-emerald-500" />
          <span>INTÉGRATIONS GOOGLE WORKSPACE API (ACTIVES)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className={`p-4 rounded-xl border flex flex-col justify-between space-y-2 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center justify-between">
              <Calendar className="w-5 h-5 text-blue-500" />
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                ACTIF
              </span>
            </div>
            <div>
              <div className={`font-bold ${valueText}`}>Google Calendar</div>
              <div className={`text-[10px] ${subText}`}>Synchro bidirectionnelle des réservations de salles</div>
            </div>
          </div>

          <div className={`p-4 rounded-xl border flex flex-col justify-between space-y-2 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center justify-between">
              <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                ACTIF
              </span>
            </div>
            <div>
              <div className={`font-bold ${valueText}`}>Google Sheets</div>
              <div className={`text-[10px] ${subText}`}>Export direct des factures & comptabilité</div>
            </div>
          </div>

          <div className={`p-4 rounded-xl border flex flex-col justify-between space-y-2 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center justify-between">
              <MessageSquare className="w-5 h-5 text-purple-500" />
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                ACTIF
              </span>
            </div>
            <div>
              <div className={`font-bold ${valueText}`}>Google Chat</div>
              <div className={`text-[10px] ${subText}`}>Webhooks d'alerte instantanée accueil & incidents</div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Credentials */}
      <div className={`${cardBg} p-6 rounded-2xl border space-y-4`}>
        <h3 className={`text-sm font-black uppercase border-b pb-3 flex items-center gap-2 ${mainTitleText} ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
          <Lock className="w-4 h-4 text-orange-500" />
          <span>SÉCURITÉ & ACCÈS .ENV</span>
        </h3>

        <div className="space-y-2 text-xs font-mono">
          <div className={`p-3 rounded-xl border flex items-center justify-between ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <div>
              <div className={`font-bold ${valueText}`}>SUPER_ADMIN_EMAIL</div>
              <div className={`text-[10px] ${subText}`}>Identifiant d'accès Super Admin Site</div>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-500 font-bold">CONFIGURÉ</span>
          </div>

          <div className={`p-3 rounded-xl border flex items-center justify-between ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <div>
              <div className={`font-bold ${valueText}`}>GEMINI_API_KEY</div>
              <div className={`text-[10px] ${subText}`}>Clé d'accès Moteur Prédictif IA</div>
            </div>
            <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-500 font-bold">ACTIF</span>
          </div>
        </div>
      </div>
    </div>
  );
};
