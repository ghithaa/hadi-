export interface ThoughtRecord {
  id: string;
  record_type: 'thought_record' | 'behavioral';
  situation: string;
  automatic_thought: string;
  emotion: string;
  emotion_intensity: number;
  distortion?: string;
  alternative_thought?: string;
  new_emotion_intensity?: number;
  created_at: string;
}

export interface CognitiveDistortion {
  name: string;
  description: string;
  example: string;
  fix: string;
}

export interface CreateThoughtRecordPayload {
  situation: string;
  automaticThought: string;
  emotion: string;
  emotionIntensity: number;
  distortion?: string;
  alternativeThought?: string;
  newEmotionIntensity?: number;
}

export interface CreateBehavioralPayload {
  activity: string;
  pleasureRating: number;
  masteryRating: number;
}
