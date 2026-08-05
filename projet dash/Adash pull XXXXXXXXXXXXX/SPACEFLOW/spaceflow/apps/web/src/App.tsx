import { Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/dashboard/Dashboard';
import CheckInPage from './pages/CheckInPage';
import BillingPage from './pages/BillingPage';
import BillingSuccess from './pages/BillingSuccess';
import InvoicesPage from './pages/InvoicesPage';
// Add other imports as needed...

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/checkin/:bookingId" element={<CheckInPage />} />
      <Route path="/billing">
        <Route index element={<BillingPage />} />
        <Route path="success" element={<BillingSuccess />} />
      </Route>
      <Route path="/invoices" element={<InvoicesPage />} />
      {/* Add more routes below */}
    </Routes>
  );
}
