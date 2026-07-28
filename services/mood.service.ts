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

  async getStats(): Promise<MoodStats> {
    const data = await apiClient.get<any>('/mood/stats');
    return {
      averageMood: data?.averageMood ?? data?.avgScore ?? 0,
      streak: data?.streak ?? data?.currentStreak ?? 0,
      totalEntries: data?.totalEntries ?? data?.totalEntries ?? 0,
    };
  },

  async getChart(params?: DateRangeParams): Promise<MoodChartData> {
    const points = await apiClient.get<any[]>('/mood/chart', params);
    return {
      labels: points.map((p) => p.date),
      data: points.map((p) => p.score ?? p.moodScore ?? 0),
    };
  },
};
