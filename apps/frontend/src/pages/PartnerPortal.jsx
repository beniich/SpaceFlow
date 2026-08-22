import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Key, Shield, Users, Globe, ExternalLink, Copy, Check, 
  Plus, Terminal, CheckCircle2, Lock, ShieldAlert, Cpu, 
  Code, RefreshCw, Layers, ArrowUpRight, HelpCircle
} from 'lucide-react';

const apiKeysList = [
  { id: 'pk-1', name: 'Schneider Ecostruxure Sync (Live)', prefix: 'pk_live_89f...2d0', scope: ['READ:SENSORS', 'WRITE:ALERTS'], created: '14 Jan 2026', lastUsed: 'Il y a 3 min', status: 'Actif' },
  { id: 'pk-2', name: 'Planon IWMS Connector API', prefix: 'pk_live_41a...9e1', scope: ['READ:WORKORDERS', 'WRITE:WORKORDERS'], created: '02 Fév 2026', lastUsed: 'Il y a 22 min', status: 'Actif' },
  { id: 'pk-3', name: 'Deepki ESG Automated Export', prefix: 'pk_live_12c...8b7', scope: ['READ:ENERGY', 'READ:ESG_CSRD'], created: '20 Fév 2026', lastUsed: 'Hier à 23:45', status: 'Actif' },
];

const partnersDirectory = [
  {
    id: 'part-1',
    name: 'Spie Facilities OT Solutions',
    tier: 'Intégrateur Certifié Gold',
    badgeColor: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
    speciality: 'Régulation GTB & CVC Haute Performance',
    activeSites: 28,
    slaCompliance: '99.8%',
    contact: 'ot-support@spie.com',
    avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'part-2',
    name: 'Dalkia Groupe EDF',
    tier: 'Partenaire Énergie & Réseaux',
    badgeColor: 'text-brand-cyan border-brand-cyan/30 bg-brand-cyan/10',
    speciality: 'Valorisation Chaleur Fatale & Contrats P1/P2/P3',
    activeSites: 42,
    slaCompliance: '99.4%',
    contact: 'beecarbonat-desk@dalkia.fr',
    avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'part-3',
    name: 'Bureau Veritas Green Audit',
    tier: 'Tiers de Confiance Audit ESG',
    badgeColor: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
    speciality: 'Certification Décret Tertiaire & Audits CSRD',
    activeSites: 65,
    slaCompliance: '100%',
    contact: 'esg-assurance@bureauveritas.com',
    avatar: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'part-4',
    name: 'Belimo France Capteurs & Vannes',
    tier: 'OEM Matériel Connecté',
    badgeColor: 'text-brand-orange border-brand-orange/30 bg-brand-orange/10',
    speciality: 'Vannes Energy Valve & Servomoteurs IoT',
    activeSites: 19,
    slaCompliance: '99.9%',
    contact: 'iot-support@belimo.fr',
    avatar: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=120&q=80'
  }
];

