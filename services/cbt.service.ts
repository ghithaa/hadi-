import { apiClient } from '@/lib/api-client';
import { ThoughtRecord, CognitiveDistortion, CreateThoughtRecordPayload, PaginationParams } from '@/types';

export const cbtService = {
  createThoughtRecord(data: CreateThoughtRecordPayload): Promise<ThoughtRecord> {
    return apiClient.post<ThoughtRecord>('/cbt/thought-records', data);
  },

  getThoughtRecords(params?: PaginationParams): Promise<ThoughtRecord[]> {
    return apiClient.get<ThoughtRecord[]>('/cbt/thought-records', params);
  },

  getDistortions(): Promise<CognitiveDistortion[]> {
    return apiClient.get<CognitiveDistortion[]>('/cbt/distortions');
  },

  getReframingScenarios(): Promise<any[]> {
    return apiClient.get<any[]>('/cbt/reframing-scenarios');
  },
};
