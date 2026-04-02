import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { plansService } from '@/services/plans.service';
import { GeneratePlanPayload } from '@/types';

export function usePlans() {
  return useQuery({
    queryKey: ['plans'],
    queryFn: () => plansService.getPlans(),
  });
}

export function useActivePlan() {
  return useQuery({
    queryKey: ['plans', 'active'],
    queryFn: () => plansService.getActivePlan(),
  });
}

export function useGeneratePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: GeneratePlanPayload) => plansService.generatePlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
  });
}

export function useTogglePlanTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, completed }: { taskId: string; completed: boolean }) =>
      plansService.toggleTask(taskId, completed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
  });
}
