export interface BreathingSession {
  id: string;
  pattern_id: string;
  cycles_completed: number;
  duration_seconds: number;
  created_at: string;
}

export interface BreathingStats {
  totalSessions: number;
  totalMinutes: number;
  favoritePattern?: string;
}

export interface LogBreathingSessionPayload {
  patternId: string;
  cyclesCompleted: number;
  durationSeconds: number;
}
