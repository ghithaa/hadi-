import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AppHeader } from '@/components/app-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, RotateCcw, Lightbulb, Check, ArrowLeft } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { useActivePlan, useGeneratePlan, useTogglePlanTask } from '@/hooks/use-plans';
import { LoadingState } from '@/components/ui/loading-state';

const profileQuestions = [
  {
    id: 'stress',
    question: 'ما مستوى التوتر الذي تشعر به حالياً؟',
    options: [
      { label: 'منخفض - اشعر بالراحة', value: 'low' },
      { label: 'متوسط - بعض الضغوط', value: 'medium' },
      { label: 'مرتفع - توتر مستمر', value: 'high' },
      { label: 'شديد - اشعر بالانهاك', value: 'severe' },
    ],
  },
  {
    id: 'sleep',
    question: 'كيف تقيّم جودة نومك؟',
    options: [
      { label: 'ممتاز - نوم عميق ومريح', value: 'excellent' },
      { label: 'جيد - بعض الصعوبات احياناً', value: 'good' },
      { label: 'ضعيف - صعوبة في النوم', value: 'poor' },
      { label: 'سيء جداً - ارق شبه يومي', value: 'terrible' },
    ],
  },
  {
    id: 'goals',
    question: 'ما هدفك الرئيسي من الخطة النفسية؟',
    options: [
      { label: 'تقليل القلق والتوتر', value: 'anxiety' },
      { label: 'تحسين المزاج ومحاربة الاكتئاب', value: 'depression' },
      { label: 'تعزيز الثقة بالنفس', value: 'confidence' },
      { label: 'تحسين العلاقات الاجتماعية', value: 'social' },
    ],
  },
];

export default function PlanPage() {
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
                <View className="flex-row justify-between items-start">
                  <TouchableOpacity onPress={() => setStarted(true)} className="bg-white/20 p-2 rounded-full">
                    <RotateCcw color="white" size={20} />
                  </TouchableOpacity>
                  <View className="flex-1 ml-3">
                    <Text className="text-2xl font-bold text-white text-right mb-1">{activePlan.title}</Text>
                    <Text className="text-primary-foreground/90 text-right font-medium">{activePlan.description}</Text>
                  </View>
                </View>
              </CardContent>
            </Card>

            <View>
              <Text className="text-xl font-bold text-foreground text-right mb-3">المهام اليومية</Text>
              <View className="gap-3">
                {activePlan.tasks?.map((task) => (
                  <TouchableOpacity
                    key={task.id}
                    onPress={() => handleToggleTask(task.id, task.isCompleted)}
                    disabled={toggleTask.isPending}
                    className="flex-row items-center gap-3 p-4 rounded-xl border border-border bg-card shadow-sm"
                  >
                    <View className={cn("h-6 w-6 rounded-full border-2 items-center justify-center", task.isCompleted ? "border-primary bg-primary" : "border-muted-foreground")}>
                      {task.isCompleted && <Check size={14} color="white" />}
                    </View>
                    <View className="flex-1 items-end">
                      <Text className={cn("font-bold text-foreground text-right text-base", task.isCompleted && "line-through opacity-60")}>{task.title}</Text>
                      <Text className="text-sm text-muted-foreground text-right">{task.description}</Text>
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
          <Text className="text-3xl font-bold text-center text-foreground mb-4">ابدأ خطتك المخصصة</Text>
          <Text className="text-center text-muted-foreground text-lg mb-12 leading-8">
            سيقوم الذكاء الاصطناعي بتحليل بياناتك وإنشاء خطة مخصصة لتحسين صحتك النفسية
          </Text>
          <Button size="lg" className="w-full h-14 rounded-xl" onPress={() => setStarted(true)}>
            <Text className="text-lg font-bold text-primary-foreground">ابدأ الآن</Text>
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <AppHeader />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="p-4 gap-6">
          <View className="flex-1 justify-center pt-10">
            <TouchableOpacity onPress={() => setStarted(false)} className="mb-4 flex-row items-center justify-end">
              <Text className="text-muted-foreground mr-1">عودة</Text>
              <ArrowLeft size={20} className="text-muted-foreground" />
            </TouchableOpacity>

            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-right">بناء خطتك الشخصية</CardTitle>
                <CardDescription className="text-right">اجب على بعض الاسئلة لنصمم لك خطة تناسب احتياجاتك</CardDescription>
              </CardHeader>
              <CardContent className="gap-6">
                <View className="gap-2">
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-xs text-muted-foreground">{step + 1} من {profileQuestions.length}</Text>
                    <Text className="text-sm font-bold text-primary">السؤال {step + 1}</Text>
                  </View>
                  <View className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <View className="h-full bg-primary rounded-full" style={{ width: `${((step + 1) / profileQuestions.length) * 100}%` }} />
                  </View>
                </View>

                <Text className="text-xl font-bold text-center py-6 text-foreground">
                  {profileQuestions[step].question}
                </Text>

                <View className="gap-3">
                  {profileQuestions[step].options.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      onPress={() => handleAnswer(option.value)}
                      disabled={generatePlan.isPending}
                      className="w-full p-4 rounded-xl border border-border bg-card active:bg-primary/5"
                    >
                      <Text className="text-center font-medium text-foreground text-lg">{option.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {generatePlan.isPending && (
                  <View className="items-center py-4">
                    <ActivityIndicator color="#0284c7" />
                    <Text className="text-muted-foreground mt-2 text-sm">جاري إنشاء خطتك...</Text>
                  </View>
                )}
              </CardContent>
            </Card>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
