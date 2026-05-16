import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { AppHeader } from '@/components/app-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, ChevronRight, ChevronLeft, Briefcase, User, Heart, Users } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { useLocalization } from '@/context/LocalizationContext';
import { useSubmitAssessment } from '@/hooks/use-assessments';

type AssessmentCategory = 'functional' | 'personal' | 'self' | 'social';

interface Assessment {
  id: string;
  title: string;
  description: string;
  badge: string;
  color: string;
  category: AssessmentCategory;
  questions: string[];
  options: { label: string; value: number }[];
  getResult: (score: number) => { level: string; color: string; advice: string };
}

const answerOptions = [
  { label: "أبداً", value: 0 },
  { label: "عدة أيام", value: 1 },
  { label: "أكثر من نصف الأيام", value: 2 },
  { label: "يومياً تقريباً", value: 3 },
];

const assessments: Assessment[] = [
  // Functional (Work)
  {
    id: "burnout",
    title: "مقياس الاحتراق الوظيفي",
    description: "قياس مستوى الإجهاد والاحتراق في بيئة العمل",
    badge: "بيئة العمل",
    color: "bg-blue-500",
    category: 'functional',
    questions: [
      "أشعر بالإرهاق العاطفي من عملي",
      "أشعر أني أستهلكت تماماً في نهاية يوم العمل",
      "أشعر بالتعب عندما أستيقظ في الصباح وعلي الذهاب للعمل",
    ],
    options: answerOptions,
    getResult: (score) => {
      if (score <= 3) return { level: "لا يوجد احتراق", color: "text-green-500", advice: "وضعك الوظيفي جيد." };
      return { level: "احتراق محتمل", color: "text-red-500", advice: "ينصح بأخذ قسط من الراحة ومراجعة توازن العمل والحياة." };
    },
  },

  // Personal (Anxiety, Depression)
  {
    id: "gad7",
    title: "اختبار القلق (GAD-7)",
    description: "قياس مستوى القلق العام خلال الأسبوعين الماضيين",
    badge: "معتمد عالمياً",
    color: "bg-primary",
    category: 'personal',
    questions: [
      "الشعور بالعصبية أو القلق أو التوتر",
      "عدم القدرة على إيقاف القلق أو السيطرة عليه",
      "القلق المفرط بشأن أشياء مختلفة",
      "صعوبة في الاسترخاء",
      "الشعور بعدم الاستقرار لدرجة صعوبة الجلوس",
      "سريعة الانفعال أو حدة الطبع",
      "الشعور بالخوف وكأن شيئاً فظيعاً سيحدث",
    ],
    options: answerOptions,
    getResult: (score) => {
      if (score <= 4) return { level: "قلق بسيط", color: "text-green-500", advice: "مستوى القلق لديك طبيعي. حافظ على نمط حياة صحي ومارس التأمل والاسترخاء بانتظام." };
      if (score <= 9) return { level: "قلق خفيف", color: "text-yellow-500", advice: "تعاني من قلق خفيف. قد تساعدك تمارين التنفس وتنظيم الوقت في التحسن." };
      if (score <= 14) return { level: "قلق متوسط", color: "text-orange-500", advice: "قلق متوسط. ننصحك بالتحدث مع مختص وممارسة الرياضة بانتظام." };
      return { level: "قلق شديد", color: "text-red-500", advice: "قلق شديد. يفضل زيارة طبيب مختص للحصول على المساعدة المناسبة." };
    },
  },
  {
    id: "phq9",
    title: "اختبار الاكتئاب (PHQ-9)",
    description: "تقييم شدة الاكتئاب خلال الأسبوعين الماضيين",
    badge: "معتمد عالمياً",
    color: "bg-accent",
    category: 'personal',
    questions: [
      "قله الرغبة أو المتعة في القيام بالأشياء",
      "الشعور باليأس أو الاحباط",
    ],
    options: answerOptions,
    getResult: (score) => {
       if (score <= 4) return { level: "لا يوجد اكتئاب", color: "text-green-500", advice: "حالتك النفسية مستقرة." };
       return { level: "اكتئاب محتمل", color: "text-red-500", advice: "يرجى استشارة مختص." };
    }
  },

  // Self (Narcissism, Self-Love)
  {
    id: "self_esteem",
    title: "مقياس تقدير الذات",
    description: "قيم نظرتك لنفسك ومدى تقديرك لها",
    badge: "تطوير الذات",
    color: "bg-purple-500",
    category: 'self',
    questions: [
      "أشعر أني شخص ذو قيمة مساوية للآخرين",
      "أشعر أن لدي عدد من الصفات الجيدة",
      "أستطيع القيام بالأشياء كما يقوم بها معظم الناس",
    ],
    options: answerOptions,
    getResult: (score) => {
      if (score >= 6) return { level: "تقدير ذات مرتفع", color: "text-green-500", advice: "لديك تقدير ممتاز لذاتك." };
      return { level: "تقدير ذات منخفض", color: "text-yellow-500", advice: "حاول التركيز على إنجازاتك ونقاط قوتك." };
    },
  },

  // Social (Social, Family, Marital)
  {
    id: "social_anxiety",
    title: "القلق الاجتماعي",
    description: "مدى راحتك في المواقف الاجتماعية",
    badge: "اجتماعي",
    color: "bg-green-500",
    category: 'social',
    questions: [
      "أخشى أن يلاحظ الآخرون توتري",
      "أتجنب الحديث مع الغرباء",
      "أخاف من الحكم علي من قبل الآخرين",
    ],
    options: answerOptions,
    getResult: (score) => {
      if (score <= 3) return { level: "طبيعي", color: "text-green-500", advice: "أنت اجتماعي بشكل طبيعي." };
      return { level: "قلق اجتماعي محتمل", color: "text-orange-500", advice: "قد تستفيد من تعريض نفسك تدريجياً للمواقف الاجتماعية." };
    },
  },
];

