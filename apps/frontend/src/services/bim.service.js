import api from './api';
import { db } from './db';

export async function uploadBIMModel(buildingId, file) {
  const formData = new FormData();
  formData.append('buildingId', buildingId);
  formData.append('file', file);
  const res = await api.post('/bim/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  
  if (res.data?.id) {
    try {
      await db.cached_bim_models.put({
        id: res.data.id,
        buildingId,
        name: res.data.name,
        data: res.data,
        updatedAt: Date.now()
      });
    } catch {
      // Ignore cache storage error
    }
  }
  return res.data;
}

export async function getBuildingBIMModels(buildingId) {
  try {
    const res = await api.get(`/bim/building/${buildingId}`);
    return res.data;
  } catch (error) {
    // Try offline IndexedDB cache
    try {
      const cached = await db.cached_bim_models.where('buildingId').equals(buildingId).toArray();
      if (cached.length > 0) {
        return cached.map(c => c.data || c);
      }
    } catch {
      // Ignore
    }
    throw error;
  }
}

export async function getBIMModelDetails(id) {
  try {
    const res = await api.get(`/bim/model/${id}`);
    if (res.data) {
      try {
        await db.cached_bim_models.put({
          id: res.data.id,
          buildingId: res.data.buildingId,
          name: res.data.name,
          data: res.data,
          updatedAt: Date.now()
        });
      } catch {
        // Ignore
      }
    }
    return res.data;
  } catch (error) {
    // Try offline IndexedDB cache
    try {
      const cached = await db.cached_bim_models.get(id);
      if (cached?.data) {
        return cached.data;
      }
    } catch {
      // Ignore
    }
    throw error;
  }
}

export async function linkBIMElementToAsset(elementId, assetId) {
  return api.post('/bim/link', { elementId, assetId }).then(res => res.data);
}

