import { apiClient } from '@/lib/api-client';
import { ReportOverview, MoodTrend, WellnessReport, WeeklyReport, ActivityBreakdown, DateRangeParams } from '@/types';

export const reportsService = {
  getOverview(): Promise<ReportOverview> {
    return apiClient.get<ReportOverview>('/reports/overview');
  },

  getMoodTrends(params?: DateRangeParams): Promise<MoodTrend[]> {
    return apiClient.get<MoodTrend[]>('/reports/mood-trends', params);
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
