import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { AppHeader } from '@/components/app-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, ChevronRight, ChevronLeft, Briefcase, User, Heart, Users } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { useLocalization } from '@/context/LocalizationContext';
import { useSubmitAssessment } from '@/hooks/use-assessments';
import { availableTests } from '@/constants/tests-data';
import { router } from 'expo-router';
import { chatService } from '@/services/chat.service';
import { queryClient } from '@/lib/react-query';

type AssessmentCategory = 'functional' | 'personal' | 'self' | 'social';

type Gender = 'male' | 'female';

type AssessmentResult = { level: string; color: string; advice: string };

interface Assessment {
  id: string;
  testId: string;
  title: string;
  description: string;
  badge: string;
  color: string;
  category: AssessmentCategory;
  items: { id: string; text: string; options: { label: string; value: number }[] }[];
  raw: any;
}

function formatTemplate(template: string, values: Record<string, string>) {
  if (!template) return '';
  return Object.entries(values).reduce((acc, [k, v]) => acc.replace(new RegExp(`\\{${k}\\}`, 'g'), v), template);
}

function fromTestData(language: 'ar' | 'en', testId: string, category: AssessmentCategory, color: string, badge: string): Assessment | null {
  const raw = (availableTests as any)?.[testId];
  if (!raw) return null;

  const items = (raw.questions || []).map((q: any) => ({
    id: q.id,
    text: language === 'ar' ? q.text_ar : q.text_en,
    options: (q.options || []).map((o: any) => ({
      label: language === 'ar' ? o.text_ar : o.text_en,
      value: o.value,
    })),
  }));

  return {
    id: raw.test_id,
    testId: raw.test_id,
    title: language === 'ar' ? raw.full_name_ar : raw.full_name_en,
    description: language === 'ar' ? raw.purpose_ar : raw.purpose_en,
    badge,
    color,
    category,
    items,
    raw,
  };
}

function severityToColor(severity?: string) {
  const key = (severity || '').toLowerCase();
  if (key.includes('high') || key.includes('severe') || key.includes('positive') || key.includes('probable')) return 'text-red-500';
  if (key.includes('moderate')) return 'text-orange-500';
  if (key.includes('mild') || key.includes('subthreshold') || key.includes('low')) return 'text-yellow-500';
  if (key.includes('none') || key.includes('minimal') || key.includes('negative') || key.includes('below_threshold')) return 'text-green-500';
  return 'text-primary';
}

