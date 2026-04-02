import { apiClient } from '@/lib/api-client';
import { EmotionEntry, AnalyzeEmotionPayload, PaginationParams } from '@/types';

export const emotionsService = {
  analyzeEmotion(data: AnalyzeEmotionPayload): Promise<EmotionEntry> {
    return apiClient.post<EmotionEntry>('/emotions/analyze', data);
  },

  getEntries(params?: PaginationParams): Promise<EmotionEntry[]> {
    return apiClient.get<EmotionEntry[]>('/emotions', params);
  },

  getEntry(id: string): Promise<EmotionEntry> {
    return apiClient.get<EmotionEntry>(`/emotions/${id}`);
  },
};
