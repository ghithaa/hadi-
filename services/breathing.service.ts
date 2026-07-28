import { apiClient } from '@/lib/api-client';
import { BreathingSession, BreathingStats, LogBreathingSessionPayload } from '@/types';

export const breathingService = {
  logSession(data: LogBreathingSessionPayload): Promise<BreathingSession> {
    return apiClient.post<BreathingSession>('/breathing/sessions', data);
  },

  getStats(): Promise<BreathingStats> {
    return apiClient.get<BreathingStats>('/breathing/stats');
  },

  async getPatterns(): Promise<any[]> {
    const serverPatterns = await apiClient.get<any[]>('/breathing/patterns');
    const { patterns } = require('@/constants/breathing-patterns');
    
    return serverPatterns.map((sp) => {
      // Find corresponding local pattern
      // Backend IDs: 'box', 'relax', 'energize', 'calm'
      // Local IDs: 'box', '4-7-8', 'energy', 'calm'
      const mappedId = sp.id === 'relax' ? '4-7-8' : sp.id === 'energize' ? 'energy' : sp.id;
      const localPattern = patterns.find((lp: any) => lp.id === mappedId);
      
      return {
        id: sp.id, // Keep server ID so logSession matches backend
        title: sp.name_ar || sp.name || localPattern?.title || '',
        subtitle: sp.name || localPattern?.subtitle || '',
        description: sp.description_ar || sp.description || localPattern?.description || '',
        color: sp.color || localPattern?.color || '#0f766e',
        timings: localPattern?.timings ?? { inhale: 4000, hold: 4000, exhale: 4000, holdOut: 4000 },
        instructions: localPattern?.instructions ?? '',
      };
    });
  },
};
