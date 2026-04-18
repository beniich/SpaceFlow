import React, { useState } from 'react';
import { 
  Shield, 
  LayoutDashboard, 
  ClipboardList, 
  History, 
  Settings, 
  Search, 
  Bell, 
  FileText, 
  Plus,
  Users,
  Lock,
  BarChart3,
  Gavel,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Globe,
  Activity,
  AlertTriangle,
  Database,
  ShieldAlert,
  Network,
  Scale,
  FileSearch,
  Wallet,
  Flag,
  Brain,
  Terminal,
  GanttChart,
  Target,
  Zap,
  Library,
  Share2,
  BookOpen,
  FileCheck,
  ClipboardCheck,
  Archive as Unarchive,
  Workflow,
  HelpCircle,
  Wrench,
  Server,
  Cable,
  MapPin,
  ShieldCheck
} from 'lucide-react';
import { UserButton } from '@clerk/clerk-react';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick: () => void;
  collapsed?: boolean;
}

const NavItem = ({ icon: Icon, label, active, onClick, collapsed }: NavItemProps) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-6 py-4 transition-all hover:bg-slate-100 dark:hover:bg-slate-800 group relative ${
      active 
      ? 'bg-white dark:bg-slate-900 border-r-4 border-blue-600 text-blue-600 shadow-sm' 
      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
    }`}
  >
    <Icon size={20} className={active ? 'text-blue-600' : 'group-hover:text-blue-600 transition-colors'} />
    {!collapsed && (
      <span className="font-sans text-[10px] uppercase tracking-widest font-bold whitespace-nowrap">
        {label}
      </span>
    )}
    {collapsed && active && (
      <div className="absolute left-0 w-1 h-8 bg-blue-600 rounded-r-full" />
    )}
  </button>
);

export const AuditMasterLayout = ({ children, activeTab, onTabChange }: any) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f6fafe] dark:bg-slate-950">
      {/* Sidebar - AuditMaster Protocol Style */}
      <aside 
        className={`flex flex-col border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 fixed left-0 h-screen z-50 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-[280px]'
        }`}
      >
        <div className="px-6 py-8 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="min-w-10 h-10 bg-slate-900 dark:bg-blue-600 flex items-center justify-center rounded shrink-0">
              <Shield size={20} className="text-white fill-current" />
            </div>
            {!isCollapsed && (
              <div className="animate-in fade-in duration-500">
                <h1 className="text-xl font-black text-slate-900 dark:text-white leading-tight">AuditMaster</h1>
                <p className="font-sans text-[9px] uppercase tracking-[0.2em] font-bold text-slate-500">Global Compliance</p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1">
            <NavItem 
              icon={LayoutDashboard} 
              label="Dashboard BI" 
              active={activeTab === 'dashboard'} 
              onClick={() => onTabChange('dashboard')} 
              collapsed={isCollapsed}
            />
            <NavItem 
              icon={ClipboardList} 
              label="Audit Runner" 
              active={activeTab === 'audits'} 
              onClick={() => onTabChange('audits')}
              collapsed={isCollapsed}
            />
            <NavItem 
              icon={Lock} 
              label="Integrity Vault" 
              active={activeTab === 'vault'} 
              onClick={() => onTabChange('vault')}
              collapsed={isCollapsed}
            />
             <NavItem 
              icon={CheckCircle2} 
              label="Compliance Hub" 
              active={activeTab === 'compliance'} 
              onClick={() => onTabChange('compliance')}
              collapsed={isCollapsed}
            />
            <NavItem 
              icon={Gavel} 
              label="Governance" 
              active={activeTab === 'governance'} 
              onClick={() => onTabChange('governance')}
              collapsed={isCollapsed}
            />
            <NavItem 
              icon={Users} 
              label="Certifications" 
              active={activeTab === 'users'} 
              onClick={() => onTabChange('users')}
              collapsed={isCollapsed}
            />
            <NavItem 
              icon={BarChart3} 
              label="Analytics" 
              active={activeTab === 'analytics'} 
              onClick={() => onTabChange('analytics')}
              collapsed={isCollapsed}
            />

            <div className="mt-8 px-6 mb-2">
               {!isCollapsed && <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Sprint 15 / Forensics</span>}
            </div>
            <NavItem 
              icon={Globe} 
              label="Regulator Portal" 
              active={activeTab === 'regulator'} 
              onClick={() => onTabChange('regulator')}
              collapsed={isCollapsed}
            />
            <NavItem 
              icon={AlertTriangle} 
              label="Remediation" 
              active={activeTab === 'remediation'} 
              onClick={() => onTabChange('remediation')}
              collapsed={isCollapsed}
            />
            <NavItem 
              icon={Activity} 
              label="Forensic Lab" 
              active={activeTab === 'forensics'} 
              onClick={() => onTabChange('forensics')}
              collapsed={isCollapsed}
            />
            <NavItem 
              icon={Database} 
              label="Sovereignty" 
              active={activeTab === 'sovereignty'} 
              onClick={() => onTabChange('sovereignty')}
              collapsed={isCollapsed}
            />

            <div className="mt-8 px-6 mb-2">
               {!isCollapsed && <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Sprint 16 / Enterprise</span>}
            </div>
            <NavItem 
              icon={Shield} 
              label="System Logs" 
              active={activeTab === 'syslogs'} 
              onClick={() => onTabChange('syslogs')}
              collapsed={isCollapsed}
            />
            <NavItem 
              icon={Network} 
              label="Entity Mapper" 
              active={activeTab === 'entities'} 
              onClick={() => onTabChange('entities')}
              collapsed={isCollapsed}
            />
            <NavItem 
              icon={Scale} 
              label="Law Mapping" 
              active={activeTab === 'legal'} 
              onClick={() => onTabChange('legal')}
              collapsed={isCollapsed}
            />
            <NavItem 
              icon={ShieldAlert} 
              label="Incident Lab" 
              active={activeTab === 'incidents'} 
              onClick={() => onTabChange('incidents')}
              collapsed={isCollapsed}
            />

            <div className="mt-8 px-6 mb-2">
               {!isCollapsed && <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Sprint 17 / Operations</span>}
            </div>
            <NavItem 
              icon={Users} 
              label="Res. Allocator" 
              active={activeTab === 'resource_allocator'} 
              onClick={() => onTabChange('resource_allocator')}
              collapsed={isCollapsed}
            />
            <NavItem 
              icon={Wallet} 
              label="Budget Analysis" 
              active={activeTab === 'budget_analysis'} 
              onClick={() => onTabChange('budget_analysis')}
              collapsed={isCollapsed}
            />
            <NavItem 
              icon={Flag} 
              label="Milestones" 
              active={activeTab === 'milestone_tracker'} 
              onClick={() => onTabChange('milestone_tracker')}
              collapsed={isCollapsed}
            />
            <NavItem 
              icon={Brain} 
              label="Risk Prediction" 
              active={activeTab === 'risk_prediction'} 
              onClick={() => onTabChange('risk_prediction')}
              collapsed={isCollapsed}
            />

            <div className="mt-8 px-6 mb-2">
               {!isCollapsed && <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Sprint 18 / Ecosystem</span>}
            </div>
            <NavItem 
              icon={Gavel} 
              label="Regulator Portal" 
              active={activeTab === 'regulator_portal'} 
              onClick={() => onTabChange('regulator_portal')}
              collapsed={isCollapsed}
            />
            <NavItem 
              icon={Share2} 
              label="Stakeholder Rep." 
              active={activeTab === 'stakeholder_reporting'} 
              onClick={() => onTabChange('stakeholder_reporting')}
              collapsed={isCollapsed}
            />
            <NavItem 
              icon={FileCheck} 
              label="QA Review" 
              active={activeTab === 'qa_review'} 
              onClick={() => onTabChange('qa_review')}
              collapsed={isCollapsed}
            />
            <NavItem 
              icon={Library} 
              label="Policy Library" 
              active={activeTab === 'policy_library'} 
              onClick={() => onTabChange('policy_library')}
              collapsed={isCollapsed}
            />

            <div className="mt-8 px-6 mb-2">
               {!isCollapsed && <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Sprint 19 / Systems</span>}
            </div>
            <NavItem 
              icon={Unarchive} 
              label="Batch Center" 
              active={activeTab === 'batch_center'} 
              onClick={() => onTabChange('batch_center')}
              collapsed={isCollapsed}
            />
            <NavItem 
              icon={Terminal} 
              label="API Security" 
              active={activeTab === 'api_security'} 
              onClick={() => onTabChange('api_security')}
              collapsed={isCollapsed}
            />
            <NavItem 
              icon={AlertTriangle} 
              label="Exceptions" 
              active={activeTab === 'audit_exceptions'} 
              onClick={() => onTabChange('audit_exceptions')}
              collapsed={isCollapsed}
            />
            <NavItem 
              icon={ShieldCheck} 
              label="Integrity Diag." 
              active={activeTab === 'integrity_diagnostics'} 
              onClick={() => onTabChange('integrity_diagnostics')} 
              collapsed={isCollapsed}
            />

            <div className="mt-8 px-6 mb-2">
               {!isCollapsed && <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Sprint 20 / Innovation</span>}
            </div>
            <NavItem 
              icon={History} 
              label="Forensic Replay" 
              active={activeTab === 'forensic_replay'} 
              onClick={() => onTabChange('forensic_replay')}
              collapsed={isCollapsed}
            />
            <NavItem 
              icon={Brain} 
              label="Innovation Lab" 
              active={activeTab === 'innovation_lab'} 
              onClick={() => onTabChange('innovation_lab')}
              collapsed={isCollapsed}
            />
            <NavItem 
              icon={ShieldAlert} 
              label="Security Audit Log" 
              active={activeTab === 'security_audit_log'} 
              onClick={() => onTabChange('security_audit_log')}
              collapsed={isCollapsed}
            />
            <NavItem 
              icon={Workflow} 
              label="Remediation" 
              active={activeTab === 'remediation_workflow'} 
              onClick={() => onTabChange('remediation_workflow')}
              collapsed={isCollapsed}
            />
            <NavItem 
              icon={FileText} 
              label="Report Preview" 
              active={activeTab === 'report_preview'} 
              onClick={() => onTabChange('report_preview')}
              collapsed={isCollapsed}
            />
            <NavItem 
              icon={HelpCircle} 
              label="System Help" 
              active={activeTab === 'system_help'} 
              onClick={() => onTabChange('system_help')}
              collapsed={isCollapsed}
            />

            <div className="mt-8 px-6 mb-2">
               {!isCollapsed && <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Sprint 21 / Infra</span>}
            </div>
            <NavItem 
              icon={Cable} 
              label="Evidence Config" 
              active={activeTab === 'evidence_collector'} 
              onClick={() => onTabChange('evidence_collector')}
              collapsed={isCollapsed}
            />
            <NavItem 
              icon={Server} 
              label="Identity Setup" 
              active={activeTab === 'identity_provider'} 
              onClick={() => onTabChange('identity_provider')}
              collapsed={isCollapsed}
            />
            <NavItem 
              icon={Network} 
              label="Node Topology" 
              active={activeTab === 'network_topology'} 
              onClick={() => onTabChange('network_topology')}
              collapsed={isCollapsed}
            />
            <NavItem 
              icon={Wrench} 
              label="Maintenance" 
              active={activeTab === 'maintenance_upgrades'} 
              onClick={() => onTabChange('maintenance_upgrades')}
              collapsed={isCollapsed}
            />
            <NavItem 
              icon={MapPin} 
              label="Regional Risk" 
              active={activeTab === 'regional_risk'} 
              onClick={() => onTabChange('regional_risk')}
              collapsed={isCollapsed}
            />
          </div>

          <div className="mt-8 px-6 mb-2">
             {!isCollapsed && <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Administration</span>}
          </div>
          <NavItem 
            icon={Settings} 
            label="System Config" 
            active={activeTab === 'settings'} 
            onClick={() => onTabChange('settings')}
            collapsed={isCollapsed}
          />
        </nav>

        <div className="p-6 border-t border-slate-200 dark:border-slate-800">
          <button 
            className={`w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 ${
              isCollapsed ? 'px-0' : 'px-4'
            }`}
          >
            <Plus size={18} />
            {!isCollapsed && <span className="text-[10px] uppercase tracking-widest font-bold">New Audit</span>}
          </button>
          
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="mt-6 w-full flex items-center justify-center text-slate-400 hover:text-slate-600"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <div className="flex items-center gap-2">
              <ChevronLeft size={16} /> <span className="text-[10px] font-bold uppercase tracking-widest">Réduire</span>
            </div>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main 
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          isCollapsed ? 'ml-20' : 'ml-[280px]'
        }`}
      >
        {/* Top Header */}
        <header className="sticky top-0 w-full flex justify-between items-center h-16 px-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-40 shadow-sm">
          <div className="flex items-center flex-1">
            <div className="relative w-96 group">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all" 
                placeholder="Search audit trail, entities, or risks..." 
                type="text"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 border-r border-slate-200 dark:border-slate-700 pr-6">
              <button className="text-slate-500 hover:text-blue-600 transition-colors relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <button className="text-slate-500 hover:text-blue-600 transition-colors">
                <FileText size={20} />
              </button>
            </div>
            
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
               <UserButton afterSignOutUrl="/" />
               <div className="flex flex-col -gap-1">
                  <span className="text-[10px] font-bold text-slate-900 dark:text-white leading-none">Inspecteur Central</span>
                  <span className="text-[8px] font-medium text-slate-500 uppercase tracking-tighter">Site-Paris-Alpha</span>
               </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="p-10 flex-1 w-full max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-700">
          {children}
        </div>
      </main>
    </div>
  );
};
