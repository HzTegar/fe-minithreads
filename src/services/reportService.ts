import { api } from './api';
import type { CreateReportInput, UpdateReportInput, Report } from '../types/report.type';

interface ReportsListResponse {
  data?: Report[];
  current_page?: number;
  last_page?: number;
  total?: number;
  per_page?: number;
}

export const reportService = {
  create: async (data: CreateReportInput): Promise<{ message?: string }> => {
    const response = await api.post<{ data?: { message?: string } } | { message?: string }>('/reports', data as unknown as Record<string, unknown>);
    return (response as { data?: { message?: string } }).data || (response as { message?: string });
  },

  getAll: async (params?: { status?: string; keyword?: string; page?: number }): Promise<ReportsListResponse> => {
    let query = '';
    const queryParts: string[] = [];
    if (params?.status && params.status !== 'all') {
      queryParts.push(`status=${encodeURIComponent(params.status)}`);
    }
    if (params?.keyword) {
      queryParts.push(`keyword=${encodeURIComponent(params.keyword)}`);
    }
    if (params?.page) {
      queryParts.push(`page=${params.page}`);
    }
    if (queryParts.length > 0) {
      query = `?${queryParts.join('&')}`;
    }
    
    const response = await api.get<{ data?: ReportsListResponse } | ReportsListResponse>(`/admin/reports${query}`);
    return (response as { data?: ReportsListResponse }).data || (response as ReportsListResponse);
  },

  getById: async (id: string): Promise<Report> => {
    const response = await api.get<{ data?: Report } | Report>(`/admin/reports/${id}`);
    return (response as { data?: Report }).data || (response as Report);
  },

  update: async (id: string, data: UpdateReportInput): Promise<Report> => {
    const response = await api.put<{ data?: Report } | Report>(`/admin/reports/${id}`, data as unknown as Record<string, unknown>);
    return (response as { data?: Report }).data || (response as Report);
  },
};
