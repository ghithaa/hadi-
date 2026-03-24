import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { AppHeader } from '@/components/app-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, ChevronRight, Briefcase, User, Heart, Users } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { useLocalization } from '@/context/LocalizationContext';

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
    id: "self-esteem",
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
    id: "social-anxiety",
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
  const { t } = useLocalization();
  const [activeAssessment, setActiveAssessment] = useState<Assessment | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<{ level: string; color: string; advice: string } | null>(null);

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
      setResult(activeAssessment.getResult(totalScore));
    }
  };

  const resetAssessment = () => {
    setActiveAssessment(null);
    setResult(null);
    setAnswers([]);
    setCurrentQuestionIndex(0);
  };

  if (activeAssessment) {
    return (
      <View className="flex-1 bg-background">
        <AppHeader />
        <ScrollView className="flex-1 px-4 pb-6">
          <Button variant="ghost" onPress={resetAssessment} className="mb-4 self-start">
            <Text className="text-primary">عودة للقائمة</Text>
          </Button>

          {result ? (
            <Card className="items-center p-6">
              <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <ClipboardList size={40} className="text-primary" color="#0284c7" />
              </View>
              <Text className="mb-2 text-2xl font-bold text-foreground">النتيجة</Text>
              <Text className={cn("mb-4 text-xl font-bold", result.color)}>
                {result.level}
              </Text>
              <Text className="mb-6 text-center text-muted-foreground">
                {result.advice}
              </Text>
              <Button onPress={resetAssessment} className="w-full">
                <Text>إنهاء</Text>
              </Button>
            </Card>
          ) : (
            <View>
              <View className="mb-6">
                <Text className="mb-2 text-sm text-muted-foreground text-right">
                  سؤال {currentQuestionIndex + 1} من {activeAssessment.questions.length}
                </Text>
                <View className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <View 
                    className="h-full bg-primary transition-all" 
                    style={{ width: `${((currentQuestionIndex + 1) / activeAssessment.questions.length) * 100}%` }} 
                  />
                </View>
              </View>

              <Card className="mb-6">
                <CardContent className="p-6">
                  <Text className="text-xl font-bold text-center text-foreground leading-relaxed">
                    {activeAssessment.questions[currentQuestionIndex]}
                  </Text>
                </CardContent>
              </Card>

              <View className="gap-3">
                {activeAssessment.options.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => handleAnswer(option.value)}
                    className="w-full rounded-xl border border-border bg-card p-4 hover:bg-accent/10 active:bg-accent/20"
                  >
                    <Text className="text-center font-medium text-foreground">
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
      <ScrollView className="flex-1 px-4 pb-6">
        <View className="mt-6 mb-6">
          <Text className="mb-2 text-xl font-bold text-foreground text-right">
            الاختبارات والمقاييس
          </Text>
          <Text className="mb-4 text-sm text-muted-foreground text-right">
            قيم حالتك النفسية بدقة باستخدام مقاييس علمية معتمدة
          </Text>

          <View className="gap-6">
            {categories.map((category) => {
              const categoryAssessments = assessments.filter(a => a.category === category.id);
              if (categoryAssessments.length === 0) return null;

              return (
                <View key={category.id} className="gap-3">
                  <View className="flex-row items-center justify-end gap-2 mb-1">
                    <Text className="text-lg font-bold text-foreground">{category.title}</Text>
                    <category.icon size={20} className="text-primary" color="#0284c7" />
                  </View>
                  
                  {categoryAssessments.map((assessment) => (
                    <Card key={assessment.id} className="overflow-hidden">
                      <TouchableOpacity onPress={() => startAssessment(assessment)}>
                        <View className={cn("h-2 w-full", assessment.color)} />
                        <CardContent className="p-5">
                          <View className="flex-row justify-between items-start mb-2">
                            <Badge variant="secondary" className="bg-secondary/50">
                              <Text className="text-xs">{assessment.badge}</Text>
                            </Badge>
                            <View className={cn("h-10 w-10 items-center justify-center rounded-xl bg-muted")}>
                              <ClipboardList size={20} className="text-muted-foreground" color="gray" />
                            </View>
                          </View>
                          <Text className="mb-1 text-lg font-bold text-foreground text-right">
                            {assessment.title}
                          </Text>
                          <Text className="text-sm text-muted-foreground text-right mb-4">
                            {assessment.description}
                          </Text>
                          <View className="flex-row items-center justify-end">
                            <Text className="text-sm font-medium text-primary ml-1">ابدأ الاختبار</Text>
                            <ChevronRight size={16} className="text-primary" color="#0284c7" />
                          </View>
                        </CardContent>
                      </TouchableOpacity>
                    </Card>
                  ))}
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
