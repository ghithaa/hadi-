import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gratitudeService } from '@/services/gratitude.service';
import { CreateGratitudePayload, PaginationParams } from '@/types';

export function useGratitudeEntries(params?: PaginationParams) {
  return useQuery({
    queryKey: ['gratitude', 'entries', params],
    queryFn: () => gratitudeService.getEntries(params),
  });
}

export function useGratitudeToday() {
  return useQuery({
    queryKey: ['gratitude', 'today'],
    queryFn: () => gratitudeService.getToday(),
  });
}

export function useGratitudeStats() {
  return useQuery({
    queryKey: ['gratitude', 'stats'],
    queryFn: () => gratitudeService.getStats(),
  });
}

export function useLogGratitude() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateGratitudePayload) => gratitudeService.logGratitude(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gratitude'] });
    },
  });
}
