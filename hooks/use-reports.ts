import { useQuery } from '@tanstack/react-query';
import { reportsService } from '@/services/reports.service';
import { DateRangeParams } from '@/types';

export function useReportOverview() {
  return useQuery({
    queryKey: ['reports', 'overview'],
    queryFn: () => reportsService.getOverview(),
  });
}

export function useMoodTrends(params?: DateRangeParams) {
  return useQuery({
    queryKey: ['reports', 'mood-trends', params],
    queryFn: () => reportsService.getMoodTrends(params),
  });
}

export function useWellnessReport() {
  return useQuery({
    queryKey: ['reports', 'wellness'],
    queryFn: () => reportsService.getWellness(),
  });
}

export function useActivitiesReport(params?: DateRangeParams) {
  return useQuery({
    queryKey: ['reports', 'activities', params],
    queryFn: () => reportsService.getActivities(params),
  });
}

export function useWeeklyReport() {
  return useQuery({
    queryKey: ['reports', 'weekly'],
    queryFn: () => reportsService.getWeekly(),
  });
}
