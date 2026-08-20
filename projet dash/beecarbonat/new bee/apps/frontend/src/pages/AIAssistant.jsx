import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles, Send, Bot, User, Paperclip, Mic, ShieldCheck,
  CheckCircle2, AlertTriangle, ArrowRight, Zap, RefreshCw, FileText, Wrench
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: 'Bonjour, je suis Aether. Votre assistant expert SRE & BEECARBONAT Facility Pro. Comment puis-je vous aider aujourd\'hui ?',
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (queryText) => {
    const promptToSubmit = queryText || input;
    if (!promptToSubmit.trim() || loading) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: promptToSubmit,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const { data } = await api.post('/ai/query', { prompt: promptToSubmit });

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.reply || 'Analyse terminée avec succès.',
        widget: data.widget,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      toast.error('Erreur d\'échange avec l\'assistant SRE');
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: 'Erreur lors de l\'accès au serveur d\'intelligence. Veuillez vérifier la connexion.',
          timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWOFromWidget = async (widget) => {
    try {
      const { data } = await api.post('/ai/create-workorder', {
        title: `Maintenance : ${widget.title || 'Anomalie Équipement'}`,
        description: widget.description || 'Généré automatiquement suite à détection anomalie télémétrique SRE.',
        priority: 'HIGH',
        assetName: widget.assetName || 'CHLR'
      });
      toast.success(data.message || 'Ordre de travail créé !');
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-confirm-${Date.now()}`,
          sender: 'ai',
          text: `✅ Ordre de travail N° ${data.workOrder?.number || 'WO-AI-01'} créé et assigné dans la file d'attente de maintenance !`,
          timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      toast.error('Erreur lors de la création de l\'ordre de travail');
    }
  };

  const toggleMic = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('La reconnaissance vocale n\'est pas supportée par ce navigateur.');
      return;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'fr-FR';

      if (isListening) {
        setIsListening(false);
        return;
      }

      setIsListening(true);
      toast.success('Écoute vocale activée...');

      recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        toast.success('Commande vocale saisie');
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-zinc-950 text-zinc-100 max-w-6xl mx-auto p-4 md:p-6">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-950/60 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-display uppercase tracking-widest text-zinc-100 flex items-center gap-2">
              Aether SRE AI Assistant
              <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                LIVE BDD & TELEMETRIE
              </span>
            </h1>
            <p className="text-xs font-mono text-zinc-400">
              Moteur d'intelligence prédictive et assistance technique automatisée
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-zinc-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Confidentiel BEECARBONAT</span>
        </div>
      </div>

      {/* Preset Suggestions */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-2 shrink-0 no-scrollbar">
        <button
          type="button"
          onClick={() => handleSend('Quelles sont les anomalies détectées sur les refroidisseurs Bâtiment Alpha ?')}
          className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-mono text-xs rounded-none shrink-0 whitespace-nowrap transition"
        >
          🔍 Anomalies Bâtiment Alpha
        </button>
        <button
          type="button"
          onClick={() => handleSend('Optimiser la consommation énergie et ventilation HVAC')}
          className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-mono text-xs rounded-none shrink-0 whitespace-nowrap transition"
        >
          ⚡ Optimisation Énergétique
        </button>
        <button
          type="button"
          onClick={() => handleSend('Quel est le statut global de tous mes équipements et ordres de travail ?')}
          className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-mono text-xs rounded-none shrink-0 whitespace-nowrap transition"
        >
          📊 Télémétrie & Parc Actifs
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 font-mono text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[75%] p-4 ${
                msg.sender === 'user'
                  ? 'bg-cyan-950/40 border border-cyan-500/40 text-cyan-100'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-200'
              }`}
            >
              <div className="flex items-center justify-between gap-4 mb-1 border-b border-zinc-800/80 pb-1 text-[10px] text-zinc-500">
                <span className="font-bold text-zinc-400 uppercase">
                  {msg.sender === 'user' ? 'Vous' : 'Aether SRE Core'}
                </span>
                <span>{msg.timestamp}</span>
              </div>

              <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

              {/* Interactive Widget attached to AI Message */}
              {msg.widget && (
                <div className="mt-4 p-4 bg-zinc-950 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between text-amber-400 font-bold border-b border-zinc-800 pb-2">
                    <span className="flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      {msg.widget.title}
                    </span>
                  </div>

                  {msg.widget.description && (
                    <p className="text-zinc-400 text-xs">{msg.widget.description}</p>
                  )}

                  {msg.widget.metrics && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                      {msg.widget.metrics.map((m, idx) => (
                        <div key={idx} className="p-2 bg-zinc-900 border border-zinc-800">
                          <p className="text-[10px] text-zinc-500 uppercase">{m.label}</p>
                          <p className="text-sm font-bold text-cyan-400">{m.value}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {msg.widget.recommendations && (
                    <div className="pt-2">
                      <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Recommandations :</p>
                      <ul className="space-y-1">
                        {msg.widget.recommendations.map((rec, idx) => (
                          <li key={idx} className="text-[11px] text-zinc-300 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-amber-400 shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-800">
                    <button
                      type="button"
                      onClick={() => handleCreateWOFromWidget(msg.widget)}
                      className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-bold text-xs uppercase flex items-center gap-1.5"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      Créer Ordre de Travail
                    </button>
                    <Link
                      to="/work-orders"
                      className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs flex items-center gap-1.5"
                    >
                      Voir les Ordres de Travail
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 shrink-0">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 items-center text-cyan-400">
            <div className="w-8 h-8 bg-cyan-950 border border-cyan-500/40 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3 bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Aether analyse la télémétrie en temps réel...
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="mt-4 pt-3 border-t border-zinc-800 shrink-0"
      >
        <div className="relative bg-zinc-900 border border-zinc-800 focus-within:border-cyan-500 transition">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Posez une question, tapez une commande ou demandez une analyse prédictive SRE..."
            rows="2"
            className="w-full bg-transparent px-4 py-3 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:outline-none resize-none pr-28"
          />

          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            <button
              type="button"
              onClick={toggleMic}
              className={`p-2 transition ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'text-zinc-500 hover:text-zinc-200'
              }`}
              title="Dictée vocale"
            >
              <Mic className="w-4 h-4" />
            </button>

            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-bold disabled:opacity-40 transition"
              title="Envoyer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 mt-2">
          <span>Appuyez sur Entrée pour envoyer (Maj + Entrée pour nouvelle ligne)</span>
          <span>Boutons d'action connectés à l'API backend</span>
        </div>
      </form>
    </div>
  );
}
