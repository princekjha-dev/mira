import { ApiError } from '../types';

const API_BASE = '/api/v1';

function generateRequestId(): string {
  return 'req-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now().toString(36);
}

export class ApiClientError extends Error {
  code: string;
  requestId?: string;
  status: number;

  constructor(code: string, message: string, status: number, requestId?: string) {
    super(message);
    this.name = 'ApiClientError';
    this.code = code;
    this.status = status;
    this.requestId = requestId;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('mira_token');
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const requestId = headers.get('x-request-id') || generateRequestId();
  headers.set('x-request-id', requestId);

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorData: ApiError | null = null;
    let responseText = '';
    try {
      errorData = (await response.json()) as ApiError;
    } catch {
      try {
        responseText = await response.text();
      } catch {
        // The response body may already have been consumed or unavailable.
      }
    }

    const code = errorData?.error?.code || 'HTTP_ERROR';
    const isProxyFailure = !errorData && response.status >= 500;
    const message = errorData?.error?.message || (isProxyFailure
      ? 'Mira API is unavailable. Start PostgreSQL, then run npm run dev from the project root.'
      : responseText.trim() || `Request failed with status ${response.status}`);
    const reqId = errorData?.error?.request_id || response.headers.get('x-request-id') || requestId;

    throw new ApiClientError(code, message, response.status, reqId);
  }

  // Check for 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: 'GET', headers }),

  post: <T>(endpoint: string, body?: unknown, headers?: Record<string, string>) =>
    request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      headers,
    }),

  put: <T>(endpoint: string, body?: unknown, headers?: Record<string, string>) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      headers,
    }),

  patch: <T>(endpoint: string, body?: unknown, headers?: Record<string, string>) =>
    request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
      headers,
    }),

  delete: <T>(endpoint: string, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: 'DELETE', headers }),
};
