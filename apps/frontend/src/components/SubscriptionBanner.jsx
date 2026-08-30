import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

export default function SubscriptionBanner() {
  const { subscriptionWarning } = useAuthStore();

  if (!subscriptionWarning) return null;

  return (
    <div className="bg-red-500/10 border-b border-red-500/20 px-4 py-3 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center flex-1 min-w-0">
          <span className="flex p-2 rounded-lg bg-red-500/20">
            <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
          </span>
          <p className="ml-3 font-medium text-red-400 truncate">
            <span className="md:hidden">Paiement échoué.</span>
            <span className="hidden md:inline">
              Votre dernier paiement a échoué. Veuillez mettre à jour vos informations pour éviter une interruption de service.
            </span>
          </p>
        </div>
        <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
          <Link
            to="/settings"
            className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-red-600 bg-white hover:bg-red-50"
          >
            Mettre à jour
          </Link>
        </div>
      </div>
    </div>
  );
}
