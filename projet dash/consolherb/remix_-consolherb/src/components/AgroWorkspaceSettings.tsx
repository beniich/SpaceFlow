import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Settings, 
  Check, 
  Plus, 
  Trash2, 
  Edit3, 
  ShieldCheck, 
  ToggleLeft, 
  ToggleRight,
  Globe,
  FileSpreadsheet,
  Clock,
  Shield,
  Activity,
  AlertTriangle
} from 'lucide-react';

interface AgroWorkspaceSettingsProps {
  onAddLog: (level: 'info' | 'success' | 'warn' | 'error', message: string) => void;
}

interface ActivityLog {
  id: string;
  timestamp: string;
  operator: string;
  role: string;
  action: string;
  type: 'info' | 'success' | 'warn' | 'error';
}

export default function AgroWorkspaceSettings({ onAddLog }: AgroWorkspaceSettingsProps) {
  // Active settings navigation tab
  const [activeCategory, setActiveCategory] = useState<'workspace' | 'general' | 'team' | 'rbac' | 'audit'>('team');

  // Interactive team members state
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'Jean Dupont', email: 'jean@agro.com', role: 'Admin' },
    { id: 2, name: 'Marie Curie', email: 'marie@agro.com', role: 'Farm Manager' },
    { id: 3, name: 'Pierre Martin', email: 'pierre@agro.com', role: 'Field Specialist' },
    { id: 4, name: 'Jane Smith', email: 'jane@agro.com', role: 'Field Specialist' },
    { id: 5, name: 'John Doe', email: 'john@agro.com', role: 'Field Hand' }
  ]);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Field Specialist');

  // Custom roles list for RBAC
  const [roles, setRoles] = useState([
    { title: 'Admin', desc: 'Full access to all features, finances, and infrastructure.' },
    { title: 'Farm Manager', desc: 'Can manage agricultural output, rotate crops, and balance budget.' },
    { title: 'Field Specialist', desc: 'Can input botanical telemetry data and trigger maintenance.' },
    { title: 'Field Hand', desc: 'Restricted access; can log biometric shifts and view kanban board.' }
  ]);

  const [isAddingRole, setIsAddingRole] = useState(false);
  const [newRoleTitle, setNewRoleTitle] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');

  // Granular permission scopes map
  const [permissionsMap, setPermissionsMap] = useState({
    'Admin': { finance: true, inventory: true, calendar: true, admin: true },
    'Farm Manager': { finance: true, inventory: true, calendar: true, admin: false },
    'Field Specialist': { finance: false, inventory: true, calendar: true, admin: false },
    'Field Hand': { finance: false, inventory: false, calendar: true, admin: false },
  });

  // General settings state
  const [timezone, setTimezone] = useState('Europe/Paris - CEST');
  const [dateFormat, setDateFormat] = useState('YYYY-MM-DD');
  const [multiTenant, setMultiTenant] = useState(true);

  // SECURED AUDIT LEDGER LOGS
  const [auditLogs, setAuditLogs] = useState<ActivityLog[]>([
    { id: 'aud-1', timestamp: '2026-06-05 21:05:33', operator: 'Marie Curie', role: 'Farm Manager', action: 'Regenerated NPK Soil Nutrition Crop Rotation targets for South Slope parcel G.', type: 'info' },
    { id: 'aud-2', timestamp: '2026-06-05 20:14:15', operator: 'Jean Dupont', role: 'Admin', action: 'Calibrated Gross Revenue projections from $420,000 to $480,000 on EBITDA Simulator.', type: 'success' },
    { id: 'aud-3', timestamp: '2026-06-05 18:42:01', operator: 'Pierre Martin', role: 'Field Specialist', action: 'Completed Barcode Arrival checking for Organic Alfalfa feed Sack #PKG-SEED-WHT-89240.', type: 'info' },
    { id: 'aud-4', timestamp: '2026-06-05 16:35:10', operator: 'Jean Dupont', role: 'Admin', action: 'Authorized dispatch of $19,345 stripe batch payroll consolidation for 6 field operators.', type: 'success' },
    { id: 'aud-5', timestamp: '2026-06-05 14:12:00', operator: 'Jane Smith', role: 'Field Specialist', action: 'Clocked-in biometric field shift tracker (Status: Active).', type: 'info' },
  ]);

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    const namePart = inviteEmail.split('@')[0];
    const name = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    
    const newMember = {
      id: Date.now(),
      name,
      email: inviteEmail.trim(),
      role: inviteRole
    };
    
    setTeamMembers(prev => [...prev, newMember]);
    onAddLog('success', `WORKSPACE: Invitation envoyée d'urgence à [${inviteEmail}] avec le rôle de [${inviteRole}].`);
    
    // Add to audit trail
    const newAudit: ActivityLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      operator: 'Active Admin',
      role: 'Admin',
      action: `Invited new workforce user ${name} (${inviteEmail}) as ${inviteRole}.`,
      type: 'success'
    };
    setAuditLogs(prev => [newAudit, ...prev]);

    setInviteEmail('');
  };

  const handleDeleteMember = (id: number, name: string, email: string) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id));
    onAddLog('warn', `WORKSPACE: Membre supprimé du système de sécurité: [${email}].`);

    // Add to audit trail
    const newAudit: ActivityLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      operator: 'Active Admin',
      role: 'Admin',
      action: `Expelled team operator: ${name} (${email}) from secure database.`,
      type: 'warn'
    };
    setAuditLogs(prev => [newAudit, ...prev]);
  };

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleTitle.trim()) return;
    
    const title = newRoleTitle.trim();
    setRoles(prev => [...prev, { title, desc: newRoleDesc.trim() || 'Custom parameters' }]);
    
    // Seed permissions for custom role
    setPermissionsMap(prev => ({
      ...prev,
      [title]: { finance: false, inventory: true, calendar: true, admin: false }
    }));

    onAddLog('success', `WORKSPACE: Nouveau rôle RBAC généré avec restrictions: "${title}"`);

    // Add to audit trail
    const newAudit: ActivityLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      operator: 'Active Admin',
      role: 'Admin',
      action: `Created new custom security role: "${title}". Initialized low-privilege bounds.`,
      type: 'success'
    };
    setAuditLogs(prev => [newAudit, ...prev]);

    setNewRoleTitle('');
    setNewRoleDesc('');
    setIsAddingRole(false);
  };

  const togglePermission = (roleTitle: string, permissionField: 'finance' | 'inventory' | 'calendar' | 'admin') => {
    setPermissionsMap(prev => {
      const existing = (prev as any)[roleTitle] || { finance: false, inventory: false, calendar: false, admin: false };
      const nextVal = !existing[permissionField];
      onAddLog('info', `RBAC: Permission [${permissionField}] modifiée pour le rôle [${roleTitle}] -> [${nextVal ? 'AUTORISÉ' : 'RÉVOQUÉ'}]`);
      
      return {
        ...prev,
        [roleTitle]: { ...existing, [permissionField]: nextVal }
      };
    });
  };

  const handleSaveChanges = () => {
    onAddLog('success', 'WORKSPACE_CONFIG: Enregistrement matériel des seuils de conformité et de l\'architecture multi-tenant.');
    alert('Workspace settings & security rules saved successfully!');
  };

  return (
    <div className="bg-[#FAF9F5] text-stone-800 p-6 rounded-[28px] border border-[#e1d5c1] font-sans shadow-md select-none" id="workspace-rbac-panel-center">
      
      {/* Brand Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#e1d5c1] pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-[#BA5834] to-[#f26b4f] rounded-xl flex items-center justify-center text-white text-lg font-bold">
            🛡️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-serif font-bold text-[#451e09]">AgroMaître Security</span>
              <span className="text-[9px] bg-red-50 text-red-700 border border-red-200 px-2.5 py-0.5 rounded-full font-mono font-bold uppercase tracking-tight">ROLE ACCESS MODULE</span>
            </div>
            <p className="text-xs text-stone-500 font-mono">Workspace organization, granular roles & certified logs check</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-[10px] bg-[#BA5834]/10 text-[#BA5834] border border-[#BA5834]/30 px-3 py-1 rounded-full font-mono font-bold">
            SOC-2 Type II Certified
          </span>
        </div>
      </header>

      {/* Primary Category Selector */}
      <div className="flex flex-wrap gap-1.5 border-b border-stone-200 pb-3 mb-6 font-sans">
        {[
          { id: 'team', label: 'User Administration', icon: <Users className="w-3.5 h-3.5" /> },
          { id: 'rbac', label: 'RBAC Permission Matrix', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
          { id: 'audit', label: 'Secured Audit Trail', icon: <Activity className="w-3.5 h-3.5" /> },
          { id: 'general', label: 'General & Multi-Tenant', icon: <Settings className="w-3.5 h-3.5" /> },
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id as any);
              onAddLog('info', `WORKSPACE: Onglet sélectionné: "${cat.label}"`);
            }}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold font-mono uppercase tracking-tight rounded-xl transition cursor-pointer border ${
              activeCategory === cat.id 
                ? 'bg-[#1c2c3e] border-[#4de082] text-[#4de082] bg-stone-900 border-none' 
                : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            {cat.icon}
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        
        {/* PANEL A: USER ADMINISTRATION (Invite, List, Assign role) */}
        {activeCategory === 'team' && (
          <motion.div 
            key="panel-team"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Invite Form & Members list (8 Cols) */}
            <div className="lg:col-span-7 bg-white border border-stone-200 rounded-[24px] p-5 flex flex-col justify-between">
              <div>
                <div className="border-b border-stone-100 pb-3 mb-4">
                  <h3 className="font-serif font-bold text-base text-stone-900">Enterprise User Administration</h3>
                  <p className="text-xs text-stone-400">Invite workforce employees, alter active workspace access & terminate connections</p>
                </div>

                {/* Invite form */}
                <form onSubmit={handleSendInvite} className="mb-6 flex gap-2 text-xs">
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="Enter operator email..."
                    className="flex-grow px-4 py-2 border border-stone-200 focus:border-[#BA5834] rounded-xl outline-none font-mono"
                    required
                  />
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="px-3 border border-stone-200 rounded-xl bg-stone-50 cursor-pointer text-stone-600 outline-none font-semibold"
                  >
                    {roles.map((r, idx) => (
                      <option key={idx} value={r.title}>{r.title}</option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#BA5834] hover:bg-[#a04321] text-white rounded-xl font-bold transition shrink-0 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Send Invite</span>
                  </button>
                </form>

                {/* Active user grid */}
                <div className="space-y-2">
                  <div className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider px-2">
                    Authorized Operators & Assigned System Roles
                  </div>
                  
                  <div className="divide-y divide-stone-100 max-h-[300px] overflow-y-auto space-y-1.5">
                    {teamMembers.map(member => (
                      <div 
                        key={member.id} 
                        className="p-3 bg-stone-50 rounded-xl border border-stone-150 text-xs flex justify-between items-center"
                      >
                        <div>
                          <strong className="text-stone-850 text-sm block">{member.name}</strong>
                          <span className="text-stone-400 font-mono text-[10px]">{member.email}</span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className="px-2.5 py-0.5 bg-orange-50 border border-orange-200 text-[#f26b4f] text-[9px] uppercase font-mono font-bold rounded-full">
                            {member.role}
                          </span>
                          
                          <button 
                            onClick={() => handleDeleteMember(member.id, member.name, member.email)}
                            disabled={member.email === 'jean@agro.com'} // Protect master admin
                            className="p-1.5 bg-white border border-stone-150 text-stone-400 hover:text-red-500 rounded-lg cursor-pointer transition disabled:opacity-30 disabled:hover:text-stone-400"
                            title="De-authorize User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick action list & system health banner (5 Cols) */}
            <div className="lg:col-span-5 bg-white border border-stone-200 rounded-[24px] p-5 flex flex-col justify-between">
              <div>
                <div className="border-b border-stone-100 pb-2 mb-3">
                  <h3 className="text-xs font-mono font-bold text-stone-400 uppercase tracking-widest">Security Status Configuration</h3>
                </div>

                <div className="bg-orange-50/20 border border-orange-200 p-4 rounded-xl space-y-2 text-xs">
                  <div className="flex gap-2 items-center text-[#BA5834] font-bold">
                    <Shield className="w-4 h-4" />
                    <span>Real-time SSO & LDAP Enforced</span>
                  </div>
                  <p className="text-stone-600 leading-relaxed text-[11px]">
                    User accounts are bound to AgroMaître LDAP Directory database. Any changes or terminations cascade to biometric clock-in gates and financial payment profiles instantly.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-stone-50 border border-stone-150 rounded-xl mt-4">
                <span className="text-[10px] uppercase font-mono font-bold text-stone-400 block mb-1">SSO ACTIVE CONFIGURATION</span>
                <div className="flex justify-between items-center text-xs">
                  <span>Enforce Active Directory Isolation:</span>
                  <strong className="text-emerald-600">ENABLED (LDAP-Secure)</strong>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* PANEL B: GRANULAR REGISTRY ACCESSIBILITY MATRIX */}
        {activeCategory === 'rbac' && (
          <motion.div 
            key="panel-rbac"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="space-y-6"
          >
            <div className="bg-white border border-stone-200 rounded-[24px] p-5">
              <div className="border-b border-stone-100 pb-3 mb-4">
                <h3 className="font-serif font-bold text-base text-stone-900">Granular Role-Based Access Control (RBAC)</h3>
                <p className="text-xs text-stone-400">Map specific core module authorizations per user role. Toggles update secure network tokens.</p>
              </div>

              {/* Roles list edit */}
              <div className="space-y-4 text-xs font-sans">
                {roles.map((r, rIdx) => {
                  const perms = (permissionsMap as any)[r.title] || { finance: false, inventory: false, calendar: false, admin: false };
                  return (
                    <div key={rIdx} className="p-4 border border-stone-150 bg-stone-50/20 rounded-xl grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      
                      {/* Title description */}
                      <div className="md:col-span-3">
                        <strong className="text-[#BA5834] text-sm block font-serif">{r.title}</strong>
                        <span className="text-stone-400 mt-1 block leading-relaxed text-[11px]">{r.desc}</span>
                      </div>

                      {/* Checkbox columns mapping */}
                      <div className="md:col-span-9 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { id: 'finance', label: 'Strategic Finance & Payroll' },
                          { id: 'inventory', label: 'Inputs & Heavy Fleet' },
                          { id: 'calendar', label: 'Crop Cycles & Calendar' },
                          { id: 'admin', label: 'System Admin Overrides' }
                        ].map(perm => (
                          <label 
                            key={perm.id} 
                            className="bg-white border hover:border-orange-200 p-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-xs select-none"
                          >
                            <input 
                              type="checkbox"
                              checked={(perms as any)[perm.id]}
                              onChange={() => togglePermission(r.title, perm.id as any)}
                              className="accent-[#BA5834] w-3.5 h-3.5 cursor-pointer"
                            />
                            <span className="font-semibold text-stone-700 text-[10px] leading-tight">{perm.label}</span>
                          </label>
                        ))}
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Inline Create new role form */}
              <div className="pt-4 mt-6 border-t border-stone-100">
                <AnimatePresence>
                  {isAddingRole ? (
                    <motion.form 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      onSubmit={handleCreateRole} 
                      className="space-y-3 text-xs bg-stone-50 border p-4 rounded-xl"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-mono text-stone-400 font-bold uppercase mb-1">New Role Name</label>
                          <input 
                            type="text" required
                            value={newRoleTitle} onChange={(e) => setNewRoleTitle(e.target.value)}
                            placeholder="e.g., Agronomic Auditor..." 
                            className="w-full px-3 py-1.5 border border-stone-250 bg-white rounded-lg outline-none font-semibold text-stone-800"
                            maxLength={20}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-stone-400 font-bold uppercase mb-1">Permissions Summary Description</label>
                          <input 
                            type="text" required
                            value={newRoleDesc} onChange={(e) => setNewRoleDesc(e.target.value)}
                            placeholder="Brief description of structural capabilities..." 
                            className="w-full px-3 py-1.5 border border-stone-250 bg-white rounded-lg outline-none font-semibold text-stone-850"
                            maxLength={80}
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end pt-2">
                        <button type="button" onClick={() => setIsAddingRole(false)} className="px-3 py-1.5 text-stone-500 font-bold">Cancel</button>
                        <button type="submit" className="px-4 py-1.5 bg-[#BA5834] text-white rounded-lg font-bold">Deploy New Role</button>
                      </div>
                    </motion.form>
                  ) : (
                    <button
                      type="button" onClick={() => setIsAddingRole(true)}
                      className="w-full py-2.5 border border-stone-200 hover:border-[#BA5834] text-stone-700 hover:text-white bg-white hover:bg-[#BA5834] rounded-xl text-xs font-mono uppercase font-bold tracking-tight text-center cursor-pointer transition shadow-xs"
                    >
                      Configure Custom Enterprise Role +
                    </button>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}

        {/* PANEL C: SECURED AUDIT LEDGER */}
        {activeCategory === 'audit' && (
          <motion.div 
            key="panel-audit"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="space-y-6"
          >
            <div className="bg-[#FAF8F5] border border-[#e1d5c1] rounded-[24px] p-5">
              <div className="border-b border-[#e1d5c1] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#BA5834] animate-ping" />
                  <h3 className="font-serif font-bold text-base text-[#451e09]">Cryptographically Signed Audit Ledger</h3>
                </div>
                <p className="text-xs text-stone-500">Watermark logs index of active user operations matching regulatory traceability policies</p>
              </div>

              <div className="space-y-2 font-mono text-[10.5px]">
                {auditLogs.map(log => (
                  <div 
                    key={log.id}
                    className={`p-3 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-2 bg-white ${
                      log.type === 'warn' ? 'border-red-200' : 'border-stone-150'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="text-stone-400 shrink-0 select-none">[{log.timestamp}]</span>
                      <div>
                        <strong className="text-stone-700">{log.operator}</strong>{' '}
                        <span className="text-stone-400 font-sans">({log.role})</span>
                        <p className="text-[#4a4a4a] mt-1 text-xs font-sans font-medium">{log.action}</p>
                      </div>
                    </div>
                    
                    <span className="text-[9px] uppercase font-bold self-start md:self-center shrink-0 text-[#BA5834]">
                      {log.id.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* PANEL D: GENERAL & TENANCY ISOLATION */}
        {activeCategory === 'general' && (
          <motion.div 
            key="panel-general"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="space-y-6"
          >
            <div className="bg-white border border-stone-200 rounded-[24px] p-5">
              <div className="border-b border-stone-100 pb-3 mb-4">
                <h3 className="font-serif font-bold text-base text-stone-900">General Infrastructure Configurations</h3>
              </div>

              <div className="space-y-4 text-xs font-sans">
                {/* Timezone and date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-stone-400 font-bold uppercase mb-1">TimeZone Sockets</label>
                    <select 
                      value={timezone} 
                      onChange={(e) => {
                        setTimezone(e.target.value);
                        onAddLog('success', `WORKSPACE: Fuseau horaire modifié: ${e.target.value}`);
                      }}
                      className="w-full px-3 py-2 border rounded-xl bg-stone-50 cursor-pointer"
                    >
                      <option value="Europe/Paris - CEST">Europe/Paris &bull; CEST</option>
                      <option value="UTC / GMT">Universal UTC / GMT</option>
                      <option value="America/New_York - EST">America/New_York &bull; EST</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-stone-400 font-bold uppercase mb-1">Calendar Date Format</label>
                    <select 
                      value={dateFormat} 
                      onChange={(e) => {
                        setDateFormat(e.target.value);
                        onAddLog('success', `WORKSPACE: Format de date modifié: ${e.target.value}`);
                      }}
                      className="w-full px-3 py-2 border rounded-xl bg-stone-50 cursor-pointer"
                    >
                      <option value="YYYY-MM-DD">YYYY-MM-DD (2026-06-05)</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY (05/06/2026)</option>
                    </select>
                  </div>
                </div>

                {/* Multitenant Isolation toggle */}
                <div className="pt-3 flex justify-between items-center border-t border-stone-100 mt-4">
                  <div>
                    <strong className="text-sm font-bold text-gray-800">Durable Multi-tenant Security Isolation</strong>
                    <p className="text-[10px] text-stone-400 font-mono block mt-0.5">Strict containerized database boundaries</p>
                  </div>

                  <button 
                    onClick={() => {
                      setMultiTenant(!multiTenant);
                      onAddLog('warn', `WORKSPACE: Isolation multi-tenant déplacée vers: [${!multiTenant ? 'ACTIF' : 'INACTIF'}]`);
                    }}
                    className="text-gray-500 hover:text-gray-700 cursor-pointer"
                  >
                    {multiTenant ? (
                      <ToggleRight className="w-9 h-9 text-[#BA5834]" />
                    ) : (
                      <ToggleLeft className="w-9 h-9 text-gray-300" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Bottom Save changes action row bar */}
      <footer className="mt-8 pt-4 border-t border-orange-100 flex justify-end gap-3 select-none">
        <button
          type="button"
          onClick={() => {
            onAddLog('warn', 'WORKSPACE: Annulation des modifications en suspens.');
            alert('Settings reset completed successfully.');
          }}
          className="px-5 py-2.5 border border-stone-250 bg-white text-stone-500 rounded-xl text-xs font-bold transition hover:bg-stone-50 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSaveChanges}
          className="px-6 py-2.5 bg-gradient-to-r from-[#BA5834] to-[#f26b4f] text-white rounded-xl text-xs font-bold shadow transition hover:brightness-105 cursor-pointer"
        >
          Save Configuration
        </button>
      </footer>

    </div>
  );
}
