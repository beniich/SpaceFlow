import { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, ClipboardList } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function WorkOrders() {
  const [workOrders, setWorkOrders] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/workorders')
      .then(({ data }) => setWorkOrders(data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'ALL' ? workOrders : workOrders.filter((wo) => wo.status === filter);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Ordres de travail</h1>
      </div>
      <div className="space-y-3">
        {loading ? <p>Chargement...</p> : filtered.map((wo) => (
          <div key={wo.id} className="bg-white p-5 rounded-xl border border-slate-200">
            <h3 className="font-semibold text-slate-900">{wo.title}</h3>
            <p className="text-sm text-slate-600 mb-2">{wo.description}</p>
            <div className="text-xs text-slate-500 flex gap-4">
              <span>Statut: {wo.status}</span>
              <span>Priorité: {wo.priority}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
