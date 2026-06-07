import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import AppLayout from '../components/layout/AppLayout';
import DashboardSkeleton from '../components/ui/DashboardSkeleton';
import FeatureGate from '../components/ui/FeatureGate';


const LandingPage   = lazy(() => import('../pages/LandingPage'));
const PortailsPage  = lazy(() => import('../pages/PortailsPage'));
const ModulesPage   = lazy(() => import('../pages/ModulesPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const InfraPage     = lazy(() => import('../pages/InfraPage'));
const LogsPage      = lazy(() => import('../pages/LogsPage'));
const SettingsPage  = lazy(() => import('../pages/SettingsPage'));
const AgroBrainPage = lazy(() => import('../pages/AgroBrainPage'));
const VisionPage    = lazy(() => import('../pages/VisionPage'));
const FinancePage   = lazy(() => import('../pages/FinancePage'));
const TraceabilityPage = lazy(() => import('../pages/TraceabilityPage'));
const UpgradePage   = lazy(() => import('../pages/UpgradePage'));
const BillingPage   = lazy(() => import('../pages/BillingPage'));
const TeamPage      = lazy(() => import('../pages/TeamPage'));
const ReportsPage   = lazy(() => import('../pages/ReportsPage'));


// Page transition wrapper — applied to every route change
const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8 },
};

const pageTransition = {
  duration: 0.2,
  ease: 'easeInOut' as const,
};

function AnimatedPage({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      style={{ willChange: 'opacity, transform' }}
    >
      {children}
    </motion.div>
  );
}

// Loader shown during Suspense boundary (before lazy chunk loads)
const Loader = () => (
  <div className="min-h-screen bg-[#051424] flex flex-col items-center justify-center gap-4">
    {/* Animated logo loader */}
    <div className="relative">
      <div className="w-12 h-12 rounded-full border-2 border-[#4de082]/20 border-t-[#4de082] animate-spin" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[#4de082] font-mono font-bold text-xs">AM</span>
      </div>
    </div>
    <p className="text-[#4de082] font-mono text-xs animate-pulse tracking-widest uppercase">
      Chargement du module...
    </p>
  </div>
);

// Inner component that reads location (must be inside BrowserRouter)
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* ── Landing page — outside AppLayout ── */}
        <Route
          path="/"
          element={
            <Suspense fallback={<Loader />}>
              <LandingPage />
            </Suspense>
          }
        />

        {/* ── App shell ── */}
        <Route element={<AppLayout />}>
          <Route
            path="/portails"
            element={
              <Suspense fallback={<Loader />}>
                <AnimatedPage><FeatureGate feature="portails"><PortailsPage /></FeatureGate></AnimatedPage>
              </Suspense>
            }
          />
          <Route
            path="/modules"
            element={
              <Suspense fallback={<Loader />}>
                <AnimatedPage><FeatureGate feature="modules"><ModulesPage /></FeatureGate></AnimatedPage>
              </Suspense>
            }
          />
          <Route
            path="/dashboard"
            element={
              <Suspense fallback={<DashboardSkeleton />}>
                <AnimatedPage><DashboardPage /></AnimatedPage>
              </Suspense>
            }
          />
          <Route
            path="/infra"
            element={
              <Suspense fallback={<Loader />}>
                <AnimatedPage><FeatureGate feature="infra"><InfraPage /></FeatureGate></AnimatedPage>
              </Suspense>
            }
          />
          <Route
            path="/logs"
            element={
              <Suspense fallback={<Loader />}>
                <AnimatedPage><LogsPage /></AnimatedPage>
              </Suspense>
            }
          />
          <Route
            path="/settings"
            element={
              <Suspense fallback={<Loader />}>
                <AnimatedPage><SettingsPage /></AnimatedPage>
              </Suspense>
            }
          />
          <Route
            path="/agro-brain"
            element={
              <Suspense fallback={<Loader />}>
                <AnimatedPage><FeatureGate feature="agro-brain"><AgroBrainPage /></FeatureGate></AnimatedPage>
              </Suspense>
            }
          />
          <Route
            path="/vision"
            element={
              <Suspense fallback={<Loader />}>
                <AnimatedPage><FeatureGate feature="vision"><VisionPage /></FeatureGate></AnimatedPage>
              </Suspense>
            }
          />
          <Route
            path="/finance"
            element={
              <Suspense fallback={<Loader />}>
                <AnimatedPage><FeatureGate feature="finance"><FinancePage /></FeatureGate></AnimatedPage>
              </Suspense>
            }
          />
          <Route
            path="/traceability"
            element={
              <Suspense fallback={<Loader />}>
                <AnimatedPage><FeatureGate feature="traceability"><TraceabilityPage /></FeatureGate></AnimatedPage>
              </Suspense>
            }
          />
          <Route
            path="/upgrade"
            element={
              <Suspense fallback={<Loader />}>
                <AnimatedPage><UpgradePage /></AnimatedPage>
              </Suspense>
            }
          />
          <Route
            path="/billing"
            element={
              <Suspense fallback={<Loader />}>
                <AnimatedPage><BillingPage /></AnimatedPage>
              </Suspense>
            }
          />
          <Route
            path="/team"
            element={
              <Suspense fallback={<Loader />}>
                <AnimatedPage><TeamPage /></AnimatedPage>
              </Suspense>
            }
          />
          <Route
            path="/reports"
            element={
              <Suspense fallback={<Loader />}>
                <AnimatedPage><ReportsPage /></AnimatedPage>
              </Suspense>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
