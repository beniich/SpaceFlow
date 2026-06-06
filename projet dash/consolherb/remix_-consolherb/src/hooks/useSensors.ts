import { useState, useEffect } from 'react';
import { apiGet } from '../api/apiService';

interface Sensor {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'online' | 'offline' | 'warning';
}

export function useSensors() {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchSensors = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiGet<Sensor[]>('/sensors');
        if (!cancelled) {
          setSensors(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to fetch sensors');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchSensors();

    return () => {
      cancelled = true;
    };
  }, []);

  return { sensors, loading, error };
}
