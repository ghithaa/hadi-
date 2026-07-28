import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AppHeader } from '@/components/app-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, RotateCcw, Check, ArrowLeft, ArrowRight, Wind, Heart, BookOpen, Flame } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { useActivePlan, useGeneratePlan, useTogglePlanTask } from '@/hooks/use-plans';
import { LoadingState } from '@/components/ui/loading-state';
import { useLocalization } from '@/context/LocalizationContext';
import { useThemeMode } from '@/hooks/use-color-scheme';

function getTaskIcon(title: string) {
  const lower = (title || '').toLowerCase();
  if (lower.includes('تنفس') || lower.includes('breath') || lower.includes('استرخ') || lower.includes('هدوء')) {
    return <Wind size={20} color="#0f766e" />;
  }
  if (lower.includes('امتنان') || lower.includes('gratitude') || lower.includes('شكر')) {
    return <Heart size={20} color="#e11d48" />;
  }
  if (lower.includes('كتابة') || lower.includes('سجل') || lower.includes('write') || lower.includes('دفتر') || lower.includes('مفكرة')) {
    return <BookOpen size={20} color="#4f46e5" />;
  }
  if (lower.includes('مشي') || lower.includes('رياضة') || lower.includes('walk') || lower.includes('جري') || lower.includes('تمرين') || lower.includes('نشاط')) {
    return <Flame size={20} color="#d97706" />;
  }
  return <Sparkles size={20} color="#0f766e" />;
}

const profileQuestions = [
  {
    id: 'stress',
    question: 'ما مستوى التوتر الذي تشعر به حالياً؟',
    questionEn: 'What is your current stress level?',
    options: [
      { label: 'منخفض - اشعر بالراحة', labelEn: 'Low - I feel relaxed', value: 'low' },
      { label: 'متوسط - بعض الضغوط', labelEn: 'Medium - Some pressure', value: 'medium' },
      { label: 'مرتفع - توتر مستمر', labelEn: 'High - Constant stress', value: 'high' },
      { label: 'شديد - اشعر بالانهاك', labelEn: 'Severe - Feeling exhausted', value: 'severe' },
    ],
  },
  {
    id: 'sleep',
    question: 'كيف تقيّم جودة نومك؟',
    questionEn: 'How would you rate your sleep quality?',
    options: [
      { label: 'ممتاز - نوم عميق ومريح', labelEn: 'Excellent - Deep and restful', value: 'excellent' },
      { label: 'جيد - بعض الصعوبات احياناً', labelEn: 'Good - Some difficulties sometimes', value: 'good' },
      { label: 'ضعيف - صعوبة في النوم', labelEn: 'Poor - Difficulty sleeping', value: 'poor' },
      { label: 'سيء جداً - ارق شبه يومي', labelEn: 'Very bad - Almost daily insomnia', value: 'terrible' },
    ],
  },
  {
    id: 'goals',
    question: 'ما هدفك الرئيسي من الخطة النفسية؟',
    questionEn: 'What is your main goal from the mental health plan?',
    options: [
      { label: 'تقليل القلق والتوتر', labelEn: 'Reduce anxiety and stress', value: 'anxiety' },
      { label: 'تحسين المزاج ومحاربة الاكتئاب', labelEn: 'Improve mood and fight depression', value: 'depression' },
      { label: 'تعزيز الثقة بالنفس', labelEn: 'Boost self-confidence', value: 'confidence' },
      { label: 'تحسين العلاقات الاجتماعية', labelEn: 'Improve social relationships', value: 'social' },
    ],
  },
];

