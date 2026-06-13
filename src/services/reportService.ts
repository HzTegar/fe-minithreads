import { api } from './api';
import type { CreateReportInput, UpdateReportInput, Report } from '../types/report.type';

export const reportService = {
  create: async (data: CreateReportInput): Promise<any> => {
    // Backend endpoint POST /api/reports
    const response: any = await api.post('/reports', data);
    return response;
  },

  getAll: async (params?: { status?: string; keyword?: string; page?: number }): Promise<any> => {
    // Backend endpoint GET /api/admin/reports
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
    
    const response: any = await api.get(`/admin/reports${query}`);
    return response.data || response;
  },

  getById: async (id: string): Promise<Report> => {
    // Backend endpoint GET /api/admin/reports/{id}
    const response: any = await api.get(`/admin/reports/${id}`);
    return response.data || response;
  },

  update: async (id: string, data: UpdateReportInput): Promise<any> => {
    // Backend endpoint PUT /api/admin/reports/{id}
    const response: any = await api.put(`/admin/reports/${id}`, data);
    return response.data || response;
  },
};
