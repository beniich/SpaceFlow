import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, Info, Zap, Building2, Workflow } from 'lucide-react';

const technologies = [
  {
    id: 1,
    icon: <Workflow size={24} />,
    title: 'Next-Gen Carbon Capture',
    description: 'Revolutionary material science for ultra-efficient CO2 absorption. Pilot tests exceeding targets by 40%.',
    active: true
  },
  {
    id: 2,
    icon: <Zap size={24} />,
    title: 'AI-Driven Grid Efficiency',
    description: 'Predictive algorithms for optimizing energy distribution in real-time. Reducing waste and increasing stability.',
    active: false
  },
  {
    id: 3,
    icon: <Building2 size={24} />,
    title: 'Sustainable Urban Integration',
    description: 'Modular carbon-neutral infrastructure solutions for modern cities. Seamless integration with existing systems.',
    active: false
  },
  {
    id: 4,
    icon: <Zap size={24} />,
    title: 'Power Thrust Generators',
    description: 'Modular carbon-neutral infrastructure solutions for modern cities. Seamless integration with existing systems.',
    active: false
  }
];

export default function InnovationLab() {
  return (
    <div className="min-h-screen bg-brand-obsidian text-zinc-100 font-sans relative overflow-hidden flex flex-col">
      {/* Background with Orange/Blue Gradient & Tech Draft lines */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#e67300] via-[#c65800] to-blue-900/40">
         {/* Tech Blueprint Grid Overlay */}
         <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
         
         {/* Subtle circular glows */}
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/10 rounded-full blur-[100px] mix-blend-overlay" />
         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[100px] mix-blend-overlay" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-12 py-8 w-full max-w-screen-2xl mx-auto text-black">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <div>
            <span className="text-2xl font-bold tracking-tight block leading-tight">BeeCarbonit</span>
            <span className="text-xl font-normal block leading-tight">Innovation</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-10 font-semibold">
          <a href="#" className="hover:opacity-70 transition-opacity">Projects</a>
          <a href="#" className="hover:opacity-70 transition-opacity">Technologies</a>
          <a href="#" className="hover:opacity-70 transition-opacity">Team</a>
          <a href="#" className="hover:opacity-70 transition-opacity">About</a>
          <button className="hover:opacity-70 transition-opacity">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          </button>
        </div>
      </nav>

      <main className="relative z-10 flex-grow w-full max-w-screen-2xl mx-auto px-12 pt-12 flex flex-col justify-between">
        
        {/* Header Text & 3D Model Area */}
        <div className="flex justify-between items-start">
          <div className="max-w-xl text-white">
            <h1 className="text-6xl md:text-7xl font-bold leading-tight mb-4 drop-shadow-lg">
              BeeCarbonit<br/>Innovation -<br/>R&D Lab
            </h1>
          </div>
          
          {/* Simulated 3D Turbine Models (represented by CSS/SVG for mockup) */}
          <div className="relative w-[600px] h-[400px] flex-shrink-0 hidden lg:block mr-24">
             {/* Main Turbine */}
             <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-zinc-300 rounded-full border-[20px] border-zinc-400 shadow-2xl flex items-center justify-center">
                <div className="w-16 h-16 bg-zinc-800 rounded-full shadow-inner" />
                {/* Simulated blades */}
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="absolute w-2 h-24 bg-zinc-400 origin-bottom" style={{ transform: `translateY(-24px) rotate(${i * 30}deg)` }} />
                ))}
             </div>
             
             {/* Smaller Turbines */}
             <div className="absolute top-12 right-24 w-40 h-40 bg-zinc-300 rounded-full border-[12px] border-zinc-400 shadow-xl opacity-80 flex items-center justify-center transform scale-75">
               <div className="w-10 h-10 bg-zinc-800 rounded-full" />
             </div>
             <div className="absolute bottom-12 right-32 w-48 h-48 bg-zinc-300 rounded-full border-[15px] border-zinc-400 shadow-xl opacity-90 flex items-center justify-center transform scale-90">
               <div className="w-12 h-12 bg-zinc-800 rounded-full" />
             </div>
             
             {/* UI Markers attached to 3D models */}
             <div className="absolute top-1/2 left-[10%] bg-white/20 backdrop-blur-md border border-white/40 rounded-full px-4 py-1 text-sm text-white shadow-lg flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
               Efficiency +12%
             </div>
          </div>
        </div>

        {/* Bottom Technology Cards Carousel */}
        <div className="mt-auto mb-16 flex gap-6 overflow-x-auto pb-4 snap-x hide-scrollbar">
          {/* Spacer for alignment if needed */}
          <div className="w-4 flex-shrink-0" />
          
          {technologies.map((tech) => (
            <div 
              key={tech.id} 
              className={`snap-start flex-shrink-0 w-80 rounded-2xl p-6 backdrop-blur-xl transition-all duration-300 flex flex-col relative group ${
                tech.active 
                  ? 'bg-brand-primary/20 border-2 border-white shadow-[0_0_30px_rgba(255,255,255,0.2)]' 
                  : 'bg-white/10 border border-white/20 hover:bg-white/20'
              }`}
            >
              {/* Info Icon */}
              <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center cursor-pointer hover:bg-white/40">
                <Info size={14} className="text-white" />
              </div>
              
              <div className="flex items-start gap-4 mb-4">
                <div className={`p-3 rounded-xl ${tech.active ? 'bg-white/20 text-white' : 'bg-white/10 text-white/70 group-hover:text-white'}`}>
                  {tech.icon}
                </div>
                <h3 className={`text-xl font-bold leading-tight pt-1 ${tech.active ? 'text-white' : 'text-white/90 group-hover:text-white'}`}>
                  {tech.title}
                </h3>
              </div>
              
              <p className={`text-sm mb-6 ${tech.active ? 'text-white/90' : 'text-white/70 group-hover:text-white/90'}`}>
                {tech.description}
              </p>
              
              {tech.active && (
                <div className="mt-auto flex justify-between items-center">
                  <button className="bg-white text-black font-semibold px-5 py-2 rounded-full hover:bg-zinc-200 transition-colors">
                    Learn More
                  </button>
                  <div className="flex gap-2">
                    <button className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center hover:bg-black/40"><ChevronLeft size={16} /></button>
                    <button className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center hover:bg-black/40"><ChevronRight size={16} /></button>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div className="w-12 flex-shrink-0" />
        </div>
      </main>
      
      {/* Footer */}
      <footer className="relative z-10 w-full py-6 px-12 flex justify-between items-center text-sm font-medium border-t border-white/20 text-black">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg></div>
          <span className="font-bold">BeeCarbonit</span>
          <span className="ml-4 opacity-70">© 2024 BeeCarbonit. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:opacity-70">Privacy Policy</a>
          <a href="#" className="hover:opacity-70">Terms of Service</a>
          <div className="flex gap-4 ml-4">
             {/* Social Icons mock */}
             <div className="w-5 h-5 bg-black rounded-full" />
             <div className="w-5 h-5 bg-black rounded-full" />
             <div className="w-5 h-5 bg-black rounded-full" />
          </div>
        </div>
      </footer>
    </div>
  );
}
