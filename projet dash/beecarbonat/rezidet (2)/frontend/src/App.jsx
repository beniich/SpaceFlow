import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import Layout from './components/Layout';
import SpiderLogo from './components/SpiderLogo';

// Pages critiques (TTI) — statiques
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';

// Pages lazy — chargées à la demande
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const VerifyEmail = lazy(() => import('./pages/auth/VerifyEmail'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Assets = lazy(() => import('./pages/Assets'));
const Spaces = lazy(() => import('./pages/Spaces'));
const WorkOrders = lazy(() => import('./pages/WorkOrders'));
const Maintenance = lazy(() => import('./pages/Maintenance'));
const Team = lazy(() => import('./pages/Team'));
const Leases = lazy(() => import('./pages/Leases'));
const Settings = lazy(() => import('./pages/Settings'));
const Security = lazy(() => import('./pages/Security'));
const Contacts = lazy(() => import('./pages/crm/Contacts'));
const Deals = lazy(() => import('./pages/crm/Deals'));
const CMMS = lazy(() => import('./pages/CMMS'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Tenants = lazy(() => import('./pages/Tenants'));
const AIAssistant = lazy(() => import('./pages/AIAssistant'));
const EnergySustainability = lazy(() => import('./pages/EnergySustainability'));
const PredictiveMaintenance = lazy(() => import('./pages/PredictiveMaintenance'));
const Intervention = lazy(() => import('./pages/Intervention'));
const AssetScanner = lazy(() => import('./pages/AssetScanner'));
const CloseWorkOrderPhoto = lazy(() => import('./pages/CloseWorkOrderPhoto'));
const CloseWorkOrderSignature = lazy(() => import('./pages/CloseWorkOrderSignature'));
const CloseWorkOrderReport = lazy(() => import('./pages/CloseWorkOrderReport'));
const ScreenSaver = lazy(() => import('./pages/crm/ScreenSaver'));
// Pages lourdes (3D / charts)
const BIMViewer = lazy(() => import('./pages/BIMViewer'));
const DigitalTwin = lazy(() => import('./pages/DigitalTwin'));
const Analytics = lazy(() => import('./pages/Analytics'));
const ERPIntegration = lazy(() => import('./pages/ERPIntegration'));
const Exports = lazy(() => import('./pages/Exports'));
const DashboardExecutive = lazy(() => import('./pages/DashboardExecutive'));
const HtmlDesignGallery = lazy(() => import('./pages/HtmlDesignGallery'));


const PrivateRoute = ({ children }) => {
  const token = useAuthStore((s) => s.token);
  return token ? children : <Navigate to="/login" />;
};

const Loader = () => (
  <div className="h-screen w-full flex flex-col items-center justify-center bg-zinc-950">
    <div className="w-12 h-12 border-4 border-zinc-800 border-t-cyan-500 rounded-full animate-spin"></div>
    <p className="text-zinc-400 mt-4 text-sm font-mono animate-pulse">Chargement du module...</p>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          
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
            
            {/* CMMS / ERP / BIM */}
            <Route path="cmms" element={<CMMS />} />
            <Route path="digital-twin" element={<DigitalTwin />} />
            <Route path="bim" element={<BIMViewer />} />
            <Route path="erp" element={<ERPIntegration />} />
            
            {/* Analytics & Reports */}
            <Route path="analytics" element={<Analytics />} />
            <Route path="executive" element={<DashboardExecutive />} />
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
            <Route path="design-gallery" element={<HtmlDesignGallery />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
