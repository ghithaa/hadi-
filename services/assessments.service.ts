import { apiClient } from '@/lib/api-client';
import { AssessmentType, AssessmentResult, SubmitAssessmentPayload, PaginationParams } from '@/types';

export const assessmentsService = {
  getTypes(): Promise<AssessmentType[]> {
    return apiClient.get<AssessmentType[]>('/assessments/types');
  },

  submitAssessment(data: SubmitAssessmentPayload): Promise<AssessmentResult> {
    return apiClient.post<AssessmentResult>('/assessments/submit', data);
  },

  getHistory(params?: PaginationParams & { type?: string }): Promise<AssessmentResult[]> {
    return apiClient.get<AssessmentResult[]>('/assessments/history', params);
  },

  getResult(id: string): Promise<AssessmentResult> {
    return apiClient.get<AssessmentResult>(`/assessments/${id}`);
  },
};
