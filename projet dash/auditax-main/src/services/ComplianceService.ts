import { api } from '../lib/api';

export interface Control {
  id: string;
  name: string;
  description: string;
  frequency: string;
  status: 'COMPLIANT' | 'NON_COMPLIANT' | 'NOT_TESTED';
}

export interface Policy {
  id: string;
  title: string;
  framework: string;
  content: string;
  active: boolean;
  controls: Control[];
}

export const ComplianceService = {
  getPolicies: () => api.get<Policy[]>('/compliance/policies'),
  createPolicy: (data: Partial<Policy>) => api.post<Policy>('/compliance/policies', data),
  addControl: (policyId: string, data: Partial<Control>) => api.post<Control>(`/compliance/policies/${policyId}/controls`, data),
  updateControlStatus: (controlId: string, status: string) => api.patch<Control>(`/compliance/controls/${controlId}`, { status }),
};
