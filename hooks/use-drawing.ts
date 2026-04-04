import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { drawingService } from '@/services/drawing.service';
import { PaginationParams } from '@/types';

export function useDrawingHistory(params?: PaginationParams) {
  return useQuery({
    queryKey: ['drawing', 'history', params],
    queryFn: () => drawingService.getHistory(params),
  });
}

export function useDrawingById(id: string | null) {
  return useQuery({
    queryKey: ['drawing', id],
    queryFn: () => drawingService.getAnalysis(id!),
    enabled: !!id,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data?.status === 'completed' || data?.status === 'failed') return false;
      return 2000;
    },
  });
}

export function useAnalyzeDrawing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => drawingService.analyzeDrawing(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drawing', 'history'] });
    },
  });
}
