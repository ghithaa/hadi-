import { apiClient } from '@/lib/api-client';
import { AssessmentType, AssessmentResult, SubmitAssessmentPayload, PaginationParams } from '@/types';

export const assessmentsService = {
  getTypes(): Promise<AssessmentType[]> {
    return apiClient.get<AssessmentType[]>('/assessments/types');
  },

  submitAssessment(data: SubmitAssessmentPayload): Promise<AssessmentResult> {
    const normalizedType = data.assessmentType.toLowerCase();
    const supportedTypes = ['gad7', 'phq9', 'burnout', 'self_esteem', 'social_anxiety'];

    if (!supportedTypes.includes(normalizedType)) {
      console.warn(`Assessment type ${data.assessmentType} is not supported by the backend database. Skipping submission.`);
      return Promise.resolve({
        id: 'local-mock-id-' + Math.random(),
        assessment_type: data.assessmentType,
        score: data.answers.reduce((sum, a) => sum + a.score, 0),
        answers: data.answers,
        created_at: new Date().toISOString(),
      } as AssessmentResult);
    }

    return apiClient.post<AssessmentResult>('/assessments/submit', {
      ...data,
      assessmentType: normalizedType,
    });
  },

  async getHistory(params?: PaginationParams & { type?: string }): Promise<AssessmentResult[]> {
    const response = await apiClient.get<any>('/assessments/history', params);
    if (response && response.data && Array.isArray(response.data)) {
      return response.data;
    }
    return Array.isArray(response) ? response : [];
  },

  getResult(id: string): Promise<AssessmentResult> {
    return apiClient.get<AssessmentResult>(`/assessments/${id}`);
  },
};
