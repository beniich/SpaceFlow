import { api } from './api';
import { Ticket } from '../types';
import { offlineQueue } from './offlineQueue.service';

export const ticketService = {
  async list(params?: { status?: string }): Promise<Ticket[]> {
    const { data } = await api.get<{ data: Ticket[] }>('/api/tickets', { params });
    return data.data;
  },

  async create(payload: {
    title: string;
    description: string;
    priority: string;
    assetId?: string;
    photos?: string[]; // URIs locales
    location?: { lat: number; lng: number };
  }): Promise<Ticket> {
    // Si offline → queue
    if (!await offlineQueue.isOnline()) {
      await offlineQueue.enqueue({
        type: 'CREATE_TICKET',
        payload,
      });
      throw new Error('Ticket créé en mode hors-ligne. Il sera synchronisé dès que vous serez en ligne.');
    }

    // Upload des photos d'abord
    const uploadedUrls = await Promise.all(
      (payload.photos || []).map(uri => uploadPhoto(uri))
    );

    const { data } = await api.post<Ticket>('/api/tickets', {
      ...payload,
      photos: uploadedUrls,
    });
    return data;
  },
};

async function uploadPhoto(uri: string): Promise<string> {
  const formData = new FormData();
  formData.append('file', {
    uri,
    type: 'image/jpeg',
    name: `photo-${Date.now()}.jpg`,
  } as any);

  const { data } = await api.post<{ url: string }>('/api/uploads', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.url;
}
