import { api } from '../lib/api';

export interface CAPATask {
  id: string;
  incidentId: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  dueDate?: string;
  assignee?: {
    firstName?: string;
    lastName?: string;
  };
}

export interface Incident {
  id: string;
  title: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'INVESTIGATING' | 'MITIGATED' | 'RESOLVED';
  detectedAt: string;
  node?: {
    name: string;
  };
  tasks: CAPATask[];
}

export const IncidentService = {
  getIncidents: () => api.get<Incident[]>('/incidents'),
  createIncident: (data: Partial<Incident>) => api.post<Incident>('/incidents', data),
  addTask: (incidentId: string, data: Partial<CAPATask>) => api.post<CAPATask>(`/incidents/${incidentId}/tasks`, data),
  updateTask: (taskId: string, status: string) => api.patch<CAPATask>(`/incidents/tasks/${taskId}`, { status }),
  resolveIncident: (incidentId: string) => api.post<Incident>(`/incidents/${incidentId}/resolve`, {}),
};
