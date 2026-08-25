import { api } from './api';
import { WorkOrder } from '../types';

export const workOrderService = {
  async list(params?: { status?: string; assignedToMe?: boolean }): Promise<WorkOrder[]> {
    const { data } = await api.get<{ data: WorkOrder[] }>('/api/workorders', { params });
    return data.data;
  },

  async getOne(id: string): Promise<WorkOrder> {
    const { data } = await api.get<WorkOrder>(`/api/workorders/${id}`);
    return data;
  },

  async start(id: string): Promise<WorkOrder> {
    const { data } = await api.post<WorkOrder>(`/api/workorders/${id}/start`);
    return data;
  },

  async complete(id: string, payload: {
    tasks: Array<{ id: string; completed: boolean }>;
    notes?: string;
    signature?: string; // base64
  }): Promise<WorkOrder> {
    const { data } = await api.post<WorkOrder>(`/api/workorders/${id}/complete`, payload);
    return data;
  },

  async addComment(id: string, message: string): Promise<void> {
    await api.post(`/api/workorders/${id}/comments`, { message });
  },
};
