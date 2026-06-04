import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, Maximize2, ZoomIn, ZoomOut, Compass, 
  Laptop, Monitor, Smartphone, Check, HelpCircle, 
  RefreshCw, Globe, ArrowRight, Server, Activity, ShieldAlert, Cpu, X
} from "lucide-react";
import { Device } from "../types";

// Static pre-calculated simplified continent geometries (SVG viewport width=1000, height=500)
const CONTINENT_PATHS = [
  {
    name: "North America",
    id: "na",
    path: "M 80,120 Q 110,60 160,50 Q 220,40 280,30 Q 340,30 350,50 Q 360,70 350,110 T 280,160 T 240,225 T 195,240 T 175,200 T 120,180 T 80,120 Z"
  },
  {
    name: "Greenland",
    id: "gl",
    path: "M 320,30 Q 355,15 390,25 Q 410,40 395,65 Q 375,85 345,75 T 320,30 Z"
  },
  {
    name: "South America",
    id: "sa",
    path: "M 195,242 Q 225,240 245,260 Q 280,290 310,340 T 300,440 T 255,480 T 230,410 T 195,300 T 195,242 Z"
  },
  {
    name: "Europe",
    id: "eu",
    path: "M 390,145 Q 425,120 465,100 Q 510,105 525,120 T 515,160 T 470,195 T 410,195 T 390,145 Z"
  },
  {
    name: "Africa",
    id: "af",
    path: "M 410,205 Q 440,200 490,195 Q 525,210 565,240 T 575,310 T 555,370 T 525,430 T 495,450 T 465,370 T 415,260 T 410,205 Z"
  },
  {
    name: "Asia",
    id: "as",
    path: "M 525,120 Q 560,95 620,80 Q 700,70 780,75 Q 860,85 885,115 T 880,180 T 845,230 T 790,300 Q 755,325 730,290 T 670,290 T 610,240 T 550,200 T 525,120 Z"
  },
  {
    name: "Australia",
    id: "au",
    path: "M 760,365 Q 795,355 835,350 Q 860,370 855,400 T 835,435 T 785,420 T 760,365 Z"
  }
];

// Seed coordinates lying strictly inside land polygons to simulate the "City Lights/Satellite Clusters" in background
const BACKGROUND_CITY_LIGHTS = [
  // NA
  { x: 140, y: 100 }, { x: 180, y: 120 }, { x: 200, y: 110 }, { x: 260, y: 130 }, { x: 280, y: 120 }, { x: 220, y: 80 }, { x: 160, y: 150 },
  // SA
  { x: 210, y: 280 }, { x: 240, y: 320 }, { x: 280, y: 360 }, { x: 250, y: 400 }, { x: 270, y: 300 },
  // Europe
  { x: 420, y: 160 }, { x: 450, y: 140 }, { x: 470, y: 155 }, { x: 440, y: 175 }, { x: 480, y: 130 },
  // Africa
  { x: 450, y: 260 }, { x: 500, y: 240 }, { x: 520, y: 300 }, { x: 470, y: 340 }, { x: 490, y: 380 }, { x: 510, y: 410 },
  // Asia
  { x: 570, y: 160 }, { x: 620, y: 140 }, { x: 660, y: 180 }, { x: 740, y: 150 }, { x: 790, y: 160 }, { x: 810, y: 140 },
  { x: 840, y: 180 }, { x: 770, y: 220 }, { x: 720, y: 240 }, { x: 750, y: 260 }, { x: 820, y: 220 },
  // Australia
  { x: 780, y: 380 }, { x: 820, y: 375 }, { x: 810, y: 410 }
];

interface GlobalHorizonMapProps {
  devices?: Device[];
  onNavigateToVariant?: (variantId: number) => void;
}

