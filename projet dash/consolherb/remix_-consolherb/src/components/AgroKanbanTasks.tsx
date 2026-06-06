import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ClipboardList, 
  Clock, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Plus, 
  Trash2, 
  User, 
  Timer,
  Play,
  Layers,
  ArrowRightLeft,
  ChevronLeft,
  ChevronRight,
  Info
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  location: string;
  timeDetail: string;
  column: 'todo' | 'progress' | 'verified';
  assignedTo?: string;
  dueDate?: string;
}

interface RotationParcel {
  id: string;
  name: string;
  year1: string;
  year2: string;
  year3: string; // Current 2026
  soilState: 'Rich' | 'Depleted Soil' | 'Recovering Nitrogen';
  recommendation: string;
}

interface AgroKanbanTasksProps {
  onAddLog: (level: 'info' | 'success' | 'warn' | 'error', message: string) => void;
}

export default function AgroKanbanTasks({ onAddLog }: AgroKanbanTasksProps) {
  const [activeTab, setActiveTab] = useState<'kanban' | 'calendar' | 'rotation'>('kanban');

  // 1. KANBAN STATE
  const [tasks, setTasks] = useState<Task[]>([
    { id: 't1', title: 'Irrigate Lavender Block G', location: 'Field G', timeDetail: 'Due: Today, 2:00 PM', column: 'todo', assignedTo: 'John Doe' },
    { id: 't2', title: 'Harvest Tomato Block 2', location: 'Greenhouse B', timeDetail: 'Due: Today, 2:00 PM', column: 'todo', assignedTo: 'Jane Smith' },
    { id: 't3', title: 'Check Soil Humidity Sensor', location: 'Field A', timeDetail: 'Due: Today, 2:00 PM', column: 'todo', assignedTo: 'Jean Dupont' },
    { id: 't4', title: 'Apply NPK Fertilizer Mix B', location: 'Field B', timeDetail: 'Due: Tomorrow, 9:00 AM', column: 'todo', assignedTo: 'Marie Curie' },
    { id: 't5', title: 'Collect Pasteurised Goat Milk', location: 'Livestock Barn 4', timeDetail: 'Started: 10:30 AM', column: 'progress', assignedTo: 'Mark Lee' },
    { id: 't6', title: 'Verify Telemetry Weather Node', location: 'Zone D-East', timeDetail: 'Started: 11:45 AM', column: 'progress', assignedTo: 'Pierre Martin' },
    { id: 't7', title: 'Repair Fence Sector C', location: 'Pasture C', timeDetail: 'Started: 11:45 AM', column: 'progress', assignedTo: 'John Doe' },
    { id: 't8', title: 'Administer Ovine Meds', location: 'Barn 2 Beta', timeDetail: 'Completed: Yesterday, 4:15 PM', column: 'verified', assignedTo: 'Jane Smith' },
    { id: 't9', title: 'Check Insect Traps Row 4', location: 'Botanical G', timeDetail: 'Completed: Today, 12:00 PM', column: 'verified', assignedTo: 'Pierre Martin' },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskLoc, setNewTaskLoc] = useState('');
  const [newTaskAssign, setNewTaskAssign] = useState('John Doe');

  // Clock-in Shift Tracker states
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isClockedIn) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setElapsedSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isClockedIn]);

  const handleClockToggle = () => {
    if (!isClockedIn) {
      setIsClockedIn(true);
      const now = new Date();
      setClockInTime(now);
      onAddLog('success', `SHIFT: Enregistrement d'arrivée biométrique réussi à ${now.toLocaleTimeString()}. Shift actif.`);
    } else {
      setIsClockedIn(false);
      const formattedDuration = formatTime(elapsedSeconds);
      onAddLog('warn', `SHIFT: Enregistrement de sortie validé. Durée cumulée du shift : ${formattedDuration}.`);
      setClockInTime(null);
    }
  };

  const formatTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const moveTask = (taskId: string, direction: 'next' | 'prev') => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        let nextColumn = t.column;
        if (direction === 'next') {
          if (t.column === 'todo') {
            nextColumn = 'progress';
            onAddLog('info', `TASKS: Tâche "${t.title}" déplacée vers [En Cours] par ${t.assignedTo}`);
          } else if (t.column === 'progress') {
            nextColumn = 'verified';
            onAddLog('success', `TASKS: Tâche "${t.title}" validée et transmise au rapport par ${t.assignedTo}`);
          }
        } else {
          if (t.column === 'verified') {
            nextColumn = 'progress';
            onAddLog('info', `TASKS: Rétrogradation de "${t.title}" vers [En Cours]`);
          } else if (t.column === 'progress') {
            nextColumn = 'todo';
            onAddLog('info', `TASKS: Rétrogradation de "${t.title}" vers [À Faire]`);
          }
        }

        let nextTime = t.timeDetail;
        if (nextColumn === 'progress') {
          nextTime = `Started: Today, ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
        } else if (nextColumn === 'verified') {
          nextTime = `Completed: Today, ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
        } else {
          nextTime = 'Due: Today, 2:00 PM';
        }

        return { ...t, column: nextColumn, timeDetail: nextTime };
      }
      return t;
    }));
  };

  const deleteTask = (taskId: string, title: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    onAddLog('warn', `TASKS: Tâche supprimée : "${title}"`);
  };

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      location: newTaskLoc.trim() || 'General Plot',
      timeDetail: 'Due: Today, 5:00 PM',
      column: 'todo',
      assignedTo: newTaskAssign
    };

    setTasks(prev => [...prev, newTask]);
    onAddLog('success', `TASKS: Nouvelle tâche opérationnelle créée et assignée à ${newTaskAssign} : "${newTask.title}"`);
    setNewTaskTitle('');
    setNewTaskLoc('');
    setShowAddForm(false);
  };


  // 2. AGRICULTURAL CALENDAR STATE
  const [currentMonth, setCurrentMonth] = useState('June 2026');
  // Representing calendar tasks in a month
  const calendarDates = [
    { day: 1, label: 'Mon', events: [{ title: 'Sow Wheat Block D', team: 'Jane Smith' }] },
    { day: 2, label: 'Tue', events: [] },
    { day: 3, label: 'Wed', events: [{ title: 'Irrigate Plot G', team: 'John Doe' }] },
    { day: 4, label: 'Thu', events: [] },
    { day: 5, label: 'Fri', events: [{ title: 'NFC Cargo Scan Ref', team: 'Pierre Martin' }] },
    { day: 6, label: 'Sat', events: [] },
    { day: 7, label: 'Sun', events: [] },
    { day: 8, label: 'Mon', events: [{ title: 'Ovine Vaccinations', team: 'Jane Smith' }] },
    { day: 9, label: 'Tue', events: [] },
    { day: 10, label: 'Wed', events: [{ title: 'Crop Rotation Cycle', team: 'Marie Curie' }] },
    { day: 11, label: 'Thu', events: [] },
    { day: 12, label: 'Fri', events: [{ title: 'Telemetry Refurbish', team: 'Pierre Martin' }] },
    { day: 13, label: 'Sat', events: [] },
    { day: 14, label: 'Sun', events: [] },
    { day: 15, label: 'Mon', events: [{ title: 'Tomato Block Harvest', team: 'John Doe' }] },
    { day: 16, label: 'Tue', events: [] },
    { day: 17, label: 'Wed', events: [] },
    { day: 18, label: 'Thu', events: [{ title: 'Budget Recalibration', team: 'Admin' }] },
    { day: 19, label: 'Fri', events: [] },
    { day: 20, label: 'Sat', events: [] },
    { day: 21, label: 'Sun', events: [] },
    { day: 22, label: 'Mon', events: [{ title: 'NPK Soil Feeding', team: 'Marie Curie' }] },
    { day: 23, label: 'Tue', events: [] },
    { day: 24, label: 'Wed', events: [] },
    { day: 25, label: 'Thu', events: [{ title: 'Tractor Fleet Brake Chk', team: 'Mark Lee' }] },
    { day: 26, label: 'Fri', events: [] },
    { day: 27, label: 'Sat', events: [] },
    { day: 28, label: 'Sun', events: [] },
  ];


  // 3. CROP ROTATION MATRIX PLANNER STATE
  const [rotationParcels, setRotationParcels] = useState<RotationParcel[]>([
    {
      id: 'p1',
      name: 'North-East parcel 4A (Clay Rich)',
      year1: 'Lavender (Heavy Depleter)',
      year2: 'Winter Wheat (Moderate)',
      year3: 'Alfalfa (Nitrogen Fixer)',
      soilState: 'Recovering Nitrogen',
      recommendation: 'Alfalfa currently restores essential nitrates. Leave for winter mulching.'
    },
    {
      id: 'p2',
      name: 'Greenhouse Dome B (Humus rich)',
      year1: 'Winter Wheat (Moderate)',
      year2: 'Alfalfa (Nitrogen Fixer)',
      year3: 'Lavender (Heavy Depleter)',
      soilState: 'Rich',
      recommendation: 'Perfect soil index for lavender root development. Active harvest on track.'
    },
    {
      id: 'p3',
      name: 'South Slope parcel G (Sandy soil)',
      year1: 'Alfalfa (Nitrogen Fixer)',
      year2: 'Lavender (Heavy Depleter)',
      year3: 'Winter Wheat (Moderate)',
      soilState: 'Depleted Soil',
      recommendation: 'Soil nitrogen index critical. Plan Alfalfa crop rotation for Year 4 immediately!'
    }
  ]);

  const handleUpdateYear3 = (id: string, newCrop: string) => {
    setRotationParcels(prev => prev.map(p => {
      if (p.id === id) {
        onAddLog('info', `ROTATION: Parcel [${p.name}] Year 3 crop modified to: ${newCrop}.`);
        
        let newState = p.soilState;
        let newRec = p.recommendation;
        if (newCrop === 'Alfalfa (Nitrogen Fixer)') {
          newState = 'Recovering Nitrogen';
          newRec = 'Alfalfa restores nitrogen compounds naturally. Ideal restorative choice.';
        } else if (newCrop === 'Lavender (Heavy Depleter)') {
          newState = 'Depleted Soil';
          newRec = 'Heavy root depletion. Crop must rotate next cycle to avoid erosion.';
        } else {
          newState = 'Rich';
          newRec = 'Moderate demand crop. Sustainable until seasonal frost consolidation.';
        }

        return { ...p, year3: newCrop, soilState: newState, recommendation: newRec };
      }
      return p;
    }));
  };

  return (
    <div className="bg-[#FAF9F5] text-stone-800 p-6 rounded-[28px] border border-[#e1d5c1] font-sans shadow-md" id="agro-tasks-and-cycles-module">
      
      {/* Brand Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#e1d5c1] pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-[#BA5834] to-[#f26b4f] rounded-xl flex items-center justify-center text-white text-lg font-bold">
            📅
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-serif font-bold text-[#451e09]">AgroMaître Cycles</span>
              <span className="text-[9px] bg-amber-50 text-[#BA5834] border border-orange-200 px-2.5 py-0.5 rounded-full font-mono font-bold uppercase tracking-tight">OPERATIONAL PLANNING</span>
            </div>
            <p className="text-xs text-stone-500 font-mono">Agricultural Calendar, Role Allocations & Sturdy Rotations</p>
          </div>
        </div>

        {/* Top clock-in button linked to shift logs */}
        <div className="flex items-center justify-between gap-3 bg-white p-2 border border-[#CED1C5] rounded-xl">
          {isClockedIn && (
            <div className="text-[10px] uppercase font-mono font-bold text-[#BA5834] animate-pulse flex items-center gap-1 px-1">
              <Timer className="w-3.5 h-3.5 text-[#BA5834]" />
              <span>Shift Time: {formatTime(elapsedSeconds)}</span>
            </div>
          )}
          <button
            onClick={handleClockToggle}
            className={`px-3 py-1 text-[10px] font-mono uppercase font-bold rounded-lg transition-colors cursor-pointer ${
              isClockedIn 
                ? 'bg-[#BA5834] hover:bg-[#a04321] text-white' 
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            {isClockedIn ? 'Clock-Out biometric shift' : 'Clock-In biometric shift'}
          </button>
        </div>
      </header>

      {/* Tabs list navigation */}
      <div className="flex flex-wrap gap-1.5 border-b border-stone-200 pb-3 mb-6">
        {[
          { id: 'kanban', label: 'Workforce Tasks Kanban', icon: <ClipboardList className="w-3.5 h-3.5" /> },
          { id: 'calendar', label: 'Monthly Agricultural Calendar', icon: <Calendar className="w-3.5 h-3.5" /> },
          { id: 'rotation', label: 'Interactive Crop Soil Rotation', icon: <ArrowRightLeft className="w-3.5 h-3.5" /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold font-mono uppercase tracking-tight rounded-xl transition cursor-pointer border ${
              activeTab === tab.id 
                ? 'bg-[#1c2c3e] border-[#4de082] text-[#4de082] bg-stone-900 border-none' 
                : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        
        {/* TAB 1: KANBAN WORKSPACE */}
        {activeTab === 'kanban' && (
          <motion.div 
            key="tab-kanban"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="space-y-6"
          >
            {/* Short subtitle with inline action button */}
            <div className="flex justify-between items-center bg-white border border-[#e1d5c1] p-3 rounded-xl">
              <div>
                <span className="text-xs font-bold text-gray-800">Operational Workforce Task Board</span>
                <p className="text-[10px] text-gray-400 font-mono">Organize teams, monitor active shifts & escalate critical agricultural tasks</p>
              </div>
              <button
                type="button" onClick={() => setShowAddForm(prev => !prev)}
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white rounded-lg text-[10px] font-mono uppercase font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition"
              >
                <Plus className="w-3.5 h-3.5" /> Assign Task
              </button>
            </div>

            {/* Hidden Add Task Form */}
            <AnimatePresence>
              {showAddForm && (
                <motion.form 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  onSubmit={handleAddTaskSubmit}
                  className="bg-white border-2 border-orange-100 rounded-[22px] p-5 grid grid-cols-1 md:grid-cols-4 gap-4 items-end text-xs"
                >
                  <div>
                    <label className="block text-[10px] font-mono uppercase font-bold text-gray-400 mb-1">Task Title</label>
                    <input 
                      type="text" required
                      placeholder="e.g. Apply soil nutrition G"
                      value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase font-bold text-gray-400 mb-1">Location Parcel</label>
                    <input 
                      type="text"
                      placeholder="e.g. Field G"
                      value={newTaskLoc} onChange={(e) => setNewTaskLoc(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase font-bold text-gray-400 mb-1">Assign Operator</label>
                    <select 
                      value={newTaskAssign} onChange={(e) => setNewTaskAssign(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl bg-stone-50 cursor-pointer"
                    >
                      <option value="John Doe">John Doe</option>
                      <option value="Jane Smith">Jane Smith</option>
                      <option value="Marie Curie">Marie Curie</option>
                      <option value="Mark Lee">Mark Lee</option>
                      <option value="Jean Dupont">Jean Dupont</option>
                      <option value="Pierre Martin">Pierre Martin</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="flex-grow py-2 bg-[#BA5834] text-white font-mono font-bold uppercase rounded-xl cursor-pointer">
                      Deploy Task
                    </button>
                    <button type="button" onClick={() => setShowAddForm(false)} className="px-3.5 py-2 bg-stone-100 text-[#4a4a4a] rounded-xl font-bold font-mono text-[10px] cursor-pointer">
                      Cancel
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Three column Kanban Board Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Column 1: TODO (À Faire) */}
              <div className="bg-[#FAF8F5]/80 border border-[#e1d5c1] rounded-2xl p-4">
                <div className="flex justify-between items-center border-b border-orange-100 pb-2 mb-3.5 pr-1">
                  <span className="font-serif font-bold text-xs flex items-center gap-2 text-stone-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400" /> TO DO (Pending)
                  </span>
                  <span className="text-[10px] font-mono font-bold text-stone-400 bg-white border px-1.5 py-0.2 rounded-full">
                    {tasks.filter(t => t.column === 'todo').length}
                  </span>
                </div>

                <div className="space-y-3">
                  {tasks.filter(t => t.column === 'todo').map(task => (
                    <div key={task.id} className="bg-white border shadow-xs hover:shadow-md transition p-3.5 rounded-[18px] relative group border-stone-200">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[9px] font-mono text-gray-400 flex items-center gap-1">
                          <User className="w-2.5 h-2.5" /> {task.assignedTo || 'Unassigned'}
                        </span>
                        <button onClick={() => deleteTask(task.id, task.title)} className="text-gray-300 hover:text-red-500 cursor-pointer transition">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h4 className="text-xs font-bold font-sans text-stone-850 block">{task.title}</h4>
                      
                      <div className="mt-3.5 flex justify-between items-center text-[9px] font-mono text-stone-500">
                        <span className="flex items-center gap-1"><MapPin className="w-2.5 h-2.5 text-[#BA5834]" /> {task.location}</span>
                        <button
                          onClick={() => moveTask(task.id, 'next')}
                          className="px-2 py-0.8 bg-gradient-to-r from-[#BA5834] to-[#f26b4f] text-white rounded font-bold hover:scale-105 cursor-pointer flex items-center gap-0.5"
                        >
                          Start <Play className="w-1.5 h-1.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 2: IN PROGRESS (En Cours) */}
              <div className="bg-[#FAF8F5]/80 border border-[#e1d5c1] rounded-2xl p-4">
                <div className="flex justify-between items-center border-b border-orange-100 pb-2 mb-3.5 pr-1">
                  <span className="font-serif font-bold text-xs flex items-center gap-2 text-stone-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> IN PROGRESS
                  </span>
                  <span className="text-[10px] font-mono font-bold text-stone-400 bg-white border px-1.5 py-0.2 rounded-full">
                    {tasks.filter(t => t.column === 'progress').length}
                  </span>
                </div>

                <div className="space-y-3">
                  {tasks.filter(t => t.column === 'progress').map(task => (
                    <div key={task.id} className="bg-white border-2 border-orange-100 shadow-xs hover:shadow-md transition p-3.5 rounded-[18px] relative group">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[9px] font-mono text-[#BA5834] font-bold flex items-center gap-1">
                          <User className="w-2.5 h-2.5" /> {task.assignedTo}
                        </span>
                        <div className="flex gap-1.5">
                          <button onClick={() => moveTask(task.id, 'prev')} className="text-gray-400 hover:text-stone-700 cursor-pointer">
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => deleteTask(task.id, task.title)} className="text-gray-300 hover:text-red-500 cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 className="text-xs font-bold font-sans text-stone-850 block">{task.title}</h4>
                      <p className="text-[8px] font-mono text-stone-400 mt-1 uppercase">{task.timeDetail}</p>
                      
                      <div className="mt-3.5 flex justify-between items-center text-[9px] font-mono text-stone-500">
                        <span className="flex items-center gap-1"><MapPin className="w-2.5 h-2.5 text-[#BA5834]" /> {task.location}</span>
                        <button
                          onClick={() => moveTask(task.id, 'next')}
                          className="px-2 py-0.8 bg-[#1c2c3e] text-[#4de082] rounded font-bold hover:scale-105 cursor-pointer flex items-center gap-0.5"
                        >
                          Done <Check className="w-1.5 h-1.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 3: VERIFIED (Vérifié / Rapports) */}
              <div className="bg-[#FAF8F5]/80 border border-[#e1d5c1] rounded-2xl p-4">
                <div className="flex justify-between items-center border-b border-orange-100 pb-2 mb-3.5 pr-1">
                  <span className="font-serif font-bold text-xs flex items-center gap-2 text-stone-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400" /> VERIFIED (Done)
                  </span>
                  <span className="text-[10px] font-mono font-bold text-stone-400 bg-white border px-1.5 py-0.2 rounded-full">
                    {tasks.filter(t => t.column === 'verified').length}
                  </span>
                </div>

                <div className="space-y-3">
                  {tasks.filter(t => t.column === 'verified').map(task => (
                    <div key={task.id} className="bg-white border border-stone-200 opacity-80 p-3.5 rounded-[18px] relative">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[9px] font-mono text-gray-400 flex items-center gap-1">
                          <User className="w-2.5 h-2.5" /> {task.assignedTo}
                        </span>
                        <button onClick={() => moveTask(task.id, 'prev')} className="text-gray-400 hover:text-stone-700 cursor-pointer">
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h4 className="text-xs font-bold font-sans text-stone-650 block line-through">{task.title}</h4>
                      <p className="text-[8px] font-mono text-stone-400 mt-1">{task.timeDetail}</p>
                      
                      <div className="mt-3 flex justify-between items-center text-[9px] font-mono text-stone-400">
                        <span className="flex items-center gap-1">{task.location}</span>
                        <span className="text-emerald-600 font-bold flex items-center gap-0.5 font-sans uppercase">
                          <Check className="w-3 h-3" /> Checked
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* TAB 2: MONTHLY HARVEST & WORK CALENDAR */}
        {activeTab === 'calendar' && (
          <motion.div 
            key="tab-calendar"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="space-y-6"
          >
            {/* Calendar header control */}
            <div className="flex justify-between items-center bg-white border border-stone-200 p-4 rounded-2xl">
              <div>
                <h3 className="font-serif font-bold text-base text-[#451e09]">Regional Agricultural Calendar</h3>
                <p className="text-xs text-stone-400">Coordinated planting, chemical inputs & harvest intervals</p>
              </div>

              <div className="flex items-center gap-3">
                <button className="p-1 px-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-bold transition">
                  Month
                </button>
                <div className="flex items-center gap-1 shadow-xs bg-white border rounded-xl px-2.5 py-1 text-xs font-mono font-bold font-serif">
                  <ChevronLeft className="w-4 h-4 text-stone-400 cursor-pointer" />
                  <span>{currentMonth}</span>
                  <ChevronRight className="w-4 h-4 text-stone-400 cursor-pointer" />
                </div>
              </div>
            </div>

            {/* Calendar Grid 7 columns */}
            <div className="bg-white border border-stone-200 rounded-[28px] overflow-hidden shadow-xs">
              <div className="grid grid-cols-7 border-b border-stone-200 bg-stone-50 font-mono text-[10px] font-bold text-stone-400 text-center py-2.5 uppercase tracking-wider select-none">
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
                <div>Sun</div>
              </div>

              <div className="grid grid-cols-7 divide-x divide-y divide-stone-100 min-h-[420px] bg-stone-50/20">
                {/* 4 blank cells leading to June 2026 Monday start */}
                {calendarDates.map((date, idx) => (
                  <div key={idx} className="bg-white p-2 flex flex-col justify-between align-stretch text-[11px] font-sans h-24 hover:bg-stone-50/30 transition border-t border-l border-stone-100">
                    <span className="font-mono font-bold text-stone-400 self-start">{date.day}</span>
                    
                    <div className="space-y-1 my-1 flex-grow overflow-y-auto">
                      {date.events.map((evt, eIdx) => (
                        <div 
                          key={eIdx} 
                          onClick={() => {
                            onAddLog('info', `CALENDAR: Diagnostic de l'événement [${evt.title}] opéré.`);
                            alert(`Task detail: "${evt.title}"\nAssigned Operator: ${evt.team}`);
                          }}
                          className="bg-amber-50 text-[#BA5834] border border-orange-200 rounded p-1 text-[9px] leading-tight font-sans font-semibold cursor-pointer max-w-full truncate block"
                          title={evt.title}
                        >
                          {evt.title}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: CROP ROTATION RESTORATIVE MATRIX PLANNER */}
        {activeTab === 'rotation' && (
          <motion.div 
            key="tab-rotation"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="space-y-6"
          >
            {/* Title explanation banner */}
            <div className="bg-amber-50 text-amber-900 border border-amber-200 rounded-2xl p-5 flex gap-4 items-start text-xs">
              <Info className="w-5 h-5 text-[#BA5834] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="text-sm font-serif font-bold text-[#451e09] block">Agronomic Soil Health Rotation Protocol</strong>
                <p className="leading-relaxed font-sans text-stone-700">
                  Rotating crops regularly prevents severe nitrogen depletion. Lavender heavily drains soil nutrients, while leguminous Alfalfa captures atomospheric nitrogen, replenishing chemical balances naturally and avoiding costly chemical fertilizers. Rotation ensures robust biological resistance to invasive pests.
                </p>
              </div>
            </div>

            {/* Interactive Crops rotation grid mapping */}
            <div className="bg-white border border-stone-200 rounded-[24px] p-5">
              <div className="border-b border-stone-100 pb-3 mb-4">
                <h3 className="font-serif font-bold text-sm text-stone-850">Interactive Land Parcel Rotation Planner</h3>
              </div>

              <div className="space-y-4 font-sans text-xs">
                {rotationParcels.map(parcel => (
                  <div key={parcel.id} className="p-4 border border-stone-150 rounded-2xl bg-stone-50/30 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    
                    {/* Parcel Name */}
                    <div className="md:col-span-3">
                      <strong className="text-gray-800 text-sm block">{parcel.name}</strong>
                      <span className={`px-2 py-0.5 inline-block text-[8.5px] uppercase font-bold rounded-lg mt-1 font-mono border ${
                        parcel.soilState === 'Rich' 
                          ? 'text-green-700 bg-green-50 border-green-200' 
                          : parcel.soilState === 'Recovering Nitrogen' 
                            ? 'text-blue-750 text-blue-700 bg-blue-50 border-blue-200' 
                            : 'text-red-700 bg-red-50 border-red-200'
                      }`}>
                        {parcel.soilState}
                      </span>
                    </div>

                    {/* Rotation years step progress */}
                    <div className="md:col-span-6 grid grid-cols-3 gap-3">
                      <div className="bg-white border rounded-xl p-2.5 text-center shadow-xs">
                        <span className="text-[8px] font-mono text-stone-400 block uppercase">Year 1 (Historic)</span>
                        <span className="font-semibold text-stone-700 mt-1 block">{parcel.year1}</span>
                      </div>
                      <div className="bg-white border rounded-xl p-2.5 text-center shadow-xs">
                        <span className="text-[8px] font-mono text-stone-400 block uppercase">Year 2 (Historic)</span>
                        <span className="font-semibold text-stone-700 mt-1 block">{parcel.year2}</span>
                      </div>

                      {/* Dropdown in Year 3 to simulate rotation change */}
                      <div className="bg-orange-50/20 border border-orange-200 rounded-xl p-2.5 text-center shadow-sm">
                        <span className="text-[8px] font-mono text-[#BA5834] block uppercase font-bold">Year 3 (Active)</span>
                        <select
                          value={parcel.year3}
                          onChange={(e) => handleUpdateYear3(parcel.id, e.target.value)}
                          className="bg-transparent font-bold text-gray-700 outline-none mt-1 text-center w-full cursor-pointer text-xs"
                        >
                          <option value="Lavender (Heavy Depleter)">Lavender (Depleter)</option>
                          <option value="Winter Wheat (Moderate)">Winter Wheat (Mod)</option>
                          <option value="Alfalfa (Nitrogen Fixer)">Alfalfa (Restorer)</option>
                        </select>
                      </div>
                    </div>

                    {/* System feedback and recommendation */}
                    <div className="md:col-span-3 bg-white p-3 rounded-xl border border-stone-200 text-[10.5px] leading-relaxed text-stone-605">
                      <span className="font-bold text-gray-800 block text-[9px] uppercase font-mono mb-0.5">Biochem recommendation</span>
                      {parcel.recommendation}
                    </div>

                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
