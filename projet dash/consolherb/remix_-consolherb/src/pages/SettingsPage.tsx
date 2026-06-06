import { useState } from 'react';
import { motion } from 'motion/react';
import { Award, Sliders, Shield, CheckCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import SocCertificateModal from '../components/SocCertificateModal';

export default function SettingsPage() {
  const { addLog, nodes } = useStore();
  
  const [securityStandard, setSecurityStandard] = useState<'soc2' | 'pci' | 'iso'>('soc2');
  const [alertThreshold, setAlertThreshold] = useState<number>(65);
  const [cryptoToken, setCryptoToken] = useState<string>('AES-256GCM-FIPS-140-3-ACTIVE');
  const [isSocModalOpen, setIsSocModalOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Compliance standard and Threshold config */}
        <div className="bg-dark-bg border border-[#334155] rounded-[4px] p-6 shadow-md md:col-span-2 space-y-6">
          <div>
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
              SÉLECTION DU RÉGISTRE DE CONFORMITÉ
            </h2>
            <p className="text-xs text-[#c5c6cd] mt-0.5">
              Modifiez le type de audit d'intégrité imposé matériellement.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => {
                setSecurityStandard('soc2');
                addLog('success', 'Régistre de sécurité modifié : SOC 2 TYPE II [ACTIVÉ]');
              }}
              className={`p-4 border font-mono rounded flex flex-col items-center justify-center gap-2 cursor-pointer transition ${
                securityStandard === 'soc2'
                  ? 'bg-emerald-950/40 border-[#4de082] text-white shadow-sm'
                  : 'bg-[#0a192f] border-[#334155] text-[#c5c6cd] hover:border-slate-500'
              }`}
            >
              <Award className="w-5 h-5" />
              <span className="text-[11px] font-bold">SOC 2 Type II</span>
            </button>

            <button
              onClick={() => {
                setSecurityStandard('pci');
                addLog('success', 'Régistre de sécurité modifié : PCI-DSS v4.0 [ACTIVÉ]');
              }}
              className={`p-4 border font-mono rounded flex flex-col items-center justify-center gap-2 cursor-pointer transition ${
                securityStandard === 'pci'
                  ? 'bg-sky-950/40 border-[#38BDF8] text-white shadow-sm'
                  : 'bg-[#0a192f] border-[#334155] text-[#c5c6cd] hover:border-slate-500'
              }`}
            >
              <Sliders className="w-5 h-5" />
              <span className="text-[11px] font-bold">PCI-DSS 4.0</span>
            </button>

            <button
              onClick={() => {
                setSecurityStandard('iso');
                addLog('success', 'Régistre de sécurité modifié : ISO 27001 [ACTIVÉ]');
              }}
              className={`p-4 border font-mono rounded flex flex-col items-center justify-center gap-2 cursor-pointer transition ${
                securityStandard === 'iso'
                  ? 'bg-purple-950/40 border-purple-500 text-white shadow-sm'
                  : 'bg-[#0a192f] border-[#334155] text-[#c5c6cd] hover:border-slate-500'
              }`}
            >
              <Shield className="w-5 h-5" />
              <span className="text-[11px] font-bold">ISO 27001</span>
            </button>
          </div>

          {/* Range alerts threshold level */}
          <div className="space-y-4 pt-4 border-t border-[#334155]/60">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xs font-mono font-bold uppercase text-white">
                  Seuil de latence critique
                </h3>
                <p className="text-xs text-[#c5c6cd] mt-0.5">
                  Déclenche l'alerte d'intrusion si la latence dépasse ce niveau.
                </p>
              </div>
              <span className="text-sm font-mono font-bold text-[#38BDF8]">{alertThreshold} ms</span>
            </div>
            
            <input
              type="range"
              min="30"
              max="150"
              value={alertThreshold}
              onChange={(e) => {
                setAlertThreshold(Number(e.target.value));
              }}
              className="w-full h-1 bg-[#0a192f] rounded-lg cursor-pointer accent-[#38BDF8]"
            />
          </div>

          {/* Token administration */}
          <div className="space-y-3 pt-4 border-t border-[#334155]/60">
            <label className="block text-xs font-mono font-bold uppercase text-white">
              Clé de chiffrement administrative (FIPS 140-3)
            </label>
            <input
              type="text"
              value={cryptoToken}
              onChange={(e) => setCryptoToken(e.target.value)}
              className="w-full bg-[#07111c] border border-[#334155] focus:border-[#38BDF8] rounded-sm text-xs py-2 px-3 outline-none text-slate-200 font-mono"
            />
            <p className="text-[10px] text-[#8f9097] font-mono">
              Les modules d'infrastructure réencryptent automatiquement par HMAC avec cette clé à la volée.
            </p>
          </div>
        </div>

        {/* Security policy checklists */}
        <div className="bg-dark-bg border border-[#334155] rounded-[4px] p-6 shadow-md space-y-6">
          <div>
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
              CONTRÔLE DE SÉCURITÉ SOC 2
            </h2>
            <p className="text-xs text-[#c5c6cd] mt-0.5">
              Règles obligatoires imposées à nos serveurs d'Arch-Compliance.
            </p>
          </div>

          <div className="space-y-4 text-xs font-mono">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-[#4de082] shrink-0 mt-0.5" />
              <div>
                <span className="text-white block font-bold">SYS-AES: TLS Actif v1.3</span>
                <span className="text-gray-400 text-[10px]">Trafic HTTP forcé sur le protocole chiffré.</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-[#4de082] shrink-0 mt-0.5" />
              <div>
                <span className="text-white block font-bold">AUTH-MFA: Double Facteur</span>
                <span className="text-gray-400 text-[10px]">Protection de l'accès kernel requis pour l'administrateur.</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-[#4de082] shrink-0 mt-0.5" />
              <div>
                <span className="text-white block font-bold">SQL-ENC: Relationnel chiffré</span>
                <span className="text-gray-400 text-[10px]">La base PostgreSQL Node-B2 applique le chiffrement crypt.</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <span className="text-[#8f9097] block font-bold">NET-WAF: Pare-feu restrictif</span>
                <span className="text-gray-400 text-[10px]">Vérification continue des connexions.</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#334155] text-center">
            <button
              onClick={() => setIsSocModalOpen(true)}
              className="w-full bg-[#4de082] hover:bg-white text-[#003919] hover:text-black font-bold font-mono text-xs py-2 rounded-sm uppercase tracking-wide cursor-pointer transition"
            >
              Voir Certificat SOC 2
            </button>
          </div>
        </div>
      </motion.div>
      <SocCertificateModal
        isOpen={isSocModalOpen}
        onClose={() => setIsSocModalOpen(false)}
        auditNodesLength={nodes.length}
      />
    </>
  );
}
