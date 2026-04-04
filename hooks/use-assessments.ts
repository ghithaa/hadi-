import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assessmentsService } from '@/services/assessments.service';
import { SubmitAssessmentPayload, PaginationParams } from '@/types';

export function useAssessmentTypes() {
  return useQuery({
    queryKey: ['assessments', 'types'],
    queryFn: () => assessmentsService.getTypes(),
  });
}

export function useAssessmentHistory(params?: PaginationParams & { type?: string }) {
  return useQuery({
    queryKey: ['assessments', 'history', params],
    queryFn: () => assessmentsService.getHistory(params),
  });
}

export function useSubmitAssessment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SubmitAssessmentPayload) => assessmentsService.submitAssessment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessments', 'history'] });
    },
  });
}
