import { useQuery } from '@tanstack/react-query';
import { emergencyService } from '@/services/emergency.service';

export function useHelplines() {
  return useQuery({
    queryKey: ['emergency', 'helplines'],
    queryFn: () => emergencyService.getHelplines(),
    staleTime: Infinity, // Helplines rarely change
  });
}

export function useEmergencyResources() {
  return useQuery({
    queryKey: ['emergency', 'resources'],
    queryFn: () => emergencyService.getResources(),
    staleTime: Infinity,
  });
}
