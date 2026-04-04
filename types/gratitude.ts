export interface GratitudeEntry {
  id: string;
  items: string[];
  date: string;
  createdAt: string;
}

export interface GratitudeStats {
  totalEntries: number;
  streak: number;
  totalItems: number;
}

export interface GratitudeTodayResponse {
  logged: boolean;
  entry?: GratitudeEntry;
}

export interface CreateGratitudePayload {
  items: string[];
}
