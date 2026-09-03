import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import { lazy, Suspense } from 'react';
import Layout from './components/Layout';
import PublicLayout from './components/PublicLayout';

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
const Pricing = lazy(() => import('./pages/Pricing'));
const CMMS = lazy(() => import('./pages/CMMS'));
const EnterpriseWorkOrders = lazy(() => import('./pages/EnterpriseWorkOrders'));
const DigitalTwin = lazy(() => import('./pages/BIMViewer'));
const ERPIntegration = lazy(() => import('./pages/ERPIntegration'));
const BIMViewer = lazy(() => import('./pages/BIMViewer'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Exports = lazy(() => import('./pages/Exports'));
const Tenants = lazy(() => import('./pages/Tenants'));
const AIAssistant = lazy(() => import('./pages/AIAssistant'));
const EnergySustainability = lazy(() => import('./pages/EnergySustainability'));
const PredictiveMaintenance = lazy(() => import('./pages/PredictiveMaintenance'));
const Intervention = lazy(() => import('./pages/Intervention'));
const DashboardExecutive = lazy(() => import('./pages/Dashboard'));
const AssetDetail = lazy(() => import('./pages/AssetDetail'));
const AssetScanner = lazy(() => import('./pages/AssetScanner'));
const CloseWorkOrderPhoto = lazy(() => import('./pages/CloseWorkOrderPhoto'));
const CloseWorkOrderSignature = lazy(() => import('./pages/CloseWorkOrderSignature'));
const CloseWorkOrderReport = lazy(() => import('./pages/CloseWorkOrderReport'));
const ScreenSaver = lazy(() => import('./pages/crm/ScreenSaver'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Security = lazy(() => import('./pages/Security'));
const QRScanResult = lazy(() => import('./pages/QRScanResult'));
const QRSmartScannerModal = lazy(() => import('./features/qr/components/QRSmartScanner').then(m => ({ default: m.QRSmartScanner })));
const About = lazy(() => import('./pages/About'));
const CarbonMarket = lazy(() => import('./pages/CarbonMarket'));
const LightingCityPulse = lazy(() => import('./pages/LightingCityPulse'));
const WaterHydroSync = lazy(() => import('./pages/WaterHydroSync'));
const AirQuality = lazy(() => import('./pages/AirQuality'));
const CaseStudies = lazy(() => import('./pages/CaseStudies'));
const ImpactReport = lazy(() => import('./pages/ImpactReport'));
const PartnerPortal = lazy(() => import('./pages/PartnerPortal'));
const Careers = lazy(() => import('./pages/Careers'));
const WasteManagement = lazy(() => import('./pages/WasteManagement'));
const PayPalSubscribe = lazy(() => import('./pages/PayPalSubscribe'));

import ErrorBoundary from './components/ErrorBoundary';

const FallbackLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-background text-brand-cyan">
    <div className="animate-pulse flex flex-col items-center gap-4">
      <div className="w-8 h-8 rounded-full border-2 border-brand-cyan border-t-transparent animate-spin"></div>
      <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">Loading Module...</span>
    </div>
  </div>
);

const PrivateRoute = ({ children }) => {
  const token = useAuthStore((s) => s.token);
  return token ? <ErrorBoundary>{children}</ErrorBoundary> : <Navigate to="/login" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Suspense fallback={<FallbackLoader />}>
        <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/qr/:code" element={<QRScanResult />} />
        <Route path="/scan" element={<QRSmartScannerModal />} />
        
        <Route element={<PublicLayout />}>
          {/* Integrated BeeCarbonat Smart Infrastructure Pages - PUBLIC */}
          <Route path="about" element={<About />} />
          <Route path="market" element={<CarbonMarket />} />
          <Route path="lighting" element={<LightingCityPulse />} />
          <Route path="water" element={<WaterHydroSync />} />
          <Route path="air-quality" element={<AirQuality />} />
          <Route path="case-studies" element={<CaseStudies />} />
          <Route path="impact" element={<ImpactReport />} />
          <Route path="partner-portal" element={<PartnerPortal />} />
          <Route path="careers" element={<Careers />} />
          <Route path="waste" element={<WasteManagement />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="subscribe" element={<PayPalSubscribe />} />
        </Route>

        <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Assets & Operations */}
          <Route path="assets" element={<Assets />} />
          <Route path="assets/:id" element={<AssetDetail />} />
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
          <Route path="enterprise-wo" element={<EnterpriseWorkOrders />} />
          <Route path="digital-twin" element={<DigitalTwin />} />
          <Route path="bim" element={<BIMViewer />} />
          <Route path="erp" element={<ERPIntegration />} />
          
          {/* Analytics & Reports */}
          <Route path="analytics" element={<Analytics />} />
          <Route path="executive" element={<DashboardExecutive />} />
          <Route path="roadmap" element={<Navigate to="/dashboard" replace />} />
          <Route path="exports" element={<Exports />} />
          <Route path="notifications" element={<Notifications />} />
          
          {/* Admin */}
          <Route path="leases" element={<Leases />} />
          <Route path="tenants" element={<Tenants />} />
          <Route path="ai" element={<AIAssistant />} />
          <Route path="settings" element={<Settings />} />
          <Route path="security" element={<Security />} />
          
          {/* Display */}
          <Route path="screensaver" element={<ScreenSaver />} />
        </Route>

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
