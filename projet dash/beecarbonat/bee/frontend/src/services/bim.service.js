import api from './api';

export async function uploadBIMModel(buildingId, file) {
  const formData = new FormData();
  formData.append('buildingId', buildingId);
  formData.append('file', file);
  return api.post('/bim/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(res => res.data);
}

export async function getBuildingBIMModels(buildingId) {
  return api.get(`/bim/building/${buildingId}`).then(res => res.data);
}

export async function getBIMModelDetails(id) {
  return api.get(`/bim/model/${id}`).then(res => res.data);
}

export async function linkBIMElementToAsset(elementId, assetId) {
  return api.post('/bim/link', { elementId, assetId }).then(res => res.data);
}
