import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Wrench, ShieldAlert } from 'lucide-react';

interface AgroSystemMaintenanceProps {
  onExit: () => void;
}

export default function AgroSystemMaintenance({ onExit }: AgroSystemMaintenanceProps) {
  return (
    <div className="relative min-h-[640px] px-6 py-12 flex flex-col items-center justify-center overflow-hidden bg-radial from-[#ffffff] to-[#FAF9F5] rounded-[32px] border border-[#e1d5c1]" id="agro-system-maintenance">
      
      {/* Immersive blurred organic leaf shape background blobs (Image 9 blobs) */}
      <div 
        className="absolute w-[600px] h-[600px] bg-[#BC542B]/5 rounded-full filter blur-[100px] pointer-events-none"
        style={{ top: '-10%', left: '-15%' }} 
      />
      <div 
        className="absolute w-[500px] h-[500px] bg-[#BC542B]/8 rounded-full filter blur-[110px] pointer-events-none"
        style={{ bottom: '-15%', right: '-10%' }} 
      />

      {/* Main glass card structure centering */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-2xl bg-white/50 backdrop-blur-md rounded-[3rem] p-8 sm:p-12 border border-white max-sm:px-6 shadow-xl text-center"
      >
        
        {/* Abstract floating service indicator icon */}
        <div className="mx-auto w-14 h-14 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-[#BC542B] mb-6 animate-pulse select-none">
          <Wrench className="w-6 h-6" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-stone-900 leading-tight mb-4 text-[#8a3311]">
          System Maintenance - <br />Optimizing your yields
        </h1>

        <p className="text-stone-500 font-sans text-sm sm:text-base leading-relaxed max-w-md mx-auto mb-10">
          Our system is currently undergoing scheduled maintenance to enhance your agricultural management experience. We appreciate your patience as we calibrate advanced IoT telemetry nodes in the background.
        </p>

        {/* Tactile exit button */}
        <button
          onClick={onExit}
          className="px-8 py-4 bg-[#BC542B] hover:bg-[#a33f1b] text-white rounded-2xl font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-lg hover:shadow-orange-500/20 hover:translate-y-[-2px] active:translate-y-0 active:scale-95 cursor-pointer flex items-center gap-2.5 mx-auto"
        >
          <span>Return To Dashboard</span>
          <ArrowUpRight className="w-4 h-4 text-orange-200" />
        </button>

        {/* Live maintenance status ticker */}
        <div className="mt-8 pt-4 border-t border-stone-150 inline-flex items-center gap-2 text-[10px] font-mono text-stone-400 uppercase tracking-widest select-none">
          <ShieldAlert className="w-3.5 h-3.5 text-[#BC542B]" />
          <span>Status: Real-time sensor recalibration active</span>
        </div>

      </motion.div>

      {/* Static Footer */}
      <footer className="mt-12 text-center text-[11px] text-stone-400 font-mono tracking-wide z-10">
        © 2026 AgroMaître. All rights reserved. | Contact Support | Privacy Policy
      </footer>

    </div>
  );
}
