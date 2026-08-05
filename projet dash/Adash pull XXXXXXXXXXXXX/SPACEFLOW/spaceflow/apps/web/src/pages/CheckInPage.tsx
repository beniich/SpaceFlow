import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, ScanLine } from 'lucide-react';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/Button';
import toast from 'react-hot-toast';

export default function CheckInPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'login'>('idle');
  const [booking, setBooking] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      setStatus('login');
      return;
    }
    if (bookingId) {
      performCheckIn();
    }
  }, [bookingId, user]);

  const performCheckIn = async () => {
    setStatus('loading');
    try {
      const response = await api.post(`/bookings/${bookingId}/checkin`);
      setBooking(response.data);
      setStatus('success');
      toast.success('✅ Check-in réussi !');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur');
      setStatus('error');
    }
  };

  if (status === 'login') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="card max-w-md w-full text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
          <ScanLine className="w-12 h-12 mx-auto text-indigo-500 mb-4" />
          <h2 className="text-xl font-bold mb-2">Connexion requise</h2>
          <p className="text-slate-600 mb-6">
            Pour effectuer un check-in, connectez-vous à votre compte SpaceFlow.
          </p>
          <Button onClick={() => navigate('/login?redirect=/checkin/' + bookingId)} className="w-full">
            Se connecter
          </Button>
        </div>
      </div>
    );
  }

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="card max-w-md w-full text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
          <Loader2 className="w-12 h-12 mx-auto text-indigo-500 animate-spin mb-4" />
          <h2 className="text-xl font-bold">Check-in en cours...</h2>
        </div>
      </div>
    );
  }

  if (status === 'success' && booking) {
    const memberName = booking.member?.firstName 
      ? `${booking.member.firstName} ${booking.member.lastName}` 
      : booking.member?.companyName;

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 p-4">
        <div className="card max-w-md w-full text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-green-900 mb-2">Bienvenue !</h2>
          <p className="text-slate-700 mb-1">{memberName}</p>
          <div className="text-sm text-slate-500 mb-6 space-y-1">
            <p><strong>Espace:</strong> {booking.space?.name}</p>
            <p><strong>Référence:</strong> {booking.reference}</p>
            <p>{new Date(booking.checkedInAt).toLocaleString('fr-FR')}</p>
          </div>
          <Button onClick={() => navigate('/bookings')} className="w-full">
            Voir les réservations
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
      <div className="card max-w-md w-full text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
        <XCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-red-900 mb-2">Erreur de check-in</h2>
        <p className="text-red-700 mb-4">{error}</p>
        <Button variant="secondary" onClick={() => navigate('/bookings')} className="w-full">
          Retour
        </Button>
      </div>
    </div>
  );
}
