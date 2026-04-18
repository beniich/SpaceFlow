import React from 'react';
import { motion } from 'motion/react';
import { 
  Settings as SettingsInputComponent, 
  Terminal, 
  FlaskConical as Biotech, 
  History as HistoryEdu, 
  Users as Groups,
  Network as AccountTree,
  AlertTriangle as Warning,
  Play as PlayCircle,
  PlusCircle as AddCircle,
  MoreVertical as MoreVert,
  Upload as UploadFile,
  Copy as ContentCopy,
  ShieldCheck as VerifiedUser,
  Settings as SettingsEthernet,
  Download,
  Plus as Add
} from 'lucide-react';

const IdentityProviderSetup: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f6fafe] p-10 font-sans cursor-default">
      <div className="max-w-[1440px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex justify-between items-end border-b border-slate-200 pb-6">
           <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-500 text-[10px] uppercase font-bold tracking-widest">
                 <span>ADMINISTRATION</span>
                 <span>/</span>
                 <span className="text-blue-600">SSO & IDENTITY PROVIDERS</span>
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Identity Provider Mapping</h1>
              <p className="text-slate-500 max-w-2xl font-medium">Configure enterprise-grade SSO connections using SAML 2.0 or OIDC. Map IDP groups directly to internal AuditMaster roles with cryptographic verification.</p>
           </div>
           <div className="flex gap-4">
              <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white text-slate-700 text-[10px] font-bold uppercase tracking-widest rounded hover:bg-slate-50 transition-colors shadow-sm">
                 <Download size={14} /> EXPORT METADATA
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest rounded hover:opacity-90 transition-opacity shadow-sm shadow-blue-600/20">
                 <Add size={14} /> CONNECT NEW IDP
              </button>
           </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-12 gap-6">
           
           {/* Connection Details */}
           <div className="col-span-8 bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                 <div className="flex items-center gap-3">
                    <SettingsEthernet size={20} className="text-blue-600" />
                    <h3 className="text-xl font-bold text-slate-900">Connection Details</h3>
                 </div>
                 <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                    <VerifiedUser size={12} className="fill-current" /> ACTIVE
                 </div>
              </div>
              
              <div className="space-y-6">
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">Provider Name</label>
                       <input className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium" defaultValue="Okta Corporate" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">Protocol</label>
                       <select className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium">
                          <option>SAML 2.0</option>
                          <option>OIDC (OpenID Connect)</option>
                       </select>
                    </div>
                 </div>
                 
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">SSO ENDPOINT URL (ASSERTION CONSUMER SERVICE)</label>
                    <div className="relative">
                       <input className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 pr-10 font-mono text-xs text-slate-600" readOnly defaultValue="https://auditmaster.enterprise.com/api/v1/sso/saml/callback/okta-001" />
                       <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors">
                          <ContentCopy size={16} />
                       </button>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">IDENTITY PROVIDER ISSUER (ENTITY ID)</label>
                    <input className="w-full border border-slate-200 rounded-lg p-3 font-mono text-xs focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all" placeholder="http://www.okta.com/exk123456..." defaultValue="http://www.okta.com/exk123456abc" />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">X.509 CERTIFICATE</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 hover:border-slate-300 transition-all">
                       <UploadFile size={32} className="text-slate-400 mb-3" />
                       <p className="text-sm font-medium text-slate-600">Drop certificate file or <span className="text-blue-600 font-bold">browse</span></p>
                       <p className="text-[10px] font-mono font-bold text-slate-400 mt-2 uppercase">Supported: .PEM, .CER, .CRT</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Diagnostics & Stats */}
           <div className="col-span-4 space-y-6">
              
              <div className="bg-[#091426] text-white rounded-xl p-8 shadow-xl shadow-slate-200">
                 <div className="flex items-center gap-3 mb-4">
                    <Biotech size={24} className="text-emerald-400" />
                    <h3 className="text-xl font-bold tracking-tight">Diagnostics</h3>
                 </div>
                 <p className="text-slate-300 text-sm mb-6 leading-relaxed">Perform a real-time validation of your SSO configuration without affecting current users.</p>
                 
                 <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                       <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Endpoint Reachability</span>
                       <span className="text-[10px] font-mono font-bold uppercase text-emerald-400">Success</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                       <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Certificate Validity</span>
                       <span className="text-[10px] font-mono font-bold uppercase text-emerald-400">Valid</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                       <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Latency</span>
                       <span className="text-[10px] font-mono font-bold uppercase text-white">42ms</span>
                    </div>
                 </div>

                 <button className="w-full bg-blue-600 text-white py-3 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-blue-500 transition-all flex items-center justify-center gap-2 shadow-sm">
                    <PlayCircle size={16} /> TEST CONNECTION
                 </button>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
                 <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-6">PROVISIONING INSIGHTS</h4>
                 <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
                       <Groups size={28} />
                    </div>
                    <div>
                       <p className="text-3xl font-black text-slate-900 tracking-tighter">1,248</p>
                       <p className="text-[10px] font-mono font-bold text-slate-400 uppercase">Synchronized Users</p>
                    </div>
                 </div>
                 <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2 overflow-hidden">
                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                 </div>
                 <p className="text-[10px] font-mono font-bold text-slate-400 leading-none">75% of total organization mapped</p>
              </div>

           </div>

           {/* Attribute Mapping */}
           <div className="col-span-12 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <div className="flex items-center gap-3">
                    <AccountTree size={20} className="text-blue-600" />
                    <div>
                       <h3 className="text-lg font-bold text-slate-900 leading-none mb-1">Attribute Mapping</h3>
                       <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">SAML Claims to AuditMaster Properties</p>
                    </div>
                 </div>
                 <button className="text-blue-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 hover:underline">
                    <AddCircle size={14} /> ADD CUSTOM MAPPING
                 </button>
              </div>
              
              <table className="w-full text-left">
                 <thead className="bg-slate-50 border-b border-slate-100">
                    <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                       <th className="px-6 py-4">IDP CLAIM (SOURCE)</th>
                       <th className="px-6 py-4">AUDITMASTER FIELD (TARGET)</th>
                       <th className="px-6 py-4">FALLBACK VALUE</th>
                       <th className="px-6 py-4">STATUS</th>
                       <th className="px-6 py-4 text-right"></th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 text-sm">
                    {/* Row 1 */}
                    <tr className="hover:bg-slate-50 transition-colors">
                       <td className="px-6 py-4 font-mono text-[11px] text-slate-900">http://schemas.xmlsoap.org/.../email</td>
                       <td className="px-6 py-4 font-bold text-slate-900">User Email</td>
                       <td className="px-6 py-4 font-mono text-[11px] text-slate-400">—</td>
                       <td className="px-6 py-4">
                          <span className="flex items-center gap-2 text-[10px] font-mono font-bold text-emerald-600">
                             <span className="w-2 h-2 rounded-full bg-emerald-500" /> ACTIVE
                          </span>
                       </td>
                       <td className="px-6 py-4 text-right">
                          <button className="text-slate-400 hover:text-blue-600"><MoreVert size={16} /></button>
                       </td>
                    </tr>
                    {/* Row 2 */}
                    <tr className="bg-slate-50/50 hover:bg-slate-50 transition-colors">
                       <td className="px-6 py-4 font-mono text-[11px] text-slate-900">groups</td>
                       <td className="px-6 py-4 font-bold text-slate-900">Security Role</td>
                       <td className="px-6 py-4 font-mono text-[11px] text-slate-400">read-only</td>
                       <td className="px-6 py-4">
                          <span className="flex items-center gap-2 text-[10px] font-mono font-bold text-emerald-600">
                             <span className="w-2 h-2 rounded-full bg-emerald-500" /> ACTIVE
                          </span>
                       </td>
                       <td className="px-6 py-4 text-right">
                          <button className="text-slate-400 hover:text-blue-600"><MoreVert size={16} /></button>
                       </td>
                    </tr>
                    {/* Row 3 */}
                    <tr className="hover:bg-slate-50 transition-colors">
                       <td className="px-6 py-4 font-mono text-[11px] text-slate-900">department</td>
                       <td className="px-6 py-4 font-bold text-slate-900">Organization Unit</td>
                       <td className="px-6 py-4 font-mono text-[11px] text-slate-400">unassigned</td>
                       <td className="px-6 py-4">
                          <span className="flex items-center gap-2 text-[10px] font-mono font-bold text-slate-400">
                             <span className="w-2 h-2 rounded-full bg-slate-300" /> PENDING
                          </span>
                       </td>
                       <td className="px-6 py-4 text-right">
                          <button className="text-slate-400 hover:text-blue-600"><MoreVert size={16} /></button>
                       </td>
                    </tr>
                 </tbody>
              </table>
           </div>

           {/* Config Audit Trail */}
           <div className="col-span-12 bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
                 <HistoryEdu size={20} className="text-blue-600" />
                 <h3 className="text-lg font-bold text-slate-900">Configuration Audit Trail</h3>
              </div>
              
              <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:h-full before:w-[2px] before:bg-slate-100">
                 
                 {/* Event 1 */}
                 <div className="relative flex items-start gap-6 ml-[5px]">
                    <div className="w-[30px] h-[30px] rounded-full bg-white border-2 border-blue-600 absolute -left-[5px] top-0 shadow-sm z-10" />
                    <div className="pl-10 flex-1">
                       <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
                          <div className="flex justify-between items-start mb-2">
                             <h4 className="font-bold text-slate-900">SAML Certificate Rotated</h4>
                             <span className="text-[10px] font-mono font-bold text-slate-400">OCT 24, 2023 · 14:22 GMT</span>
                          </div>
                          <p className="text-xs font-mono text-slate-600 leading-relaxed mb-4">
                             Updated public key for Okta IDP. SHA-256 Fingerprint changed to <span className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">A1:B2:C3:D4...</span>
                          </p>
                          <div className="flex items-center gap-2">
                             <div className="w-5 h-5 bg-slate-300 rounded-full overflow-hidden">
                                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJMVc32xm2s70s5Suyleayvc-qlYLSfAIpRh85LoY7vpsDg6EiWr7lXNeCfEf21cHIvZFhY2VWIX39c1Z-MP7U6UobYtZke7j5Le3zGdPgkiwRw27VWxYZLa7APiWuIS7xYAMC7AsE9puVo9nn280WwSf0V8lg-RSC9GS-_Vvo51HIaI5YfuBPkmEEg-xkuWEDeVml1pqTRfkk0x_xn6y5nJrDWvizPa0L8j6AM-iZK295u9dppg12G-di-wk9CAVU6AQfEElMajQ" alt="admin" className="w-full h-full object-cover" />
                             </div>
                             <span className="text-[10px] font-mono font-bold text-slate-500">action by s.chen@security.corp</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Event 2 */}
                 <div className="relative flex items-start gap-6 ml-[5px] opacity-70">
                    <div className="w-[30px] h-[30px] rounded-full bg-white border-2 border-slate-300 absolute -left-[5px] top-0 shadow-sm z-10" />
                    <div className="pl-10 flex-1">
                       <div className="bg-white border border-slate-100 rounded-lg p-5">
                          <div className="flex justify-between items-start mb-2">
                             <h4 className="font-bold text-slate-900">Attribute Mapping Modified</h4>
                             <span className="text-[10px] font-mono font-bold text-slate-400">OCT 12, 2023 · 09:15 GMT</span>
                          </div>
                          <p className="text-xs font-mono text-slate-600 leading-relaxed">
                             Added 'Organization Unit' mapping for automated department provisioning.
                          </p>
                       </div>
                    </div>
                 </div>

              </div>
           </div>

           {/* Footer Action Bar */}
           <div className="col-span-12 flex items-center justify-between pt-6 border-t border-slate-200">
              <div className="flex items-center gap-2 text-red-600 text-[10px] font-mono font-bold uppercase tracking-widest bg-red-50 px-4 py-2 rounded border border-red-100">
                 <Warning size={14} />
                 DANGER ZONE: DISABLING SSO WILL FORCE PASSWORD RESET FOR 1,248 USERS.
              </div>
              <div className="flex gap-4">
                 <button className="px-6 py-3 border border-slate-200 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors shadow-sm">
                    DISCARD CHANGES
                 </button>
                 <button className="px-8 py-3 bg-[#091426] text-white rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all">
                    COMMIT CONFIGURATION
                 </button>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default IdentityProviderSetup;
