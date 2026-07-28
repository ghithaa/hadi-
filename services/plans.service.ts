import { apiClient, ApiClientError } from '@/lib/api-client';
import { Plan, GeneratePlanPayload } from '@/types';

export function mapBackendPlanToFrontend(data: any): Plan {
  if (!data) return data;
  return {
    id: data.id,
    title: data.title || '',
    description: data.description || '',
    isActive: data.is_active !== undefined ? data.is_active : (data.isActive !== undefined ? data.isActive : false),
    createdAt: data.created_at || data.createdAt || '',
    updatedAt: data.updated_at || data.updatedAt || '',
    tasks: (data.tasks || []).map((t: any) => ({
      id: t.id,
      title: t.title || '',
      description: t.description || '',
      isCompleted: t.is_completed !== undefined ? t.is_completed : (t.isCompleted !== undefined ? t.isCompleted : false),
      frequency: t.frequency,
      priority: t.priority,
    })),
  };
}

export const plansService = {
  async generatePlan(data: GeneratePlanPayload): Promise<Plan> {
    const raw = await apiClient.post<any>('/plans/generate', data);
    return mapBackendPlanToFrontend(raw);
  },

  async getPlans(): Promise<Plan[]> {
    const raw = await apiClient.get<any[]>('/plans');
    return (raw || []).map(mapBackendPlanToFrontend);
  },

  async getActivePlan(): Promise<Plan | null> {
    try {
      const raw = await apiClient.get<any>('/plans/active');
      return mapBackendPlanToFrontend(raw);
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
