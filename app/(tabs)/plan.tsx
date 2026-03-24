import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { AppHeader } from '@/components/app-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  RotateCcw,
  Lightbulb,
  Check,
  ArrowLeft
} from 'lucide-react-native';
import { cn } from '@/lib/utils';

interface PlanTask {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  done: boolean;
}

interface GeneratedPlan {
  title: string;
  focus: string;
  dailyTasks: PlanTask[];
  tips: string[];
}

const profileQuestions = [
  {
    id: "stress",
    question: "ما مستوى التوتر الذي تشعر به حالياً؟",
    options: [
      { label: "منخفض - اشعر بالراحة", value: "low" },
      { label: "متوسط - بعض الضغوط", value: "medium" },
      { label: "مرتفع - توتر مستمر", value: "high" },
      { label: "شديد - اشعر بالانهاك", value: "severe" },
    ],
  },
  {
    id: "sleep",
    question: "كيف تقيّم جودة نومك؟",
    options: [
      { label: "ممتاز - نوم عميق ومريح", value: "excellent" },
      { label: "جيد - بعض الصعوبات احياناً", value: "good" },
      { label: "ضعيف - صعوبة في النوم", value: "poor" },
      { label: "سيء جداً - ارق شبه يومي", value: "terrible" },
    ],
  },
  {
    id: "goals",
    question: "ما هدفك الرئيسي من الخطة النفسية؟",
    options: [
      { label: "تقليل القلق والتوتر", value: "anxiety" },
      { label: "تحسين المزاج ومحاربة الاكتئاب", value: "depression" },
      { label: "تعزيز الثقة بالنفس", value: "confidence" },
      { label: "تحسين العلاقات الاجتماعية", value: "social" },
    ],
  },
];

export default function PlanPage() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);

  const handleAnswer = (value: string) => {
    const question = profileQuestions[step];
    const newAnswers = { ...answers, [question.id]: value };
    setAnswers(newAnswers);

    if (step < profileQuestions.length - 1) {
      setStep(step + 1);
    } else {
      generatePlan(newAnswers);
    }
  };

  const generatePlan = (finalAnswers: Record<string, string>) => {
    // Simple logic to generate plan
    const newPlan: GeneratedPlan = {
      title: "خطتك الشخصية للتعافي",
      focus: finalAnswers.goals === 'anxiety' ? "الهدوء والاسترخاء" : 
             finalAnswers.goals === 'depression' ? "النشاط والحيوية" : "التوازن النفسي",
      dailyTasks: [
        { id: "1", title: "تمرين تنفس الصباح", description: "5 دقائق من التنفس العميق", duration: "5 د", category: "breathing", done: false },
        { id: "2", title: "تسجيل الامتنان", description: "اكتب 3 اشياء انت ممتن لها", duration: "3 د", category: "journaling", done: false },
        { id: "3", title: "المشي", description: "المشي في الهواء الطلق", duration: "20 د", category: "activity", done: false },
      ],
      tips: [
        "حاول الالتزام بالخطة يومياً",
        "لا تقسي على نفسك اذا فوتّ يوماً",
        "احتفل بالانتصارات الصغيرة"
      ]
    };
    setPlan(newPlan);
  };

  const resetPlan = () => {
    setStarted(false);
    setStep(0);
    setAnswers({});
    setPlan(null);
  };

  if (!started) {
    return (
      <View className="flex-1 bg-background">
        <AppHeader />
        <View className="flex-1 items-center justify-center p-6">
          <View className="mb-8 h-32 w-32 items-center justify-center rounded-full bg-primary/10">
            <Sparkles size={64} className="text-primary" color="#0284c7" />
          </View>
          
          <Text className="text-3xl font-bold text-center text-foreground mb-4">
            ابدأ خطتك المخصصة
          </Text>
          
          <Text className="text-center text-muted-foreground text-lg mb-12 leading-8">
            سيقوم الذكاء الاصطناعي بتحليل بياناتك وإنشاء خطة مخصصة لتحسين صحتك النفسية
          </Text>

          <Button 
            size="lg" 
            className="w-full h-14 rounded-xl"
            onPress={() => setStarted(true)}
          >
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
          {!plan ? (
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
                      <View 
                        className="h-full bg-primary rounded-full transition-all duration-500" 
                        style={{ width: `${((step + 1) / profileQuestions.length) * 100}%` }}
                      />
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
                        className="w-full p-4 rounded-xl border border-border bg-card active:bg-primary/5 transition-all"
                      >
                        <Text className="text-center font-medium text-foreground text-lg">{option.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </CardContent>
              </Card>
            </View>
          ) : (
            <View className="gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pt-4">
              <Card className="bg-primary border-none shadow-md">
                <CardContent className="p-6">
                  <View className="flex-row justify-between items-start">
                    <TouchableOpacity onPress={resetPlan} className="bg-white/20 p-2 rounded-full">
                      <RotateCcw color="white" size={20} />
                    </TouchableOpacity>
                    <View>
                      <Text className="text-2xl font-bold text-white text-right mb-1">{plan.title}</Text>
                      <Text className="text-primary-foreground/90 text-right font-medium">التركيز: {plan.focus}</Text>
                    </View>
                  </View>
                </CardContent>
              </Card>

              <View>
                <Text className="text-xl font-bold text-foreground text-right mb-3">المهام اليومية</Text>
                <View className="gap-3">
                  {plan.dailyTasks.map((task) => (
                    <View key={task.id} className="flex-row items-center gap-3 p-4 rounded-xl border border-border bg-card shadow-sm">
                      <TouchableOpacity className={cn(
                        "h-6 w-6 rounded-full border-2 items-center justify-center",
                        task.done ? "border-primary bg-primary" : "border-muted-foreground"
                      )}>
                        {task.done && <Check size={14} color="white" />}
                      </TouchableOpacity>
                      <View className="flex-1 items-end">
                        <Text className="font-bold text-foreground text-right text-base">{task.title}</Text>
                        <Text className="text-sm text-muted-foreground text-right">{task.description}</Text>
                      </View>
                      <View className="bg-secondary px-2 py-1 rounded-md">
                        <Text className="text-xs font-medium text-secondary-foreground">{task.duration}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              <View className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                <View className="flex-row items-center justify-end gap-2 mb-3">
                    <Text className="font-bold text-orange-800">نصائح للنجاح</Text>
                    <Lightbulb className="text-orange-500" size={20} color="#f97316" />
                </View>
                <View className="gap-2">
                    {plan.tips.map((tip, i) => (
                      <View key={i} className="flex-row justify-end items-center gap-2">
                        <Text className="text-right text-sm text-orange-900/80 leading-5">{tip}</Text>
                        <View className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                      </View>
                    ))}
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
