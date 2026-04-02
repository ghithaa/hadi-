import { apiClient } from '@/lib/api-client';
import { Helpline, EmergencyResource } from '@/types';

export const emergencyService = {
  getHelplines(): Promise<Helpline[]> {
    return apiClient.get<Helpline[]>('/emergency/helplines', undefined, { skipAuth: true });
  },

  getResources(): Promise<EmergencyResource[]> {
    return apiClient.get<EmergencyResource[]>('/emergency/resources', undefined, { skipAuth: true });
  },
};
