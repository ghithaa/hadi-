import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AppHeader } from '@/components/app-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, RotateCcw, Check, ArrowLeft, ArrowRight } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { useActivePlan, useGeneratePlan, useTogglePlanTask } from '@/hooks/use-plans';
import { LoadingState } from '@/components/ui/loading-state';
import { useLocalization } from '@/context/LocalizationContext';

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

  // Show active plan if exists
  if (activePlan && !started) {
    return (
      <View className="flex-1 bg-background">
        <AppHeader />
        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
          <View className="p-4 gap-6 pt-4">
            <Card className="bg-primary border-none shadow-md">
              <CardContent className="p-6">
                <View className={cn("justify-between items-start", flexDir())}>
                  <TouchableOpacity onPress={() => setStarted(true)} className="bg-white/20 p-2 rounded-full">
                    <RotateCcw color="white" size={20} />
                  </TouchableOpacity>
                  <View className={cn("flex-1", isRTL ? "ml-3" : "mr-3")}>
                    <Text className={cn("text-2xl font-bold text-white mb-1", textAlign())}>{activePlan.title}</Text>
                    <Text className={cn("text-primary-foreground/90 font-medium", textAlign())}>{activePlan.description}</Text>
                  </View>
                </View>
              </CardContent>
            </Card>

            <View>
              <Text className={cn("text-xl font-bold text-foreground mb-3", textAlign())}>{isRTL ? 'المهام اليومية' : 'Daily Tasks'}</Text>
              <View className="gap-3">
                {activePlan.tasks?.map((task) => (
                  <TouchableOpacity
                    key={task.id}
                    onPress={() => handleToggleTask(task.id, task.isCompleted)}
                    disabled={toggleTask.isPending}
                    className={cn("items-center gap-3 p-4 rounded-xl border border-border bg-card shadow-sm", flexDir())}
                  >
                    <View className={cn("h-6 w-6 rounded-full border-2 items-center justify-center", task.isCompleted ? "border-primary bg-primary" : "border-muted-foreground")}>
                      {task.isCompleted && <Check size={14} color="white" />}
                    </View>
                    <View className={cn("flex-1", alignItems('start'))}>
                      <Text className={cn("font-bold text-foreground text-base", textAlign(), task.isCompleted && "line-through opacity-60")}>{task.title}</Text>
                      <Text className={cn("text-sm text-muted-foreground", textAlign())}>{task.description}</Text>
                    </View>
                    {task.frequency && (
                      <View className="bg-secondary px-2 py-1 rounded-md">
                        <Text className="text-xs font-medium text-secondary-foreground">{task.frequency}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // No plan — show intro or questionnaire
  if (!started) {
    return (
      <View className="flex-1 bg-background">
        <AppHeader />
        <View className="flex-1 items-center justify-center p-6">
          <View className="mb-8 h-32 w-32 items-center justify-center rounded-full bg-primary/10">
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
      </View>
    );
  }

  const currentQ = profileQuestions[step];
  const progress = ((step + 1) / profileQuestions.length) * 100;

  return (
    <View className="flex-1 bg-background">
      <AppHeader />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="p-5 gap-6">
          <View className="flex-1 justify-center pt-6">
            <TouchableOpacity onPress={() => setStarted(false)} className={cn("mb-4 items-center gap-1", flexDir(), isRTL ? "self-end" : "self-start")}>
              {isRTL ? null : <ArrowLeft size={18} color="#64748b" />}
              <Text className="text-muted-foreground font-bold">{isRTL ? 'عودة' : 'Back'}</Text>
              {isRTL ? <ArrowRight size={18} color="#64748b" /> : null}
            </TouchableOpacity>

            <View className="bg-card border border-border/40 rounded-[28px] p-6 shadow-sm">
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
                  <View className="bg-primary/10 px-3 py-1 rounded-full">
                    <Text className="text-xs font-bold text-primary">{step + 1} / {profileQuestions.length}</Text>
                  </View>
                </View>
                <View className="h-2.5 w-full bg-secondary/60 rounded-full overflow-hidden">
                  <View className="h-full bg-primary rounded-full" style={{ width: `${progress}%`, alignSelf: isRTL ? 'flex-end' : 'flex-start' }} />
                </View>
              </View>

              {/* Question */}
              <View className="mb-8 rounded-[24px] bg-primary/5 border border-primary/10 p-6">
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
                    className="w-full p-4 rounded-[20px] border-2 border-border/60 bg-card items-center justify-center active:bg-primary/5 active:border-primary/30"
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
    </View>
  );
}
