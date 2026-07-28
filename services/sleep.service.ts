import { apiClient } from '@/lib/api-client';
import {
  SleepEntry,
  SleepStats,
  SleepChartData,
  SleepChartPoint,
  SleepTodayResponse,
  CreateSleepPayload,
  DateRangeParams,
} from '@/types';

export const sleepService = {
  logSleep(data: CreateSleepPayload): Promise<SleepEntry> {
    return apiClient.post<SleepEntry>('/sleep', data);
  },

  getEntries(params?: DateRangeParams & { limit?: number }): Promise<SleepEntry[]> {
    return apiClient.get<SleepEntry[]>('/sleep', params);
  },

  getToday(): Promise<SleepTodayResponse> {
    return apiClient.get<SleepTodayResponse>('/sleep/today');
  },

  async getStats(): Promise<SleepStats> {
    const data = await apiClient.get<any>('/sleep/stats');
    return {
      averageHours: data?.averageHours ?? data?.avgHours ?? 0,
      averageQuality: data?.averageQuality ?? data?.avgQuality ?? 0,
      streak: data?.streak ?? 0,
      totalEntries: data?.totalEntries ?? data?.count ?? 0,
    };
  },

  async getChart(params?: DateRangeParams): Promise<SleepChartData> {
    const points = await apiClient.get<SleepChartPoint[]>('/sleep/chart', params);
    return {
      labels: points.map((p) => p.date),
      data: points.map((p) => p.hours),
    };
  },
};
