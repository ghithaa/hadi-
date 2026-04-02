import { apiClient } from '@/lib/api-client';
import {
  MoodEntry,
  MoodStats,
  MoodChartData,
  MoodChartPoint,
  MoodTodayResponse,
  CreateMoodPayload,
  DateRangeParams,
} from '@/types';

export const moodService = {
  logMood(data: CreateMoodPayload): Promise<MoodEntry> {
    return apiClient.post<MoodEntry>('/mood', data);
  },

  getEntries(params?: DateRangeParams & { limit?: number }): Promise<MoodEntry[]> {
    return apiClient.get<MoodEntry[]>('/mood', params);
  },

  getToday(): Promise<MoodTodayResponse> {
    return apiClient.get<MoodTodayResponse>('/mood/today');
  },

  getStats(): Promise<MoodStats> {
    return apiClient.get<MoodStats>('/mood/stats');
  },

  async getChart(params?: DateRangeParams): Promise<MoodChartData> {
    const points = await apiClient.get<MoodChartPoint[]>('/mood/chart', params);
    return {
      labels: points.map((p) => p.date),
      data: points.map((p) => p.score),
    };
  },
};
