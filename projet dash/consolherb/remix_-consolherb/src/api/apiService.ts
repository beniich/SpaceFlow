import { auth } from './firebaseClient';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api';

async function getAuthHeaders(): Promise<HeadersInit> {
  const token = await auth.currentUser?.getIdToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }

  // Handle empty responses (204 No Content)
  const contentType = response.headers.get('content-type');
  if (response.status === 204 || !contentType?.includes('application/json')) {
    return undefined as unknown as T;
  }

  return response.json() as Promise<T>;
}

export function apiGet<T>(path: string): Promise<T> {
  return apiFetch<T>(path, { method: 'GET' });
}

export function apiPost<T>(path: string, body: unknown): Promise<T> {
  return apiFetch<T>(path, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function apiDelete(path: string): Promise<void> {
  return apiFetch<void>(path, { method: 'DELETE' });
}
