import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cbtService } from '@/services/cbt.service';
import { CreateThoughtRecordPayload, PaginationParams } from '@/types';

export function useThoughtRecords(params?: PaginationParams) {
  return useQuery({
    queryKey: ['cbt', 'thought-records', params],
    queryFn: () => cbtService.getThoughtRecords(params),
  });
}

export function useCBTDistortions() {
  return useQuery({
    queryKey: ['cbt', 'distortions'],
    queryFn: () => cbtService.getDistortions(),
    staleTime: Infinity, // Distortions rarely change
  });
}

export function useReframingScenarios() {
  return useQuery({
    queryKey: ['cbt', 'reframing'],
    queryFn: () => cbtService.getReframingScenarios(),
    staleTime: Infinity,
  });
}

export function useCreateThoughtRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateThoughtRecordPayload) => cbtService.createThoughtRecord(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cbt', 'thought-records'] });
    },
  });
}
