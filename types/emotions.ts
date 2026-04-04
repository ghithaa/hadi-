export interface EmotionEntry {
  id: string;
  text: string;
  detected_emotions: DetectedEmotion[];
  created_at: string;
}

export interface DetectedEmotion {
  emotion_name: string;
  score: number;
}

export interface AnalyzeEmotionPayload {
  text: string;
}
