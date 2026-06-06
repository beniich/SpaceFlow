import { useState, useEffect } from 'react';
import { apiGet } from '../api/apiService';

export interface CropKnowledge {
  id: string;
  name: string;
  idealPh: number | null;
  waterRequirement: string | null;
  growthCycleDays: number | null;
  companionPlants: string[];
  soilType: string | null;
}

export interface PestKnowledge {
  id: string;
  pestName: string;
  targetCrops: string[];
  symptoms: string;
  organicTreatment: string;
  chemicalTreatment: string | null;
}

export function useCrops() {
  const [crops, setCrops] = useState<CropKnowledge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<CropKnowledge[]>('/knowledge/crops')
      .then((data) => setCrops(data || []))
      .catch((err) => console.error('Failed to fetch crops', err))
      .finally(() => setLoading(false));
  }, []);

  return { crops, loading };
}

export function usePests() {
  const [pests, setPests] = useState<PestKnowledge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<PestKnowledge[]>('/knowledge/pests')
      .then((data) => setPests(data || []))
      .catch((err) => console.error('Failed to fetch pests', err))
      .finally(() => setLoading(false));
  }, []);

  return { pests, loading };
}
