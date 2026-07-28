import { apiClient } from '@/lib/api-client';
import { ReportOverview, MoodTrend, WellnessReport, WeeklyReport, ActivityBreakdown, DateRangeParams } from '@/types';

export const reportsService = {
  async getOverview(): Promise<ReportOverview> {
    const data = await apiClient.get<any>('/reports/overview');
    return {
      moodAverage: data?.mood?.avg7d ?? data?.moodAverage ?? 0,
      sleepAverage: data?.sleep?.avgHours7d ?? data?.sleepAverage ?? 0,
      gratitudeStreak: data?.gratitude?.streak ?? data?.gratitudeStreak ?? 0,
      breathingSessionsThisWeek: data?.breathingSessionsThisWeek ?? 0,
    };
  },

  async getMoodTrends(params?: DateRangeParams): Promise<MoodTrend[]> {
    const data = await apiClient.get<any[]>('/reports/mood-trends', params);
    return data.map((item) => ({
      date: item.date,
      score: item.score ?? item.moodScore ?? 0,
    }));
  },

  getWellness(): Promise<WellnessReport> {
    return apiClient.get<WellnessReport>('/reports/wellness');
  },

  getActivities(params?: DateRangeParams): Promise<ActivityBreakdown[]> {
    return apiClient.get<ActivityBreakdown[]>('/reports/activities', params);
  },

  getWeekly(): Promise<WeeklyReport> {
    return apiClient.get<WeeklyReport>('/reports/weekly');
  },
};
