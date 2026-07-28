export type AssessmentAnalysisLanguage = 'ar' | 'en';
export type AssessmentAnalysisGender = 'male' | 'female' | null;

export interface AssessmentAnalysisQuestionOption {
  label: string;
  value: number;
}

export interface AssessmentAnalysisQuestion {
  id: string;
  text: string;
  options: AssessmentAnalysisQuestionOption[];
}

export interface AssessmentAnalysisResult {
  level: string;
  color: string;
  advice: string;
}

function severityToColor(severity?: string) {
  const key = (severity || '').toLowerCase();
  if (key.includes('high') || key.includes('severe') || key.includes('positive') || key.includes('probable')) return 'text-red-500';
  if (key.includes('moderate')) return 'text-orange-500';
  if (key.includes('mild') || key.includes('subthreshold') || key.includes('low')) return 'text-yellow-500';
  if (key.includes('none') || key.includes('minimal') || key.includes('negative') || key.includes('below_threshold')) return 'text-green-500';
  return 'text-primary';
}

export function computeAssessmentResult(
  language: AssessmentAnalysisLanguage,
  raw: any,
  questions: AssessmentAnalysisQuestion[],
  answers: number[],
  gender: AssessmentAnalysisGender = null
): AssessmentAnalysisResult {
  const scoringType = raw?.scoring_type as string | undefined;
  const totalScore = answers.reduce((a, b) => a + b, 0);
  const scoreLine = language === 'ar' ? `مجموع النقاط: ${totalScore}` : `Total score: ${totalScore}`;

  if (scoringType === 'sum') {
    const interpretation = (raw?.interpretation || []) as any[];
    const match = interpretation.find(
      (row) => typeof row.min === 'number' && typeof row.max === 'number' && totalScore >= row.min && totalScore <= row.max
    );
    const level = match ? (language === 'ar' ? match.label_ar : match.label_en) : scoreLine;
    const color = severityToColor(match?.severity);

    let advice = scoreLine;
    const criticalItems = raw?.critical_items || {};
    const qIds = questions.map((question) => question.id);
    const flags = Object.entries(criticalItems).filter(([qid, meta]) => {
      const index = qIds.indexOf(qid);
      if (index < 0) return false;
      const threshold = (meta as any)?.threshold;
      return typeof threshold === 'number' ? (answers[index] ?? 0) > threshold : false;
    });

    if (flags.length > 0) {
      advice =
        language === 'ar'
          ? `${scoreLine}\n\nإذا كانت لديك أفكار بإيذاء نفسك أو كنت في خطر فوري، تواصل مع الطوارئ أو شخص موثوق فوراً.`
          : `${scoreLine}\n\nIf you have thoughts of self-harm or are in immediate danger, contact emergency services or a trusted person right away.`;
    }

    return { level, color, advice };
  }

  if (scoringType === 'asrs_threshold') {
    const special = raw?.special_scoring || {};
    const thresholdValue = typeof special.threshold_value === 'number' ? special.threshold_value : 2;
    const minItems = typeof special.min_items_above_threshold === 'number' ? special.min_items_above_threshold : 4;
    const countAbove = answers.filter((value) => value >= thresholdValue).length;
    const positive = countAbove >= minItems;
    const interpretation = (raw?.interpretation || []) as any[];
    const target = interpretation.find((row) => row.severity === (positive ? 'positive_screen' : 'negative_screen'));
    const level = target
      ? (language === 'ar' ? target.label_ar : target.label_en)
      : positive
        ? (language === 'ar' ? 'نتيجة إيجابية' : 'Positive screen')
        : (language === 'ar' ? 'نتيجة سلبية' : 'Negative screen');
    const color = positive ? 'text-orange-500' : 'text-green-500';
    const advice =
      language === 'ar'
        ? `عدد البنود فوق العتبة: ${countAbove}\n\nهذه نتيجة فحص أولي وليست تشخيصاً.`
        : `Items above threshold: ${countAbove}\n\nThis is a screening result, not a diagnosis.`;
    return { level, color, advice };
  }

  if (scoringType === 'auditc_gender') {
    const special = raw?.special_scoring || {};
    const maleCutoff = typeof special.male_cutoff === 'number' ? special.male_cutoff : 4;
    const femaleCutoff = typeof special.female_cutoff === 'number' ? special.female_cutoff : 3;
    const cutoff = gender === 'female' ? femaleCutoff : maleCutoff;
    const positive = totalScore >= cutoff;
    const interpretation = (raw?.interpretation || []) as any[];
    const target = interpretation.find((row) => row.severity === (positive ? 'positive_screen' : 'negative_screen'));
    const level = target
      ? (language === 'ar' ? target.label_ar : target.label_en)
      : positive
        ? (language === 'ar' ? 'نتيجة إيجابية' : 'Positive screen')
        : (language === 'ar' ? 'نتيجة سلبية' : 'Negative screen');
    return { level, color: positive ? 'text-orange-500' : 'text-green-500', advice: scoreLine };
  }

  if (scoringType === 'cssrs_risk') {
    const order: Record<string, number> = { none: 0, low: 1, moderate: 2, high: 3 };
    let maxRisk = 'none';

    (raw?.questions || []).forEach((question: any, index: number) => {
      const value = answers[index] ?? 0;
      if (value > 0 && question.risk_level && order[question.risk_level] > order[maxRisk]) {
        maxRisk = question.risk_level;
      }
    });

    const interpretation = (raw?.interpretation || []) as any[];
    const target = interpretation.find((row) => row.severity === maxRisk);
    const level = target ? (language === 'ar' ? target.label_ar : target.label_en) : maxRisk;
    const crisis = language === 'ar' ? raw?.crisis_message_ar : raw?.crisis_message_en;
    const advice = maxRisk === 'high' || maxRisk === 'moderate' ? (crisis || '') : '';
    return { level, color: severityToColor(maxRisk), advice: advice || scoreLine };
  }

  if (scoringType === 'mdq_3part') {
    const special = raw?.special_scoring || {};
    const part1Threshold = typeof special.part1_threshold === 'number' ? special.part1_threshold : 7;
    const part2Required = !!special.part2_required;
    const part3MinValue = typeof special.part3_min_value === 'number' ? special.part3_min_value : 2;

    let part1Yes = 0;
    let part2Yes = false;
    let part3Value = 0;

    (raw?.questions || []).forEach((question: any, index: number) => {
      const value = answers[index] ?? 0;
      if (question.part === 1 && value > 0) part1Yes += 1;
      if (question.part === 2 && value > 0) part2Yes = true;
      if (question.part === 3) part3Value = value;
    });

    const positive = part1Yes >= part1Threshold && (!part2Required || part2Yes) && part3Value >= part3MinValue;
    const interpretation = (raw?.interpretation || []) as any[];
    const target = interpretation.find((row) => row.severity === (positive ? 'positive_screen' : 'negative_screen'));
    const level = target
      ? (language === 'ar' ? target.label_ar : target.label_en)
      : positive
        ? (language === 'ar' ? 'نتيجة إيجابية' : 'Positive screen')
        : (language === 'ar' ? 'نتيجة سلبية' : 'Negative screen');
    const advice =
      language === 'ar'
        ? `بنود الجزء الأول (نعم): ${part1Yes}\n\nهذه نتيجة فحص أولي وليست تشخيصاً.`
        : `Part 1 “Yes” count: ${part1Yes}\n\nThis is a screening result, not a diagnosis.`;
    return { level, color: positive ? 'text-orange-500' : 'text-green-500', advice };
  }

  return { level: scoreLine, color: 'text-primary', advice: scoreLine };
}

export function buildAssessmentAnswersPayload(
  questions: AssessmentAnalysisQuestion[],
  answers: number[]
) {
  return questions.map((question, index) => {
    const selectedValue = answers[index];
    const selectedLabel = question.options.find((option) => option.value === selectedValue)?.label ?? String(selectedValue ?? '');

    return {
      questionId: question.id,
      questionText: question.text,
      selectedOption: selectedLabel,
      score: selectedValue ?? 0,
    };
  });
}
