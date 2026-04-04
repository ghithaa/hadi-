import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { moodService } from '@/services/mood.service';
import { CreateMoodPayload, DateRangeParams } from '@/types';

export function useMoodEntries(params?: DateRangeParams & { limit?: number }) {
  return useQuery({
    queryKey: ['mood', 'entries', params],
    queryFn: () => moodService.getEntries(params),
  });
}

export function useMoodToday() {
  return useQuery({
    queryKey: ['mood', 'today'],
    queryFn: () => moodService.getToday(),
  });
}

export function useMoodStats() {
  return useQuery({
    queryKey: ['mood', 'stats'],
    queryFn: () => moodService.getStats(),
  });
}

export function useMoodChart(params?: DateRangeParams) {
  return useQuery({
    queryKey: ['mood', 'chart', params],
    queryFn: () => moodService.getChart(params),
  });
}

export function useLogMood() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateMoodPayload) => moodService.logMood(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mood'] });
    },
  });
}
