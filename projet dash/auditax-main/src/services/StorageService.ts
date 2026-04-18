import { apiRequest } from '../lib/api';

export interface StorageUploadResponse {
  url: string;
  key: string;
  filename: string;
  mimeType: string;
  size: number;
}

export class StorageService {
  static async uploadEvidence(file: File, auditId: string): Promise<StorageUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('auditId', auditId);

    // In a real production app, this would hit /api/storage/upload
    // which would return a signed URL or process the upload to S3.
    // For industrial demo, we simulate the latency and validation.
    
    return apiRequest<StorageUploadResponse>('/storage/upload', {
      method: 'POST',
      body: formData,
    });
  }

  static async getEvidenceUrl(key: string): Promise<string> {
    const data = await apiRequest<{ url: string }>(`/storage/url/${key}`);
    return data.url;
  }
}