export default function PlanPage() {
  const { isRTL, flexDir, textAlign, alignItems } = useLocalization();
  const { colorScheme } = useThemeMode();
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const { data: activePlan, isLoading: planLoading } = useActivePlan();
  const generatePlan = useGeneratePlan();
  const toggleTask = useTogglePlanTask();

  const handleAnswer = async (value: string) => {
    const question = profileQuestions[step];
    const newAnswers = { ...answers, [question.id]: value };
    setAnswers(newAnswers);

    if (step < profileQuestions.length - 1) {
      setStep(step + 1);
    } else {
      try {
        await generatePlan.mutateAsync({ questionnaireData: newAnswers });
        setStarted(false);
        setStep(0);
        setAnswers({});
      } catch {
        // Error handled by mutation
      }
    }
  };

  const handleToggleTask = async (taskId: string, currentDone: boolean) => {
    await toggleTask.mutateAsync({ taskId, completed: !currentDone });
  };

  if (planLoading) {
    return (
      <View className="flex-1 bg-background">
        <AppHeader />
        <LoadingState />
      </View>
    );
  }

  const currentQ = profileQuestions[step];
  const progress = ((step + 1) / profileQuestions.length) * 100;

  const renderContent = () => {
    // 1. Show active plan if exists and not started questionnaire
    if (activePlan && !started) {
      return (
        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
          <View className="p-4 gap-6 pt-4">
            <View 
              className="relative bg-primary rounded-[28px] overflow-hidden p-6"
              style={{
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 4 },
              }}
            >
              <View pointerEvents="none" className="absolute -right-6 -bottom-6" style={{ opacity: 0.08 }}>
                <Sparkles size={130} color="white" />
              </View>
              <View className={cn("justify-between items-start", flexDir())}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setStarted(true)}
                  className="p-2.5 rounded-full border"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <RotateCcw color="white" size={18} />
                </TouchableOpacity>
                <View className={cn("flex-1", isRTL ? "ml-3" : "mr-3")}>
                  <Text className={cn("text-2xl font-bold text-white mb-2", textAlign())}>{activePlan.title}</Text>
                  <Text className={cn("text-white/90 font-semibold text-sm leading-6", textAlign())}>{activePlan.description}</Text>
                </View>
              </View>
            </View>

            <View>
              <Text className={cn("text-xl font-bold text-foreground mb-4", textAlign())}>{isRTL ? 'المهام اليومية' : 'Daily Tasks'}</Text>
              <View className="gap-3.5">
                {activePlan.tasks?.map((task) => (
                  <TouchableOpacity
                    key={task.id}
                    onPress={() => handleToggleTask(task.id, task.isCompleted)}
                    disabled={toggleTask.isPending}
                    activeOpacity={0.85}
                    className={cn(
                      "items-center gap-4 p-4 rounded-[22px] border bg-card",
                      flexDir()
                    )}
                    style={{
                      opacity: task.isCompleted ? 0.6 : 1,
                      backgroundColor: task.isCompleted
                        ? (colorScheme === 'dark' ? 'rgba(15, 23, 42, 0.1)' : 'rgba(241, 245, 249, 0.3)')
                        : undefined,
                      borderColor: task.isCompleted
                        ? (colorScheme === 'dark' ? '#1e293b' : '#f1f5f9')
                        : (colorScheme === 'dark' ? '#334155' : '#e2e8f0'),
                      borderLeftWidth: !isRTL ? 4 : 1,
                      borderRightWidth: isRTL ? 4 : 1,
                      borderLeftColor: !isRTL
                        ? (task.isCompleted ? (colorScheme === 'dark' ? '#475569' : '#cbd5e1') : '#0f766e')
                        : (task.isCompleted ? (colorScheme === 'dark' ? '#1e293b' : '#f1f5f9') : (colorScheme === 'dark' ? '#334155' : '#e2e8f0')),
                      borderRightColor: isRTL
                        ? (task.isCompleted ? (colorScheme === 'dark' ? '#475569' : '#cbd5e1') : '#0f766e')
                        : (task.isCompleted ? (colorScheme === 'dark' ? '#1e293b' : '#f1f5f9') : (colorScheme === 'dark' ? '#334155' : '#e2e8f0')),
                      shadowColor: '#000',
                      shadowOpacity: 0.03,
                      shadowRadius: 6,
                      shadowOffset: { width: 0, height: 2 },
                    }}
                  >
                    <View 
                      className="h-6 w-6 rounded-full border-2 items-center justify-center bg-card"
                      style={{
                        borderColor: task.isCompleted ? '#0f766e' : (colorScheme === 'dark' ? '#475569' : '#cbd5e1'),
                        backgroundColor: task.isCompleted ? '#0f766e' : undefined,
                      }}
                    >
                      {task.isCompleted && <Check size={12} strokeWidth={3.5} color="white" />}
                    </View>

                    <View className="h-10 w-10 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                      {getTaskIcon(task.title)}
                    </View>

                    <View className={cn("flex-1", alignItems('start'))}>
                      <Text 
                        className={cn("font-bold text-foreground text-base mb-1", textAlign())}
                        style={{
                          textDecorationLine: task.isCompleted ? 'line-through' : 'none',
                          opacity: task.isCompleted ? 0.6 : 1
                        }}
                      >
                        {task.title}
                      </Text>
                      <Text className={cn("text-xs text-muted-foreground leading-5 font-medium", textAlign())}>{task.description}</Text>
                    </View>

                    {task.frequency && (
                      <View 
                        className="px-2.5 py-1 rounded-full"
                        style={{
                          backgroundColor: task.isCompleted
                            ? (colorScheme === 'dark' ? '#1e293b' : '#f1f5f9')
                            : (colorScheme === 'dark' ? 'rgba(15, 118, 110, 0.2)' : 'rgba(15, 118, 110, 0.1)')
                        }}
                      >
                        <Text 
                          className="text-[9px] font-bold tracking-wide"
                          style={{
                            color: task.isCompleted
                              ? (colorScheme === 'dark' ? '#94a3b8' : '#64748b')
                              : '#0f766e'
                          }}
                        >
                          {task.frequency}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      );
    }

    // 2. Show Intro screen if not active plan and not started questionnaire
    if (!started) {
      return (
        <View className="flex-1 items-center justify-center p-6">
          <View 
            className="mb-8 h-32 w-32 items-center justify-center rounded-full"
            style={{ backgroundColor: colorScheme === 'dark' ? 'rgba(15, 118, 110, 0.2)' : 'rgba(15, 118, 110, 0.1)' }}
          >
            <Sparkles size={64} color="#0284c7" />
          </View>
          <Text className="text-3xl font-bold text-center text-foreground mb-4">{isRTL ? 'ابدأ خطتك المخصصة' : 'Start Your Custom Plan'}</Text>
          <Text className="text-center text-muted-foreground text-lg mb-12 leading-8">
            {isRTL
              ? 'سيقوم الذكاء الاصطناعي بتحليل بياناتك وإنشاء خطة مخصصة لتحسين صحتك النفسية'
              : 'AI will analyze your data and create a personalized plan to improve your mental health'}
          </Text>
          <Button size="lg" className="w-full h-14 rounded-xl" onPress={() => setStarted(true)}>
            <Text className="text-lg font-bold text-primary-foreground">{isRTL ? 'ابدأ الآن' : 'Start Now'}</Text>
          </Button>
        </View>
      );
    }

    // 3. Show Questionnaire screen
    return (
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <View className="p-5 gap-6">
          <View className="flex-1 justify-center pt-6">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setStarted(false)}
              className={cn(
                "items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-4 py-2.5 rounded-full mb-4",
                flexDir(),
                isRTL ? "self-end" : "self-start"
              )}
            >
              {isRTL ? null : <ArrowLeft size={16} color="#475569" />}
              <Text className="text-slate-700 dark:text-slate-300 font-bold text-xs">
                {isRTL ? 'عودة' : 'Back'}
              </Text>
              {isRTL ? <ArrowRight size={16} color="#475569" /> : null}
            </TouchableOpacity>

            <View 
              className="bg-card border border-slate-100 dark:border-slate-800 rounded-[28px] p-6"
              style={{
                shadowColor: '#000',
                shadowOpacity: 0.03,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 4 },
              }}
            >
              <View className="mb-6">
                <Text className={cn("text-xl font-bold text-foreground mb-1", textAlign())}>{isRTL ? 'بناء خطتك الشخصية' : 'Build Your Personal Plan'}</Text>
                <Text className={cn("text-sm text-muted-foreground", textAlign())}>{isRTL ? 'اجب على بعض الاسئلة لنصمم لك خطة تناسب احتياجاتك' : 'Answer a few questions so we can design a plan that suits your needs'}</Text>
              </View>

              {/* Progress */}
              <View className="mb-6">
                <View className={cn("items-center justify-between mb-3", flexDir())}>
                  <Text className="text-sm font-bold text-foreground">
                    {isRTL ? `السؤال ${step + 1}` : `Question ${step + 1}`}
                  </Text>
                  <View 
                    className="px-3 py-1 rounded-full"
                    style={{ backgroundColor: colorScheme === 'dark' ? 'rgba(15, 118, 110, 0.2)' : 'rgba(15, 118, 110, 0.1)' }}
                  >
                    <Text className="text-xs font-bold text-primary">{step + 1} / {profileQuestions.length}</Text>
                  </View>
                </View>
                <View className="h-2.5 w-full bg-secondary rounded-full overflow-hidden">
                  <View className="h-full bg-primary rounded-full" style={{ width: `${progress}%`, alignSelf: isRTL ? 'flex-end' : 'flex-start' }} />
                </View>
              </View>

              {/* Question */}
              <View 
                className="mb-8 rounded-[24px] border p-6"
                style={{
                  backgroundColor: colorScheme === 'dark' ? 'rgba(15, 118, 110, 0.08)' : 'rgba(15, 118, 110, 0.04)',
                  borderColor: colorScheme === 'dark' ? 'rgba(15, 118, 110, 0.2)' : 'rgba(15, 118, 110, 0.1)',
                }}
              >
                <Text className={cn("text-[18px] font-bold text-foreground leading-8 text-center")}>
                  {isRTL ? currentQ.question : currentQ.questionEn}
                </Text>
              </View>

              {/* Options */}
              <View className="gap-3">
                {currentQ.options.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => handleAnswer(option.value)}
                    disabled={generatePlan.isPending}
                    activeOpacity={0.7}
                    className="w-full p-4 rounded-[20px] border-2 bg-card items-center justify-center"
                    style={{
                      borderColor: colorScheme === 'dark' ? '#334155' : '#e2e8f0',
                    }}
                  >
                    <Text className="text-center font-bold text-foreground text-[16px]">{isRTL ? option.label : option.labelEn}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {generatePlan.isPending && (
                <View className="items-center py-4 mt-4">
                  <ActivityIndicator color="#0284c7" />
                  <Text className="text-muted-foreground mt-2 text-sm">{isRTL ? 'جاري إنشاء خطتك...' : 'Creating your plan...'}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <View className="flex-1 bg-background">
      <AppHeader />
      {renderContent()}
    </View>
  );
}
