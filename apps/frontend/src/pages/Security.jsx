import { useState, useEffect } from 'react';
import {
  Shield, Key, Lock, Eye, CheckCircle2, AlertTriangle, RefreshCw,
  Terminal, ShieldAlert, Cpu, UserCheck, Search, Filter
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Security() {
  const [enforce2FA, setEnforce2FA] = useState(true);
  const [ipRestrict, setIpRestrict] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Simulated live chronological access logs
  const [logs, setLogs] = useState([
    { id: 'l-1', user: 'Dr. Aris Thorne', event: 'SRE Login - Portal Verified', ip: '10.0.1.15', time: 'Just Now', status: 'SUCCESS' },
    { id: 'l-2', user: 'System Bot', event: 'Daily Database Automatic Backup', ip: 'Localhost', time: '5m ago', status: 'SUCCESS' },
    { id: 'l-3', user: 'External API Client', event: 'Trimble BIM Layout Node Sync', ip: '192.168.12.80', time: '12m ago', status: 'SUCCESS' },
    { id: 'l-4', user: 'Operator J. Doe', event: 'Work Order WO-1042 Updated', ip: '10.0.1.34', time: '28m ago', status: 'SUCCESS' },
    { id: 'l-5', user: 'Unknown Node', event: 'Invalid API Key Query Blocked', ip: '185.22.45.101', time: '45m ago', status: 'BLOCKED' }
  ]);

  // Live access matrix table
  const [users, setUsers] = useState([
    { id: 'u-1', name: 'Dr. Aris Thorne', role: 'Chief SRE & Director', status: 'ACTIVE', keyType: '2FA Hardware Key', location: 'Core Server Room B' },
    { id: 'u-2', name: 'Operator Jane Doe', role: 'Facility Technician', status: 'ACTIVE', keyType: 'Authenticator App', location: 'HVAC Zone 4 Corridor' },
    { id: 'u-3', name: 'Engineer Mike Smith', role: 'BIM Spatial Designer', status: 'OFFLINE', keyType: 'Yubikey Bio', location: 'Remote CAD Office' },
    { id: 'u-4', name: 'Support Bot', role: 'System Automated Script', status: 'DAEMON', keyType: 'API Authorization Token', location: 'Docker Container Node' }
  ]);

  // Generate new events periodically
  useEffect(() => {
    const eventsPool = [
      { user: 'Dr. Aris Thorne', event: 'Core cooling values requested', ip: '10.0.1.15', status: 'SUCCESS' },
      { user: 'Operator Jane Doe', event: 'FieldTech signature recorded', ip: '10.0.1.34', status: 'SUCCESS' },
      { user: 'External API Client', event: 'Sensor health poll batch complete', ip: '192.168.12.80', status: 'SUCCESS' },
      { user: 'Crawler Bot', event: 'Suspicious path access blocked (/admin)', ip: '82.165.4.12', status: 'BLOCKED' }
    ];

    const interval = setInterval(() => {
      const randomEvent = eventsPool[Math.floor(Math.random() * eventsPool.length)];
      const newLog = {
        id: `l-${Date.now()}`,
        ...randomEvent,
        time: 'Just Now'
      };

      setLogs(prev => [newLog, ...prev.slice(0, 8)]);
      if (randomEvent.status === 'BLOCKED') {
        toast.error(`Security Alert: ${randomEvent.event} from ${randomEvent.ip}`, {
          icon: '🛡️',
          duration: 3000
        });
      }
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  const handleAuditNow = () => {
    const auditToast = toast.loading('Running live cryptographic security audit...');
    setTimeout(() => {
      toast.success('Audit complete. All 4 perimeter nodes fully authenticated.', { id: auditToast });
    }, 1500);
  };

  const togglePolicy = (policyName, state, setter) => {
    setter(!state);
    toast.success(`Security Policy updated: ${policyName} is now ${!state ? 'ENABLED' : 'DISABLED'}`);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 space-y-8 bg-[#09090b] text-zinc-100 min-h-screen font-sans">
      {/* Header and Sync controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-zinc-800/60">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-display uppercase tracking-widest text-zinc-50 flex items-center gap-3">
            <Shield className="w-8 h-8 text-cyan-400 animate-pulse" />
            Security &amp; Access
          </h1>
          <p className="text-zinc-400 text-xs mt-1 max-w-xl">
            Enforce multi-factor cryptographic keys, oversee live active personnel sessions, and monitor physical/digital perimeter access logs.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleAuditNow}
            className="flex items-center gap-2 bg-cyan-950/40 hover:bg-cyan-900/40 text-cyan-400 border border-cyan-800/40 px-5 py-2.5 text-xs font-mono uppercase tracking-wider font-bold rounded-sm transition shadow-[0_0_15px_rgba(34,211,238,0.05)]"
          >
            <ShieldAlert className="w-4 h-4" />
            Audit Protocol
          </button>
        </div>
      </div>

      {/* Top Controls Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Toggle Policies */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-4">
          <h3 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest">Global Security Policies</h3>
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3.5 bg-zinc-950 border border-zinc-800 rounded-sm">
              <div>
                <span className="font-mono text-xs text-zinc-200 block">Enforce 2FA Hardware Keys</span>
                <p className="text-[10px] text-zinc-500">Require all dashboard SRE operators to confirm logins via FIDO2/WebAuthn keys.</p>
              </div>
              <button
                onClick={() => togglePolicy('2FA Enforce', enforce2FA, setEnforce2FA)}
                className="text-zinc-400 hover:text-zinc-100 transition"
              >
                <span className={`inline-block w-12 h-6 rounded-full relative transition-colors ${enforce2FA ? 'bg-cyan-500' : 'bg-zinc-800'}`}>
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-black transition-transform ${enforce2FA ? 'translate-x-7' : 'translate-x-1'}`} />
                </span>
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-zinc-950 border border-zinc-800 rounded-sm">
              <div>
                <span className="font-mono text-xs text-zinc-200 block">Strict IP Whitelisting</span>
                <p className="text-[10px] text-zinc-500">Restrict admin operations and settings edits strictly to local facility IP gateways.</p>
              </div>
              <button
                onClick={() => togglePolicy('IP Whitelisting', ipRestrict, setIpRestrict)}
                className="text-zinc-400 hover:text-zinc-100 transition"
              >
                <span className={`inline-block w-12 h-6 rounded-full relative transition-colors ${ipRestrict ? 'bg-cyan-500' : 'bg-zinc-800'}`}>
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-black transition-transform ${ipRestrict ? 'translate-x-7' : 'translate-x-1'}`} />
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Network Perimeter blueprint panel */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <h3 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest">Perimeter Status</h3>
              <span className="text-[10px] font-mono text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                SECURE
              </span>
            </div>
            <p className="text-zinc-400 text-xs mt-2">Active firewall rules analyzing incoming traffic on 12 nodes. Intrusion prevention systems status: HIGH VIGILANCE.</p>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 p-4 font-mono text-[10px] text-zinc-500 space-y-1 mt-4">
            <p className="text-cyan-500 flex items-center gap-1.5"><Terminal className="w-3 h-3" /> systemctl status beecarbonat-firewall</p>
            <p>● beecarbonat-firewall.service - Active Perimeter Shield</p>
            <p className="text-green-400">   Active: active (running) since Tue 2026-08-18</p>
            <p>   IP whitelisting matrix loaded (10.0.0.0/16)</p>
            <p>   All decrypted logs securely routed to Audit Vault</p>
          </div>
        </div>
      </div>

      {/* Access Matrix & Live Log Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Access Matrix (Table of Users) */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest">Active Personnel Matrix</h3>
              <p className="text-zinc-500 text-[11px] mt-1">Cross-check operator privileges, current physical locations, and access tokens.</p>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search active users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs font-mono rounded-sm pl-9 pr-4 py-2 w-full sm:w-48 outline-none focus:border-cyan-500 transition"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 text-[10px] uppercase">
                  <th className="pb-3 font-semibold">User Operator</th>
                  <th className="pb-3 font-semibold">Role</th>
                  <th className="pb-3 font-semibold">Verification Key</th>
                  <th className="pb-3 font-semibold">Current Location</th>
                  <th className="pb-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/40">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-zinc-950/40 transition">
                    <td className="py-3.5 pr-2 font-semibold text-zinc-200">{user.name}</td>
                    <td className="py-3.5 pr-2 text-zinc-400">{user.role}</td>
                    <td className="py-3.5 pr-2 text-zinc-500 text-[11px]">{user.keyType}</td>
                    <td className="py-3.5 pr-2 text-cyan-400/80 text-[11px]">{user.location}</td>
                    <td className="py-3.5 text-right">
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-sm border ${
                        user.status === 'ACTIVE'
                          ? 'bg-green-500/10 text-green-400 border-green-500/20'
                          : user.status === 'DAEMON'
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                          : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Access Event Logs (Sidebar) */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest">Real-time Access Logs</h3>
            <span className="text-[10px] text-zinc-500 uppercase font-mono flex items-center gap-1">
              <RefreshCw className="w-3 h-3 animate-spin text-cyan-500" /> Live
            </span>
          </div>

          <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
            {logs.map((log) => (
              <div key={log.id} className="border-l-2 border-zinc-800 pl-3 py-1 space-y-1 hover:border-cyan-500 transition">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="font-semibold text-zinc-300">{log.user}</span>
                  <span className={`px-1.5 py-0.1 text-[8px] font-bold rounded-sm ${
                    log.status === 'SUCCESS' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400 animate-pulse'
                  }`}>
                    {log.status}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-tight">{log.event}</p>
                <div className="flex justify-between items-center text-[9px] text-zinc-500 font-mono">
                  <span>IP: {log.ip}</span>
                  <span>{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============== NEW SECTION: SECURITY SHIELD & CCTV MATRIX WALL (IMAGES 6 & 7) ============== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        
        {/* Column 1: Security Threat Shield (Image 6) - 4 cols */}
        <div className="lg:col-span-4 bg-zinc-900 border border-zinc-800 p-6 rounded-xl flex flex-col justify-between relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-300">
          <div>
            <h3 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest border-b border-zinc-800/80 pb-3 mb-4">
              Security Threat Shield
            </h3>
            <p className="text-zinc-400 text-xs font-mono">Concentric neural threat analyzer monitoring facility bypass nodes.</p>
          </div>

          {/* Glowing Concentric Rings Shield Visual */}
          <div className="my-6 flex items-center justify-center relative h-48">
            <div className="absolute inset-0 bg-cyan-500/5 rounded-full blur-3xl group-hover:bg-cyan-500/10 transition-all duration-700"></div>
            
            {/* Interactive Glowing Rings */}
            <svg viewBox="0 0 200 200" className="w-40 h-40 animate-pulse">
              {/* Outer Ring */}
              <circle cx="100" cy="100" r="85" fill="none" stroke="#00dbe7" strokeWidth="1" strokeDasharray="6 8" className="animate-spin" style={{ animationDuration: '20s' }} />
              {/* Mid Ring */}
              <circle cx="100" cy="100" r="65" fill="none" stroke="#f38020" strokeWidth="1" strokeDasharray="12 4" className="animate-spin" style={{ animationDuration: '10s', animationDirection: 'reverse' }} opacity="0.6" />
              {/* Inner Solid Ring */}
              <circle cx="100" cy="100" r="50" fill="none" stroke="#00dbe7" strokeWidth="2" opacity="0.8" />
              {/* Central Target */}
              <circle cx="100" cy="100" r="35" fill="#090d16" stroke="#22d3ee" strokeWidth="1" />
            </svg>

            {/* Shield Metric overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-lg font-black text-cyan-400 font-sans tracking-tight">98.4%</span>
              <span className="text-[8px] text-zinc-500 font-mono uppercase tracking-widest">SECURED</span>
            </div>
          </div>

          <div className="space-y-2.5 font-mono text-[10px] uppercase text-zinc-400 bg-zinc-950/60 p-3.5 border border-zinc-800 rounded">
            <div className="flex justify-between">
              <span>System Integrity:</span>
              <span className="text-emerald-400 font-bold">OPTIMAL</span>
            </div>
            <div className="flex justify-between">
              <span>Active Bypasses Permitted:</span>
              <span className="text-brand-orange font-bold">3 / ADMIN</span>
            </div>
            <div className="flex justify-between">
              <span>Intrusion attempts:</span>
              <span className="text-zinc-500">0 IN 30 DAYS</span>
            </div>
          </div>
        </div>

        {/* Column 2: CCTV Video Stream Wall (Image 7) - 8 cols */}
        <div className="lg:col-span-8 bg-zinc-900 border border-zinc-800 p-6 rounded-xl flex flex-col justify-between group hover:border-orange-500/30 transition-all duration-300">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 mb-4">
            <div>
              <h3 className="font-mono text-xs font-bold text-brand-orange uppercase tracking-widest">
                CCTV Tactical Stream Wall
              </h3>
              <p className="text-zinc-500 text-[10px] font-mono mt-0.5">Automated visual motion tracking feeds</p>
            </div>
            <span className="px-2.5 py-0.5 bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-[9px] uppercase tracking-wider rounded animate-pulse">
              ● Live Surveillance
            </span>
          </div>

          {/* 2x2 Camera Feeds Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Feed 1: Lobby */}
            <div 
              onClick={() => toast.success('Streaming feed: Camera 01 Lobby (Lossless)')}
              className="bg-[#050912] border border-zinc-800 hover:border-cyan-500/40 rounded-lg p-3 relative h-36 overflow-hidden cursor-pointer transition-all duration-300 group/feed"
            >
              {/* Futuristic CCTV details */}
              <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                <span className="font-mono text-[8px] text-zinc-300 bg-black/50 px-1.5 py-0.5 rounded">CAM-01 LOBBY EAST</span>
              </div>
              <span className="absolute top-2 right-2 font-mono text-[8px] text-zinc-500 z-10">1080p // 30 FPS</span>
              
              {/* Scanline overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-10 bg-gradient-to-b from-zinc-100/10 via-zinc-900/10 to-zinc-100/10" style={{ backgroundSize: '100% 4px' }}></div>
              
              {/* Decorative wireframe visual to represent CCTV stream content */}
              <div className="w-full h-full flex flex-col justify-center items-center opacity-25">
                <svg viewBox="0 0 100 50" className="w-2/3 h-2/3 text-brand-cyan">
                  <path d="M 0 40 L 40 10 L 80 40 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  <path d="M 20 40 L 50 20 L 90 40 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  <circle cx="50" cy="20" r="1" fill="currentColor" />
                </svg>
              </div>

              <div className="absolute bottom-2 left-2 font-mono text-[8px] text-zinc-500 z-10 uppercase">
                UTC: {new Date().toISOString().slice(11, 19)}
              </div>
              <div className="absolute bottom-2 right-2 font-mono text-[8px] text-emerald-400 z-10 uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> NO MOTION
              </div>
            </div>

            {/* Feed 2: Core Server B */}
            <div 
              onClick={() => toast.success('Streaming feed: Camera 02 Server Room (Lossless)')}
              className="bg-[#050912] border border-zinc-800 hover:border-brand-orange/40 rounded-lg p-3 relative h-36 overflow-hidden cursor-pointer transition-all duration-300 group/feed"
            >
              <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                <span className="font-mono text-[8px] text-zinc-300 bg-black/50 px-1.5 py-0.5 rounded">CAM-02 SERVER ROOM B</span>
              </div>
              <span className="absolute top-2 right-2 font-mono text-[8px] text-zinc-500 z-10">1080p // 30 FPS</span>
              <div className="absolute inset-0 pointer-events-none opacity-10 bg-gradient-to-b from-zinc-100/10 via-zinc-900/10 to-zinc-100/10" style={{ backgroundSize: '100% 4px' }}></div>
              
              <div className="w-full h-full flex flex-col justify-center items-center opacity-30">
                <svg viewBox="0 0 100 50" className="w-2/3 h-2/3 text-brand-orange">
                  <rect x="10" y="10" width="15" height="30" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  <rect x="35" y="10" width="15" height="30" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  <rect x="60" y="10" width="15" height="30" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </svg>
              </div>

              <div className="absolute bottom-2 left-2 font-mono text-[8px] text-zinc-500 z-10 uppercase">
                UTC: {new Date().toISOString().slice(11, 19)}
              </div>
              <div className="absolute bottom-2 right-2 font-mono text-[8px] text-amber-400 z-10 uppercase flex items-center gap-1 animate-pulse">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping"></span> TRACKING TEMP
              </div>
            </div>

            {/* Feed 3: East Parking */}
            <div 
              onClick={() => toast.success('Streaming feed: Camera 03 Parking (Lossless)')}
              className="bg-[#050912] border border-zinc-800 hover:border-cyan-500/40 rounded-lg p-3 relative h-36 overflow-hidden cursor-pointer transition-all duration-300 group/feed"
            >
              <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                <span className="font-mono text-[8px] text-zinc-300 bg-black/50 px-1.5 py-0.5 rounded">CAM-03 EAST PARKING</span>
              </div>
              <span className="absolute top-2 right-2 font-mono text-[8px] text-zinc-500 z-10">720p // 24 FPS</span>
              <div className="absolute inset-0 pointer-events-none opacity-10 bg-gradient-to-b from-zinc-100/10 via-zinc-900/10 to-zinc-100/10" style={{ backgroundSize: '100% 4px' }}></div>
              
              <div className="w-full h-full flex flex-col justify-center items-center opacity-25">
                <svg viewBox="0 0 100 50" className="w-2/3 h-2/3 text-brand-cyan">
                  <line x1="10" y1="45" x2="90" y2="45" stroke="currentColor" strokeWidth="0.5" />
                  <circle cx="30" cy="35" r="5" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  <circle cx="70" cy="35" r="5" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </svg>
              </div>

              <div className="absolute bottom-2 left-2 font-mono text-[8px] text-zinc-500 z-10 uppercase">
                UTC: {new Date().toISOString().slice(11, 19)}
              </div>
              <div className="absolute bottom-2 right-2 font-mono text-[8px] text-emerald-400 z-10 uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> NO MOTION
              </div>
            </div>

            {/* Feed 4: Loading Dock */}
            <div 
              onClick={() => toast.success('Streaming feed: Camera 04 Loading Dock (Lossless)')}
              className="bg-[#050912] border border-zinc-800 hover:border-brand-orange/40 rounded-lg p-3 relative h-36 overflow-hidden cursor-pointer transition-all duration-300 group/feed"
            >
              <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                <span className="font-mono text-[8px] text-zinc-300 bg-black/50 px-1.5 py-0.5 rounded">CAM-04 LOADING DOCK</span>
              </div>
              <span className="absolute top-2 right-2 font-mono text-[8px] text-zinc-500 z-10">1080p // 30 FPS</span>
              <div className="absolute inset-0 pointer-events-none opacity-10 bg-gradient-to-b from-zinc-100/10 via-zinc-900/10 to-zinc-100/10" style={{ backgroundSize: '100% 4px' }}></div>
              
              <div className="w-full h-full flex flex-col justify-center items-center opacity-30">
                <svg viewBox="0 0 100 50" className="w-2/3 h-2/3 text-brand-orange">
                  <path d="M10,40 L90,40 L90,20 L60,20 L40,30 L10,30 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </svg>
              </div>

              <div className="absolute bottom-2 left-2 font-mono text-[8px] text-zinc-500 z-10 uppercase">
                UTC: {new Date().toISOString().slice(11, 19)}
              </div>
              <div className="absolute bottom-2 right-2 font-mono text-[8px] text-brand-cyan z-10 uppercase flex items-center gap-1 animate-pulse">
                <span className="w-1.5 h-1.5 bg-brand-cyan rounded-full"></span> SENSOR OK
              </div>
            </div>

          </div>

          <div className="pt-4 text-center font-mono text-[9px] text-zinc-500 uppercase tracking-widest">
            AI Automated Intrusion Model: Active & Active Core Shield
          </div>
        </div>

      </div>
    </div>
  );
}

