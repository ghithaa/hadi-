export interface ReportOverview {
  moodAverage: number;
  sleepAverage: number;
  gratitudeStreak: number;
  breathingSessionsThisWeek: number;
  lastAssessment?: { type: string; score: number; severity: string };
  activePlan?: { id: string; title: string; progress: number };
}

export interface MoodTrend {
  date: string;
  score: number;
}

export interface WellnessReport {
  overallScore: number;
  dimensions: { name: string; score: number }[];
}

export interface WeeklyReport {
  summary: string;
  recommendations: string[];
  moodTrend: MoodTrend[];
  sleepTrend: { date: string; hours: number }[];
}

export interface ActivityBreakdown {
  module: string;
  count: number;
}
