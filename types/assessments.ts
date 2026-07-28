export interface AssessmentType {
  id: string;
  name: string;
  description: string;
  questions: AssessmentQuestion[];
}

export interface AssessmentQuestion {
  index: number;
  text: string;
  options: { label: string; value: string; score: number }[];
}

export interface AssessmentResult {
  id: string;
  assessment_type: string;
  score: number;
  severity_level?: string;
  severity?: string;
  answers: object;
  created_at: string;
}

export interface SubmitAssessmentPayload {
  assessmentType: string;
  answers: {
    questionIndex: number;
    selectedOption: string;
    score: number;
  }[];
}
