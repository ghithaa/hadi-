import { apiClient } from '@/lib/api-client';
import { BreathingSession, BreathingStats, LogBreathingSessionPayload } from '@/types';

export const breathingService = {
  logSession(data: LogBreathingSessionPayload): Promise<BreathingSession> {
    return apiClient.post<BreathingSession>('/breathing/sessions', data);
  },

  getStats(): Promise<BreathingStats> {
    return apiClient.get<BreathingStats>('/breathing/stats');
  },
};