export default function AssessmentsPage() {
  const { t, isRTL, flexDir, textAlign, alignItems, alignSelf, justifyContent, l, r } = useLocalization();
  const [activeAssessment, setActiveAssessment] = useState<Assessment | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<{ level: string; color: string; advice: string } | null>(null);
  const submitAssessment = useSubmitAssessment();

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
  };

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (activeAssessment && currentQuestionIndex < activeAssessment.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (activeAssessment) {
      const totalScore = newAnswers.reduce((a, b) => a + b, 0);
      const localResult = activeAssessment.getResult(totalScore);
      setResult(localResult);
      // Also submit to backend (fire-and-forget)
      submitAssessment.mutate({
        assessmentType: activeAssessment.id,
        answers: newAnswers.map((score, questionIndex) => ({
          questionIndex,
          selectedOption: activeAssessment.options.find(o => o.value === score)?.label ?? String(score),
          score,
        })),
      });
    }
  };

  const resetAssessment = () => {
    setActiveAssessment(null);
    setResult(null);
    setAnswers([]);
    setCurrentQuestionIndex(0);
  };

  if (activeAssessment) {
    const progress = ((currentQuestionIndex + 1) / activeAssessment.questions.length) * 100;
    return (
      <View className="flex-1 bg-background">
        <AppHeader />
        <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
          <TouchableOpacity onPress={resetAssessment} className={cn("mb-4 mt-2 items-center gap-2 bg-secondary/50 px-4 py-2.5 rounded-full border border-border/40 self-start", flexDir(), isRTL ? 'self-end' : 'self-start')}>
            {isRTL ? null : <ChevronLeft size={16} color="#0f766e" />}
            <Text className="text-primary font-bold text-sm">{isRTL ? "عودة للقائمة" : "Back to List"}</Text>
            {isRTL ? <ChevronRight size={16} color="#0f766e" /> : null}
          </TouchableOpacity>

          {result ? (
            <View className="bg-card border border-border/40 rounded-[28px] p-8 items-center shadow-sm">
              <View className="mb-5 h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <ClipboardList size={40} color="#0284c7" />
              </View>
              <Text className="mb-2 text-2xl font-bold text-foreground">{isRTL ? 'النتيجة' : 'Result'}</Text>
              <Text className={cn("mb-4 text-xl font-bold", result.color)}>
                {result.level}
              </Text>
              <Text className={cn("mb-6 text-center text-muted-foreground leading-6", textAlign())}>
                {result.advice}
              </Text>
              <TouchableOpacity onPress={resetAssessment} className="w-full bg-primary py-4 rounded-2xl items-center">
                <Text className="text-white font-bold">{isRTL ? 'إنهاء' : 'Done'}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              {/* Progress */}
              <View className="mb-6">
                <View className={cn("items-center justify-between mb-3", flexDir())}>
                  <Text className="text-sm font-bold text-foreground">
                    {isRTL ? `سؤال ${currentQuestionIndex + 1} من ${activeAssessment.questions.length}` : `Question ${currentQuestionIndex + 1} of ${activeAssessment.questions.length}`}
                  </Text>
                  <View className="bg-primary/10 px-3 py-1 rounded-full">
                    <Text className="text-xs font-bold text-primary">{Math.round(progress)}%</Text>
                  </View>
                </View>
                <View className="h-2.5 w-full overflow-hidden rounded-full bg-secondary/60">
                  <View
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${progress}%`, alignSelf: isRTL ? 'flex-end' : 'flex-start' }}
                  />
                </View>
              </View>

              {/* Question */}
              <View className="mb-8 rounded-[24px] bg-primary/5 border border-primary/10 p-6">
                <Text className={cn("text-[18px] font-bold text-foreground leading-8", textAlign())}>
                  {activeAssessment.questions[currentQuestionIndex]}
                </Text>
              </View>

              {/* Answer Options — centered */}
              <View className="gap-3">
                {activeAssessment.options.map((option, idx) => (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => handleAnswer(option.value)}
                    activeOpacity={0.7}
                    className="w-full rounded-[20px] border-2 border-border/60 bg-card p-4 px-5 items-center justify-center active:bg-primary/5 active:border-primary/30"
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
          <Text className={cn("text-muted-foreground font-medium", textAlign())}>اكتشف نفسك أكثر من خلال اختباراتنا العلمية</Text>
        </View>

        {categories.map((category) => (
          <View key={category.id} className="mb-8">
            <View className={cn("items-center gap-3 mb-4 px-1", flexDir())}>
              <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
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
                  className="bg-card border border-border/40 rounded-[28px] p-5 shadow-sm shadow-black/5"
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
                  <View className={cn("items-center justify-between pt-4 border-t border-border/40", flexDir())}>
                    <View className={cn("items-center gap-2", flexDir())}>
                      <ClipboardList size={14} color="#64748b" />
                      <Text className="text-[11px] font-bold text-muted-foreground uppercase">{assessment.questions.length} أسئلة</Text>
                    </View>
                    <Text className="text-[11px] font-bold text-primary uppercase">ابدأ الآن</Text>
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