function computeAssessmentResult(language: 'ar' | 'en', assessment: Assessment, answers: number[], gender: Gender | null): AssessmentResult {
  const raw = assessment.raw || {};
  const scoringType = raw.scoring_type as string | undefined;

  const totalScore = answers.reduce((a, b) => a + b, 0);
  const scoreLine = language === 'ar' ? `مجموع النقاط: ${totalScore}` : `Total score: ${totalScore}`;

  if (scoringType === 'sum') {
    const interpretation = (raw.interpretation || []) as any[];
    const match = interpretation.find((r) => typeof r.min === 'number' && typeof r.max === 'number' && totalScore >= r.min && totalScore <= r.max);
    const level = match ? (language === 'ar' ? match.label_ar : match.label_en) : scoreLine;
    const color = severityToColor(match?.severity);

    let advice = scoreLine;
    const criticalItems = raw.critical_items || {};
    const qIds = (raw.questions || []).map((q: any) => q.id);
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
    const special = raw.special_scoring || {};
    const thresholdValue = typeof special.threshold_value === 'number' ? special.threshold_value : 2;
    const minItems = typeof special.min_items_above_threshold === 'number' ? special.min_items_above_threshold : 4;
    const countAbove = answers.filter((v) => v >= thresholdValue).length;
    const positive = countAbove >= minItems;
    const interpretation = (raw.interpretation || []) as any[];
    const target = interpretation.find((r) => r.severity === (positive ? 'positive_screen' : 'negative_screen'));
    const level = target ? (language === 'ar' ? target.label_ar : target.label_en) : (positive ? (language === 'ar' ? 'نتيجة إيجابية' : 'Positive screen') : (language === 'ar' ? 'نتيجة سلبية' : 'Negative screen'));
    const color = positive ? 'text-orange-500' : 'text-green-500';
    const advice =
      language === 'ar'
        ? `عدد البنود فوق العتبة: ${countAbove}\n\nهذه نتيجة فحص أولي وليست تشخيصاً.`
        : `Items above threshold: ${countAbove}\n\nThis is a screening result, not a diagnosis.`;
    return { level, color, advice };
  }

  if (scoringType === 'auditc_gender') {
    const special = raw.special_scoring || {};
    const maleCutoff = typeof special.male_cutoff === 'number' ? special.male_cutoff : 4;
    const femaleCutoff = typeof special.female_cutoff === 'number' ? special.female_cutoff : 3;
    const cutoff = gender === 'female' ? femaleCutoff : maleCutoff;
    const positive = totalScore >= cutoff;
    const interpretation = (raw.interpretation || []) as any[];
    const target = interpretation.find((r) => r.severity === (positive ? 'positive_screen' : 'negative_screen'));
    const level = target ? (language === 'ar' ? target.label_ar : target.label_en) : (positive ? (language === 'ar' ? 'نتيجة إيجابية' : 'Positive screen') : (language === 'ar' ? 'نتيجة سلبية' : 'Negative screen'));
    const color = positive ? 'text-orange-500' : 'text-green-500';
    const advice = scoreLine;
    return { level, color, advice };
  }

  if (scoringType === 'cssrs_risk') {
    const questions = (raw.questions || []) as any[];
    const order: Record<string, number> = { none: 0, low: 1, moderate: 2, high: 3 };
    let maxRisk = 'none';
    questions.forEach((q, idx) => {
      const v = answers[idx] ?? 0;
      if (v > 0 && q.risk_level && order[q.risk_level] > order[maxRisk]) {
        maxRisk = q.risk_level;
      }
    });
    const interpretation = (raw.interpretation || []) as any[];
    const target = interpretation.find((r) => r.severity === maxRisk);
    const level = target ? (language === 'ar' ? target.label_ar : target.label_en) : maxRisk;
    const color = severityToColor(maxRisk);
    const crisis = language === 'ar' ? raw.crisis_message_ar : raw.crisis_message_en;
    const advice = maxRisk === 'high' || maxRisk === 'moderate' ? (crisis || '') : '';
    return { level, color, advice: advice || scoreLine };
  }

  if (scoringType === 'mdq_3part') {
    const questions = (raw.questions || []) as any[];
    const special = raw.special_scoring || {};
    const part1Threshold = typeof special.part1_threshold === 'number' ? special.part1_threshold : 7;
    const part2Required = !!special.part2_required;
    const part3MinValue = typeof special.part3_min_value === 'number' ? special.part3_min_value : 2;

    let part1Yes = 0;
    let part2Yes = false;
    let part3Value = 0;

    questions.forEach((q, idx) => {
      const v = answers[idx] ?? 0;
      if (q.part === 1 && v > 0) part1Yes += 1;
      if (q.part === 2 && v > 0) part2Yes = true;
      if (q.part === 3) part3Value = v;
    });

    const positive = part1Yes >= part1Threshold && (!part2Required || part2Yes) && part3Value >= part3MinValue;
    const interpretation = (raw.interpretation || []) as any[];
    const target = interpretation.find((r) => r.severity === (positive ? 'positive_screen' : 'negative_screen'));
    const level = target ? (language === 'ar' ? target.label_ar : target.label_en) : (positive ? (language === 'ar' ? 'نتيجة إيجابية' : 'Positive screen') : (language === 'ar' ? 'نتيجة سلبية' : 'Negative screen'));
    const color = positive ? 'text-orange-500' : 'text-green-500';
    const advice =
      language === 'ar'
        ? `بنود الجزء الأول (نعم): ${part1Yes}\n\nهذه نتيجة فحص أولي وليست تشخيصاً.`
        : `Part 1 “Yes” count: ${part1Yes}\n\nThis is a screening result, not a diagnosis.`;
    return { level, color, advice };
  }

  return { level: scoreLine, color: 'text-primary', advice: scoreLine };
}

