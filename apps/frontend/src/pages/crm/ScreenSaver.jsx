import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import crmApi from '../../services/crmApi';
import { io } from 'socket.io-client';
import {
  Trophy, TrendingUp, Users, Package, Maximize,
  DollarSign, Award, Activity
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip
} from 'recharts';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const SLIDE_DURATION = 8000; // 8s par slide

const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const toggle = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return { isFullscreen, toggle };
};

const useCursorHider = (delay = 3000) => {
  const [hidden, setHidden] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const reset = () => {
      setHidden(false);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setHidden(true), delay);
    };

    window.addEventListener('mousemove', reset);
    window.addEventListener('touchstart', reset);
    reset();

    return () => {
      window.removeEventListener('mousemove', reset);
      window.removeEventListener('touchstart', reset);
      clearTimeout(timeoutRef.current);
    };
  }, [delay]);

  return hidden;
};

// ============== SLIDES ==============

const ClockSlide = ({ now }) => (
  <div className="flex flex-col items-center justify-center h-full text-white">
    <div className="text-[12vw] font-bold tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500 drop-shadow-[0_0_25px_rgba(255,255,255,0.2)]">
      {format(now, 'HH:mm', { locale: fr })}
    </div>
    <div className="text-[3vw] mt-4 font-light text-zinc-400">
      {format(now, 'EEEE d MMMM yyyy', { locale: fr })}
    </div>
  </div>
);

