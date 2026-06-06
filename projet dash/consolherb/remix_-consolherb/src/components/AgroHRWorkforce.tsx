import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Clock, 
  CreditCard,
  Search, 
  Check, 
  X, 
  RefreshCw,
  Award,
  AlertTriangle,
  UserPlus
} from 'lucide-react';

interface AgroHRWorkforceProps {
  onAddLog: (level: 'info' | 'success' | 'warn' | 'error', message: string) => void;
}

export default function AgroHRWorkforce({ onAddLog }: AgroHRWorkforceProps) {
  // Verification logs table state
  const [logsList, setLogsList] = useState([
    { id: 1, name: 'John Doe', time: '08:00 AM', method: 'Fingerprint', status: 'Verified', location: 'Main Gate' },
    { id: 2, name: 'Jane Smith', time: '08:15 AM', method: 'FaceID', status: 'Verified', location: 'Greenhouse A' },
    { id: 3, name: 'Mark Lee', time: '08:30 AM', method: 'Fingerprint', status: 'Failed', location: 'Warehouse' }
  ]);
  const [searchQuery, setSearchQuery] = useState('');

  // Payroll processing simulation states
  const [payrollStatus, setPayrollStatus] = useState<'idle' | 'processing' | 'done'>('idle');
  const [payrollProgress, setPayrollProgress] = useState(0);

  // New employee pop-up
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserMethod, setNewUserMethod] = useState('Fingerprint');

  // Stats
  const [totalWorkers, setTotalWorkers] = useState(150);
  const [presentCount, setPresentCount] = useState(135);
  const [absentCount, setAbsentCount] = useState(10);
  const [leaveCount, setLeaveCount] = useState(5);

  const handleProcessPayroll = () => {
    if (payrollStatus !== 'idle') return;
    setPayrollStatus('processing');
    setPayrollProgress(0);
    onAddLog('info', 'PAYROLL: Démarrage de la consolidation de paie biométrique (Octobre 2024)...');

    const interval = setInterval(() => {
      setPayrollProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setPayrollStatus('done');
          onAddLog('success', 'PAYROLL: Calcul validé ! 450,000.00$ déboursés via Stripe Standard API.');
          return 100;
        }
        return prev + 20;
      });
    }, 400);
  };

  const handleAddWorker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim()) return;
    
    // Add to table with current logs
    const newLog = {
      id: Date.now(),
      name: newUserName.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      method: newUserMethod,
      status: 'Verified',
      location: 'Reception'
    };
    setLogsList(prev => [newLog, ...prev]);
    setTotalWorkers(prev => prev + 1);
    setPresentCount(prev => prev + 1);
    
    onAddLog('success', `HR: Nouveau travailleur biométrique enregistré: "${newUserName}"`);
    setNewUserName('');
    setIsAddUserOpen(false);
  };

  const handleSMSContact = (worker: string) => {
    onAddLog('warn', `HR_ALERT: Rappel SMS envoyé de force à ${worker} pour vérifier le motif du retard.`);
    alert(`SMS alert dispatched to ${worker} regarding pointage failure.`);
  };

  // Filter list
  const filteredLogs = logsList.filter(log => 
    log.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.method.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#fdfbf9] text-[#4a4a4a] p-6 rounded-[28px] border border-stone-200/60 font-sans shadow-lg select-none" id="attendance-payroll-module">
      
      {/* Brand Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-orange-100 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-[#f26b4f] to-[#e65a3d] rounded-xl flex items-center justify-center text-white text-lg font-bold">
            🌾
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-800">AgroMaître <span className="text-xs font-normal text-gray-400">(Herboferme)</span></span>
              <span className="text-[9px] bg-orange-50 text-[#f26b4f] border border-orange-200 px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-tight">ATTENDANCE_PAYROLL</span>
            </div>
            <p className="text-xs text-gray-500 font-mono">Image 4: Biometric Attendance & Stripe Payroll Calibration</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full font-mono font-bold flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-amber-700 font-bold" />
            <span>SOC 2 Type II Audited</span>
          </span>
        </div>
      </header>

      {/* Main title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Biometric Attendance Summary</h1>
      </div>

      {/* Grid of four main stats counts (copied from Image 4) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {/* Total Workers */}
        <div className="bg-white border border-stone-100 p-5 rounded-[20px] flex items-center gap-3 shadow-xs hover:border-orange-200 transition">
          <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-xl">👥</div>
          <div>
            <div className="text-[10px] text-gray-400 uppercase font-mono font-bold">Total Workers</div>
            <div className="text-2xl font-bold text-gray-800 font-mono mt-0.5">{totalWorkers}</div>
          </div>
        </div>

        {/* Present */}
        <div className="bg-white border border-stone-100 p-5 rounded-[20px] flex items-center gap-3 shadow-xs hover:border-orange-200 transition border-b-4 border-b-green-400">
          <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">✅</div>
          <div>
            <div className="text-[10px] text-gray-400 uppercase font-mono font-bold">Present</div>
            <div className="text-2xl font-bold text-gray-800 font-mono mt-0.5">{presentCount}</div>
          </div>
        </div>

        {/* Absent */}
        <div className="bg-white border border-stone-100 p-5 rounded-[20px] flex items-center gap-3 shadow-xs hover:border-orange-200 transition border-b-4 border-b-red-400">
          <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-xl">🚫</div>
          <div>
            <div className="text-[10px] text-gray-400 uppercase font-mono font-bold">Absent</div>
            <div className="text-2xl font-bold text-gray-800 font-mono mt-0.5">{absentCount}</div>
          </div>
        </div>

        {/* On Leave */}
        <div className="bg-white border border-stone-100 p-5 rounded-[20px] flex items-center gap-3 shadow-xs hover:border-orange-200 transition border-b-4 border-b-yellow-400">
          <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center text-xl">📅</div>
          <div>
            <div className="text-[10px] text-gray-400 uppercase font-mono font-bold">On Leave</div>
            <div className="text-2xl font-bold text-gray-800 font-mono mt-0.5">{leaveCount}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (col-span-7) - Verification Logs Today Table */}
        <div className="lg:col-span-7 bg-white border border-stone-100 rounded-2xl p-6 shadow-xs">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-base font-bold text-gray-800">Verification Logs (Today)</h2>
              <p className="text-xs text-gray-400">Real-time gate pass authentication logs</p>
            </div>

            {/* Filter controls */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-44">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search logs..."
                  className="w-full bg-stone-50 border border-gray-200 rounded-lg text-xs py-1.5 pl-8 pr-3 outline-none"
                />
              </div>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  onAddLog('info', 'HR: Réinitialisation du filtre de recherche.');
                }}
                className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg text-xs transition cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-stone-100 text-[#4a4a4a]/60 pb-3 font-semibold">
                  <th className="pb-3 text-left">Worker Name</th>
                  <th className="pb-3 text-left">Time</th>
                  <th className="pb-3 text-left">Method</th>
                  <th className="pb-3 text-left">Status</th>
                  <th className="pb-3 text-left">Location</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-stone-50/50 transition">
                    <td className="py-3 font-bold text-gray-800">{log.name}</td>
                    <td className="py-3 font-mono text-gray-500">{log.time}</td>
                    <td className="py-3 font-mono text-gray-500">{log.method}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full text-[10px] ${
                        log.status === 'Verified' 
                          ? 'bg-green-50 text-green-700' 
                          : 'bg-red-50 text-red-600 animate-pulse'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${log.status === 'Verified' ? 'bg-green-500' : 'bg-red-500'}`} />
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-600 font-mono">{log.location}</td>
                    <td className="py-3 text-right">
                      {log.status === 'Failed' ? (
                        <button
                          onClick={() => handleSMSContact(log.name)}
                          className="px-1.5 py-0.5 bg-red-50 text-red-600 hover:bg-red-100/80 rounded transition text-[10px] font-bold cursor-pointer"
                        >
                          Alert Worker
                        </button>
                      ) : (
                        <span className="text-gray-400 select-none">Approved ✓</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* Right Column (col-span-5) - Monthly Payroll Calculation Card */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-gradient-to-br from-[#f26b4f] to-[#e65a3d] text-white rounded-2xl p-6 shadow-md relative overflow-hidden group">
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none select-none" />
            
            <div className="text-[10px] uppercase font-mono tracking-wider opacity-80 mb-1">
              Monthly Payroll Calculation (October)
            </div>
            <div className="text-3xl font-bold font-mono tracking-tight">$450,000.00</div>
            
            <div className="grid grid-cols-2 gap-4 text-xs mt-6 mb-6">
              <div>
                <span className="opacity-70 font-mono uppercase block text-[9px]">Base Pay:</span>
                <span className="text-sm font-bold font-mono">$400,000.00</span>
              </div>
              <div>
                <span className="opacity-70 font-mono uppercase block text-[9px]">Overtime:</span>
                <span className="text-sm font-bold font-mono">$35,000.00</span>
              </div>
              <div>
                <span className="opacity-70 font-mono uppercase block text-[9px]">Deductions:</span>
                <span className="text-sm font-bold font-mono">-$15,000.00</span>
              </div>
              <div>
                <span className="opacity-70 font-mono uppercase block text-[9px]">Bonuses:</span>
                <span className="text-sm font-bold font-mono">$30,000.00</span>
              </div>
            </div>

            {/* Simulated progress state */}
            {payrollStatus === 'processing' && (
              <div className="mb-4">
                <div className="flex justify-between text-[11px] font-mono mb-1">
                  <span>Processing transactions...</span>
                  <span>{payrollProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-black/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white transition-all duration-300"
                    style={{ width: `${payrollProgress}%` }}
                  />
                </div>
              </div>
            )}

            {payrollStatus === 'done' && (
              <div className="p-2.5 bg-green-500/20 border border-green-400/30 rounded-xl text-center font-mono text-[11px] mb-4 text-white font-bold flex items-center justify-center gap-1.5">
                <span>✓ STRIPE DISPATCH SETTLED STABLE</span>
              </div>
            )}

            <button 
              onClick={handleProcessPayroll}
              disabled={payrollStatus !== 'idle'}
              className="w-full py-3 bg-white text-[#f26b4f] hover:bg-stone-50 rounded-xl font-bold text-xs transition uppercase shadow-sm cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {payrollStatus === 'processing' ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <CreditCard className="w-4 h-4" />
              )}
              <span>{payrollStatus === 'processing' ? 'Processing...' : payrollStatus === 'done' ? 'Payroll Processed ✓' : 'Process Payroll'}</span>
            </button>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-white border border-stone-100 rounded-2xl p-5 shadow-xs">
            <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest mb-3 border-b border-stone-100 pb-2">
              Attendance Quick Actions
            </h3>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button 
                onClick={() => {
                  onAddLog('info', 'HR: Génération du rapport de pointage complet...');
                  alert('Generating XLS detailed summary from pointage...');
                }}
                className="p-3 border border-stone-100 hover:border-orange-200 bg-stone-50/20 hover:bg-white text-gray-700 font-semibold rounded-xl text-center transition cursor-pointer"
              >
                📝 Generate Report
              </button>
              <button 
                onClick={() => {
                  onAddLog('success', 'HR: Validation globale des demandes de congés Q3.');
                  setLeaveCount(prev => Math.max(0, prev - 1));
                }}
                className="p-3 border border-stone-100 hover:border-orange-200 bg-stone-50/20 hover:bg-white text-gray-700 font-semibold rounded-xl text-center transition cursor-pointer"
              >
                📅 Approve Leaves
              </button>
              <button 
                onClick={() => {
                  onAddLog('info', 'HR: Accès à la matrice de rotation de shifts.');
                  alert('Opening Rotating Shifts Matrix Panel...');
                }}
                className="p-3 border border-stone-100 hover:border-orange-200 bg-stone-50/20 hover:bg-white text-gray-700 font-semibold rounded-xl text-center transition cursor-pointer"
              >
                ⚙️ Manage Shifts
              </button>
              <button 
                onClick={() => setIsAddUserOpen(true)}
                className="p-3 border border-[#f26b4f]/20 bg-[#fff5f2] hover:bg-[#fff5f2]/80 text-[#f26b4f] font-bold rounded-xl text-center transition cursor-pointer flex items-center justify-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Add Worker</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Slideup adding user modal */}
      <AnimatePresence>
        {isAddUserOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-stone-200 p-6 max-w-sm w-full font-sans text-xs text-[#4a4a4a] shadow-xl"
            >
              <div className="flex justify-between items-center border-b border-stone-100 pb-3 mb-4">
                <span className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
                  👤 Register New NFC Worker Card
                </span>
                <button onClick={() => setIsAddUserOpen(false)} className="cursor-pointer hover:text-red-500 text-gray-400">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddWorker} className="space-y-4">
                <div>
                  <label className="block text-gray-500 text-[10px] uppercase mb-1 font-bold">Worker Name:</label>
                  <input 
                    type="text" 
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="e.g. Jeanine Dupont..."
                    className="w-full bg-stone-50 border border-gray-200 p-2.5 rounded-lg outline-none text-xs font-semibold"
                    required
                    maxLength={30}
                  />
                </div>

                <div>
                  <label className="block text-gray-500 text-[10px] uppercase mb-1 font-bold">Authentication Key Method:</label>
                  <select
                    value={newUserMethod}
                    onChange={(e) => setNewUserMethod(e.target.value)}
                    className="w-full bg-stone-50 border border-gray-200 p-2.5 rounded-lg outline-none text-xs"
                  >
                    <option value="Fingerprint">NFC Fingerprint Biometric</option>
                    <option value="FaceID">FaceID Facial recognition</option>
                    <option value="SmartCard">Access Badging RFID</option>
                  </select>
                </div>

                <div className="pt-2 flex justify-end gap-2 text-xs">
                  <button 
                    type="button" 
                    onClick={() => setIsAddUserOpen(false)}
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded-lg font-bold text-gray-600 transition"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-[#f26b4f] hover:bg-[#e65a3d] text-white rounded-lg font-bold transition shadow-sm"
                  >
                    Authorize Worker Card
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
