import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Assets from './pages/Assets';
import Spaces from './pages/Spaces';
import WorkOrders from './pages/WorkOrders';
import Maintenance from './pages/Maintenance';
import Analytics from './pages/Analytics';
import Leases from './pages/Leases';
import Settings from './pages/Settings';
import CMMS from './pages/CMMS';
import DigitalTwin from './pages/DigitalTwin';
import Notifications from './pages/Notifications';
import Tenants from './pages/Tenants';
import Exports from './pages/Exports';
import Signup from './pages/Signup';
import Contacts from './pages/Contacts';
import Deals from './pages/Deals';

const PrivateRoute = ({ children }) => {
  const token = useAuthStore((s) => s.token);
  return token ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Routes publiques */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ✅ Bypass — Dashboard accessible sans authentification */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Routes protégées */}
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="assets" element={<Assets />} />
          <Route path="spaces" element={<Spaces />} />
          <Route path="work-orders" element={<WorkOrders />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="leases" element={<Leases />} />
          <Route path="cmms" element={<CMMS />} />
          <Route path="digital-twin" element={<DigitalTwin />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="tenant" element={<Tenants />} />
          <Route path="exports" element={<Exports />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="deals" element={<Deals />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