const KPIsSlide = ({ kpis }) => {
  const items = [
    { icon: TrendingUp, label: 'Pipeline', value: kpis?.pipelineValue || 0, color: 'text-indigo-400' },
    { icon: DollarSign, label: 'CA Gagné', value: kpis?.wonTotal || 0, color: 'text-emerald-400' },
    { icon: Users, label: 'Contacts', value: kpis?.totalContacts || 0, color: 'text-purple-400' },
    { icon: Trophy, label: 'Deals Actifs', value: kpis?.activeDeals || 0, color: 'text-yellow-400' },
  ];

  return (
    <div className="h-full flex flex-col justify-center px-[8vw]">
      <h2 className="text-[4vw] font-bold text-white mb-[4vw]">Performance Globale</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[2vw]">
        {items.map((item, i) => (
          <div
            key={item.label}
            className="bg-[#18181b]/60 backdrop-blur-xl rounded-[2vw] p-[3vw] border border-zinc-800/60 shadow-[0_0_30px_rgba(0,0,0,0.5)]"
            style={{ animation: `fadeInUp 0.6s ease-out ${i * 0.1}s both` }}
          >
            <item.icon className={`w-[4vw] h-[4vw] ${item.color} mb-[2vw] opacity-80`} />
            <p className="text-zinc-400 text-[1.5vw] font-medium mb-[1vw] uppercase tracking-wider">{item.label}</p>
            <p className="text-[3vw] font-bold text-white">
              {typeof item.value === 'number' 
                ? item.value.toLocaleString('fr-FR')
                : item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const DealOfTheDaySlide = ({ deals }) => {
  const topDeal = deals?.[0];
  
  return (
    <div className="h-full flex flex-col items-center justify-center text-white px-[8vw]">
      <Award className="w-[8vw] h-[8vw] text-yellow-500 mb-[3vw] animate-pulse drop-shadow-[0_0_20px_rgba(234,179,8,0.4)]" />
      <h2 className="text-[3vw] font-semibold mb-[2vw] text-zinc-400 tracking-widest uppercase">Deal Récemment Gagné</h2>
      {topDeal ? (
        <>
          <p className="text-[5vw] font-bold mb-[2vw] text-center leading-tight">{topDeal.name}</p>
          <p className="text-[4.5vw] font-bold text-emerald-400 mb-[2vw] drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">
            {topDeal.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
          </p>
          <p className="text-[2vw] text-zinc-400 font-light">
            {topDeal.contact?.firstName} {topDeal.contact?.lastName}
            {topDeal.contact?.company && ` • ${topDeal.contact.company}`}
          </p>
        </>
      ) : (
        <p className="text-[2.5vw] opacity-50">Aucun deal récent</p>
      )}
    </div>
  );
};

// ============== COMPOSANT PRINCIPAL ==============

export default function ScreenSaver() {
  const navigate = useNavigate();
  const [now, setNow] = useState(new Date());
  const [slideIndex, setSlideIndex] = useState(0);
  const [data, setData] = useState({ kpis: null, deals: null });
  const { isFullscreen, toggle } = useFullscreen();
  const cursorHidden = useCursorHider(3000);

  // Horloge temps réel
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Rotation slides
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex(i => (i + 1) % 3);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, []);

  // Chargement données
  useEffect(() => {
    loadData();
    const timer = setInterval(loadData, 60000); // 1 min
    return () => clearInterval(timer);
  }, []);

  // Raccourcis clavier
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'f' || e.key === 'F') toggle();
      if (e.key === 'Escape') navigate('/crm/dashboard');
      if (e.key === 'ArrowRight') setSlideIndex(i => (i + 1) % 3);
      if (e.key === 'ArrowLeft') setSlideIndex(i => (i - 1 + 3) % 3);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate, toggle]);

  const loadData = async () => {
    try {
      const [dash, dealsRes] = await Promise.all([
        crmApi.get('/dashboard/summary'),
        crmApi.get('/deals')
      ]);
      const wonDeals = dealsRes.data.filter(d => d.status === 'WON').sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      setData({ kpis: dash.data, deals: wonDeals });
    } catch (err) {
      console.error(err);
    }
  };

  const slides = [
    <ClockSlide key="clock" now={now} />,
    <KPIsSlide key="kpis" kpis={data?.kpis} />,
    <DealOfTheDaySlide key="deal" deals={data?.deals} />
  ];

  return (
    <div 
      className={`fixed inset-0 bg-[#09090b] overflow-hidden transition-colors duration-1000 ${cursorHidden ? 'cursor-none' : ''}`}
      onClick={toggle}
    >
      {/* Background ambiancing */}
      <div className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] bg-indigo-600/10 rounded-full blur-[10vw] mix-blend-screen pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] bg-emerald-600/5 rounded-full blur-[8vw] mix-blend-screen pointer-events-none"></div>

      {/* Indicateur slides */}
      <div className="absolute bottom-[3vw] left-1/2 -translate-x-1/2 flex gap-[1vw] z-50">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`h-[0.5vw] rounded-full transition-all duration-500 ${
              i === slideIndex ? 'w-[4vw] bg-white' : 'w-[1vw] bg-zinc-700'
            }`}
          />
        ))}
      </div>

      {/* Bouton fullscreen */}
      <button
        onClick={(e) => { e.stopPropagation(); toggle(); }}
        className="absolute top-[2vw] right-[2vw] p-[1vw] bg-[#18181b]/50 hover:bg-zinc-800 rounded-xl backdrop-blur-md border border-zinc-800 text-zinc-400 hover:text-white transition-colors z-50"
      >
        <Maximize className="w-[1.5vw] h-[1.5vw]" />
      </button>

      {/* Bouton retour */}
      <button
        onClick={(e) => { e.stopPropagation(); navigate('/crm/dashboard'); }}
        className="absolute top-[2vw] left-[2vw] px-[1.5vw] py-[0.8vw] bg-[#18181b]/50 hover:bg-zinc-800 rounded-xl backdrop-blur-md border border-zinc-800 text-zinc-400 hover:text-white text-[1vw] font-medium transition-colors z-50"
      >
        ← Quitter
      </button>

      {/* Slide actuel */}
      <div className="relative w-full h-full z-10">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              i === slideIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
            }`}
          >
            {slide}
          </div>
        ))}
      </div>

      {/* Horloge discrète en permanence */}
      <div className="absolute bottom-[2vw] right-[2vw] text-zinc-600 text-[1vw] font-mono tracking-widest z-50">
        {format(now, 'HH:mm')}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-pulse-slow {
          animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
