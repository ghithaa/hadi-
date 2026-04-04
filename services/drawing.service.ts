import { apiClient } from '@/lib/api-client';
import { DrawingAnalysis, PaginationParams } from '@/types';

export const drawingService = {
  analyzeDrawing(formData: FormData): Promise<DrawingAnalysis> {
    return apiClient.post<DrawingAnalysis>('/drawing/analyze', formData, { isMultipart: true });
  },

  getHistory(params?: PaginationParams): Promise<DrawingAnalysis[]> {
    return apiClient.get<DrawingAnalysis[]>('/drawing/history', params);
  },

  getAnalysis(id: string): Promise<DrawingAnalysis> {
    return apiClient.get<DrawingAnalysis>(`/drawing/${id}`);
  },
};
