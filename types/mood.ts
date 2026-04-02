export interface MoodEntry {
  id: string;
  moodScore: number;
  note?: string;
  date: string;
  createdAt: string;
}

export interface MoodStats {
  averageMood: number;
  streak: number;
  totalEntries: number;
}

export interface MoodChartPoint {
  date: string;
  score: number;
}

export interface MoodChartData {
  labels: string[];
  data: number[];
}

export interface MoodTodayResponse {
  logged: boolean;
  entry?: MoodEntry;
}

export interface CreateMoodPayload {
  moodScore: number;
  note?: string;
}
