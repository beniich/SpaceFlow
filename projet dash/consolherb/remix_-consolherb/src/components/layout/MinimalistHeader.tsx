import React, { useState, useEffect } from 'react';
import { User, Satellite, Thermometer, Globe } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import TokenWidget from '../ui/TokenWidget';


const MinimalistHeader = () => {
  const [data, setData] = useState({ ip: '...', temp: '...', time: '' });
  const [satellites, setSatellites] = useState({ active: 3, total: 3 });

  useEffect(() => {
    // 1. IP fetching
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setData(prev => ({ ...prev, ip: data.ip })))
      .catch(() => setData(prev => ({ ...prev, ip: '127.0.0.1' })));

    // 2. Weather fetching (Example: Paris)
    fetch('https://api.open-meteo.com/v1/forecast?latitude=48.85&longitude=2.35&current_weather=true')
      .then(res => res.json())
      .then(data => setData(prev => ({ ...prev, temp: `${Math.round(data.current_weather.temperature)}°C` })))
      .catch(() => setData(prev => ({ ...prev, temp: '--°C' })));

    // 3. Real-time clock
    const timer = setInterval(() => {
      setData(prev => ({ ...prev, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) }));
    }, 1000);

    // 4. Satellite Simulation
    const satTimer = setInterval(() => {
      setSatellites({ active: Math.floor(Math.random() * 2) + 2, total: 3 });
    }, 10000);

    return () => { clearInterval(timer); clearInterval(satTimer); };
  }, []);

  return (
    <header className="h-12 w-full bg-[#0f172a] border-b border-white/10 flex items-center justify-between px-4 text-slate-400 text-[11px] font-medium tracking-tight shrink-0 z-50">
      
      {/* LEFT: Brand */}
      <div className="flex items-center gap-3">
        <div className="bg-accent text-white font-bold px-2 py-0.5 rounded text-xs">CH</div>
        <span className="text-slate-200 font-semibold tracking-wide">CONSOLHERB</span>
      </div>

      {/* CENTER: Live Data Stream */}
      <div className="hidden md:flex items-center gap-6 border-x border-white/10 px-6 h-full">
        <div className="flex items-center gap-2">
          <Globe size={12} className="text-blue-400" />
          <span>IP: <span className="text-slate-200">{data.ip}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <Thermometer size={12} className="text-orange-400" />
          <span>{data.temp}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-200 font-mono">{data.time}</span>
        </div>
      </div>

      {/* RIGHT: System Status & Profile */}
      <div className="flex items-center gap-3">
        {/* Token Widget */}
        <TokenWidget />

        {/* Theme Toggle */}
        <ThemeToggle />

        <div className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded-full border border-white/10">
          <Satellite size={12} className="text-purple-400" />
          <span className="hidden sm:inline">SATS: </span>
          <span className="text-slate-200 font-bold">{satellites.active}/{satellites.total}</span>
        </div>
        
        <div className="relative group cursor-pointer z-50">
          <div className="w-7 h-7 rounded-full bg-slate-700 border border-white/20 flex items-center justify-center overflow-hidden">
             <User size={16} className="text-slate-300" />
          </div>
          {/* Minimal Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-[#1e293b] border border-white/10 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all translate-y-2 group-hover:translate-y-0 p-2">
            <div className="px-3 py-2 text-xs font-bold text-slate-400 border-b border-white/10 mb-1">Mon Compte</div>
            <div className="px-3 py-2 text-xs text-slate-300 hover:bg-white/5 rounded-lg cursor-pointer" onClick={() => window.location.href = '/billing'}>Facturation & Jetons</div>
            <div className="px-3 py-2 text-xs text-slate-300 hover:bg-white/5 rounded-lg cursor-pointer" onClick={() => window.location.href = '/upgrade'}>Changer de Plan</div>
            <div className="px-3 py-2 text-xs text-slate-300 hover:bg-white/5 rounded-lg cursor-pointer" onClick={() => window.location.href = '/team'}>Gérer l'Équipe</div>
            <div className="px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer">Déconnexion</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MinimalistHeader;
