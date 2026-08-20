import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

export default function DashboardPage() {
  const { userId, orgId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-zinc-400 mb-8">Bienvenue sur BEECARBONIT Serverless</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="text-zinc-400 text-sm mb-1">Organisation (Tenant)</div>
          <div className="font-mono text-orange-400 text-sm break-all">{orgId ?? 'Aucune org sélectionnée'}</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="text-zinc-400 text-sm mb-1">API Assets</div>
          <a href="/api/assets" className="text-blue-400 hover:underline text-sm font-mono">/api/assets</a>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="text-zinc-400 text-sm mb-1">Health Check</div>
          <a href="/api/health" className="text-green-400 hover:underline text-sm font-mono">/api/health</a>
        </div>
      </div>

      <div className="mt-8 bg-orange-500/10 border border-orange-500/20 rounded-xl p-6">
        <h2 className="text-orange-400 font-semibold mb-2">🚀 Migration Serverless — Semaines 3-6</h2>
        <ul className="text-zinc-300 text-sm space-y-1 list-disc list-inside">
          <li>✅ Clerk Auth — Middleware configuré</li>
          <li>✅ Prisma + Neon Adapter — Client serverless</li>
          <li>✅ Route Handler /api/assets (GET, POST, PUT, DELETE)</li>
          <li>✅ Route Handler /api/workorders (GET, POST)</li>
          <li>✅ Route Handler /api/health (public)</li>
          <li>🔄 Migration des autres routes (Buildings, ESG, BIM…)</li>
        </ul>
      </div>
    </main>
  );
}
