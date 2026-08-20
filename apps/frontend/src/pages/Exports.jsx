import { useState, useEffect } from 'react';
import {
  FileText, Download, UploadCloud, FileSpreadsheet,
  CheckCircle2, Clock, Play, Sparkles, Loader2, RefreshCw, AlertCircle
} from 'lucide-react';
import { downloadInventoryPdf, downloadWorkOrderPdf } from '../services/export.service';
import { uploadToDrive, exportToSheets } from '../services/workspace.service';
import toast from 'react-hot-toast';

export default function Exports() {
  const [downloading, setDownloading] = useState(null);
  const [syncingDrive, setSyncingDrive] = useState(false);
  const [syncingSheets, setSyncingSheets] = useState(false);

  // Simulated active batch generation tasks with realistic countdowns
  const [tasks, setTasks] = useState([
    {
      id: 'task-1',
      title: 'Q3 Energy Consumption Analysis',
      description: 'BIM integration complete. Validating structural energy nodes.',
      progress: 78,
      status: 'PROCESSING',
      timeRemaining: '4m remaining',
      type: 'ENERGY_AUDIT'
    },
    {
      id: 'task-2',
      title: 'HVAC Zone 4 Layout (Updated)',
      description: 'BIM layout export. High-resolution vector floorplan compilation.',
      progress: 42,
      status: 'RENDERING',
      timeRemaining: '12m remaining',
      type: 'BIM_LAYOUT'
    },
    {
      id: 'task-3',
      title: 'September Incident Logs',
      description: 'Consolidating ticket records and maintenance logs.',
      progress: 15,
      status: 'EXTRACTING',
      timeRemaining: '18m remaining',
      type: 'LOG_EXTRACTION'
    }
  ]);

  // Slowly advance progress bars for dynamic interaction
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(prevTasks =>
        prevTasks.map(task => {
          if (task.progress >= 100) {
            return { ...task, progress: 100, status: 'COMPLETED', timeRemaining: 'Completed' };
          }
          const nextProgress = task.progress + Math.floor(Math.random() * 3) + 1;
          const displayProgress = Math.min(nextProgress, 100);
          return {
            ...task,
            progress: displayProgress,
            status: displayProgress === 100 ? 'COMPLETED' : task.status,
            timeRemaining: displayProgress === 100 ? 'Completed' : task.timeRemaining
          };
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleDownloadInventory = async () => {
    setDownloading('inventory');
    const loadToast = toast.loading('Compiling parts inventory PDF...');
    try {
      await downloadInventoryPdf();
      toast.success('Inventory report downloaded successfully', { id: loadToast });
    } catch (err) {
      toast.error('Inventory PDF generation failed, downloading simulated report', { id: loadToast });
      alert('Simulated PDF Download: BEECARBONAT Parts Inventory Report');
    } finally {
      setDownloading(null);
    }
  };

  const handleDownloadWorkOrder = async () => {
    setDownloading('workorder');
    const loadToast = toast.loading('Compiling corrective work orders report...');
    try {
      await downloadWorkOrderPdf('wo-demo-101');
      toast.success('Work orders report downloaded successfully', { id: loadToast });
    } catch (err) {
      toast.error('Work order PDF generation failed, downloading simulated report', { id: loadToast });
      alert('Simulated PDF Download: BEECARBONAT corrective Work Orders Report');
    } finally {
      setDownloading(null);
    }
  };

  const handleSyncDrive = async () => {
    setSyncingDrive(true);
    const loadToast = toast.loading('Synchronizing documents to Google Drive...');
    try {
      await uploadToDrive('BEECARBONAT_Facility_Report.txt', 'Official BEECARBONAT Facility report automatically synced on ' + new Date().toLocaleString());
      toast.success('Facility Report synchronized with Google Drive', { id: loadToast });
    } catch (error) {
      toast.error(error.message || 'Drive synchronization failed', { id: loadToast });
    } finally {
      setSyncingDrive(false);
    }
  };

  const handleSyncSheets = async () => {
    setSyncingSheets(true);
    const loadToast = toast.loading('Exporting spreadsheet data to Google Sheets...');
    try {
      const data = [
        ['Timestamp', 'Strategic Pillar', 'Log Description', 'Risk Level'],
        [new Date().toLocaleDateString(), 'Energy & ESG Copilot', 'Automated energy audit triggered for Core Room B', 'Low'],
        [new Date().toLocaleDateString(), 'Predictive AI', 'HVAC Zone 4 fan speed deviation logged', 'Medium'],
        [new Date().toLocaleDateString(), 'Digital Twin', 'Physical 3D node structural link confirmed', 'Low']
      ];
      const url = await exportToSheets('BEECARBONAT Facility Export', data);
      toast.success(
        <span>
          Data exported! <a href={url} target="_blank" rel="noreferrer" className="underline font-bold text-amber-400">Open Google Sheets</a>
        </span>,
        { id: loadToast }
      );
    } catch (error) {
      toast.error(error.message || 'Sheets synchronization failed', { id: loadToast });
    } finally {
      setSyncingSheets(false);
    }
  };

  const triggerMockGeneration = (title) => {
    toast.success(`New batch generation triggered: ${title}`);
    setTasks(prev => [
      {
        id: `task-${Date.now()}`,
        title: title,
        description: 'Initializing batch extraction and structural node checks.',
        progress: 0,
        status: 'PROCESSING',
        timeRemaining: '8m remaining',
        type: 'CUSTOM'
      },
      ...prev
    ]);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 bg-[#09090b] text-zinc-100 min-h-screen font-sans">
      {/* Header and Sync controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-zinc-800/60">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-display uppercase tracking-widest text-zinc-50 flex items-center gap-3">
            <FileText className="w-8 h-8 text-brand-orange" />
            Reports &amp; Docs
          </h1>
          <p className="text-zinc-400 text-xs mt-1 max-w-xl">
            Access, generate, and manage automated facility reports and high-resolution BIM documentation. System currently processing {tasks.filter(t => t.status !== 'COMPLETED').length} active batch requests.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleSyncDrive}
            disabled={syncingDrive}
            className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-sm transition"
          >
            {syncingDrive ? <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-orange" /> : <UploadCloud className="w-3.5 h-3.5 text-brand-orange" />}
            Sync Google Drive
          </button>
          <button
            onClick={handleSyncSheets}
            disabled={syncingSheets}
            className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-sm transition"
          >
            {syncingSheets ? <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-orange" /> : <FileSpreadsheet className="w-3.5 h-3.5 text-green-500" />}
            Sync Google Sheets
          </button>
        </div>
      </div>

      {/* Active Batch Generations Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-orange flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-ping" />
            Active Batch Generations ({tasks.filter(t => t.status !== 'COMPLETED').length} tasks running)
          </h2>
          <span className="text-[10px] text-zinc-500 font-mono uppercase">System Queue: Normal</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <div key={task.id} className="bg-zinc-900/60 border border-zinc-800/80 rounded-sm p-5 space-y-4 hover:border-zinc-700 transition relative overflow-hidden">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <h3 className="font-mono text-sm font-semibold text-zinc-200 truncate max-w-[200px]">{task.title}</h3>
                  <span className="text-[9px] text-zinc-500 font-mono tracking-widest uppercase">{task.type}</span>
                </div>
                <span className={`px-2 py-0.5 text-[9px] font-mono tracking-wider rounded-sm border ${
                  task.status === 'COMPLETED'
                    ? 'bg-green-500/10 text-green-400 border-green-500/20'
                    : 'bg-brand-orange/10 text-brand-orange border-brand-orange/20 animate-pulse'
                }`}>
                  {task.status}
                </span>
              </div>

              <p className="text-xs text-zinc-400 line-clamp-2 min-h-[32px]">{task.description}</p>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
                  <span>Progress</span>
                  <span className="text-brand-orange font-bold">{task.progress}%</span>
                </div>
                <div className="w-full bg-zinc-950 h-1 rounded-full overflow-hidden border border-zinc-800">
                  <div
                    className="bg-brand-orange h-full transition-all duration-500"
                    style={{ width: `${task.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 pt-1">
                <Clock className="w-3 h-3 text-zinc-500" />
                <span>{task.timeRemaining}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Available Documents and Archive */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400 flex items-center gap-2">
            Available Reports &amp; Compliance Archive
          </h2>
          <span className="text-[10px] text-zinc-500 font-mono uppercase">Standard PDFKit v2.4</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Item 1 */}
          <div className="bg-zinc-900 border border-zinc-800/80 p-6 flex flex-col justify-between hover:border-zinc-700 transition">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-brand-orange" />
                </div>
                <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded-sm bg-zinc-950 border border-zinc-800 text-zinc-400 uppercase tracking-widest">
                  Parts Inventory
                </span>
              </div>

              <div>
                <h4 className="font-mono text-sm font-bold text-zinc-100 uppercase tracking-wide">BEECARBONAT Parts Inventory</h4>
                <p className="text-xs text-zinc-500 mt-1">Official time-stamped log of critical building components, lifespans, and stock levels.</p>
              </div>

              <div className="space-y-2 text-xs text-zinc-400 border-t border-zinc-800/60 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                  <span>Optimized print and ERP synchronization layout</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                  <span>Includes live QR code index linking</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={handleDownloadInventory}
                disabled={downloading === 'inventory'}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-brand-orange hover:bg-[#e27010] text-black font-mono text-xs uppercase tracking-wider font-bold transition"
              >
                {downloading === 'inventory' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                Download PDF
              </button>
              <button
                onClick={() => triggerMockGeneration('Parts Inventory Update')}
                className="p-2 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition"
                title="Trigger Manual Batch Compile"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Item 2 */}
          <div className="bg-zinc-900 border border-zinc-800/80 p-6 flex flex-col justify-between hover:border-zinc-700 transition">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-cyan-400" />
                </div>
                <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded-sm bg-zinc-950 border border-zinc-800 text-zinc-400 uppercase tracking-widest">
                  Work Orders
                </span>
              </div>

              <div>
                <h4 className="font-mono text-sm font-bold text-zinc-100 uppercase tracking-wide">Corrective WO Summary</h4>
                <p className="text-xs text-zinc-500 mt-1">Audit sheet listing corrective actions, technical signatures, SRE server alarms, and response durations.</p>
              </div>

              <div className="space-y-2 text-xs text-zinc-400 border-t border-zinc-800/60 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                  <span>SLA response and resolution times compiled</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                  <span>Fully verified technician signature blocks</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={handleDownloadWorkOrder}
                disabled={downloading === 'workorder'}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-cyan-600 hover:bg-cyan-500 text-black font-mono text-xs uppercase tracking-wider font-bold transition"
              >
                {downloading === 'workorder' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                Download PDF
              </button>
              <button
                onClick={() => triggerMockGeneration('Corrective WO Log compiles')}
                className="p-2 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition"
                title="Trigger Manual Batch Compile"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Item 3 */}
          <div className="bg-zinc-900 border border-zinc-800/80 p-6 flex flex-col justify-between hover:border-zinc-700 transition">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-brand-orange" />
                </div>
                <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded-sm bg-zinc-950 border border-zinc-800 text-zinc-400 uppercase tracking-widest">
                  ESG &amp; ENERGY
                </span>
              </div>

              <div>
                <h4 className="font-mono text-sm font-bold text-zinc-100 uppercase tracking-wide">Building ESG Audit</h4>
                <p className="text-xs text-zinc-500 mt-1">Full-spectrum analysis of facility power footprints, HVAC efficiency coefficients, and target emission goals.</p>
              </div>

              <div className="space-y-2 text-xs text-zinc-400 border-t border-zinc-800/60 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                  <span>BIM floorplan energy node validation logs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                  <span>CO2 emission models &amp; sustainability ratios</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={handleDownloadInventory}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 font-mono text-xs uppercase tracking-wider font-bold transition"
              >
                <Download className="w-3.5 h-3.5 text-brand-orange" />
                Download PDF
              </button>
              <button
                onClick={() => triggerMockGeneration('Full ESG Sustainability audit compilation')}
                className="p-2 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition"
                title="Trigger Manual Batch Compile"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
