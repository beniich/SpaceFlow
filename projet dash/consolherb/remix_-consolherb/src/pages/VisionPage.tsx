import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Camera, AlertTriangle, CheckCircle, Zap, Bot, Leaf, ArrowRight, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';

type Severity = 'Low' | 'Medium' | 'High' | 'Critical';

interface DiagnosisResult {
  status: string;
  crop: string;
  filename: string;
  detected: string;
  confidence: number;
  treatment: string;
  severity: Severity;
}

const SEVERITY_CONFIG: Record<Severity, { label: string; color: string; bg: string; border: string }> = {
  Low:      { label: 'Faible',    color: 'text-green-400',  bg: 'bg-green-400/10',  border: 'border-green-400/30' },
  Medium:   { label: 'Moyen',     color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30' },
  High:     { label: 'Élevé',     color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/30' },
  Critical: { label: 'Critique',  color: 'text-red-400',    bg: 'bg-red-400/10',    border: 'border-red-400/30' },
};

const CROPS = [
  { id: 'tomato',   label: 'Tomate',   emoji: '🍅' },
  { id: 'lavender', label: 'Lavande',  emoji: '💜' },
  { id: 'ginseng',  label: 'Ginseng',  emoji: '🌿' },
];

export default function VisionPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedCrop, setSelectedCrop] = useState('tomato');
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [incidentCreated, setIncidentCreated] = useState(false);

  const addLog = useStore((s) => s.addLog);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setImage(file);
    setResult(null);
    setIncidentCreated(false);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => setIsDragging(false);

  const createIncident = async (diagnosis: DiagnosisResult) => {
    try {
      await fetch('http://localhost:4000/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `🚨 Vision IA : ${diagnosis.detected} détecté en ${diagnosis.crop}`,
          type: 'PEST_CONTROL',
          content: {
            source: 'Eyes in the Field (Computer Vision)',
            pathogen: diagnosis.detected,
            confidence: `${(diagnosis.confidence * 100).toFixed(1)}%`,
            severity: diagnosis.severity,
            treatment: diagnosis.treatment,
            file: diagnosis.filename,
            detectedAt: new Date().toISOString(),
          }
        })
      });
      setIncidentCreated(true);
      addLog('warn', `Incident Pest Control créé : "${diagnosis.detected}" (confiance: ${(diagnosis.confidence * 100).toFixed(0)}%)`);
    } catch {
      addLog('error', 'Impossible de créer l\'incident dans la base de données.');
    }
  };

  const handleAnalyze = async () => {
    if (!image || loading) return;
    setLoading(true);
    setResult(null);
    addLog('info', `Analyse visuelle lancée sur "${image.name}" (culture: ${selectedCrop})`);

    try {
      const formData = new FormData();
      formData.append('file', image);
      formData.append('crop', selectedCrop);

      const res = await fetch('http://localhost:8000/analyze', { method: 'POST', body: formData });
      const data: DiagnosisResult = await res.json();
      setResult(data);

      // Boucle de rétroaction : créer incident si sévérité élevée
      if (data.severity === 'High' || data.severity === 'Critical') {
        await createIncident(data);
      }

      addLog('success', `Diagnostic Vision IA : ${data.detected} (${(data.confidence * 100).toFixed(0)}% confiance)`);
    } catch {
      addLog('error', 'Le micro-service Vision IA est hors ligne. Lancez : cd server_vision && uvicorn main:app');
    } finally {
      setLoading(false);
    }
  };

  const askAgroBrain = () => {
    if (!result) return;
    // Store the question in sessionStorage for AgroBrain to pick up
    sessionStorage.setItem('agrobrain_prefill', `Le diagnostic Vision IA a détecté "${result.detected}" sur mes ${result.crop} avec ${(result.confidence * 100).toFixed(0)}% de confiance. Explique-moi pourquoi cela est arrivé et quel plan d'action dois-je suivre ?`);
    navigate('/agro-brain');
  };

  const severityCfg = result ? SEVERITY_CONFIG[result.severity] ?? SEVERITY_CONFIG['Medium'] : null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
      {/* Header */}
      <header className="text-center">
        <div className="inline-flex items-center gap-3 bg-[#1e293b]/80 border border-slate-700 px-5 py-2.5 rounded-full mb-4 shadow-lg">
          <Camera className="w-5 h-5 text-[#f97316]" />
          <span className="text-white font-bold text-sm tracking-wide">EYES IN THE FIELD</span>
          <span className="text-[#f97316] font-mono text-xs border border-[#f97316]/30 bg-[#f97316]/10 px-2 py-0.5 rounded-full">BETA</span>
        </div>
        <h1 className="text-3xl font-bold text-white">Diagnostic Visuel par IA</h1>
        <p className="text-slate-400 text-sm mt-1">Envoyez une photo de feuille — Notre CNN simulé détecte les maladies en temps réel</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT : Upload & Config */}
        <div className="space-y-5">
          {/* Crop Selector */}
          <div className="bg-[#1e293b]/60 border border-slate-700 rounded-2xl p-4">
            <p className="text-slate-400 text-xs font-mono uppercase mb-3">Sélectionner la culture</p>
            <div className="flex gap-2">
              {CROPS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCrop(c.id)}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all ${
                    selectedCrop === c.id
                      ? 'bg-[#f97316] text-white shadow-[0_0_12px_rgba(249,115,22,0.35)]'
                      : 'bg-[#0f172a] text-slate-400 border border-slate-700 hover:border-[#f97316]/40'
                  }`}
                >
                  {c.emoji} {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Drag & Drop Zone */}
          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={() => !preview && fileInputRef.current?.click()}
            className={`relative overflow-hidden border-2 border-dashed rounded-3xl transition-all duration-300 cursor-pointer
              ${isDragging
                ? 'border-[#f97316] bg-[#f97316]/10 shadow-[0_0_30px_rgba(249,115,22,0.25)] scale-[1.01]'
                : preview ? 'border-slate-600 bg-transparent' : 'border-slate-700 bg-[#1e293b]/40 hover:border-[#f97316]/50 hover:bg-[#f97316]/5'
              }`}
            style={{ minHeight: '240px' }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />

            <AnimatePresence mode="wait">
              {preview ? (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative"
                >
                  <img src={preview} alt="Aperçu" className="w-full h-60 object-cover rounded-3xl" />
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-[#0f172a]/80 to-transparent flex items-end p-4">
                    <span className="text-white text-sm font-mono truncate">{image?.name}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); setImage(null); setPreview(null); setResult(null); }}
                      className="ml-auto p-1.5 bg-slate-800/80 border border-slate-600 rounded-lg text-slate-400 hover:text-white transition"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center p-10 space-y-3"
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${isDragging ? 'bg-[#f97316] text-white' : 'bg-[#0f172a] text-slate-500'}`}>
                    <Upload size={28} />
                  </div>
                  <p className="text-white font-semibold text-sm">{isDragging ? 'Déposez l\'image ici !' : 'Glissez une photo de feuille'}</p>
                  <p className="text-slate-500 text-xs">ou cliquez pour sélectionner · PNG, JPG, WEBP</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={!image || loading}
            className={`w-full py-4 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-3 ${
              image && !loading
                ? 'bg-[#f97316] text-white shadow-[0_0_25px_rgba(249,115,22,0.35)] hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(249,115,22,0.5)]'
                : 'bg-[#1e293b] text-slate-500 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyse CNN en cours...
              </>
            ) : (
              <>
                <Zap size={20} />
                Lancer le Diagnostic IA
              </>
            )}
          </button>
        </div>

        {/* RIGHT : Results Panel */}
        <div className="bg-[#1e293b]/60 border border-slate-700 rounded-3xl overflow-hidden">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 space-y-5 h-full"
              >
                {/* Severity Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs font-mono uppercase">Résultat du Diagnostic</span>
                  {severityCfg && (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${severityCfg.color} ${severityCfg.bg} ${severityCfg.border}`}>
                      ● Sévérité {severityCfg.label}
                    </span>
                  )}
                </div>

                {/* Pathogen */}
                <div className="bg-[#0f172a]/70 border border-slate-700 p-4 rounded-2xl">
                  <p className="text-slate-500 text-xs font-mono mb-1">PATHOGÈNE DÉTECTÉ</p>
                  <p className="text-[#f97316] text-xl font-bold">{result.detected}</p>
                </div>

                {/* Confidence Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-mono">CONFIANCE IA</span>
                    <span className="text-white font-bold">{(result.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-2.5 bg-[#0f172a] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.confidence * 100}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                      className="h-full bg-gradient-to-r from-[#f97316] to-[#ea580c] rounded-full shadow-[0_0_8px_rgba(249,115,22,0.5)]"
                    />
                  </div>
                </div>

                {/* Treatment */}
                <div className="bg-green-400/5 border border-green-400/20 p-4 rounded-2xl flex gap-3">
                  <CheckCircle size={18} className="text-green-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-green-400 text-xs font-mono mb-1">TRAITEMENT SUGGÉRÉ</p>
                    <p className="text-slate-300 text-sm leading-relaxed">{result.treatment}</p>
                  </div>
                </div>

                {/* Incident Alert */}
                {incidentCreated && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-orange-400/5 border border-orange-400/20 p-3 rounded-xl flex items-center gap-3"
                  >
                    <AlertTriangle size={16} className="text-[#f97316] shrink-0" />
                    <p className="text-slate-300 text-xs">Incident créé dans le module <strong className="text-white">Pest Control</strong></p>
                  </motion.div>
                )}

                {/* AgroBrain Link */}
                <button
                  onClick={askAgroBrain}
                  className="w-full py-3 flex items-center justify-center gap-2 bg-[#0f172a] border border-slate-600 rounded-2xl text-slate-300 text-sm hover:border-[#f97316]/50 hover:text-[#f97316] transition-all group"
                >
                  <Bot size={16} className="group-hover:text-[#f97316] transition-colors" />
                  Demander à l'Agro-Brain d'expliquer
                  <ArrowRight size={14} />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center p-10 space-y-4"
                style={{ minHeight: '400px' }}
              >
                <div className="w-20 h-20 rounded-2xl bg-[#0f172a] border border-slate-700 flex items-center justify-center">
                  <Leaf size={36} className="text-slate-600" />
                </div>
                <p className="text-slate-500 text-sm text-center">En attente d'une image pour<br />le diagnostic visuel</p>
                <p className="text-slate-600 text-xs font-mono">NETWORK PRÊT · PORT 8000</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Info Bar */}
      <div className="bg-[#1e293b]/40 border border-slate-800 rounded-2xl p-4 flex flex-wrap gap-6 justify-center text-xs text-slate-500 font-mono">
        <span>🔬 MODÈLE : CNN SIMULÉ v1.0</span>
        <span>🌐 ENDPOINT : localhost:8000/analyze</span>
        <span>📋 DOCS : localhost:8000/docs</span>
        <span>🔄 NEXT : PyTorch ResNet-50</span>
      </div>
    </div>
  );
}
