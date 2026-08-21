import React, { useState } from 'react';
import { Send, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SupportAI() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Hello! How can I assist you with your BeeCarbonit facility today? I can help with system inquiries, sustainability reports, or technical issues.'
    },
    {
      id: 2,
      sender: 'user',
      text: "Hi, I'm seeing an alert on the HVAC efficiency dashboard. Can you check the carbon offset data?"
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages(prev => [
      ...prev,
      { id: Date.now(), sender: 'user', text: input }
    ]);
    setInput('');
    
    // Mock AI response
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { 
          id: Date.now() + 1, 
          sender: 'ai', 
          text: 'Checking the HVAC efficiency dashboard now. It appears there was a brief fluctuation in the cooling cycle causing a temporary drop in efficiency. The carbon offset data is currently synchronizing to reflect this.' 
        }
      ]);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-brand-obsidian text-zinc-100 font-sans relative overflow-hidden flex flex-col">
      {/* Background Graphic - Cybernetic lines */}
      <div className="absolute inset-0 z-0 opacity-20">
         <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
           <defs>
             <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M10 10 L40 10 L50 20 L50 80 L60 90 L90 90" fill="none" stroke="#00f2ff" strokeWidth="2" strokeOpacity="0.5" />
                <circle cx="90" cy="90" r="3" fill="#00f2ff" />
                <circle cx="10" cy="10" r="3" fill="#00f2ff" />
             </pattern>
           </defs>
           <rect width="100%" height="100%" fill="url(#circuit)" />
         </svg>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-obsidian/50 to-brand-obsidian z-0" />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 bg-brand-obsidian/50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 text-brand-primary">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <span className="text-2xl font-bold tracking-tight">BeeCarbonit</span>
        </div>
        <div className="hidden md:flex gap-8 font-medium">
          <a href="#" className="text-zinc-400 hover:text-zinc-200">Home</a>
          <a href="#" className="text-zinc-400 hover:text-zinc-200">Knowledge Base</a>
          <a href="#" className="text-zinc-400 hover:text-zinc-200">Submit Ticket</a>
          <a href="#" className="text-zinc-400 hover:text-zinc-200">Sustainability</a>
          <a href="#" className="text-zinc-400 hover:text-zinc-200">Contact</a>
        </div>
      </nav>

      <main className="relative z-10 flex-grow container mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left Side - 3D Bee / Hologram Concept */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative w-80 h-80 mb-8 group">
            {/* Hologram Base */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-12 bg-gradient-to-t from-brand-cyan/40 to-transparent rounded-[100%] blur-sm" />
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-4 border-2 border-brand-cyan/50 rounded-[100%] shadow-[0_0_15px_#00f2ff]" />
            
            {/* Bee Placeholder (Simulating 3D model with glowing effects) */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="relative w-48 h-48 bg-gradient-to-br from-brand-primary/80 to-orange-600 rounded-[40%_60%_70%_30%] blur-[2px] shadow-[0_0_50px_rgba(243,128,32,0.4)] flex items-center justify-center">
                <div className="w-24 h-24 bg-white/20 rounded-full blur-md" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Chat Interface */}
        <div className="flex-1 w-full max-w-xl">
          <div className="mb-6">
            <h1 className="text-4xl font-bold mb-2">BeeCarbonit Support - <span className="text-brand-cyan">AI Assistant</span></h1>
            <p className="text-zinc-400">Variant 16/20 - Interactive Help Center</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-2xl shadow-[0_0_30px_rgba(0,242,255,0.05)] overflow-hidden flex flex-col h-[500px] relative">
            {/* Inner glow border */}
            <div className="absolute inset-0 border border-brand-cyan/20 rounded-2xl pointer-events-none" />
            
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
              <span className="font-semibold text-brand-cyan">Bee-Drone AI Connection Active</span>
              <button className="text-zinc-400 hover:text-white"><X size={20} /></button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center mr-3 flex-shrink-0 border border-brand-primary/50 shadow-[0_0_10px_rgba(243,128,32,0.3)]">
                      <span className="text-xs">🐝</span>
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] p-4 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30 rounded-tr-none'
                      : 'bg-white/10 text-zinc-200 border border-white/5 rounded-tl-none'
                  }`}>
                    {msg.sender === 'ai' && <div className="text-xs font-bold mb-1 opacity-50">Bee-Drone AI</div>}
                    {msg.sender === 'user' && <div className="text-xs font-bold mb-1 opacity-50 text-right">User</div>}
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                  
                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center ml-3 flex-shrink-0 border border-white/10">
                      <span className="text-xs">👤</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-4 bg-white/5 border-t border-white/10">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message here..."
                  className="w-full bg-black/40 border border-white/10 rounded-full py-3 px-6 text-sm text-white focus:outline-none focus:border-brand-primary/50 focus:shadow-[0_0_15px_rgba(243,128,32,0.2)] transition-all"
                />
                <button 
                  onClick={handleSend}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-brand-cyan/20 text-brand-cyan hover:bg-brand-cyan/40 hover:text-white flex items-center justify-center transition-colors"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 py-6 text-center text-xs text-zinc-500 bg-brand-obsidian/80">
        <div className="flex justify-center gap-6 mb-2">
          <a href="#" className="hover:text-zinc-300">Privacy Policy</a>
          <a href="#" className="hover:text-zinc-300">Terms of Service</a>
          <a href="#" className="hover:text-zinc-300">Contact Us</a>
        </div>
        <p>© 2024 BeeCarbonit. All rights reserved.</p>
      </footer>
    </div>
  );
}
