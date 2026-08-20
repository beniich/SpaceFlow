import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import { lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import SpiderLogo from './components/SpiderLogo';

// Lazy loaded pages
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const VerifyEmail = lazy(() => import('./pages/auth/VerifyEmail'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Assets = lazy(() => import('./pages/Assets'));
const Spaces = lazy(() => import('./pages/Spaces'));
const WorkOrders = lazy(() => import('./pages/WorkOrders'));
const Maintenance = lazy(() => import('./pages/Maintenance'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Team = lazy(() => import('./pages/Team'));
const Leases = lazy(() => import('./pages/Leases'));
const Settings = lazy(() => import('./pages/Settings'));
const Contacts = lazy(() => import('./pages/crm/Contacts'));
const Deals = lazy(() => import('./pages/crm/Deals'));
const Pricing = lazy(() => import('./pages/crm/Pricing'));
const CMMS = lazy(() => import('./pages/CMMS'));
const DigitalTwin = lazy(() => import('./pages/DigitalTwin'));
const ERPIntegration = lazy(() => import('./pages/ERPIntegration'));
const BIMViewer = lazy(() => import('./pages/BIMViewer'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Exports = lazy(() => import('./pages/Exports'));
const Tenants = lazy(() => import('./pages/Tenants'));
const AIAssistant = lazy(() => import('./pages/AIAssistant'));
const EnergySustainability = lazy(() => import('./pages/EnergySustainability'));
const PredictiveMaintenance = lazy(() => import('./pages/PredictiveMaintenance'));
const Intervention = lazy(() => import('./pages/Intervention'));
const DashboardExecutive = lazy(() => import('./pages/DashboardExecutive'));
const AssetScanner = lazy(() => import('./pages/AssetScanner'));
const CloseWorkOrderPhoto = lazy(() => import('./pages/CloseWorkOrderPhoto'));
const CloseWorkOrderSignature = lazy(() => import('./pages/CloseWorkOrderSignature'));
const CloseWorkOrderReport = lazy(() => import('./pages/CloseWorkOrderReport'));
const ScreenSaver = lazy(() => import('./pages/crm/ScreenSaver'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Security = lazy(() => import('./pages/Security'));
const Roadmap = lazy(() => import('./pages/Roadmap'));
const WorkflowBuilder = lazy(() => import('./pages/WorkflowBuilder'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const SectorTemplates = lazy(() => import('./pages/SectorTemplates'));
const BimWorkspace = lazy(() => import('./features/bim/BimWorkspace'));

import { ErrorBoundary } from 'react-error-boundary';
import { GlobalErrorFallback } from './components/GlobalErrorFallback';

const FallbackLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-background text-brand-cyan">
    <div className="animate-pulse flex flex-col items-center gap-4">
      <div className="w-8 h-8 rounded-full border-2 border-brand-cyan border-t-transparent animate-spin"></div>
      <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">Loading Module...</span>
    </div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const PrivateRoute = ({ children }) => {
  const token = useAuthStore((s) => s.token);
  return token ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <ErrorBoundary 
      FallbackComponent={GlobalErrorFallback}
      onReset={() => window.location.reload()}
    >
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Toaster position="top-right" />
          <Suspense fallback={<FallbackLoader />}>
        <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/bim/*" element={<BimWorkspace modelId="office-tower-a" />} />
        
        <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Assets & Operations */}
          <Route path="assets" element={<Assets />} />
          <Route path="scanner" element={<AssetScanner />} />
          <Route path="spaces" element={<Spaces />} />
          <Route path="work-orders" element={<WorkOrders />} />
          <Route path="intervention" element={<Intervention />} />
          <Route path="close-wo-photo" element={<CloseWorkOrderPhoto />} />
          <Route path="close-wo-signature" element={<CloseWorkOrderSignature />} />
          <Route path="close-wo-report" element={<CloseWorkOrderReport />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="predictive-maintenance" element={<PredictiveMaintenance />} />
          <Route path="energy" element={<EnergySustainability />} />
          <Route path="team" element={<Team />} />
          
          {/* CRM */}
          <Route path="contacts" element={<Contacts />} />
          <Route path="deals" element={<Deals />} />
          <Route path="pricing" element={<Pricing />} />
          
          {/* CMMS / ERP / BIM */}
          <Route path="cmms" element={<CMMS />} />
          <Route path="digital-twin" element={<DigitalTwin />} />
          <Route path="bim" element={<BIMViewer />} />
          <Route path="erp" element={<ERPIntegration />} />
          
          {/* Analytics & Reports */}
          <Route path="analytics" element={<Analytics />} />
          <Route path="executive" element={<DashboardExecutive />} />
          <Route path="roadmap" element={<Roadmap />} />
          <Route path="exports" element={<Exports />} />
          <Route path="notifications" element={<Notifications />} />
          
          {/* Admin */}
          <Route path="leases" element={<Leases />} />
          <Route path="tenants" element={<Tenants />} />
          <Route path="ai" element={<AIAssistant />} />
          <Route path="workflows" element={<WorkflowBuilder />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="sector-templates" element={<SectorTemplates />} />
          <Route path="settings" element={<Settings />} />
          <Route path="security" element={<Security />} />
          
          {/* Display */}
          <Route path="screensaver" element={<ScreenSaver />} />
        </Route>
        </Routes>
        </Suspense>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
