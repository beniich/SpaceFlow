import api from './api';

export async function getERPConnections() {
  return api.get('/erp/connections').then(res => res.data);
}

export async function createERPConnection(config) {
  return api.post('/erp/connections', config).then(res => res.data);
}

export async function testERPConnection(id) {
  return api.post(`/erp/connections/${id}/test`).then(res => res.data);
}

export async function syncERPConnection(id, type = 'FULL_SYNC') {
  return api.post(`/erp/connections/${id}/sync`, { type }).then(res => res.data);
}

export async function getERPSyncLogs() {
  return api.get('/erp/logs').then(res => res.data);
}
