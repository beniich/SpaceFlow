import { Audit, AuditEvent, AuditTemplate } from '../types';

const API_BASE = '/api';

let currentToken: string | null = null;

export function setGlobalAuthToken(token: string | null) {
  currentToken = token;
}

async function safeFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  try {
    const headers: any = {
      ...options.headers,
    };
    if (currentToken) {
      headers['Authorization'] = `Bearer ${currentToken}`;
    }

    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      throw new Error(`API Error ${res.status}: ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error(`[AuditService] Fetch failed for ${url}:`, error);
    throw error;
  }
}

export const AuditService = {
  setToken: setGlobalAuthToken,
  async getTemplates(): Promise<AuditTemplate[]> {
    return safeFetch<AuditTemplate[]>(`${API_BASE}/templates`);
  },

  async getAudits(): Promise<Audit[]> {
    return safeFetch<Audit[]>(`${API_BASE}/audits`);
  },

  async getAudit(id: string): Promise<Audit> {
    return safeFetch<Audit>(`${API_BASE}/audit/${id}`);
  },

  async getEvents(id: string): Promise<AuditEvent[]> {
    return safeFetch<AuditEvent[]>(`${API_BASE}/audit/${id}/events`);
  },

  async appendEvent(auditId: string, type: string, payload: any, userId: string = 'current-user') {
    return safeFetch<any>(`${API_BASE}/audit/${auditId}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, payload, userId })
    });
  },

  async startAudit(templateId: string, entityId: string): Promise<string> {
    const auditId = `audit-${Date.now()}`;
    await this.appendEvent(auditId, 'AUDIT_STARTED', { templateId, entityId });
    return auditId;
  }
};

// Mock Template
export const SAFETY_TEMPLATE: AuditTemplate = {
  id: 'tpl-safety',
  title: 'Audit de Sécurité Industrielle',
  description: 'Contrôle trimestriel de conformité HSE et protection incendie.',
  version: 1,
  sections: [
    {
      id: 'sec-1',
      title: 'Équipements de Protection Individuelle (EPI)',
      questions: [
        { id: 'q1', text: 'Le port du casque est-il respecté en zone A ?', type: 'YES_NO', weight: 10, required: true },
        { id: 'q2', text: 'État des stocks de gants anti-coupures', type: 'SCORE', weight: 5, required: true },
        { id: 'q3', text: 'Capturez une photo de la signalétique EPI à l\'entrée', type: 'IMAGE', weight: 2, required: false }
      ]
    },
    {
      id: 'sec-2',
      title: 'Sécurité Incendie',
      questions: [
        { id: 'q4', text: 'Les extincteurs ont-ils été vérifiés il y a moins de 6 mois ?', type: 'YES_NO', weight: 15, required: true },
        { id: 'q5', text: 'Observations sur les issues de secours', type: 'TEXT', weight: 5, required: false }
      ]
    }
  ]
};
