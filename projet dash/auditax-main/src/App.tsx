/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuditMasterLayout } from './components/AuditMasterLayout';
import { Dashboard } from './components/Dashboard';
import { AuditRunner } from './components/AuditRunner';
import { AuditTrail } from './components/AuditTrail';
import { ComplianceHub } from './components/ComplianceHub';
import { SystemVault } from './components/SystemVault';
import { PredictiveAnalytics } from './components/PredictiveAnalytics';
import { GovernancePortal } from './components/GovernancePortal';
import { CertificationsHub } from './components/CertificationsHub';
import { SystemConfig } from './components/SystemConfig';
import RegulatorPortal from './components/RegulatorPortal';
import RemediationWorkflow from './components/RemediationWorkflow';
import ForensicView from './components/ForensicView';
import SovereigntyMonitor from './components/SovereigntyMonitor';
import SecurityAuditLog from './components/SecurityAuditLog';
import EntityMapper from './components/EntityMapper';
import JurisdictionMapping from './components/JurisdictionMapping';
import IncidentWorkspace from './components/IncidentWorkspace';
import ResourceAllocator from './components/ResourceAllocator';
import BudgetAnalysis from './components/BudgetAnalysis';
import MilestoneTracker from './components/MilestoneTracker';
import RiskPrediction from './components/RiskPrediction';
import StakeholderReporting from './components/StakeholderReporting';
import QAReview from './components/QAReview';
import PolicyLibrary from './components/PolicyLibrary';
import BatchCenter from './components/BatchCenter';
import APISecurity from './components/APISecurity';
import AuditExceptions from './components/AuditExceptions';
import IntegrityDiagnostics from './components/IntegrityDiagnostics';
import ForensicReplay from './components/ForensicReplay';
import InnovationLab from './components/InnovationLab';
import FinalReportPreview from './components/FinalReportPreview';
import SystemHelp from './components/SystemHelp';
import EvidenceCollectorConfig from './components/EvidenceCollectorConfig';
import IdentityProviderSetup from './components/IdentityProviderSetup';
import NetworkNodeTopology from './components/NetworkNodeTopology';
import MaintenanceUpgrades from './components/MaintenanceUpgrades';
import RegionalRiskDrilldown from './components/RegionalRiskDrilldown';
import { NewAuditModal } from './components/NewAuditModal';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuditService } from './services/AuditService';
import { Audit, AuditTemplate } from './types';
import { ClipboardCheck, List } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';

