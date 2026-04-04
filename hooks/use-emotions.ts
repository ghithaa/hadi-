import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { emotionsService } from '@/services/emotions.service';
import { AnalyzeEmotionPayload, PaginationParams } from '@/types';

export function useEmotionEntries(params?: PaginationParams) {
  return useQuery({
    queryKey: ['emotions', 'entries', params],
    queryFn: () => emotionsService.getEntries(params),
  });
}

export function useAnalyzeEmotion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AnalyzeEmotionPayload) => emotionsService.analyzeEmotion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emotions', 'entries'] });
    },
  });
}
