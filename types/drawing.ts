export interface DrawingAnalysisResult {
  themes: string[];
  emotionalTone: string;
  observations: string[];
  insights: string[];
}

export interface DrawingAnalysis {
  id: string;
  imagePath: string;
  status: 'processing' | 'completed' | 'failed';
  analysis: DrawingAnalysisResult | null;
  analyzedAt?: string;
  createdAt: string;
}
