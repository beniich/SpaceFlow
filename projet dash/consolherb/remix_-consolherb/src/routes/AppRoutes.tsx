import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';

const PortailsPage  = lazy(() => import('../pages/PortailsPage'));
const ModulesPage   = lazy(() => import('../pages/ModulesPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const InfraPage     = lazy(() => import('../pages/InfraPage'));
const LogsPage      = lazy(() => import('../pages/LogsPage'));
const SettingsPage  = lazy(() => import('../pages/SettingsPage'));

const Loader = () => (
  <div className="min-h-screen bg-[#051424] flex flex-col items-center justify-center gap-4">
    {/* Animated logo loader */}
    <div className="relative">
      <div className="w-12 h-12 rounded-full border-2 border-[#4de082]/20 border-t-[#4de082] animate-spin" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[#4de082] font-mono font-bold text-xs">CC</span>
      </div>
    </div>
    <p className="text-[#4de082] font-mono text-xs animate-pulse tracking-widest uppercase">
      Chargement du module...
    </p>
  </div>
);

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/portails"   element={<PortailsPage />} />
            <Route path="/modules"    element={<ModulesPage />} />
            <Route path="/dashboard"  element={<DashboardPage />} />
            <Route path="/infra"      element={<InfraPage />} />
            <Route path="/logs"       element={<LogsPage />} />
            <Route path="/settings"   element={<SettingsPage />} />
            <Route path="/"           element={<Navigate to="/portails" replace />} />
            <Route path="*"           element={<Navigate to="/portails" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
