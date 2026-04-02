import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { breathingService } from '@/services/breathing.service';
import { LogBreathingSessionPayload } from '@/types';

export function useBreathingStats() {
  return useQuery({
    queryKey: ['breathing', 'stats'],
    queryFn: () => breathingService.getStats(),
  });
}

export function useLogBreathingSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: LogBreathingSessionPayload) => breathingService.logSession(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['breathing'] });
    },
  });
}
