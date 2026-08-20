import api from './api';

export async function downloadWorkOrderPdf(workOrderId) {
  const response = await api.get(`/export/workorder/${workOrderId}/pdf`, {
    responseType: 'blob'
  });
  
  const blob = new Blob([response.data], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `workorder-${workOrderId}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export async function downloadInventoryPdf() {
  const response = await api.get('/export/inventory/pdf', {
    responseType: 'blob'
  });
  
  const blob = new Blob([response.data], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'inventaire-pieces.pdf');
  document.body.appendChild(link);
  link.click();
  link.remove();
}
