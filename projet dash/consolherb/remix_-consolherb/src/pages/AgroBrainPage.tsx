import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Sparkles, Paperclip, Mic } from 'lucide-react';
import { useStore } from '../store/useStore';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp?: Date;
}

export default function AgroBrainPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      role: 'ai',
      text: "Bonjour ! Je suis AgroBrain, l'Intelligence Autonome de Cyber-Compliance Arch. J'analyse vos capteurs en temps réel. Quelle est votre requête ?",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const addLog = useStore((s) => s.addLog);

  useEffect(() => {
    const prefill = sessionStorage.getItem('agrobrain_prefill');
    if (prefill) {
      setInput(prefill);
      sessionStorage.removeItem('agrobrain_prefill');
      addLog('info', 'Question chargée depuis le module Vision.');
    }
  }, [addLog]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg: Message = { id: `msg-${Date.now()}-user`, role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    addLog('info', `Requête RAG envoyée à AgroBrain : "${input.substring(0, 30)}..."`);

    try {
      const res = await fetch('http://localhost:4000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input })
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setMessages(prev => [...prev, { id: `msg-${Date.now()}-ai`, role: 'ai', text: data.answer, timestamp: new Date() }]);
      addLog('success', 'Réponse AgroBrain reçue et décodée.');
    } catch (err: any) {
      setMessages(prev => [...prev, { 
        id: `msg-${Date.now()}-err`, 
        role: 'ai', 
        text: `**ERREUR SYSTEME** : ${err.message || 'Le sous-réseau neuronal est hors ligne.'}`,
        timestamp: new Date()
      }]);
      addLog('error', `Echec de la liaison AgroBrain : ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-4xl mx-auto pb-4 font-sans" id="agro-brain-container">
      
      <header className="text-center mb-6 flex flex-col items-center">
        <div className="w-12 h-12 bg-[#1e293b] border border-slate-700 rounded-2xl flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(249,115,22,0.15)]">
          <Sparkles className="w-6 h-6 text-[#f97316]" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          AGRO-BRAIN <span className="text-[#f97316] font-mono text-xs border border-[#f97316]/30 bg-[#f97316]/10 px-2 py-0.5 rounded-full">v2.0</span>
        </h1>
        <p className="text-slate-400 text-xs font-mono mt-1">MODULE D'INTELLIGENCE GENERATIVE AUTONOME</p>
      </header>

      {/* CHAT AREA (Content-Centric Claude Style in Dark Mode) */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-8 mb-6 px-4 sm:px-8 py-6 bg-[#0f172a]/60 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl custom-scrollbar"
      >
        <AnimatePresence>
          {messages.map((m) => (
            <motion.div 
              key={m.id}
              initial={{ opacity: 0, y: 10, scale: 0.98 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`flex gap-4 sm:gap-6 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div className={`shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border
                ${m.role === 'ai' 
                  ? 'bg-[#1e293b] border-slate-700 text-[#f97316]' 
                  : 'bg-[#f97316]/10 border-[#f97316]/30 text-[#f97316]'
                }`}
              >
                {m.role === 'ai' ? <Bot size={18} /> : <User size={18} />}
              </div>

              {/* Message Bubble & Timestamp */}
              <div className={`flex flex-col max-w-[85%] sm:max-w-[80%] ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div 
                  className={`px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm
                    ${m.role === 'user' 
                      ? 'bg-[#f97316] text-white rounded-tr-sm' 
                      : 'bg-[#1e293b] text-slate-200 border border-slate-700 rounded-tl-sm'
                    }`}
                >
                  {/* Basic markdown bold parsing */}
                  {m.text.split(/(\*\*.*?\*\*)/g).map((part, i) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return <strong key={i} className={m.role === 'ai' ? 'text-white font-semibold' : 'font-bold'}>{part.slice(2, -2)}</strong>;
                    }
                    return <span key={i}>{part}</span>;
                  })}
                </div>
                <span className="text-[10px] text-slate-500 mt-1.5 px-1 font-mono">
                  {m.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || new Date().toLocaleTimeString()}
                </span>
              </div>
            </motion.div>
          ))}
          
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 sm:gap-6 flex-row"
            >
              <div className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#1e293b] border border-slate-700 text-[#f97316] flex items-center justify-center animate-pulse">
                <Bot size={18} />
              </div>
              <div className="bg-[#1e293b] border border-slate-700 p-4 sm:px-5 sm:py-4 rounded-2xl rounded-tl-sm flex items-center shadow-sm">
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FLOATING INPUT BAR (Claude Style in Dark Mode) */}
      <div className="relative group mx-auto w-full max-w-3xl">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#f97316]/40 to-transparent rounded-3xl blur-md opacity-20 group-hover:opacity-40 transition duration-500"></div>
        <div className="relative flex items-end p-2 bg-[#1e293b]/90 backdrop-blur-xl border border-slate-700 rounded-3xl shadow-2xl focus-within:border-[#f97316]/60 transition-all duration-300">
          
          <button className="p-3.5 text-slate-400 hover:text-[#f97316] transition-colors shrink-0">
            <Paperclip size={20} />
          </button>
          
          <textarea 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            rows={1}
            className="flex-1 py-3.5 px-2 bg-transparent text-slate-100 placeholder-slate-500 outline-none resize-none text-[15px] max-h-32 leading-relaxed custom-scrollbar" 
            placeholder="Posez une question sur vos cultures, le sol ou les capteurs..." 
            style={{ height: 'auto' }}
          />
          
          <div className="flex items-center gap-1.5 pr-1 shrink-0 pb-1">
            <button className="p-3 text-slate-400 hover:text-[#f97316] transition-colors">
              <Mic size={20} />
            </button>
            <button 
              onClick={handleSend} 
              disabled={!input.trim() || isLoading}
              className={`p-3 rounded-2xl transition-all duration-200 ${
                input.trim() && !isLoading
                  ? 'bg-[#f97316] text-white shadow-[0_0_15px_rgba(249,115,22,0.4)] hover:scale-105' 
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
        <div className="text-center mt-3">
          <span className="text-[10px] text-slate-500 font-mono tracking-wide">L'IA PEUT FAIRE DES ERREURS. VÉRIFIEZ TOUJOURS LES CONSEILS AGRONOMIQUES CRITIQUES.</span>
        </div>
      </div>

    </div>
  );
}
