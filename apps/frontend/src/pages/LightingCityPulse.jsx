import React, { useState } from 'react';
import { Sun, Moon, Sliders, Clock, Lightbulb, ChevronRight, AlertTriangle, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LightingCityPulse() {
  const [selectedLamp, setSelectedLamp] = useState('Lamp 104');
  const [intensity, setIntensity] = useState(80);
  const [colorTemp, setColorTemp] = useState(50);
  const [isOn, setIsOn] = useState(true);
  const [scheduleMode, setScheduleMode] = useState(true);

  return (
    <div className="min-h-screen bg-[#0b0f14] text-slate-100 p-4 sm:p-6 lg:p-8 font-sans relative">
      {/* Top Title Bar */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#f38020]/20 border border-[#f38020]/40 flex items-center justify-center text-[#f38020]">
            <Lightbulb className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
              BeeCarbonat <span className="text-slate-400 font-normal">Lighting - City Pulse</span>
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Pilotage dynamique de l'éclairage public et des réseaux urbains intelligents
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> RESEAU SYNCHRONISÉ
          </span>
        </div>
      </div>

      {/* Main 3-Column Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Navigation Tree */}
        <div className="lg:col-span-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-4">
          <div className="text-xs font-mono uppercase tracking-widest text-[#00dbe7] border-b border-slate-800 pb-2">
            City Grid Hierarchy
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="text-slate-300 font-semibold flex items-center gap-1.5">
              <ChevronRight className="w-4 h-4 text-[#f38020]" /> City Grid
            </div>
            <div className="pl-4 space-y-1 text-slate-400">
              <div className="flex items-center justify-between text-slate-200">
                <span>Park Sector A</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <div className="pl-4 space-y-1">
                <div className="text-slate-400">Streetlights</div>
                <div className="pl-4 space-y-1">
                  {['Lamp 102', 'Lamp 103', 'Lamp 104', 'Lamp 105'].map((lamp) => (
                    <button
                      key={lamp}
                      onClick={() => setSelectedLamp(lamp)}
                      className={`w-full text-left px-2 py-1 rounded transition flex items-center justify-between ${
                        selectedLamp === lamp
                          ? 'bg-[#f38020]/20 text-[#f38020] font-bold border border-[#f38020]/40'
                          : 'hover:bg-slate-800/80 text-slate-300'
                      }`}
                    >
                      <span>{lamp}</span>
                      {lamp === 'Lamp 104' && <AlertTriangle className="w-3 h-3 text-amber-400" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Central 3D Interactive Park View */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative h-[420px] rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
            {/* Background Simulated Night Park Visual */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#060a0f] via-[#0b131f] to-[#04080d]" />

            {/* Glowing Lamp Poles Graphic Overlay */}
            <div className="relative w-full h-full p-8 flex flex-col justify-between items-center pointer-events-none">
              <div className="w-full flex justify-between text-xs font-mono text-slate-400">
                <span>CHARCOAL TREE • PARK SECTOR A</span>
                <span className="text-[#00dbe7]">3D VIEW ACTIVE</span>
              </div>

              {/* Glowing Neon Streetlight Graphic Elements */}
              <div className="relative w-full max-w-md h-48 flex items-end justify-around">
                {/* Pole 1 */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-1.5 h-36 rounded-t transition-all duration-300"
                    style={{
                      backgroundColor: isOn ? '#f38020' : '#334155',
                      boxShadow: isOn ? `0 0 ${intensity / 2}px #f38020` : 'none'
                    }}
                  />
                  <div className="w-8 h-2 bg-slate-700 rounded-full mt-1" />
                </div>

                {/* Pole 2 (Selected Lamp 104) */}
                <div className="flex flex-col items-center scale-110">
                  <div
                    className="w-2 h-40 rounded-t transition-all duration-300 relative"
                    style={{
                      backgroundColor: isOn ? '#00dbe7' : '#334155',
                      boxShadow: isOn ? `0 0 ${intensity}px #00dbe7` : 'none'
                    }}
                  >
                    <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full border border-amber-400/60 animate-ping" />
                  </div>
                  <div className="w-10 h-2 bg-slate-700 rounded-full mt-1" />
                </div>

                {/* Pole 3 */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-1.5 h-36 rounded-t transition-all duration-300"
                    style={{
                      backgroundColor: isOn ? '#f38020' : '#334155',
                      boxShadow: isOn ? `0 0 ${intensity / 2}px #f38020` : 'none'
                    }}
                  />
                  <div className="w-8 h-2 bg-slate-700 rounded-full mt-1" />
                </div>
              </div>

              {/* On-Screen Floating Glassmorphic Controller Box */}
              <div className="pointer-events-auto w-full max-w-sm p-4 rounded-xl bg-slate-900/80 border border-slate-700/80 backdrop-blur-xl shadow-2xl space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                  <span>Intensity</span>
                  <span className="text-[#f38020] font-bold">{intensity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={intensity}
                  onChange={(e) => setIntensity(parseInt(e.target.value))}
                  className="w-full accent-[#f38020] bg-slate-800"
                />

                <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                  <span>Color Temp</span>
                  <span className="text-[#00dbe7] font-bold">{colorTemp > 50 ? 'Cool White' : 'Warm Amber'}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={colorTemp}
                  onChange={(e) => setColorTemp(parseInt(e.target.value))}
                  className="w-full accent-[#00dbe7] bg-slate-800"
                />

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs font-mono">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isOn}
                      onChange={(e) => setIsOn(e.target.checked)}
                      className="accent-[#f38020] w-4 h-4 rounded"
                    />
                    <span>On / Off</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={scheduleMode}
                      onChange={(e) => setScheduleMode(e.target.checked)}
                      className="accent-[#00dbe7] w-4 h-4 rounded"
                    />
                    <span>Schedule Mode</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Timeline Bar */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-2">
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>16:00</span>
              <span>17:00</span>
              <span>22:00</span>
              <span>03:00</span>
              <span>06:00</span>
              <span>09:00</span>
              <span>12:00</span>
            </div>
            <div className="flex gap-2 h-8 text-xs font-mono font-bold">
              <div className="flex-1 bg-[#f38020] rounded-lg flex items-center justify-center text-white">
                Evening 80%
              </div>
              <div className="flex-1 bg-slate-700/80 rounded-lg flex items-center justify-center text-slate-300">
                Late Night 30%
              </div>
              <div className="flex-1 bg-[#f38020] rounded-lg flex items-center justify-center text-white">
                Evening 80%
              </div>
            </div>
          </div>
        </div>

        {/* Right Properties Inspector */}
        <div className="lg:col-span-3 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-4">
            <div className="border-b border-slate-800 pb-2">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Properties Inspector</span>
              <div className="text-lg font-bold text-white mt-1">Lamp ID: #SL-A-104</div>
            </div>

            <div className="space-y-3 text-xs font-mono text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Hauteur:</span>
                <span className="text-white">30 ft</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Type de mât:</span>
                <span className="text-white">Pole Space</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Puissance nominale:</span>
                <span className="text-[#00dbe7]">120W</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Intensité actuelle:</span>
                <span className="text-[#f38020]">{intensity}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Installation:</span>
                <span className="text-white">09/25/2024</span>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-3">
              <div className="text-[10px] font-mono text-slate-400 mb-1">GUID METADATA</div>
              <div className="p-2 bg-slate-950 rounded border border-slate-800 text-[10px] font-mono text-slate-300 break-all">
                #GM-4477-4bsa-e2735a
              </div>
            </div>

            <button
              onClick={() => toast.success("Ordre de travail pour le lampadaire #SL-A-104 créé")}
              className="w-full py-2.5 rounded-xl bg-[#f38020] hover:bg-orange-600 text-xs font-bold text-white transition tracking-wider uppercase font-mono shadow-lg shadow-orange-500/20"
            >
              Create Work Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
