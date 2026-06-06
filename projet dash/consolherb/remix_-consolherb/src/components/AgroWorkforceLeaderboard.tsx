import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, 
  Search, 
  Layers, 
  Zap, 
  CheckCircle, 
  Trash2, 
  Plus, 
  Star,
  Activity,
  ArrowUp,
  UserCheck,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

interface FarmWorker {
  rank: number;
  name: string;
  department: 'Harvesting' | 'Greenhouse' | 'Processing' | 'Maintenance';
  score: number; // overall out of 100
  speedRating: number; // percentile
  accuracyRating: number; // percentile
  avatar: string;
  badges: string[];
  solvedTasks: number;
  streakDays: number;
}

interface AgroWorkforceLeaderboardProps {
  onAddLog: (level: 'info' | 'success' | 'warn' | 'error', message: string) => void;
}

export default function AgroWorkforceLeaderboard({ onAddLog }: AgroWorkforceLeaderboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedWorker, setSelectedWorker] = useState<FarmWorker | null>(null);

  const workers: FarmWorker[] = [
    {
      rank: 1,
      name: 'Jean Dupont',
      department: 'Harvesting',
      score: 98,
      speedRating: 96,
      accuracyRating: 99,
      avatar: '👨‍🌾',
      badges: ['Top Performer', 'Golden Shears', '100% Secure'],
      solvedTasks: 142,
      streakDays: 14
    },
    {
      rank: 2,
      name: 'Jeanine Dupont',
      department: 'Greenhouse',
      score: 95,
      speedRating: 98,
      accuracyRating: 92,
      avatar: '👩‍🌾',
      badges: ['Speed King', 'Flora Whisperer'],
      solvedTasks: 128,
      streakDays: 9
    },
    {
      rank: 3,
      name: 'Michel Lemaire',
      department: 'Processing',
      score: 91,
      speedRating: 88,
      accuracyRating: 94,
      avatar: '👨‍🔬',
      badges: ['Lab Master', 'Safety First'],
      solvedTasks: 110,
      streakDays: 6
    },
    {
      rank: 4,
      name: 'Amandine Petit',
      department: 'Harvesting',
      score: 89,
      speedRating: 90,
      accuracyRating: 88,
      avatar: '👩‍🌾',
      badges: ['Efficient Picker'],
      solvedTasks: 95,
      streakDays: 11
    },
    {
      rank: 5,
      name: 'Robert Claveau',
      department: 'Maintenance',
      score: 87,
      speedRating: 92,
      accuracyRating: 82,
      avatar: '👨‍🔧',
      badges: ['Wrench Legend'],
      solvedTasks: 84,
      streakDays: 4
    }
  ];

  const filteredWorkers = workers.filter(w => {
    const matchesSearch = w.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || w.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const handleRewardWorker = (workerName: string, badgeName: string) => {
    onAddLog('success', `HR_PERFORMANCE: Badge de mérite "${badgeName}" décerné à ${workerName} !`);
  };

  const handleWorkerDrilldown = (worker: FarmWorker) => {
    setSelectedWorker(worker);
    onAddLog('info', `HR_PERFORMANCE: Visualisation détaillée de la fiche de performance de ${worker.name}.`);
  };

  return (
    <div className="bg-[#FAF9F5] text-stone-800 p-6 rounded-[28px] border border-[#e1d5c1] font-sans shadow-md" id="agro-workforce-leaderboard-module">
      
      {/* Brand Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#e1d5c1] pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-[#1E3B21] to-[#3B663F] rounded-xl flex items-center justify-center text-white text-lg font-bold">
            <Award className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-serif font-bold text-[#1a3a22]">Workforce Performance & Worker Leaderboard</span>
              <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-mono font-bold uppercase tracking-tight">Image 3 New</span>
            </div>
            <p className="text-xs text-stone-500 font-mono uppercase">Precision Logging, Daily Tasks Metrology & Safety Scores</p>
          </div>
        </div>
      </header>

      {/* Main Grid: Left is Leaderboard (col-span-8), Right is detail cards (col-span-4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side (col-span-8): Leaderboard Lists & Filters */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Subheader Filters bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#e1d5c1]/60 pb-3">
            <div className="relative w-full sm:w-64">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search active field worker..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#e1d5c1] text-xs py-2 pl-9 pr-4 rounded-xl outline-none focus:ring-1 focus:ring-[#1a3a22]"
              />
            </div>

            <div className="flex flex-wrap gap-1">
              {['All', 'Harvesting', 'Greenhouse', 'Processing'].map(dept => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`text-[9.5px] font-mono px-2.5 py-1.5 rounded-xl border transition ${
                    selectedDept === dept 
                      ? 'bg-[#1a3a22] text-white border-[#1a3a22]' 
                      : 'bg-white border-[#e1d5c1] text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* List Table with premium design */}
          <div className="bg-white border border-[#e1d5c1] rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse text-xs select-none">
              <thead>
                <tr className="bg-stone-50/80 border-b border-[#e1d5c1] text-stone-400 font-mono text-[9px] uppercase">
                  <th className="py-2.5 px-4 text-center w-12">Rank</th>
                  <th className="py-2.5 px-4">Operator</th>
                  <th className="py-2.5 px-4">Sector</th>
                  <th className="py-2.5 px-4">Completed</th>
                  <th className="py-2.5 px-4">Overall Score</th>
                  <th className="py-2.5 px-4 text-center">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-sans">
                {filteredWorkers.map(w => (
                  <tr 
                    key={w.name} 
                    onClick={() => handleWorkerDrilldown(w)}
                    className="hover:bg-amber-50/20 transition duration-150 cursor-pointer align-middle"
                  >
                    <td className="py-4 px-4 text-center font-serif font-bold text-base text-stone-700">
                      {w.rank === 1 ? '🏆' : w.rank}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xl shrink-0">{w.avatar}</span>
                        <div>
                          <div className="font-serif font-bold text-[#1a3a22] text-sm">{w.name}</div>
                          <div className="flex gap-1.5 mt-0.5 max-w-[200px] flex-wrap">
                            {w.badges.slice(0, 2).map(b => (
                              <span key={b} className="text-[7.5px] font-mono bg-stone-50 border border-stone-200 text-stone-500 px-1 py-0.2 rounded-sm uppercase tracking-wider">
                                {b}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono text-[10.5px] font-bold text-stone-500">
                      {w.department}
                    </td>
                    <td className="py-4 px-4 font-mono text-stone-600 font-semibold">
                      {w.solvedTasks} items
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 max-w-[80px] bg-stone-100 h-1.5 rounded-full overflow-hidden border border-stone-200">
                          <div className="bg-emerald-500 h-full" style={{ width: `${w.score}%` }} />
                        </div>
                        <span className="font-mono text-xs font-bold text-emerald-600">{w.score}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-xs text-emerald-500 font-bold inline-flex items-center gap-0.5">
                        <ArrowUp className="w-3 h-3" /> +1
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* Right Side (col-span-4): Worker Drilldown Detailed Profiles */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-xs font-mono font-bold text-stone-400 uppercase tracking-wider select-none">
            Selected Performance Detail
          </h3>

          <AnimatePresence mode="wait">
            {selectedWorker ? (
              <motion.div
                key={selectedWorker.name}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="bg-white border border-[#e1d5c1] rounded-2xl p-5 shadow-xs text-center"
              >
                <div className="text-5xl mb-2">{selectedWorker.avatar}</div>
                <h4 className="text-md font-serif font-bold text-[#1a3a22]">{selectedWorker.name}</h4>
                <div className="text-[10px] font-mono text-[#1a3a22] font-bold bg-[#EFF2EE] px-2 py-0.5 rounded-full inline-block mt-0.5 uppercase tracking-wide">
                  {selectedWorker.department} Sector Lead
                </div>

                {/* Accuracy & Speed ratings */}
                <div className="space-y-3.5 mt-6 text-left border-t border-b border-stone-100 py-4 font-mono text-[11px] text-stone-600">
                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span>⚡ Daily Harvest Speed:</span>
                      <span className="text-orange-600 font-extrabold">{selectedWorker.speedRating}%</span>
                    </div>
                    <div className="bg-stone-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-orange-500 h-full animate-progress" style={{ width: `${selectedWorker.speedRating}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span>🎯 Placement Accuracy:</span>
                      <span className="text-blue-600 font-extrabold">{selectedWorker.accuracyRating}%</span>
                    </div>
                    <div className="bg-stone-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full animate-progress" style={{ width: `${selectedWorker.accuracyRating}%` }} />
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs mt-4 bg-emerald-50/50 p-2 border border-emerald-100/50 rounded-xl leading-none">
                    <span className="font-bold text-emerald-800">🔥 Current Streak:</span>
                    <strong className="text-emerald-700 font-extrabold">{selectedWorker.streakDays} Days</strong>
                  </div>
                </div>

                {/* Decorate awards button */}
                <div className="mt-5 space-y-2">
                  <button
                    onClick={() => handleRewardWorker(selectedWorker.name, 'Golden Harvest Shears')}
                    className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-xs rounded-xl text-[10px] font-mono font-bold uppercase cursor-pointer transition active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <Star className="w-3.5 h-3.5 text-white" />
                    <span>Reward Merit Badge</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="bg-[#FAF9F5] border border-dashed border-[#e1d5c1] p-10 text-center rounded-2xl text-stone-400 font-medium text-xs">
                Select any field operant in the performance listing to view efficiency scores, accuracy percentiles, and award merit badges dynamically.
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
