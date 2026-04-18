/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AuditStatus = 'DRAFT' | 'IN_PROGRESS' | 'SUBMITTED' | 'REVIEWED' | 'CLOSED';

export interface AuditEvent {
  id: string;
  auditId: string;
  type: string;
  timestamp: string;
  userId: string;
  payload: any;
  sha256_hash?: string;
}

export interface AuditTemplate {
  id: string;
  title: string;
  description: string;
  sections: AuditSection[];
  version: number;
}

export interface AuditSection {
  id: string;
  title: string;
  questions: AuditQuestion[];
}

export interface AuditQuestion {
  id: string;
  text: string;
  type: 'YES_NO' | 'SCORE' | 'TEXT' | 'IMAGE';
  weight: number;
  required: boolean;
}

export interface Audit {
  id: string;
  templateId: string;
  status: AuditStatus;
  auditorId: string;
  entityId: string;
  startedAt: string;
  submittedAt?: string;
  responses: Record<string, AuditResponse>;
  gpsLocation?: { lat: number; lng: number };
}

export interface AuditResponse {
  questionId: string;
  value: any;
  evidenceUrl?: string[];
  findingText?: string;
  score?: number;
  timestamp: string;
}

export interface KPI {
  title: string;
  value: string | number;
  trend: 'up' | 'down' | 'neutral';
  color: string;
}
