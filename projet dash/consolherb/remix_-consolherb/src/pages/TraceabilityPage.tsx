import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, ShieldCheck, Database, Link as LinkIcon, Plus, User, MapPin, Clock, CheckCircle } from 'lucide-react';
import { apiGet, apiPost } from '../api/apiService';
import { useStore } from '../store/useStore';

interface Block {
  id: string;
  batchId: string;
  cropName: string;
  action: string;
  timestamp: string;
  operator: string;
  location: string;
  previousHash: string;
  hash: string;
}

interface VerificationReport {
  isValid: boolean;
  errorBlockId?: string;
  message: string;
}

export default function TraceabilityPage() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [verification, setVerification] = useState<VerificationReport | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [batchId, setBatchId] = useState('B-TOM-001');
  const [cropName, setCropName] = useState('Tomato');
  const [action, setAction] = useState('SEEDING');
  const [operator, setOperator] = useState('');
  const [location, setLocation] = useState('');

  const addLog = useStore((s) => s.addLog);

  const fetchBlocks = async () => {
    try {
      setLoading(true);
      const data = await apiGet<Block[]>('/traceability/batches');
      setBlocks(data || []);
    } catch (err: any) {
      addLog('error', `Erreur de chargement de la blockchain: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlocks();
  }, []);

  const handleVerify = async () => {
    try {
      setVerifying(true);
      setVerification(null);
      addLog('info', 'Lancement de l\'audit de conformité blockchain...');
      const report = await apiGet<VerificationReport>('/traceability/verify');
      setVerification(report);
      if (report.isValid) {
        addLog('success', 'Blockchain intègre. Signature cryptographique validée.');
      } else {
        addLog('error', `Alerte Blockchain: ${report.message}`);
      }
    } catch (err: any) {
      addLog('error', `Erreur lors de la vérification blockchain: ${err.message}`);
    } finally {
      setVerifying(false);
    }
  };

  const handleRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!operator || !location) return;
    try {
      await apiPost('/traceability/record', {
        batchId,
        cropName,
        action,
        operator,
        location,
      });
      addLog('success', `Bloc enregistré: ${action} pour le lot ${batchId}`);
      setShowForm(false);
      setOperator('');
      setLocation('');
      setVerification(null);
      fetchBlocks();
    } catch (err: any) {
      addLog('error', `Erreur d'écriture ledger: ${err.message}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 space-y-6">
      {/* Blockchain Header Info */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-[#0c1825]/90 border border-slate-800 p-4 rounded-xl">
        <div>
          <h2 className="text-base font-bold text-white font-mono uppercase tracking-wide flex items-center gap-2">
            <Database className="w-5 h-5 text-[#f97316]" /> Traçabilité Blockchain "Farm-to-Fork"
          </h2>
          <p className="text-[11px] text-slate-400 font-mono mt-1">
            Chaque bloc opérationnel est chaîné via condensats SHA-256 inaltérables
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleVerify}
            disabled={verifying}
            className={`flex items-center gap-1.5 border text-xs font-semibold px-3.5 py-2 rounded-lg transition-all active:scale-95 ${
              verifying
                ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-wait'
                : 'bg-[#122131] border-slate-700 text-slate-300 hover:border-[#f97316] hover:text-white'
            }`}
          >
            {verifying ? 'Validation...' : 'Vérifier l\'intégrité'}
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 bg-[#f97316] text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-md hover:bg-[#ea580c] transition-all active:scale-95"
          >
            <Plus size={14} /> Consigner Opération
          </button>
        </div>
      </div>

      {/* Verification alerts */}
      <AnimatePresence>
        {verification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-xl border flex gap-3 ${
              verification.isValid
                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}
          >
            {verification.isValid ? <ShieldCheck size={20} className="shrink-0 mt-0.5" /> : <ShieldAlert size={20} className="shrink-0 mt-0.5" />}
            <div>
              <p className="text-xs font-bold uppercase font-mono">
                Rapport d'Audit Blockchain : {verification.isValid ? 'VALIDE' : 'SÉCURITÉ INFECTÉE'}
              </p>
              <p className="text-xs mt-1 text-slate-300 font-mono">{verification.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Block sequence map */}
      <div className="bg-[#122131]/40 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-10 h-10 border-2 border-[#f97316]/20 border-t-[#f97316] rounded-full animate-spin" />
            <span className="text-xs font-mono text-[#f97316] tracking-widest uppercase animate-pulse">
              Chargement du registre distribué...
            </span>
          </div>
        ) : (
          <div className="relative">
            {/* Block timeline connector */}
            <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-0.5 bg-slate-800/80 -translate-x-1/2 hidden md:block" />

            <div className="space-y-8 relative">
              {blocks.map((block, idx) => (
                <div
                  key={block.id}
                  className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative ${
                    idx % 2 === 0 ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline node dot */}
                  <div className="absolute left-6 md:left-1/2 top-5 md:top-1/2 w-4 h-4 rounded-full bg-[#051424] border-2 border-[#f97316] -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block" />

                  {/* Block Content Container */}
                  <div className="w-full md:w-[47%] bg-[#0f172a]/80 border border-slate-800 rounded-xl p-4 space-y-3 hover:border-slate-700 transition">
                    {/* Header info */}
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs font-bold text-[#f97316] font-mono">
                        {block.batchId} ({block.cropName})
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                        <Clock size={10} /> {new Date(block.timestamp).toLocaleDateString('fr-FR')}
                      </span>
                    </div>

                    {/* Operational parameters */}
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-300">
                      <div>
                        <span className="text-[9px] text-slate-500 block uppercase">ACTION</span>
                        <span className="text-white font-bold">{block.action}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 block uppercase">OPERATOR</span>
                        <span className="flex items-center gap-1 text-white"><User size={10} /> {block.operator}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[9px] text-slate-500 block uppercase font-mono">LOCATION</span>
                        <span className="flex items-center gap-1 text-slate-300"><MapPin size={10} /> {block.location}</span>
                      </div>
                    </div>

                    {/* Cryptographic hashes links */}
                    <div className="bg-[#051424] border border-slate-900 rounded p-2 text-[9px] font-mono space-y-1">
                      <div className="flex justify-between items-center text-slate-500">
                        <span>PREV_HASH:</span>
                        <span className="text-slate-400 font-mono">{block.previousHash.substring(0, 16)}...</span>
                      </div>
                      <div className="flex justify-between items-center text-[#f97316]">
                        <span>BLOCK_HASH:</span>
                        <span className="font-bold font-mono">{block.hash.substring(0, 16)}...</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Write block form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#051424]/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#122131] border border-slate-700 w-full max-w-md p-6 rounded-2xl shadow-2xl relative"
          >
            <h3 className="text-base font-bold text-white font-mono mb-4 uppercase tracking-wide">
              Consigner une Opération
            </h3>
            <form onSubmit={handleRecord} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">ID Lot (Batch)</label>
                  <input
                    type="text"
                    value={batchId}
                    onChange={(e) => setBatchId(e.target.value)}
                    required
                    placeholder="Ex: B-TOM-001"
                    className="w-full bg-[#051424] border border-slate-700 p-2.5 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">Culture</label>
                  <select
                    value={cropName}
                    onChange={(e) => setCropName(e.target.value)}
                    className="w-full bg-[#051424] border border-slate-700 p-2.5 rounded-lg text-white"
                  >
                    <option value="Tomato">Tomate</option>
                    <option value="Lavender">Lavande</option>
                    <option value="Ginseng">Ginseng</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono">Étape (Action)</label>
                <select
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  className="w-full bg-[#051424] border border-slate-700 p-2.5 rounded-lg text-white"
                >
                  <option value="SEEDING">Semis (Seeding)</option>
                  <option value="FERTILIZATION">Fertilisation</option>
                  <option value="IRRIGATION">Irrigation</option>
                  <option value="HARVESTING">Récolte (Harvesting)</option>
                  <option value="QUALITY_CONTROL">Inspection Qualité</option>
                  <option value="PACKAGING">Conditionnement</option>
                  <option value="SHIPPING">Expédition</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono">Opérateur responsable</label>
                <input
                  type="text"
                  value={operator}
                  onChange={(e) => setOperator(e.target.value)}
                  required
                  placeholder="Ex: Jean-Luc Dupont"
                  className="w-full bg-[#051424] border border-slate-700 p-2.5 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono">Emplacement (Serre/Champ/Lab)</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  placeholder="Ex: Serre Zone-B3"
                  className="w-full bg-[#051424] border border-slate-700 p-2.5 rounded-lg text-white"
                />
              </div>

              <div className="flex gap-2 pt-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-slate-800 text-slate-400 px-4 py-2 rounded-lg font-bold border border-slate-700 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-[#f97316] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#ea580c]"
                >
                  Signer & Enregistrer
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