export const GlobalHorizonMap: React.FC<GlobalHorizonMapProps> = ({
  devices: rawDevices = [],
  onNavigateToVariant
}) => {
  // Navigation tabs state & filters logic
  const [regionFilter, setRegionFilter] = useState<string>("All");
  const [deviceTypes, setDeviceTypes] = useState({
    Laptops: true,
    Desktops: true,
    Mobile: true
  });
  const [statusFilter, setStatusFilter] = useState<string>("Online"); // Matching wireframe visual status default
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Map Navigation Zoom and Pan controls
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [activeTooltipId, setActiveTooltipId] = useState<string | null>(null);

  // Dynamic live clock matching screenshot
  const [timestamp, setTimestamp] = useState<string>("14:35:00 UTC");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hrs = String(now.getUTCHours()).padStart(2, "0");
      const mins = String(now.getUTCMinutes()).padStart(2, "0");
      setTimestamp(`${hrs}:${mins} UTC`);
    };
    updateClock();
    const interval = setInterval(updateClock, 10000);
    return () => clearInterval(interval);
  }, []);

  // Hydrate devices with logical regions and coordinates
  const processedDevices = useMemo(() => {
    return rawDevices.map((device) => {
      let region: "North America" | "Europe" | "Asia-Pac" = "North America";
      let x = 200;
      let y = 150;
      let type: "Laptops" | "Desktops" | "Mobile" = "Desktops";

      // 1. Assign Region & Coordinates
      const loc = device.location.toLowerCase();
      if (loc.includes("alpha") || loc.includes("beta") || loc.includes("flight")) {
        region = "North America";
        if (loc.includes("alpha")) { x = 210; y = 175; } // West Area
        else if (loc.includes("beta")) { x = 290; y = 195; } // East US Area
        else { x = 250; y = 240; } // South US Area
      } else if (loc.includes("refinery") || loc.includes("cleanroom") || loc.includes("substructure")) {
        region = "Europe";
        if (loc.includes("refinery")) { x = 480; y = 145; } // Central Europe
        else if (loc.includes("cleanroom")) { x = 445; y = 135; } // Northern Europe/UK
        else { x = 460; y = 175; } // Southern Europe
      } else {
        region = "Asia-Pac";
        if (loc.includes("delta") || device.id === "DEV-044" || device.id === "DEV-048") { 
          x = 730; y = 280; // Singapore/Tokyo area
        } else if (device.id === "DEV-047" || loc.includes("sydney")) { 
          x = 840; y = 415; // Australia Sydney
        } else { 
          x = 825; y = 180; // Tokyo
        }
      }

      // 2. Assign Device Type
      const name = device.name.toLowerCase();
      const os = device.os.toLowerCase();
      if (os === "macos" || name.includes("laptop") || name.includes("rot") || name.includes("valve")) {
        type = "Laptops";
      } else if (os === "windows" || name.includes("analyzer") || name.includes("scada")) {
        type = "Mobile";
      } else {
        type = "Desktops";
      }

      return {
        ...device,
        region,
        type,
        geoX: x,
        geoY: y
      };
    });
  }, [rawDevices]);

  // Filtered devices list for pins showing on the map
  const filteredDevices = useMemo(() => {
    return processedDevices.filter((dev) => {
      // 1. Region Filter
      if (regionFilter !== "All" && dev.region !== regionFilter) return false;

      // 2. Device Type Checklist
      if (dev.type === "Laptops" && !deviceTypes.Laptops) return false;
      if (dev.type === "Desktops" && !deviceTypes.Desktops) return false;
      if (dev.type === "Mobile" && !deviceTypes.Mobile) return false;

      // 3. Status Checked Radio
      const s = statusFilter.toLowerCase();
      if (s === "online" && dev.status !== "online") return false;
      if (s === "offline" && dev.status !== "offline") return false;
      if (s === "active" && dev.status === "offline") return false; // Active includes online and warning

      // 4. Locative Search Context
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchName = dev.name.toLowerCase().includes(query);
        const matchLoc = dev.location.toLowerCase().includes(query);
        const matchIp = dev.ip.includes(query);
        if (!matchName && !matchLoc && !matchIp) return false;
      }

      return true;
    });
  }, [processedDevices, regionFilter, deviceTypes, statusFilter, searchQuery]);

  interface ClusterItem {
    x: number;
    y: number;
    mainCount: number;
    totalDevices: number;
    label: string;
  }

  // Dynamic region counts that count elements after general filtering & multipliers to match screenshot
  const clustersData = useMemo<Record<string, ClusterItem>>(() => {
    const naFiltered = processedDevices.filter(d => d.region === "North America");
    const euFiltered = processedDevices.filter(d => d.region === "Europe");
    const apFiltered = processedDevices.filter(d => d.region === "Asia-Pac");

    // Compute standard factors to simulate total fleet density scaled with active state filters
    const laptopMult = deviceTypes.Laptops ? 1.0 : 0.65;
    const desktopMult = deviceTypes.Desktops ? 1.0 : 0.5;
    const mobileMult = deviceTypes.Mobile ? 1.0 : 0.45;
    const aggFactor = laptopMult * desktopMult * mobileMult;

    let naBaseCount = Math.round(512 * aggFactor);
    let euBaseCount = Math.round(345 * aggFactor);
    let apBaseCount = Math.round(890 * aggFactor);

    if (statusFilter.toLowerCase() === "offline") {
      naBaseCount = Math.round(naBaseCount * 0.15);
      euBaseCount = Math.round(euBaseCount * 0.12);
      apBaseCount = Math.round(apBaseCount * 0.18);
    } else if (statusFilter.toLowerCase() === "online") {
      naBaseCount = Math.round(naBaseCount * 0.75);
      euBaseCount = Math.round(euBaseCount * 0.81);
      apBaseCount = Math.round(apBaseCount * 0.72);
    }

    if (regionFilter !== "All") {
      if (regionFilter !== "North America") naBaseCount = 0;
      if (regionFilter !== "Europe") euBaseCount = 0;
      if (regionFilter !== "Asia-Pac") apBaseCount = 0;
    }

    return {
      na: {
        x: 305,
        y: 200,
        mainCount: naBaseCount || naFiltered.length,
        totalDevices: 912,
        label: "North America"
      },
      eu: {
        x: 505,
        y: 155,
        mainCount: euBaseCount || euFiltered.length,
        totalDevices: 345,
        label: "Europe"
      },
      ap: {
        x: 770,
        y: 320,
        mainCount: apBaseCount || apFiltered.length,
        totalDevices: 880,
        label: "Asia-Pac"
      }
    };
  }, [processedDevices, deviceTypes, statusFilter, regionFilter]);

  // Zoom manipulation actions
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.7));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };
  const handleFitBounds = () => {
    setZoom(1.15);
    setPan({ x: 0, y: 0 });
  };

  // Status indicators UI config lookup utilities
  const getStatusRingColor = (status: "online" | "warning" | "offline") => {
    if (status === "online") return "border-emerald-500/30 shadow-emerald-500/20";
    if (status === "warning") return "border-amber-500/30 shadow-amber-500/20";
    return "border-zinc-550/30 shadow-zinc-500/20";
  };

  const getStatusDotColor = (status: "online" | "warning" | "offline") => {
    if (status === "online") return "bg-emerald-400";
    if (status === "warning") return "bg-amber-400";
    return "bg-zinc-500";
  };

  return (
    <div className="flex flex-col h-full bg-[#030712] text-slate-300 rounded-3xl border border-white/5 relative font-sans overflow-hidden shadow-2xl">
      
      {/* 1. Header Bar Area matching layout image */}
      <div className="px-6 py-5 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-[#050a18]/60 backdrop-blur-md">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5 tracking-tight">
            <span className="text-sky-500 cursor-default uppercase">Geographic Fleet Map</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            FixLab — Visualizing real-time nodes and security telemetry worldwide
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#09152a] rounded-lg border border-sky-500/10 text-[10px] font-mono text-sky-400">
            <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-ping" />
            <span>SECURE STREAM ONLINE</span>
          </div>
        </div>
      </div>

      {/* 2. Primary Layout Framework: Sidebar + Map viewport */}
      <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-180px)] min-h-[550px]">
        
        {/* LEFT SIDEBAR FILTERS PANEL */}
        <aside className="w-full lg:w-72 bg-[#050a18]/70 border-r border-white/5 p-5 flex flex-col gap-6 shrink-0 relative overflow-y-auto">
          
          {/* Filter: Region Dropdown Selector */}
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2 block">Region</label>
            <div className="relative">
              <select 
                value={regionFilter} 
                onChange={(e) => setRegionFilter(e.target.value)}
                className="w-full bg-[#091022] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 font-medium outline-none focus:border-sky-500/80 focus:ring-1 focus:ring-sky-500/40 transition appearance-none cursor-pointer"
              >
                <option value="All">All Regions</option>
                <option value="North America">North America</option>
                <option value="Europe">Europe</option>
                <option value="Asia-Pac">Asia-Pac</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* Filter: Device Type Checklist checkboxes */}
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2 block">Device Type</label>
            <div className="space-y-2 bg-[#091022]/60 p-4 rounded-xl border border-white/5">
              
              <button 
                onClick={() => setDeviceTypes(prev => ({ ...prev, Laptops: !prev.Laptops }))}
                className="w-full flex items-center justify-between text-left text-xs text-slate-300 font-medium py-1 hover:text-white transition"
              >
                <div className="flex items-center gap-2.5">
                  <Laptop className="w-4 h-4 text-sky-400" />
                  <span>Laptops</span>
                </div>
                <div className={`w-4 h-4 rounded flex items-center justify-center border transition ${deviceTypes.Laptops ? "bg-sky-500 border-sky-500 text-white" : "border-slate-500/30 bg-transparent text-transparent"}`}>
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              </button>

              <button 
                onClick={() => setDeviceTypes(prev => ({ ...prev, Desktops: !prev.Desktops }))}
                className="w-full flex items-center justify-between text-left text-xs text-slate-300 font-medium py-1 hover:text-white transition mt-1"
              >
                <div className="flex items-center gap-2.5">
                  <Monitor className="w-4 h-4 text-sky-400" />
                  <span>Desktops</span>
                </div>
                <div className={`w-4 h-4 rounded flex items-center justify-center border transition ${deviceTypes.Desktops ? "bg-sky-500 border-sky-500 text-white" : "border-slate-500/30 bg-transparent text-transparent"}`}>
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              </button>

              <button 
                onClick={() => setDeviceTypes(prev => ({ ...prev, Mobile: !prev.Mobile }))}
                className="w-full flex items-center justify-between text-left text-xs text-slate-300 font-medium py-1 hover:text-white transition mt-1"
              >
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-sky-400" />
                  <span>Mobile</span>
                </div>
                <div className={`w-4 h-4 rounded flex items-center justify-center border transition ${deviceTypes.Mobile ? "bg-sky-500 border-sky-500 text-white" : "border-slate-500/30 bg-transparent text-transparent"}`}>
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              </button>

            </div>
          </div>

          {/* Filter: Status Segmented Option keys */}
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2 block">Status Rule</label>
            <div className="space-y-2 bg-[#091022]/60 p-4 rounded-xl border border-white/5">
              
              <button 
                onClick={() => setStatusFilter("Online")}
                className="w-full flex items-center justify-between text-xs py-1"
              >
                <div className="flex items-center gap-2.5 text-slate-300 font-medium hover:text-white transition">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                  <span>Online Only</span>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center p-0.5 transition ${statusFilter === "Online" ? "border-sky-500 text-sky-500" : "border-slate-500/30 text-transparent"}`}>
                  <div className="w-2 h-2 rounded-full bg-sky-500" />
                </div>
              </button>

              <button 
                onClick={() => setStatusFilter("Offline")}
                className="w-full flex items-center justify-between text-xs py-1 mt-1"
              >
                <div className="flex items-center gap-2.5 text-slate-300 font-medium hover:text-white transition">
                  <span className="w-2 h-2 rounded-full bg-slate-500" />
                  <span>Offline Only</span>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center p-0.5 transition ${statusFilter === "Offline" ? "border-sky-500 text-sky-500" : "border-slate-500/30 text-transparent"}`}>
                  <div className="w-2 h-2 rounded-full bg-sky-500" />
                </div>
              </button>

              <button 
                onClick={() => setStatusFilter("Active")}
                className="w-full flex items-center justify-between text-xs py-1 mt-1"
              >
                <div className="flex items-center gap-2.5 text-slate-300 font-medium hover:text-white transition">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                  <span>Active & Alerting</span>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center p-0.5 transition ${statusFilter === "Active" ? "border-sky-500 text-sky-500" : "border-slate-500/30 text-transparent"}`}>
                  <div className="w-2 h-2 rounded-full bg-sky-500" />
                </div>
              </button>

            </div>
          </div>

          {/* Filter: Location Search text query */}
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2 block">Search Location</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Locations..."
                className="w-full bg-[#091022] border border-white/10 rounded-xl pl-9.5 pr-4 py-2.5 text-xs text-slate-200 outline-none focus:border-sky-500/80 transition"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3.5 top-3.5" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-3.5 text-slate-450 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Side stats: Showing filtered pins results */}
          <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>FILTERED PINS:</span>
            <span className="text-sky-400 font-extrabold">{filteredDevices.length} / {processedDevices.length} ACTIVE</span>
          </div>

        </aside>

        {/* WORKSPACE CENTRAL MAP VIEWPORT PANEL */}
        <main className="flex-1 relative bg-[#040813] p-4 flex items-center justify-center overflow-hidden">
          
          {/* Technical scanning background grid overlay */}
          <div className="absolute inset-0 bg-[#040813] z-0 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(34,211,238,0.02)" strokeWidth="0.8" />
                </pattern>
                <pattern id="accentVerticalGrid" width="160" height="160" patternUnits="userSpaceOnUse">
                  <path d="M 160 0 L 0 0 0 160" fill="none" stroke="rgba(34,211,238,0.04)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#mapGrid)" />
              <rect width="100%" height="100%" fill="url(#accentVerticalGrid)" />
              
              {/* Clinical navigation horizontal indicator lines */}
              <line x1="0" y1="150" x2="100%" y2="150" stroke="rgba(34,211,238,0.05)" strokeWidth="1" strokeDasharray="3 4" />
              <text x="24" y="145" className="text-[8px] font-mono fill-slate-650 opacity-40 font-bold uppercase tracking-widest">Tropic of Cancer • [23.4°N]</text>

              <line x1="0" y1="250" x2="100%" y2="250" stroke="rgba(34,211,238,0.08)" strokeWidth="1" strokeDasharray="1 0" />
              <text x="24" y="245" className="text-[8px] font-mono fill-sky-500/40 font-extrabold uppercase tracking-widest">Equator Axis • [0.0°N]</text>

              <line x1="0" y1="350" x2="100%" y2="350" stroke="rgba(34,211,238,0.05)" strokeWidth="1" strokeDasharray="3 4" />
              <text x="24" y="345" className="text-[8px] font-mono fill-slate-650 opacity-40 font-bold uppercase tracking-widest">Tropic of Capricorn • [23.4°S]</text>
            </svg>
          </div>

          {/* MAP CANVAS PANEL CONTENT */}
          <motion.div 
            id="geographic-map-canvas"
            className="w-full max-w-[1050px] aspect-[2/1] relative select-none"
            style={{ originX: 0.5, originY: 0.5 }}
            animate={{ scale: zoom, x: pan.x, y: pan.y }}
            transition={{ type: "spring", stiffness: 150, damping: 25 }}
          >
            {/* World Continent outline mapping layer */}
            <svg 
              viewBox="0 0 1000 500" 
              className="w-full h-full relative z-10"
              style={{ filter: "drop-shadow(0px 10px 30px rgba(0,0,0,0.85))" }}
            >
              <g id="geographic-landmasses">
                {CONTINENT_PATHS.map((cont) => (
                  <path
                    key={cont.id}
                    d={cont.path}
                    className="transition-colors duration-500 fill-[#070e1b] hover:fill-[#0a162d] stroke-[#111f3d] stroke-width-[1]"
                    style={{
                      fillOpacity: 0.85,
                      strokeOpacity: 0.5
                    }}
                  />
                ))}
              </g>

              {/* Glowing Background City Lights Cluster Dots */}
              <g id="sparkling-city-luminances">
                {BACKGROUND_CITY_LIGHTS.map((dot, idx) => {
                  const cycleDelay = (idx % 5) * 1.5;
                  return (
                    <circle
                      key={`city-${idx}`}
                      cx={dot.x}
                      cy={dot.y}
                      r="1.2"
                      className="fill-sky-400"
                      opacity="0.30"
                    />
                  );
                })}
              </g>

              {/* Pulsing Tactical Rings of Main Clusters */}
              <g id="pulsing-radar-rings">
                {(Object.entries(clustersData) as Array<[string, ClusterItem]>).map(([key, item]) => {
                  if (item.mainCount <= 0) return null;
                  return (
                    <g key={`rings-${key}`}>
                      {/* Pulse ring 1 */}
                      <circle
                        cx={item.x}
                        cy={item.y}
                        r="35"
                        fill="none"
                        stroke="rgba(14, 165, 233, 0.15)"
                        strokeWidth="1.5"
                      />
                      {/* Pulse ring 2 */}
                      <circle
                        cx={item.x}
                        cy={item.y}
                        r="55"
                        fill="none"
                        stroke="rgba(14, 165, 233, 0.05)"
                        strokeWidth="1"
                      />
                    </g>
                  );
                })}
              </g>
            </svg>

            {/* DYNAMIC COMPONENT OVERLAYS LAYER: CLUSTERS & PIN POINTS */}
            <div className="absolute inset-0 pointer-events-none z-20">
              
              {/* Rendering Larger Region Clusters */}
              {(Object.entries(clustersData) as Array<[string, ClusterItem]>).map(([key, item]) => {
                if (item.mainCount <= 0) return null;
                
                // SVG percentage layout conversion matching coordinates
                const leftPct = `${item.x / 10}%`;
                const topPct = `${item.y / 10}%`;

                return (
                  <div
                    key={`cluster-${key}`}
                    className="absolute flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-default"
                    style={{ left: leftPct, top: topPct }}
                  >
                    {/* Top labels */}
                    <div className="text-[10px] text-sky-400 font-extrabold mb-1 px-1.5 py-0.5 rounded uppercase tracking-wider bg-black/60 border border-sky-500/10 shadow-[0_0_10px_rgba(14,165,233,0.1)]">
                      {item.label}
                    </div>
                    <div className="text-[8px] text-slate-500 font-mono mb-1 font-bold">
                      ({item.totalDevices} Devices)
                    </div>

                    <div className="relative flex items-center justify-center w-14 h-14">
                      {/* Continuous pulse ring scale animation */}
                      <motion.div 
                        className="absolute inset-0 rounded-full bg-sky-500/10 border border-sky-400/35 shadow-[0_0_20px_rgba(14,165,233,0.2)]"
                        animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0.1, 0.6] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <div className="absolute inset-1.5 rounded-full bg-[#0a1426] border border-sky-500/20 flex items-center justify-center z-10">
                        <span className="text-white font-extrabold text-base tracking-tight font-mono">
                          {item.mainCount}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Rendering Floating device-specific pins */}
              {filteredDevices.map((dev) => {
                const isHovered = activeTooltipId === dev.id;
                
                // Coordinates percentages
                const leftPct = `${dev.geoX / 10}%`;
                const topPct = `${dev.geoY / 10}%`;

                return (
                  <div
                    key={`pin-${dev.id}`}
                    className="absolute pointer-events-auto"
                    style={{ left: leftPct, top: topPct }}
                  >
                    {/* Pulsing blue node trigger */}
                    <div className="relative -translate-x-1/2 -translate-y-1/2">
                      
                      <button
                        onMouseEnter={() => setActiveTooltipId(dev.id)}
                        onMouseLeave={() => setActiveTooltipId(null)}
                        onClick={() => setActiveTooltipId(activeTooltipId === dev.id ? null : dev.id)}
                        className="relative z-35 flex items-center justify-center focus:outline-none group"
                      >
                        {/* Pulse dot halo ring */}
                        <motion.div
                          className="absolute w-5 h-5 rounded-full bg-sky-400/20 border border-sky-400/40"
                          animate={{ scale: [1, 2.1, 1], opacity: [0.8, 0, 0.8] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                        />

                        {/* Solid inner pin indicator */}
                        <div className={`w-2.5 h-2.5 rounded-full border border-black shadow-[0_0_10px_#38bdf8] ${getStatusDotColor(dev.status)} transition-transform duration-350 hover:scale-130`} />

                        {/* Interactive hover tooltip connector visual line */}
                        {isHovered && (
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-sky-400/60" />
                        )}
                      </button>

                      {/* Tooltip Hover Widget Content Overlay */}
                      <AnimatePresence>
                        {isHovered && (
                          <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute bottom-5 left-1/2 -translate-x-1/2 z-40 bg-[#070d19]/95 border border-sky-500/40 p-3 rounded-xl shadow-2xl backdrop-blur-md w-56 text-left pointer-events-none"
                            style={{ boxShadow: "0 0 25px rgba(14,165,233,0.3)" }}
                          >
                            <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-1.5">
                              <span className="text-[10px] font-mono text-slate-400 tracking-wider">HOST TELEMETRY</span>
                              <div className="flex items-center gap-1 bg-[#10b981]/15 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold text-[#10b981]">
                                {dev.status === "online" ? "ONLINE" : dev.status === "warning" ? "WARNING" : "OFFLINE"}
                              </div>
                            </div>

                            <h4 className="text-xs font-bold text-white tracking-wider flex items-center gap-1.5">
                              {dev.type === "Laptops" ? <Laptop className="w-3.5 h-3.5 text-sky-400" /> : <Monitor className="w-3.5 h-3.5 text-sky-400" />}
                              <span className="italic truncate">{dev.name}</span>
                            </h4>

                            <div className="space-y-1 mt-2 text-[9px] font-mono">
                              <div className="flex justify-between">
                                <span className="text-slate-500">IP ADDRESS:</span>
                                <span className="text-slate-300 font-bold">{dev.ip}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">SYSTEM OS:</span>
                                <span className="text-slate-300">{dev.os}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">COMPLIANCE:</span>
                                <span className="text-emerald-400 font-bold">{dev.policyCompliance}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">ACTIVE UNIT:</span>
                                <span className="text-sky-400 truncate max-w-[100px]">{dev.location}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 grid grid-cols-2 gap-1 mt-2.5 pt-2 border-t border-white/5">
                              <div className="flex flex-col">
                                <span className="text-[8px] text-slate-500 font-mono">CPU LOAD</span>
                                <span className="text-[10px] font-bold text-[#38bdf8]">{dev.cpu}%</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[8px] text-slate-500 font-mono">RAM DEPTH</span>
                                <span className="text-[10px] font-bold text-[#a855f7]">{dev.ram}%</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                    </div>
                  </div>
                );
              })}

            </div>

          </motion.div>

          {/* 3. Outer Interactive Translucent controls bottom line panel */}
          <div className="absolute top-6 right-6 flex flex-col gap-2 z-30">
            
            <button 
              onClick={handleZoomIn}
              className="w-10 h-10 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:border-sky-500/50 backdrop-blur-md transition shadow-lg cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-5 h-5" />
            </button>

            <button 
              onClick={handleZoomOut}
              className="w-10 h-10 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:border-sky-500/50 backdrop-blur-md transition shadow-lg cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-5 h-5" />
            </button>

            <button 
              onClick={handleResetZoom}
              className="w-10 h-10 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:border-sky-500/50 backdrop-blur-md transition shadow-lg cursor-pointer"
              title="Reset Zoom"
            >
              <Compass className="w-5 h-5" />
            </button>

            <button 
              onClick={handleFitBounds}
              className="w-10 h-10 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:border-sky-500/50 backdrop-blur-md transition shadow-lg cursor-pointer"
              title="Fit Bounds"
            >
              <Maximize2 className="w-5 h-5" />
            </button>

          </div>

          {/* Bottom map overlay legend bar */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-black/70 border border-white/5 px-4.5 py-3 rounded-xl backdrop-blur-lg z-30 pointer-events-auto">
            
            <div className="flex flex-wrap items-center gap-5 text-[11px] font-medium text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                <span>Office Cluster Node</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.4)]" />
                <span>Remote Device Node</span>
              </div>
            </div>

            <div className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-slate-500 animate-pulse" />
              <span>Last Updated Match: {timestamp}</span>
            </div>

          </div>

        </main>
      </div>

    </div>
  );
};

