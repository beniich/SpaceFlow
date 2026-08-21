import React from 'react';
import { motion } from 'framer-motion';

export default function ImpactReport() {
  return (
    <div className="min-h-screen bg-brand-obsidian text-zinc-100 font-sans relative overflow-hidden flex flex-col items-center pt-8">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-brand-obsidian/90 backdrop-blur-3xl" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-brand-cyan/10 rounded-[100%] blur-[100px] mix-blend-screen" />
        
        {/* Bottom flame/energy effect */}
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-orange-600/40 via-blue-600/20 to-transparent blur-[60px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 bg-white/5 border border-white/10 rounded-full px-6 py-3 flex items-center justify-between w-full max-w-4xl backdrop-blur-xl mb-16">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 text-brand-cyan">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <span className="font-bold">BeeCarbonit</span>
        </div>
        <div className="flex gap-6 text-sm font-medium">
          <a href="#" className="text-zinc-400 hover:text-zinc-200">DASHBOARD</a>
          <a href="#" className="text-zinc-400 hover:text-zinc-200">FACILITIES</a>
          <a href="/impact" className="text-brand-cyan">IMPACT REPORT</a>
          <a href="#" className="text-zinc-400 hover:text-zinc-200">DATA PULSE</a>
          <a href="#" className="text-zinc-400 hover:text-zinc-200">ABOUT US</a>
        </div>
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
          <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
        </div>
      </nav>

      <main className="relative z-10 flex flex-col items-center w-full max-w-5xl px-6">
        {/* Hero Number */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-7xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-brand-cyan to-blue-500 tracking-tighter drop-shadow-[0_0_40px_rgba(0,242,255,0.4)]"
          >
            4,200+
          </motion.h1>
          <p className="text-xl md:text-2xl mt-4 text-zinc-300 tracking-wide">Metric Tons CO2e Reduced</p>
        </div>

        {/* Environmental Metrics */}
        <div className="w-full mb-16">
          <h2 className="text-xl font-semibold text-brand-cyan mb-6 text-center uppercase tracking-widest">
            Environmental Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl flex flex-col items-center hover:border-brand-cyan/50 transition-colors">
              <div className="w-full flex justify-between text-xs text-zinc-400 font-medium mb-8">
                <span>CO2 REDUCTION GOAL</span>
                <span className="text-brand-cyan">📈</span>
              </div>
              <div className="relative w-40 h-40 flex items-center justify-center mb-4">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                  <circle cx="50" cy="50" r="40" stroke="#00f2ff" strokeWidth="8" fill="none" strokeDasharray="251" strokeDashoffset="37" className="drop-shadow-[0_0_8px_rgba(0,242,255,0.8)]" strokeLinecap="round" />
                </svg>
                <div className="absolute text-center">
                  <span className="text-sm text-zinc-400">Chart.js</span>
                  <div className="text-4xl font-bold">85%</div>
                  <span className="text-brand-cyan">↗</span>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl flex flex-col items-center hover:border-brand-cyan/50 transition-colors">
              <div className="w-full flex justify-between text-xs text-zinc-400 font-medium mb-8">
                <span>TOTAL CARBON OFFSET</span>
                <span className="text-brand-cyan">🌲</span>
              </div>
              <div className="relative w-40 h-40 flex items-center justify-center mb-4">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                  <circle cx="50" cy="50" r="40" stroke="#00f2ff" strokeWidth="8" fill="none" strokeDasharray="251" strokeDashoffset="100" className="drop-shadow-[0_0_8px_rgba(0,242,255,0.8)]" strokeLinecap="round" />
                </svg>
                <div className="absolute text-center">
                  <div className="text-3xl font-bold">1,500+</div>
                  <span className="text-xs text-zinc-400 uppercase">Tonnes</span>
                </div>
              </div>
              <p className="text-xs text-zinc-500 text-center">Equivalent to 30,000 trees planted</p>
            </div>

            {/* Card 3 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl flex flex-col items-center hover:border-brand-cyan/50 transition-colors">
              <div className="w-full flex justify-between text-xs text-zinc-400 font-medium mb-8">
                <span>ENERGY EFFICIENCY SCORE</span>
              </div>
              <div className="relative w-40 h-40 flex items-center justify-center mb-4">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                  <circle cx="50" cy="50" r="40" stroke="#00f2ff" strokeWidth="8" fill="none" strokeDasharray="251" strokeDashoffset="20" className="drop-shadow-[0_0_8px_rgba(0,242,255,0.8)]" strokeLinecap="round" />
                </svg>
                <div className="absolute text-center">
                  <div className="text-4xl font-bold">A+</div>
                  <span className="text-sm text-zinc-400">92%</span>
                </div>
              </div>
              <p className="text-xs text-zinc-500 text-center">Building consumption optimized</p>
            </div>
          </div>
        </div>

        {/* Community Engagement */}
        <div className="w-full mb-24">
          <h2 className="text-xl font-semibold text-brand-cyan mb-6 text-center uppercase tracking-widest">
            Community Engagement & Sustainability
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl flex items-center gap-6 hover:border-brand-cyan/30 transition-colors">
               <div className="w-32 h-32 rounded-lg bg-white/5 flex-shrink-0 flex items-center justify-center overflow-hidden relative">
                  {/* Mock Vertical Farm Image */}
                  <div className="absolute inset-0 bg-green-500/20" />
                  <div className="w-full h-full border border-green-500/30 flex flex-col gap-1 p-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex-1 bg-green-400/30 rounded-sm" />
                    ))}
                  </div>
               </div>
               <div>
                 <div className="text-4xl font-bold text-white mb-2">600+</div>
                 <div className="text-sm text-zinc-400">Local Residents Trained</div>
               </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl flex items-center gap-6 hover:border-brand-cyan/30 transition-colors">
               <div className="w-32 h-32 rounded-lg bg-white/5 flex-shrink-0 flex items-center justify-center overflow-hidden relative">
                  {/* Mock Bus Image */}
                  <div className="absolute inset-x-2 bottom-4 top-8 bg-zinc-300 rounded-lg shadow-lg flex items-center justify-center border-b-4 border-blue-500">
                    <div className="w-full h-1/2 bg-blue-900/50 mb-auto rounded-t-lg" />
                  </div>
               </div>
               <div>
                 <div className="text-4xl font-bold text-white mb-2">2,000+</div>
                 <div className="text-sm text-zinc-400">Zero-Emission Trips</div>
               </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="relative z-10 w-full bg-brand-obsidian/80 border-t border-white/10 py-4 flex justify-between px-8 text-xs text-zinc-500 mt-auto">
        <span>© 2024 BeeCarbonit. All rights reserved. Carbon-Neutral Initiative.</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-zinc-300">Facebook</a>
          <a href="#" className="hover:text-zinc-300">Twitter</a>
          <a href="#" className="hover:text-zinc-300">Instagram</a>
        </div>
      </footer>
    </div>
  );
}
