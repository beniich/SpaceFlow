import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export default function BillingSuccessPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    // Attendre 2s pour que le webhook Stripe se propage
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      setVerifying(false);
    }, 2000);
  }, [queryClient]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-md w-full text-center">
        {verifying ? (
          <>
            <Loader2 className="w-12 h-12 mx-auto text-indigo-500 animate-spin mb-4" />
            <h2 className="text-xl font-bold">Activation de votre abonnement...</h2>
            <p className="text-slate-500 mt-2">Cela peut prendre quelques secondes</p>
          </>
        ) : (
          <>
            <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-green-900 mb-2">
              Paiement réussi ! 🎉
            </h2>
            <p className="text-slate-600 mb-6">
              Votre abonnement est maintenant actif.
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition w-full"
            >
              Aller au dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}