export default function AssessmentsPage() {
  const { t, language, isRTL, flexDir, textAlign, alignItems, alignSelf, justifyContent, l, r } = useLocalization();
  const [activeAssessment, setActiveAssessment] = useState<Assessment | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<{ level: string; color: string; advice: string } | null>(null);
  const [completed, setCompleted] = useState<{
    assessment: Assessment;
    answers: number[];
    result: { level: string; color: string; advice: string };
  } | null>(null);
  const [showPreliminary, setShowPreliminary] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [gender, setGender] = useState<Gender | null>(null);
  const submitAssessment = useSubmitAssessment();

  const assessments: Assessment[] = useMemo(() => {
    const validatedBadge = t('assessments.badge.validated');
    const safetyBadge = t('assessments.badge.safety');

    const configs: { testId: string; category: AssessmentCategory; color: string; badge: string }[] = [
      { testId: 'GAD7', category: 'personal', color: 'bg-primary', badge: validatedBadge },
      { testId: 'PHQ9', category: 'personal', color: 'bg-accent', badge: validatedBadge },
      { testId: 'ASRS', category: 'personal', color: 'bg-sky-500', badge: validatedBadge },
      { testId: 'MDQ', category: 'personal', color: 'bg-emerald-500', badge: validatedBadge },
      { testId: 'PCL5', category: 'personal', color: 'bg-rose-500', badge: validatedBadge },
      { testId: 'PCPTSD5', category: 'personal', color: 'bg-teal-500', badge: validatedBadge },
      { testId: 'PQB', category: 'personal', color: 'bg-violet-500', badge: validatedBadge },
      { testId: 'SCOFF', category: 'self', color: 'bg-orange-500', badge: validatedBadge },
      { testId: 'ISI', category: 'self', color: 'bg-indigo-500', badge: validatedBadge },
      { testId: 'AUDITC', category: 'self', color: 'bg-amber-500', badge: validatedBadge },
      { testId: 'CSSRS_SCREENER', category: 'personal', color: 'bg-red-500', badge: safetyBadge },
    ];

    return configs.map((c) => fromTestData(language, c.testId, c.category, c.color, c.badge)).filter(Boolean) as Assessment[];
  }, [language, t]);

  const categories: { id: AssessmentCategory; title: string; icon: any }[] = [
    { id: 'functional', title: t('assessments.category.functional'), icon: Briefcase },
    { id: 'personal', title: t('assessments.category.personal'), icon: User },
    { id: 'self', title: t('assessments.category.self'), icon: Heart },
    { id: 'social', title: t('assessments.category.social'), icon: Users },
  ];

  const startAssessment = (assessment: Assessment) => {
    setActiveAssessment(assessment);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setResult(null);
    setCompleted(null);
    setShowPreliminary(false);
    setIsAnalyzing(false);
    setGender(null);
  };

  const handleAnalyze = async () => {
    if (!completed || isAnalyzing) return;

    try {
      setIsAnalyzing(true);

      const { assessment, answers: completedAnswers, result: completedResult } = completed;

      const totalScore = completedAnswers.reduce((a, b) => a + b, 0);
      const answersPayload = assessment.items.map((item, index) => {
        const selectedValue = completedAnswers[index];
        const selectedLabel = item.options.find((o) => o.value === selectedValue)?.label ?? String(selectedValue ?? '');
        return {
          questionId: item.id,
          questionText: item.text,
          selectedOption: selectedLabel,
          score: selectedValue ?? 0,
        };
      });

      const sessionTitle =
        language === 'ar'
          ? `تحليل: ${assessment.title}`
          : `Analysis: ${assessment.title}`;

      const session = await chatService.createSession({ title: sessionTitle });
      queryClient.invalidateQueries({ queryKey: ['chat', 'sessions'] });

      try {
        await chatService.submitTestResult(session.id, {
          testId: assessment.testId,
          title: assessment.title,
          description: assessment.description,
          scoringType: assessment.raw?.scoring_type,
          totalScore,
          result: completedResult,
          answers: answersPayload,
        });
      } catch (e) {
        console.warn('Failed to submit detailed test results to chat context, falling back to prompt only', e);
      }

      const prompt =
        language === 'ar'
          ? `لقد أنهيت اختبار ${assessment.title}. أرجو تحليل النتائج وإعطائي شرحاً واضحاً وخطوات عملية مناسبة.\n\nالنتيجة الأولية: ${completedResult.level}\nمجموع النقاط: ${totalScore}`
          : `I finished the ${assessment.title} assessment. Please analyze the results and give me a clear explanation with practical next steps.\n\nPreliminary result: ${completedResult.level}\nTotal score: ${totalScore}`;

      router.push({ pathname: '/(tabs)/chat', params: { sessionId: session.id, autoMessage: prompt } } as any);
    } catch (error) {
      console.error('handleAnalyze failed:', error);
      const message = error ? (String((error as any).message || '') || String(error)) : '';
      const needsRelogin =
        message.includes('No refresh token available') ||
        message.includes('Demo session is no longer supported') ||
        message.includes('Authentication failed') ||
        message.includes('401') ||
        message.includes('No refresh token');

      Alert.alert(
        language === 'ar' ? 'خطأ' : 'Error',
        needsRelogin
          ? (language === 'ar'
              ? 'انتهت الجلسة الحالية أو كانت جلسة تجريبية قديمة. يرجى تسجيل الدخول مرة أخرى بحساب حقيقي ثم إعادة إرسال التحليل.'
              : 'Your current session has expired or is an old demo session. Please sign in again with a real account and retry the analysis.')
          : (language === 'ar'
              ? 'فشل إرسال نتائج الاختبار للتحليل.'
              : 'Failed to send the test results for analysis.')
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnswer = (value: number) => {
    if (!activeAssessment) return;

    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    const totalQuestions = Array.isArray(activeAssessment.items) ? activeAssessment.items.length : 0;
    const isLastQuestion = totalQuestions === 0 || currentQuestionIndex >= totalQuestions - 1;

    if (!isLastQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1);
      return;
    }

    const localResult = computeAssessmentResult(language, activeAssessment, newAnswers, gender);
    setResult(localResult);
    setCompleted({ assessment: activeAssessment, answers: newAnswers, result: localResult });
    setShowPreliminary(false);

    submitAssessment.mutate({
      assessmentType: activeAssessment.testId,
      answers: newAnswers.map((score, questionIndex) => ({
        questionIndex,
        selectedOption: activeAssessment.items?.[questionIndex]?.options?.find((o) => o.value === score)?.label ?? String(score),
        score,
      })),
    });
  };

  const resetAssessment = () => {
    setActiveAssessment(null);
    setResult(null);
    setCompleted(null);
    setShowPreliminary(false);
    setIsAnalyzing(false);
    setAnswers([]);
    setCurrentQuestionIndex(0);
    setGender(null);
  };

  if (activeAssessment) {
    const needsGender = activeAssessment.raw?.scoring_type === 'auditc_gender';
    const genderPrompt = (language === 'ar' ? activeAssessment.raw?.gender_prompt_ar : activeAssessment.raw?.gender_prompt_en) as string | undefined;

    if (needsGender && !gender) {
      return (
        <View className="flex-1 bg-background">
          <AppHeader />
          <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
            <TouchableOpacity onPress={resetAssessment} className={cn("mb-4 mt-2 items-center gap-2 bg-secondary-50 px-4 py-2.5 rounded-full border border-border-40 self-start", flexDir(), isRTL ? 'self-end' : 'self-start')}>
              {isRTL ? null : <ChevronLeft size={16} color="#0f766e" />}
              <Text className="text-primary font-bold text-sm">{t('assessments.backToList')}</Text>
              {isRTL ? <ChevronRight size={16} color="#0f766e" /> : null}
            </TouchableOpacity>

            <View className="bg-card border border-border-40 rounded-[28px] p-8 items-center" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 }}>
              <Text className={cn("mb-6 text-[16px] font-bold text-foreground leading-7", textAlign())}>
                {genderPrompt || (language === 'ar' ? 'يرجى تحديد الجنس' : 'Please select gender')}
              </Text>
              <View className="w-full gap-3">
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setGender('male')}
                  className="w-full rounded-[20px] border-2 border-border-60 bg-card p-4 px-5 items-center justify-center active:bg-primary-5 active:border-primary-30"
                >
                  <Text className="text-center font-bold text-foreground text-[16px]">{t('assessments.gender.male')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setGender('female')}
                  className="w-full rounded-[20px] border-2 border-border-60 bg-card p-4 px-5 items-center justify-center active:bg-primary-5 active:border-primary-30"
                >
                  <Text className="text-center font-bold text-foreground text-[16px]">{t('assessments.gender.female')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      );
    }

    const questionCount = Array.isArray(activeAssessment.items) ? activeAssessment.items.length : 0;
    const safeIndex = questionCount > 0 ? Math.min(currentQuestionIndex, questionCount - 1) : 0;
    const currentItem = questionCount > 0 ? activeAssessment.items[safeIndex] : null;
    const progress = questionCount > 0 ? ((safeIndex + 1) / questionCount) * 100 : 0;
    return (
      <View className="flex-1 bg-background">
        <AppHeader />
        <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
          <TouchableOpacity onPress={resetAssessment} className={cn("mb-4 mt-2 items-center gap-2 bg-secondary-50 px-4 py-2.5 rounded-full border border-border-40 self-start", flexDir(), isRTL ? 'self-end' : 'self-start')}>
            {isRTL ? null : <ChevronLeft size={16} color="#0f766e" />}
            <Text className="text-primary font-bold text-sm">{t('assessments.backToList')}</Text>
            {isRTL ? <ChevronRight size={16} color="#0f766e" /> : null}
          </TouchableOpacity>

          {completed && !showPreliminary ? (
            <View className="bg-card border border-border-40 rounded-[28px] p-8 items-center" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 }}>
              <View className="mb-5 h-20 w-20 items-center justify-center rounded-full bg-primary-10">
                <ClipboardList size={40} color="#0284c7" />
              </View>
              <Text className={cn("mb-2 text-2xl font-bold text-foreground", textAlign())}>{t('assessments.finish.title')}</Text>
              <Text className={cn("mb-6 text-center text-muted-foreground leading-6", textAlign())}>{t('assessments.finish.subtitle')}</Text>

              <View className="w-full gap-3">
                <TouchableOpacity
                  onPress={() => setShowPreliminary(true)}
                  className="w-full bg-primary py-4 rounded-2xl items-center"
                >
                  <Text className="text-white font-bold">{t('assessments.finish.preliminary')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleAnalyze}
                  disabled={isAnalyzing}
                  className={cn("w-full py-4 rounded-2xl items-center border border-border-60 bg-card", isAnalyzing ? "opacity-70" : "")}
                >
                  {isAnalyzing ? (
                    <View className={cn("items-center gap-3", flexDir())}>
                      <ActivityIndicator />
                      <Text className="text-foreground font-bold">{t('assessments.finish.analyzing')}</Text>
                    </View>
                  ) : (
                    <Text className="text-foreground font-bold">{t('assessments.finish.analyze')}</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ) : result ? (
            <View className="bg-card border border-border-40 rounded-[28px] p-8 items-center" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 }}>
              <View className="mb-5 h-20 w-20 items-center justify-center rounded-full bg-primary-10">
                <ClipboardList size={40} color="#0284c7" />
              </View>
              <Text className="mb-2 text-2xl font-bold text-foreground">{t('assessments.resultTitle')}</Text>
              <Text className={cn("mb-4 text-xl font-bold", result.color)}>
                {result.level}
              </Text>
              <Text className={cn("mb-6 text-center text-muted-foreground leading-6", textAlign())}>
                {result.advice}
              </Text>
              <View className="w-full gap-3">
                <TouchableOpacity
                  onPress={handleAnalyze}
                  disabled={isAnalyzing || !completed}
                  className={cn("w-full bg-primary py-4 rounded-2xl items-center", isAnalyzing ? "opacity-70" : "")}
                >
                  {isAnalyzing ? (
                    <View className={cn("items-center gap-3", flexDir())}>
                      <ActivityIndicator color="white" />
                      <Text className="text-white font-bold">{t('assessments.finish.analyzing')}</Text>
                    </View>
                  ) : (
                    <Text className="text-white font-bold">{t('assessments.finish.analyze')}</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity onPress={resetAssessment} className="w-full bg-card py-4 rounded-2xl items-center border border-border-60">
                  <Text className="text-foreground font-bold">{t('assessments.done')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View>
              {/* Progress */}
              <View className="mb-6">
                <View className={cn("items-center justify-between mb-3", flexDir())}>
                  <Text className="text-sm font-bold text-foreground">
                    {formatTemplate(t('assessments.questionOf'), { current: String(safeIndex + 1), total: String(questionCount) })}
                  </Text>
                  <View className="bg-primary-10 px-3 py-1 rounded-full">
                    <Text className="text-xs font-bold text-primary">{Math.round(progress)}%</Text>
                  </View>
                </View>
                <View className="h-2.5 w-full overflow-hidden rounded-full bg-secondary-60">
                  <View
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${progress}%`, alignSelf: isRTL ? 'flex-end' : 'flex-start' }}
                  />
                </View>
              </View>

              {/* Question */}
              <View className="mb-8 rounded-[24px] bg-primary-5 border border-primary-10 p-6">
                <Text className={cn("text-[18px] font-bold text-foreground leading-8", textAlign())}>
                  {currentItem?.text}
                </Text>
              </View>

              {/* Answer Options — centered */}
              <View className="gap-3">
                {(currentItem?.options || []).map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => handleAnswer(option.value)}
                    activeOpacity={0.7}
                    className="w-full rounded-[20px] border-2 border-border-60 bg-card p-4 px-5 items-center justify-center active:bg-primary-5 active:border-primary-30"
                  >
                    <Text className="text-center font-bold text-foreground text-[16px]">
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <AppHeader />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 20 }} showsVerticalScrollIndicator={false}>
        <View className={cn("mt-6 mb-8", alignItems('start'))}>
          <Text className={cn("text-3xl font-bold text-foreground mb-1", textAlign())}>{t('tabs.assessments')}</Text>
          <Text className={cn("text-muted-foreground font-medium", textAlign())}>{t('assessments.subtitle')}</Text>
        </View>

        {categories.filter((category) => assessments.some((a) => a.category === category.id)).map((category) => (
          <View key={category.id} className="mb-8">
            <View className={cn("items-center gap-3 mb-4 px-1", flexDir())}>
              <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary-10">
                <category.icon size={22} color="#0f766e" />
              </View>
              <Text className="text-xl font-bold text-foreground">{category.title}</Text>
            </View>

            <View className="gap-4">
              {assessments.filter(a => a.category === category.id).map((assessment) => (
                <TouchableOpacity
                  key={assessment.id}
                  onPress={() => startAssessment(assessment)}
                  activeOpacity={0.7}
                  className="bg-card border border-border-40 rounded-[28px] p-5"
                  style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}
                >
                  <View className={cn("items-start justify-between mb-4", flexDir())}>
                    <View className={cn("flex-1", alignItems('start'))}>
                      <Badge className={cn("mb-2", assessment.color)}>{assessment.badge}</Badge>
                      <Text className={cn("text-lg font-bold text-foreground mb-1", textAlign())}>{assessment.title}</Text>
                      <Text className={cn("text-xs text-muted-foreground font-medium", textAlign())}>{assessment.description}</Text>
                    </View>
                    <View className="h-10 w-10 items-center justify-center rounded-full bg-secondary">
                      {isRTL ? <ChevronLeft size={20} color="#64748b" /> : <ChevronRight size={20} color="#64748b" />}
                    </View>
                  </View>
                  <View className={cn("items-center justify-between pt-4 border-t border-border-40", flexDir())}>
                    <View className={cn("items-center gap-2", flexDir())}>
                      <ClipboardList size={14} color="#64748b" />
                      <Text className="text-[11px] font-bold text-muted-foreground uppercase">
                        {formatTemplate(t('assessments.questionsCount'), { count: String(assessment.items.length) })}
                      </Text>
                    </View>
                    <Text className="text-[11px] font-bold text-primary uppercase">{t('assessments.startNow')}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