export default function App() {
  const { getToken } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [audits, setAudits] = useState<Audit[]>([]);
  const [templates, setTemplates] = useState<AuditTemplate[]>([]);
  const [selectedAuditId, setSelectedAuditId] = useState<string | null>(null);
  const [viewingAuditId, setViewingAuditId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getToken().then(t => {
      AuditService.setToken(t);
      refreshAudits();
      loadTemplates();
    });
  }, [getToken]);

  const loadTemplates = async () => {
    try {
      const data = await AuditService.getTemplates();
      setTemplates(data);
    } catch (e) {
      console.error('Failed to load templates', e);
    }
  };

  const refreshAudits = async () => {
    try {
      const data = await AuditService.getAudits();
      setAudits(data);
    } catch (e) {
      console.error('Failed to load audits', e);
    }
  };

  const handleStartNewAudit = async (templateId: string, entityId: string) => {
    const id = await AuditService.startAudit(templateId, entityId);
    setIsModalOpen(false);
    setSelectedAuditId(id);
    setActiveTab('audits');
    refreshAudits();
  };

  return (
    <ProtectedRoute>
      <AuditMasterLayout 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
      >
        {activeTab === 'dashboard' && (
          <Dashboard audits={audits} templates={templates} />
        )}

        {activeTab === 'audits' && (
          <div className="flex flex-col gap-6">
            {!selectedAuditId ? (
              <div className="flex flex-col gap-8">
                 <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-brand-text-main uppercase tracking-tight">Registre des Audits de Site</h2>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-brand-sidebar text-white px-6 py-3 rounded-xl font-bold text-xs shadow-lg shadow-brand-sidebar/20 uppercase tracking-widest hover:opacity-90 transition-all"
                  >
                    Démarrer Mission de Terrain
                  </button>
                </div>
                
                {isModalOpen && (
                  <NewAuditModal 
                    templates={templates} 
                    onClose={() => setIsModalOpen(false)} 
                    onStart={handleStartNewAudit} 
                  />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {audits.map(audit => (
                    <div key={audit.id} className="bg-white p-6 rounded-xl border border-brand-border shadow-sm flex flex-col gap-4 group hover:border-brand-accent/30 transition-all">
                      <div className="flex justify-between items-start">
                        <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center text-brand-text-muted border border-brand-border">
                          <ClipboardCheck size={24} />
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[9px] uppercase font-extrabold ${
                          audit.status === 'DRAFT' ? 'bg-slate-100 text-slate-500' :
                          audit.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-600' :
                          'bg-emerald-100 text-emerald-600'
                        }`}>
                          {audit.status}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-brand-text-main truncate">#{audit.id}</h4>
                        <p className="text-brand-text-muted text-[11px] font-medium uppercase tracking-wider">
                          {templates.find(t => t.id === audit.templateId)?.title || 'Audit de Sécurité Industrielle'}
                        </p>
                      </div>
                      <div className="pt-4 border-t border-brand-bg mt-2 flex gap-2">
                         <button 
                          onClick={() => setSelectedAuditId(audit.id)}
                          className="flex-1 py-2 bg-slate-50 text-brand-text-main border border-brand-border rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all"
                         >
                           {audit.status === 'SUBMITTED' ? 'Voir Rapport' : 'Continuer Saisie'}
                         </button>
                         <button 
                          onClick={() => { setViewingAuditId(audit.id); setActiveTab('trail'); }}
                          className="px-4 py-2 border border-brand-border text-brand-text-muted rounded-lg hover:text-brand-accent transition-all"
                         >
                           <List size={16} />
                         </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <button 
                  onClick={() => setSelectedAuditId(null)}
                  className="mb-8 text-brand-text-muted hover:text-brand-accent flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all"
                >
                  ← Retour au Registre
                </button>
                {selectedAuditId && templates.find(t => t.id === audits.find(a => a.id === selectedAuditId)?.templateId) && (
                  <AuditRunner 
                    auditId={selectedAuditId} 
                    template={templates.find(t => t.id === audits.find(a => a.id === selectedAuditId)?.templateId)!} 
                    onComplete={() => {
                      setSelectedAuditId(null);
                      refreshAudits();
                    }} 
                  />
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'trail' && (
          <AuditTrail audits={audits} />
        )}

        {activeTab === 'compliance' && (
          <ComplianceHub />
        )}

        {activeTab === 'vault' && (
          <SystemVault />
        )}

        {activeTab === 'analytics' && (
          <PredictiveAnalytics />
        )}

        {activeTab === 'governance' && (
          <GovernancePortal />
        )}

        {activeTab === 'users' && (
          <CertificationsHub />
        )}

        {activeTab === 'settings' && (
          <SystemConfig />
        )}

        {activeTab === 'regulator' && (
          <RegulatorPortal />
        )}

        {activeTab === 'remediation' && (
          <RemediationWorkflow />
        )}

        {activeTab === 'forensics' && (
          <ForensicView />
        )}

        {activeTab === 'sovereignty' && (
          <SovereigntyMonitor />
        )}

        {activeTab === 'syslogs' && (
          <SecurityAuditLog />
        )}

        {activeTab === 'entities' && (
          <EntityMapper />
        )}

        {activeTab === 'legal' && (
          <JurisdictionMapping />
        )}

        {activeTab === 'incidents' && (
          <IncidentWorkspace />
        )}

        {activeTab === 'resource_allocator' && (
          <ResourceAllocator />
        )}

        {activeTab === 'budget_analysis' && (
          <BudgetAnalysis />
        )}

        {activeTab === 'milestone_tracker' && (
          <MilestoneTracker />
        )}

        {activeTab === 'risk_prediction' && (
          <RiskPrediction />
        )}

        {activeTab === 'regulator_portal' && (
          <RegulatorPortal />
        )}

        {activeTab === 'stakeholder_reporting' && (
          <StakeholderReporting />
        )}

        {activeTab === 'qa_review' && (
          <QAReview />
        )}

        {activeTab === 'policy_library' && (
          <PolicyLibrary />
        )}

        {activeTab === 'batch_center' && (
          <BatchCenter />
        )}

        {activeTab === 'api_security' && (
          <APISecurity />
        )}

        {activeTab === 'audit_exceptions' && (
          <AuditExceptions />
        )}

        {activeTab === 'integrity_diagnostics' && (
          <IntegrityDiagnostics />
        )}

        {activeTab === 'forensic_replay' && (
          <ForensicReplay />
        )}

        {activeTab === 'innovation_lab' && (
          <InnovationLab />
        )}

        {activeTab === 'security_audit_log' && (
          <SecurityAuditLog />
        )}

        {activeTab === 'remediation_workflow' && (
          <RemediationWorkflow />
        )}

        {activeTab === 'report_preview' && (
          <FinalReportPreview />
        )}

        {activeTab === 'system_help' && (
          <SystemHelp />
        )}

        {activeTab === 'evidence_collector' && (
          <EvidenceCollectorConfig />
        )}

        {activeTab === 'identity_provider' && (
          <IdentityProviderSetup />
        )}

        {activeTab === 'network_topology' && (
          <NetworkNodeTopology />
        )}

        {activeTab === 'maintenance_upgrades' && (
          <MaintenanceUpgrades />
        )}

        {activeTab === 'regional_risk' && (
          <RegionalRiskDrilldown />
        )}
      </AuditMasterLayout>
    </ProtectedRoute>
  );
}
