import { apiClient, ApiClientError } from '@/lib/api-client';
import { Plan, GeneratePlanPayload } from '@/types';

export const plansService = {
  generatePlan(data: GeneratePlanPayload): Promise<Plan> {
    return apiClient.post<Plan>('/plans/generate', data);
  },

  getPlans(): Promise<Plan[]> {
    return apiClient.get<Plan[]>('/plans');
  },

  async getActivePlan(): Promise<Plan | null> {
    try {
      return await apiClient.get<Plan>('/plans/active');
    } catch (err) {
      if (err instanceof ApiClientError && err.statusCode === 404) {
        return null;
      }
      throw err;
    }
  },

  toggleTask(taskId: string, completed: boolean): Promise<void> {
    return apiClient.put(`/plans/tasks/${taskId}/toggle`, { is_completed: completed });
  },
};
