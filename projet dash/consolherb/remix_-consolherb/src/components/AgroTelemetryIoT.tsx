import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wifi, 
  Battery, 
  Search, 
  MapPin, 
  SlidersHorizontal, 
  Activity, 
  ListFilter, 
  Cpu, 
  AlertTriangle,
  RefreshCw,
  Droplets,
  Thermometer,
  Sun,
  Bug,
  Volume2,
  BellRing
} from 'lucide-react';

interface AgroTelemetryIoTProps {
  onAddLog: (level: 'info' | 'success' | 'warn' | 'error', message: string) => void;
}

interface SensorNode {
  id: number;
  name: string;
  zone: 'Zone A' | 'Zone B' | 'Zone C' | 'Zone D' | 'Zone E' | 'Zone F';
  signal: number;
  battery: number;
  lastPing: string;
  active: boolean;
  type: 'Moisture' | 'Temp' | 'Irrigation' | 'Pest' | 'Nutrient' | 'Weather';
  currentVal: number;
  points: number[];
}

export default function AgroTelemetryIoT({ onAddLog }: AgroTelemetryIoTProps) {
  const [activeTab, setActiveTab] = useState<'monitor' | 'thresholds'>('monitor');

  // Interactive Live Alert Thresholds Sliders
  const [humidityMinThreshold, setHumidityMinThreshold] = useState(15); // %
  const [tempMaxThreshold, setTempMaxThreshold] = useState(24);         // °C
  const [nutrientMinThreshold, setNutrientMinThreshold] = useState(10); // index/PPM

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [zoneFilter, setZoneFilter] = useState<string>('All Zones');

  // 18 sensor metrics. Added 'currentVal' to compare with reactive thresholds!
  const [sensors, setSensors] = useState<SensorNode[]>([
    { id: 1, name: 'Soil Moisture A1', zone: 'Zone A', signal: -75, battery: 88, lastPing: '2s ago', active: true, type: 'Moisture', currentVal: 12, points: [10, 15, 5, 20, 10, 12] },
    { id: 2, name: 'Temp/Humidity B4', zone: 'Zone B', signal: -70, battery: 88, lastPing: '2s ago', active: true, type: 'Temp', currentVal: 26, points: [12, 18, 14, 15, 22, 26] },
    { id: 3, name: 'Temp/Humidity B5', zone: 'Zone B', signal: -72, battery: 88, lastPing: '2s ago', active: true, type: 'Temp', currentVal: 19, points: [8, 15, 12, 19, 10, 19] },
    { id: 4, name: 'Irrigation Controller C2', zone: 'Zone C', signal: -75, battery: 88, lastPing: '2s ago', active: true, type: 'Irrigation', currentVal: 45, points: [15, 12, 10, 8, 14, 45] },
    { id: 5, name: 'Pest Monitor E1', zone: 'Zone E', signal: -75, battery: 88, lastPing: '2s ago', active: true, type: 'Pest', currentVal: 2, points: [5, 12, 8, 10, 6, 2] },
    { id: 6, name: 'Nutrient Sensor F3', zone: 'Zone F', signal: -75, battery: 88, lastPing: '2s ago', active: true, type: 'Nutrient', currentVal: 8, points: [18, 14, 15, 12, 19, 8] },
    
    { id: 7, name: 'Irrigation Controller C3', zone: 'Zone C', signal: -75, battery: 12, lastPing: '2s ago', active: true, type: 'Irrigation', currentVal: 50, points: [12, 15, 22, 10, 18, 50] }, // low battery
    { id: 8, name: 'Weather Station D5', zone: 'Zone D', signal: -68, battery: 92, lastPing: '5s ago', active: true, type: 'Weather', currentVal: 28, points: [5, 15, 25, 22, 18, 28] }, // high temp
    { id: 9, name: 'Pest Monitor E2', zone: 'Zone E', signal: -75, battery: 88, lastPing: '2s ago', active: true, type: 'Pest', currentVal: 7, points: [8, 14, 10, 12, 15, 7] },
    { id: 10, name: 'Weather Station D6', zone: 'Zone D', signal: -75, battery: 88, lastPing: '2s ago', active: false, type: 'Weather', currentVal: 0, points: [10, 10, 8, 5, 2, 0] },
    { id: 11, name: 'Nutrient Sensor F2', zone: 'Zone F', signal: -75, battery: 88, lastPing: '2s ago', active: true, type: 'Nutrient', currentVal: 18, points: [15, 18, 12, 14, 19, 18] },
    { id: 12, name: 'Nutrient Sensor F3', zone: 'Zone F', signal: -75, battery: 88, lastPing: '2s ago', active: true, type: 'Nutrient', currentVal: 23, points: [14, 12, 18, 15, 22, 23] },
    
    { id: 13, name: 'Soil Moisture A2', zone: 'Zone A', signal: -75, battery: 88, lastPing: '2s ago', active: true, type: 'Moisture', currentVal: 18, points: [10, 8, 12, 15, 14, 18] },
    { id: 14, name: 'Temp/Humidity B6', zone: 'Zone B', signal: -75, battery: 88, lastPing: '2s ago', active: true, type: 'Temp', currentVal: 21, points: [15, 22, 18, 14, 12, 21] },
    { id: 15, name: 'Pest Monitor E3', zone: 'Zone E', signal: -75, battery: 88, lastPing: '2s ago', active: true, type: 'Pest', currentVal: 5, points: [6, 12, 15, 8, 10, 5] },
    { id: 16, name: 'Nutrient Sensor F1', zone: 'Zone F', signal: -75, battery: 88, lastPing: '2s ago', active: true, type: 'Nutrient', currentVal: 12, points: [10, 14, 12, 18, 15, 12] },
    { id: 17, name: 'Nutrient Sensor F4', zone: 'Zone F', signal: -75, battery: 88, lastPing: '2s ago', active: true, type: 'Nutrient', currentVal: 14, points: [15, 12, 18, 10, 14, 14] },
    { id: 18, name: 'Nutrient Sensor F5', zone: 'Zone F', signal: -75, battery: 10, lastPing: '2s ago', active: false, type: 'Nutrient', currentVal: 0, points: [5, 4, 2, 1, 0, 0] },
  ]);

  const toggleSensorActive = (id: number, name: string, current: boolean) => {
    setSensors(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, active: !current, lastPing: !current ? 'Just now' : 'Failed' };
      }
      return s;
    }));
    onAddLog(current ? 'warn' : 'success', `SENSORS: Diagnostic du capteur [${name}] modifié. Nouvel état: ${!current ? 'ACTIF' : 'DÉSACTIVÉ'}.`);
  };

  const handleApplyThresholds = () => {
    onAddLog('success', `THRESHOLDS: Limites de sécurité calées : Humidité >= ${humidityMinThreshold}%, Température <= ${tempMaxThreshold}°C, Nutriments >= ${nutrientMinThreshold} PPM.`);
  };

  // Filtration logic representing actual values
  const filteredSensors = sensors.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' 
      ? true 
      : statusFilter === 'Active' 
        ? s.active 
        : !s.active;
    const matchesZone = zoneFilter === 'All Zones' 
      ? true 
      : s.zone === zoneFilter;

    return matchesSearch && matchesStatus && matchesZone;
  });

  return (
    <div className="bg-[#FAF9F5] text-stone-800 p-6 rounded-[28px] border border-[#e1d5c1] font-sans shadow-md" id="iot-telemetry-panel-center">
      
      {/* Brand Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#e1d5c1] pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-[#BA5834] to-[#f26b4f] rounded-xl flex items-center justify-center text-white text-lg font-bold">
            📡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-serif font-bold text-[#451e09]">AgroMaître IoT Hub</span>
              <span className="text-[9px] bg-[#BA5834]/10 text-[#BA5834] border border-[#BA5834]/30 px-2.5 py-0.5 rounded-full font-mono font-bold uppercase tracking-tight">SYSTEM INTEGRITY</span>
            </div>
            <p className="text-xs text-stone-500 font-mono">18 active nodes, threshold diagnostics & live alerting</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 text-xs font-mono text-stone-500 bg-white border border-[#CED1C5] px-3 py-1 rounded-xl">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span>Nominal (18 Sockets)</span>
        </div>
      </header>

      {/* Tabs Menu Selection */}
      <div className="flex flex-wrap gap-1.5 border-b border-stone-200 pb-3 mb-6 font-sans">
        <button
          onClick={() => setActiveTab('monitor')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold font-mono uppercase tracking-tight rounded-xl transition cursor-pointer border ${
            activeTab === 'monitor' 
              ? 'bg-[#1c2c3e] border-[#4de082] text-[#4de082] bg-stone-900 border-none' 
              : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Active Sensor Nodes Grid</span>
        </button>

        <button
          onClick={() => setActiveTab('thresholds')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold font-mono uppercase tracking-tight rounded-xl transition cursor-pointer border ${
            activeTab === 'thresholds' 
              ? 'bg-[#1c2c3e] border-[#4de082] text-[#4de082] bg-stone-900 border-none' 
              : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Configure Threshold Alerts</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        
        {/* TAB 1: SENSOR MONITORING CARD REGISTER */}
        {activeTab === 'monitor' && (
          <motion.div 
            key="tab-monitor"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="space-y-6"
          >
            {/* Filtering tools row */}
            <div className="bg-white border border-[#e1d5c1] p-3 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-3">
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <ListFilter className="w-4 h-4 text-[#BA5834]" />
                <select 
                  value={zoneFilter}
                  onChange={(e) => {
                    setZoneFilter(e.target.value);
                    onAddLog('info', `SENSORS: Zone filtrée : ${e.target.value}.`);
                  }}
                  className="bg-transparent text-xs font-mono font-bold outline-none cursor-pointer border rounded-lg px-2 py-1"
                >
                  <option value="All Zones">All Zones</option>
                  <option value="Zone A">Zone A</option>
                  <option value="Zone B">Zone B</option>
                  <option value="Zone C">Zone C</option>
                  <option value="Zone D">Zone D</option>
                  <option value="Zone E">Zone E</option>
                  <option value="Zone F">Zone F</option>
                </select>
              </div>

              <div className="flex items-center bg-stone-100 p-1 rounded-xl gap-1 text-xs font-mono">
                {['All', 'Active', 'Inactive'].map((status) => (
                  <button
                    type="button"
                    key={status}
                    onClick={() => setStatusFilter(status as any)}
                    className={`px-3 py-1 rounded-lg font-bold transition ${
                      statusFilter === status ? 'bg-white text-stone-850 shadow-xs' : 'text-stone-400 hover:text-stone-605'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-60">
                <input 
                  type="text"
                  placeholder="Search sensor index..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 border border-stone-200 outline-none text-xs rounded-xl font-mono text-stone-800"
                />
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
              </div>

            </div>

            {/* In-app Notification summary about breached bounds */}
            <div className="bg-amber-50 text-amber-900 border border-amber-200 rounded-2xl p-4 flex gap-3 text-xs leading-relaxed items-start">
              <BellRing className="w-5 h-5 text-[#BA5834] shrink-0 mt-0.5 animate-bounce" />
              <div>
                <strong className="text-sm font-serif font-bold text-[#451e09] block">Dynamic Telemetry Diagnostics Dashboard</strong>
                <p className="font-sans text-stone-700">
                  Breaches are reactive to active slider threshholds definitions under **Configure Threshold Alerts**. Moisture levels below **{humidityMinThreshold}%**, Temperatures above **{tempMaxThreshold}°C**, or Nutrient states below **{nutrientMinThreshold} PPM** will raise interactive indicators automatically.
                </p>
              </div>
            </div>

            {/* Grid display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {filteredSensors.map(s => {
                const pathData = s.points.map((p, i) => `${i * 18},${30 - p}`).join(' ');
                
                // Reactive warn indicators triggers Based on Active sliders of Tab B!
                let isBreached = false;
                let breachReason = '';

                if (s.active) {
                  if (s.type === 'Moisture' && s.currentVal < humidityMinThreshold) {
                    isBreached = true;
                    breachReason = 'LOW MOISTURE';
                  } else if (s.type === 'Temp' && s.currentVal > tempMaxThreshold) {
                    isBreached = true;
                    breachReason = 'OVERHEAT';
                  } else if (s.type === 'Nutrient' && s.currentVal < nutrientMinThreshold) {
                    isBreached = true;
                    breachReason = 'POOR FIELD PPM';
                  } else if (s.battery < 20) {
                    isBreached = true;
                    breachReason = 'BATTERY CRIT';
                  }
                }

                return (
                  <motion.div
                    key={s.id}
                    layout
                    onClick={() => toggleSensorActive(s.id, s.name, s.active)}
                    className={`bg-white border rounded-3xl p-4 shadow-xs flex flex-col justify-between transition hover:shadow-md cursor-pointer group select-none relative ${
                      isBreached 
                        ? 'border-red-300 bg-red-50/5 hover:border-red-500' 
                        : s.active 
                          ? 'border-stone-200 hover:border-[#BA5834]' 
                          : 'border-stone-150 opacity-60 bg-stone-50/30'
                    }`}
                  >

                    {/* Sensor Header info */}
                    <div>
                      <div className="flex justify-between items-center text-[9px] font-mono font-bold">
                        <span className={`flex items-center gap-1 ${s.active ? 'text-green-700' : 'text-red-700'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full inline-block ${s.active ? 'bg-green-600 animate-pulse' : 'bg-red-500'}`} />
                          {s.active ? 'Active' : 'Offline'}
                        </span>
                        <span className="text-stone-400">ID {100 + s.id}</span>
                      </div>

                      {/* Main Node Name */}
                      <div className="flex items-center gap-2 mt-2.5">
                        <span className="text-base">
                          {s.type === 'Moisture' && '💧'}
                          {s.type === 'Temp' && '🌡️'}
                          {s.type === 'Irrigation' && '⛲'}
                          {s.type === 'Pest' && '🐛'}
                          {s.type === 'Nutrient' && '🧪'}
                          {s.type === 'Weather' && '☀️'}
                        </span>
                        <h4 className="text-xs font-bold font-sans text-stone-850 truncate group-hover:text-[#BA5834] transition">
                          {s.name}
                        </h4>
                      </div>

                      {/* Sparkline mini chart */}
                      <div className="h-10 w-full bg-stone-50 border-b border-l border-stone-200 mt-3 absolute-none overflow-hidden flex items-end relative rounded">
                        <svg className="w-full h-full pointer-events-none" viewBox="0 0 100 30" preserveAspectRatio="none">
                          <polyline 
                            fill="none" 
                            stroke={isBreached ? '#ef4444' : s.active ? '#BA5834' : '#a8a29e'} 
                            strokeWidth="1.2" 
                            points={pathData} 
                          />
                        </svg>
                        <div className="absolute right-1 top-0.5 text-[7px] font-mono text-gray-400">24h</div>

                        {/* Overlaid current real-time metric label */}
                        {s.active && (
                          <div className="absolute left-1 bottom-0.5 text-[8.5px] font-mono font-bold text-[#1c2c3e]">
                            {s.currentVal}
                            {s.type === 'Moisture' && '%'}
                            {s.type === 'Temp' && '°C'}
                            {s.type === 'Nutrient' && ' PPM'}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Breach banner indicator */}
                    {isBreached && (
                      <div className="mt-2.5 px-2 py-0.5 bg-red-100 text-red-700 text-[8px] font-mono font-bold rounded-lg flex items-center justify-center gap-1">
                        <AlertTriangle className="w-2.5 h-2.5 animate-bounce" /> {breachReason}
                      </div>
                    )}

                    {/* Bottom stats details */}
                    <div className="mt-3.5 pt-2 border-t border-stone-100 flex justify-between items-center text-[8.5px] font-mono text-stone-500">
                      <div className="flex items-center gap-0.5">
                        <Wifi className="w-2.5 h-2.5 text-stone-400" />
                        <span>{s.signal}dB</span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <Battery className={`w-2.5 h-2.5 ${s.battery < 20 ? 'text-red-500 font-bold' : 'text-stone-400'}`} />
                        <span className={s.battery < 20 ? 'text-red-600 font-bold' : ''}>{s.battery}%</span>
                      </div>
                      <span className="text-stone-400">{s.lastPing}</span>
                    </div>

                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* TAB 2: INTERACTIVE SLIDING BOUNDARY CALIBRATOR */}
        {activeTab === 'thresholds' && (
          <motion.div 
            key="tab-thresholds"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="space-y-6"
          >
            <div className="bg-white border border-stone-200 rounded-[24px] p-6 shadow-xs">
              <div className="border-b border-stone-100 pb-3 mb-4">
                <h3 className="font-serif font-bold text-base text-stone-900">Calibration of Network Alerting Boundaries</h3>
                <p className="text-xs text-stone-400">Setup triggers to fire automated alarms when soil sensors index go out of strategic bounds</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans text-xs pt-2">
                
                {/* 1. Moisture */}
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-150 space-y-3.5">
                  <div className="flex items-center gap-2 text-blue-750 font-bold text-sm text-blue-700">
                    <Droplets className="w-4 h-4" />
                    <span>Min Soil Moisture: {humidityMinThreshold}%</span>
                  </div>
                  <input 
                    type="range" min={5} max={30} step={1}
                    value={humidityMinThreshold} onChange={(e) => setHumidityMinThreshold(parseInt(e.target.value))}
                    className="w-full accent-blue-600 h-1 cursor-pointer bg-stone-200"
                  />
                  <p className="text-[10px] text-stone-500 leading-relaxed">
                    Triggers warning flags for any relative humidity points reading below target value. Protects roots during crop droughts.
                  </p>
                </div>

                {/* 2. Temperature */}
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-150 space-y-3.5">
                  <div className="flex items-center gap-2 text-[#BA5834] font-bold text-sm">
                    <Thermometer className="w-4 h-4" />
                    <span>Max Air Temperature: {tempMaxThreshold}°C</span>
                  </div>
                  <input 
                    type="range" min={18} max={35} step={1}
                    value={tempMaxThreshold} onChange={(e) => setTempMaxThreshold(parseInt(e.target.value))}
                    className="w-full accent-[#BA5834] h-1 cursor-pointer bg-stone-200"
                  />
                  <p className="text-[10px] text-stone-500 leading-relaxed">
                    Raises notifications for overheat conditions inside greenhouses. Activates ventilation coils.
                  </p>
                </div>

                {/* 3. Nutrient index */}
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-150 space-y-3.5">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                    <Cpu className="w-4 h-4" />
                    <span>Min Chemical Nutrients: {nutrientMinThreshold} PPM</span>
                  </div>
                  <input 
                    type="range" min={5} max={25} step={1}
                    value={nutrientMinThreshold} onChange={(e) => setNutrientMinThreshold(parseInt(e.target.value))}
                    className="w-full accent-emerald-600 h-1 cursor-pointer bg-stone-200"
                  />
                  <p className="text-[10px] text-stone-500 leading-relaxed">
                    Warns when active nitrogen compounds fall below minimum threshold. Suggests leguminous rotation immediately.
                  </p>
                </div>

              </div>

              <div className="pt-4 border-t border-stone-100 mt-6 flex justify-end">
                <button
                  type="button" onClick={handleApplyThresholds}
                  className="px-5 py-2 bg-[#BA5834] hover:bg-[#a04321] text-white rounded-xl text-xs font-mono font-bold uppercase transition shadow-sm cursor-pointer"
                >
                  Apply & Synchronize Sockets
                </button>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
