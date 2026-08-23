import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../services/api';

const LIVE_REFRESH_INTERVAL = 30000;

export function useDashboard() {
  const [kpis, setKpis] = useState(null);
  const [charts, setCharts] = useState(null);
  const [lists, setLists] = useState(null);
  const [liveStats, setLiveStats] = useState(null);
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const liveIntervalRef = useRef(null);

  const fetchKPIs = useCallback(async () => {
    try {
      const { data } = await api.get('/dashboard/kpis');
      setKpis(data.kpis);
      setCharts(data.charts);
      setLists(data.lists);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur chargement KPIs');
    }
  }, []);

  const fetchLiveStats = useCallback(async () => {
    try {
      const { data } = await api.get('/dashboard/live');
      setLiveStats(data);
    } catch { }
  }, []);

  const fetchWorkOrders = useCallback(async () => {
    try {
      const { data } = await api.get('/workorders?status=IN_PROGRESS');
      setWorkOrders(data.slice(0, 5));
    } catch { }
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchKPIs(), fetchWorkOrders()]);
    setLoading(false);
  }, [fetchKPIs, fetchWorkOrders]);

  useEffect(() => {
    refresh();
    fetchLiveStats();
    liveIntervalRef.current = setInterval(fetchLiveStats, LIVE_REFRESH_INTERVAL);
    return () => clearInterval(liveIntervalRef.current);
  }, [refresh, fetchLiveStats]);

  return { kpis, charts, lists, liveStats, workOrders, loading, error, refresh };
}
