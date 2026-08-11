import { Camera, Alert, Nvr, Incident, AuditLog, User } from '../types';

const API_BASE = '/api/v1';

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('secureview_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'API request failed');
  }
  return data;
}

// Camera API Callers
export const cameraService = {
  getAll: (params: Record<string, string> = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchApi<{ success: boolean; data: Camera[] }>(`/cameras${query ? `?${query}` : ''}`);
  },
  getById: (id: string) => fetchApi<{ success: boolean; data: Camera }>(`/cameras/${id}`),
  create: (data: Partial<Camera>) =>
    fetchApi<{ success: boolean; data: Camera }>('/cameras', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Camera>) =>
    fetchApi<{ success: boolean; data: Camera }>(`/cameras/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    fetchApi<{ success: boolean; message: string }>(`/cameras/${id}`, { method: 'DELETE' }),
  testConnection: (id: string) =>
    fetchApi<{ success: boolean; diagnostic: any }>(`/cameras/${id}/test-connection`, { method: 'POST' }),
};

// Alert API Callers
export const alertService = {
  getAll: (params: Record<string, string> = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchApi<{ success: boolean; data: Alert[] }>(`/alerts${query ? `?${query}` : ''}`);
  },
  updateStatus: (id: string, status: string, assignedToId?: string) =>
    fetchApi<{ success: boolean; data: Alert }>(`/alerts/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, assignedToId }),
    }),
};

// NVR API Callers
export const nvrService = {
  getAll: () => fetchApi<{ success: boolean; data: Nvr[] }>('/nvrs'),
  getStorageAnalytics: () => fetchApi<{ success: boolean; summary: any; nvrBreakdown: Nvr[] }>('/nvrs/storage-analytics'),
};

// Incident API Callers
export const incidentService = {
  getAll: () => fetchApi<{ success: boolean; data: Incident[] }>('/incidents'),
  create: (data: Partial<Incident>) =>
    fetchApi<{ success: boolean; data: Incident }>('/incidents', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Incident>) =>
    fetchApi<{ success: boolean; data: Incident }>(`/incidents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Audit Log & Reports API Callers
export const auditService = {
  getLogs: () => fetchApi<{ success: boolean; data: AuditLog[] }>('/audit-logs'),
};

export const reportService = {
  getUptimeReport: () => fetchApi<{ success: boolean; summary: any; monthlyTrends: any[]; cameraStatusList: any[] }>('/reports/uptime'),
};
