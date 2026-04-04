import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sleepService } from '@/services/sleep.service';
import { CreateSleepPayload, DateRangeParams } from '@/types';

export function useSleepEntries(params?: DateRangeParams & { limit?: number }) {
  return useQuery({
    queryKey: ['sleep', 'entries', params],
    queryFn: () => sleepService.getEntries(params),
  });
}

export function useSleepToday() {
  return useQuery({
    queryKey: ['sleep', 'today'],
    queryFn: () => sleepService.getToday(),
  });
}

export function useSleepStats() {
  return useQuery({
    queryKey: ['sleep', 'stats'],
    queryFn: () => sleepService.getStats(),
  });
}

export function useSleepChart(params?: DateRangeParams) {
  return useQuery({
    queryKey: ['sleep', 'chart', params],
    queryFn: () => sleepService.getChart(params),
  });
}

export function useLogSleep() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSleepPayload) => sleepService.logSleep(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sleep'] });
    },
  });
}
