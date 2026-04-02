import { apiClient } from '@/lib/api-client';
import {
  GratitudeEntry,
  GratitudeStats,
  GratitudeTodayResponse,
  CreateGratitudePayload,
  PaginationParams,
} from '@/types';

export const gratitudeService = {
  logGratitude(data: CreateGratitudePayload): Promise<GratitudeEntry> {
    return apiClient.post<GratitudeEntry>('/gratitude', data);
  },

  getEntries(params?: PaginationParams): Promise<GratitudeEntry[]> {
    return apiClient.get<GratitudeEntry[]>('/gratitude', params);
  },

  getToday(): Promise<GratitudeTodayResponse> {
    return apiClient.get<GratitudeTodayResponse>('/gratitude/today');
  },

  getStats(): Promise<GratitudeStats> {
    return apiClient.get<GratitudeStats>('/gratitude/stats');
  },
};
