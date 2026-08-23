import { redirect } from 'next/navigation';
import DealsClient from './DealsClient';
import { Suspense } from 'react';

// On utilise des données mock pour la démo CRM
// Dans une vraie intégration, on connecterait à CRMOrganization via Clerk orgId
const MOCK_DEALS = [
  { id: '1', name: 'Restructuration Campus Paris', amount: 145000, status: 'PIPELINE', stage: 'Pipeline', probability: 20, currency: 'EUR', contact: { firstName: 'Marie', lastName: 'Dupont' } },
  { id: '2', name: 'Contrat GMAO Tour Horizon', amount: 89000, status: 'QUALIFIED', stage: 'Qualified', probability: 40, currency: 'EUR', contact: { firstName: 'Jean', lastName: 'Martin' } },
  { id: '3', name: 'Déploiement Capteurs IoT - Entrepôts', amount: 220000, status: 'PROPOSAL', stage: 'Proposal', probability: 60, currency: 'EUR', contact: { firstName: 'Sophie', lastName: 'Bernard' } },
  { id: '4', name: 'Maintenance Préventive Annuelle', amount: 35000, status: 'NEGOTIATION', stage: 'Negotiation', probability: 80, currency: 'EUR', contact: { firstName: 'Pierre', lastName: 'Lambert' } },
  { id: '5', name: 'Audit Énergétique CSRD', amount: 18000, status: 'WON', stage: 'Won', probability: 100, currency: 'EUR', contact: { firstName: 'Alice', lastName: 'Petit' } },
];

export default async function DealsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-zinc-500">Chargement du pipeline...</div>}>
      <DealsClient initialDeals={MOCK_DEALS} />
    </Suspense>
  );
}