export default function PartnerPortal() {
  const [copiedKey, setCopiedKey] = useState(null);
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [keyName, setKeyName] = useState('');

  const handleCopy = (keyPrefix, id) => {
    navigator.clipboard.writeText(`bk_secret_${id}_${Date.now()}`);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-10 font-sans">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-zinc-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-mono mb-3">
              <Key className="w-3.5 h-3.5" />
              <span>ECOSYSTEM & DEVELOPER SECURITY GATEWAY</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-white flex items-center gap-3">
              Portail Partenaires & Connecteurs API
            </h1>
            <p className="text-zinc-400 mt-2 max-w-2xl text-sm lg:text-base">
              Gérez les accès sécurisés mTLS / OAuth2, générez vos clés d’API industrielles et monitorez les flux de données partagés avec vos prestataires et auditeurs ESG.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowNewKeyModal(true)}
              className="px-4 py-2 bg-brand-orange hover:bg-white text-black font-bold text-xs font-mono uppercase rounded-lg flex items-center gap-2 shadow-[0_0_15px_rgba(243,128,32,0.3)] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Générer Clé d'API
            </button>
          </div>
        </div>

        {/* Top security summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-cyan/10 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-zinc-400 font-mono">Protocole de Chiffrement</div>
              <div className="text-lg font-bold text-white">TLS 1.3 & mTLS v2</div>
              <div className="text-[11px] text-emerald-400 font-mono">Zéro faille détectée</div>
            </div>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-orange/10 border border-brand-orange/30 flex items-center justify-center text-brand-orange">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-zinc-400 font-mono">Appels API Partenaires / 24h</div>
              <div className="text-lg font-bold font-mono text-white">1 428 920 req</div>
              <div className="text-[11px] text-brand-cyan font-mono">Latence moyenne : 18ms</div>
            </div>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-zinc-400 font-mono">Partenaires Certifiés Actifs</div>
              <div className="text-lg font-bold text-white">12 Intégrateurs</div>
              <div className="text-[11px] text-zinc-400 font-mono">Conformité RGPD / ISO 27001</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Sections */}
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Section 1: Active API Keys */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-md">
          <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-brand-cyan" />
                Clés d'API & Identifiants Machine-to-Machine
              </h3>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">Autorisations granulaires par flux (BIM, CVC, ESG, GMAO)</p>
            </div>
            <span className="text-xs font-mono text-zinc-400">
              {apiKeysList.length} clés actives
            </span>
          </div>

          <div className="divide-y divide-zinc-800/60">
            {apiKeysList.map((key) => (
              <div key={key.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-zinc-800/30 transition-colors">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-white text-base">{key.name}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono">
                      {key.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400 mt-2">
                    <div className="flex items-center gap-1.5 bg-black/60 px-2.5 py-1 rounded border border-zinc-800 text-zinc-200">
                      <span>{key.prefix}</span>
                      <button
                        onClick={() => handleCopy(key.prefix, key.id)}
                        className="text-brand-orange hover:text-white transition-colors"
                        title="Copier le token"
                      >
                        {copiedKey === key.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <span>Créé le : {key.created}</span>
                    <span>Dernier appel : {key.lastUsed}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {key.scope.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px] font-mono border border-zinc-700">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-300 rounded-lg border border-zinc-700 transition-colors">
                    Régénérer
                  </button>
                  <button className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-mono rounded-lg border border-rose-500/30 transition-colors">
                    Révoquer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Certified Partner Directory */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-brand-orange" />
                Réseau des Partenaires & Intégrateurs Agréés
              </h3>
              <p className="text-xs text-zinc-400 font-mono mt-1">Fournisseurs de maintenance, auditeurs et équipementiers connectés</p>
            </div>
            <a 
              href="mailto:partners@beecarbonat.com" 
              className="text-xs font-mono text-brand-cyan hover:underline flex items-center gap-1"
            >
              <span>Devenir Partenaire Agréé</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {partnersDirectory.map((partner) => (
              <div 
                key={partner.id}
                className="bg-zinc-900/60 border border-zinc-800 hover:border-brand-cyan/40 p-6 rounded-2xl backdrop-blur-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={partner.avatar} 
                        alt={partner.name} 
                        className="w-12 h-12 rounded-xl object-cover border border-zinc-700"
                      />
                      <div>
                        <h4 className="font-bold text-white text-base">{partner.name}</h4>
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono border mt-1 ${partner.badgeColor}`}>
                          {partner.tier}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-zinc-300 mt-4">
                    <strong className="text-zinc-400 font-normal">Domaine d'intervention :</strong> {partner.speciality}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mt-4 p-3 bg-black/40 rounded-xl border border-zinc-800/80 text-xs font-mono">
                    <div>
                      <span className="text-zinc-500">Sites Opérés</span>
                      <div className="text-white font-bold mt-0.5">{partner.activeSites} Bâtiments</div>
                    </div>
                    <div>
                      <span className="text-zinc-500">Conformité SLA</span>
                      <div className="text-emerald-400 font-bold mt-0.5">{partner.slaCompliance}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between">
                  <span className="text-xs font-mono text-zinc-400">{partner.contact}</span>
                  <button className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-200 rounded-lg transition-colors flex items-center gap-1.5">
                    <span>Gérer les flux</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New API Key Modal */}
      {showNewKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-2xl max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Créer une Clé API Sécurisée</h3>
            <p className="text-xs text-zinc-400 mb-4">Attribuez un nom explicite pour identifier l'intégration externe ou le service tiers.</p>
            
            <input 
              type="text" 
              placeholder="Ex: Honeywell Building IoT Connector" 
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-black border border-zinc-700 text-white text-sm focus:outline-none focus:border-brand-orange mb-4 font-sans"
            />

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowNewKeyModal(false)}
                className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 text-xs font-mono uppercase hover:bg-zinc-700"
              >
                Annuler
              </button>
              <button 
                onClick={() => {
                  alert(`Clé API "${keyName || 'Nouvelle Intégration'}" créée avec succès ! Token: bk_live_${Math.random().toString(36).substring(2)}`);
                  setShowNewKeyModal(false);
                  setKeyName('');
                }}
                className="px-4 py-2 rounded-lg bg-brand-orange text-black font-bold text-xs font-mono uppercase hover:bg-white"
              >
                Générer Token
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
