export interface SleepEntry {
  id: string;
  hours: number;
  quality: number;
  note?: string;
  date: string;
  createdAt: string;
}

export interface SleepStats {
  averageHours: number;
  averageQuality: number;
  streak: number;
  totalEntries: number;
}

export interface SleepChartPoint {
  date: string;
  hours: number;
}

export interface SleepChartData {
  labels: string[];
  data: number[];
}

export interface SleepTodayResponse {
  logged: boolean;
  entry?: SleepEntry;
}

export interface CreateSleepPayload {
  hours: number;
  quality: number;
  note?: string;
}
