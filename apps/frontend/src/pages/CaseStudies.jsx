import React, { useState } from 'react';
import { Globe, ArrowRight, CheckCircle2, Sparkles, Building2, Sun, Zap, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const projectCases = [
  {
    id: 'eco-singapore',
    title: 'Eco-District X - Singapore',
    completion: 85,
    tag: 'Smart Grid & Urban',
    description: 'Integration of smart grids, renewable energy sources, and waste-to-energy systems in a dense urban area.',
    badgeColor: 'border-[#00dbe7] text-[#00dbe7]',
    gradient: 'from-[#00dbe7]/20 via-slate-900 to-slate-950',
    icon: Building2
  },
  {
    id: 'solar-dubai',
    title: 'Solar Tower Alpha - Dubai',
    completion: 92,
    tag: 'Solar Thermal Power',
    description: "World's largest solar-thermal power plant providing clean energy for 500,000 homes with zero emissions.",
    badgeColor: 'border-[#f38020] text-[#f38020]',
    gradient: 'from-[#f38020]/20 via-slate-900 to-slate-950',
    icon: Sun
  },
  {
    id: 'green-berlin',
    title: 'Green Corridor Network - Berlin',
    completion: 78,
    tag: 'Sustainable Mobility',
    description: 'Connecting green spaces and implementing sustainable autonomous transport infrastructure.',
    badgeColor: 'border-emerald-400 text-emerald-400',
    gradient: 'from-emerald-500/20 via-slate-900 to-slate-950',
    icon: Leaf
  },
  {
    id: 'energy-norway',
    title: 'Clean Energy Hub - Norway',
    completion: 65,
    tag: 'Offshore Wind & Tidal',
    description: 'Harnessing tidal and wind power for coastal cities and zero-emission industrial parks.',
    badgeColor: 'border-cyan-400 text-cyan-400',
    gradient: 'from-cyan-500/20 via-slate-900 to-slate-950',
    icon: Zap
  }
];

export default function CaseStudies() {
  const [selectedCase, setSelectedCase] = useState(null);

  return (
    <div className="min-h-screen bg-[#070b10] text-slate-100 p-4 sm:p-6 lg:p-12 font-sans relative">
      {/* Background Tech Network */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,219,231,0.1)_0,transparent_60%)] pointer-events-none" />

      {/* Top Navigation */}
      <div className="max-w-7xl mx-auto flex items-center justify-between border-b border-slate-800 pb-6 mb-12">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-white">
            <span className="text-[#f38020]">Bee</span><span className="text-[#00dbe7]">Carbonat</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-widest text-slate-400">
          <Link to="/dashboard" className="hover:text-white transition">Home</Link>
          <Link to="/market" className="hover:text-white transition">Solutions</Link>
          <span className="text-[#00dbe7] font-bold border-b border-[#00dbe7] pb-1">Case Studies</span>
          <Link to="/about" className="hover:text-white transition">About Us</Link>
          <Link to="/careers" className="hover:text-white transition">Careers</Link>
        </div>

        <Link
          to="/partner-portal"
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition"
        >
          Partner Portal
        </Link>
      </div>

      {/* Hero Headline Section */}
      <div className="max-w-4xl mx-auto text-center mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00dbe7]/10 border border-[#00dbe7]/30 text-[#00dbe7] text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" /> GLOBAL PROJECT SHOWCASE
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
          Success Stories: Powering Our Future, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f38020] to-[#00dbe7]">Carbon-Free</span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          Explore how our innovative smart city and CAFM projects are transforming infrastructure, reducing emissions, and driving sustainability worldwide.
        </p>
      </div>

      {/* Project Cards Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {projectCases.map((project) => {
          const IconComp = project.icon;
          return (
            <div
              key={project.id}
              className={`p-6 rounded-2xl bg-gradient-to-b ${project.gradient} border border-slate-800 hover:border-slate-600 transition-all duration-300 backdrop-blur-xl flex flex-col justify-between group hover:scale-[1.02] shadow-xl`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white">
                    <IconComp className="w-5 h-5 text-[#00dbe7]" />
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono border ${project.badgeColor}`}>
                    {project.tag}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#00dbe7] transition-colors">
                    {project.title}
                  </h3>
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-xs font-mono text-slate-400">
                      <span>Project Completion:</span>
                      <span className="text-white font-bold">{project.completion}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#f38020] to-[#00dbe7] h-full rounded-full transition-all duration-1000"
                        style={{ width: `${project.completion}%` }}
                      />
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  {project.description}
                </p>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => {
                    setSelectedCase(project);
                    toast.success(`Détails de l'étude de cas : ${project.title}`);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#00dbe7]/10 hover:bg-[#00dbe7] text-[#00dbe7] hover:text-slate-950 border border-[#00dbe7]/30 text-xs font-bold transition flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-cyan-500/20"
                >
                  <span>View Case Study</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Detail View if Clicked */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">{selectedCase.title}</h3>
              <button
                onClick={() => setSelectedCase(null)}
                className="text-slate-400 hover:text-white text-sm font-mono"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-slate-300">{selectedCase.description}</p>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Avancement Global:</span>
                <span className="text-[#00dbe7] font-bold">{selectedCase.completion}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Émissions de CO2 Évitées:</span>
                <span className="text-emerald-400 font-bold">12,400 Tonnes/An</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedCase(null)}
              className="w-full py-2 rounded-xl bg-[#f38020] text-white text-xs font-bold hover:bg-orange-600 transition"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="max-w-7xl mx-auto border-t border-slate-800 pt-8 text-center text-xs font-mono text-slate-500">
        © 2026 BeeCarbonat Facilities. All rights reserved. Powered by CAFM PRO.
      </div>
    </div>
  );
}
