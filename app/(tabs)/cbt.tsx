import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { AppHeader } from '@/components/app-header';
import { Brain, ChevronLeft, ChevronRight, Target, RefreshCw, PenLine, ArrowRight, ArrowLeft, AlertCircle, Lightbulb } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { useLocalization } from '@/context/LocalizationContext';

interface CBTExercise {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  icon: any;
  color: string;
  type: "thought-record" | "distortions" | "behavioral" | "reframing";
}

const exercises: CBTExercise[] = [
  {
    id: "thought-record",
    title: "سجل الافكار",
    titleEn: "Thought Record",
    description: "حدد وحلل افكارك التلقائية السلبية واستبدلها بافكار واقعية",
    descriptionEn: "Identify and analyze negative automatic thoughts and replace them with realistic ones",
    icon: PenLine,
    color: "bg-primary",
    type: "thought-record",
  },
  {
    id: "distortions",
    title: "التشوهات المعرفية",
    titleEn: "Cognitive Distortions",
    description: "تعرّف على انماط التفكير المشوّه وتعلّم كيف تتعرف عليها",
    descriptionEn: "Learn about distorted thinking patterns and how to recognize them",
    icon: Brain,
    color: "bg-accent",
    type: "distortions",
  },
  {
    id: "behavioral",
    title: "التنشيط السلوكي",
    titleEn: "Behavioral Activation",
    description: "خطط لانشطة ممتعة لتحسين مزاجك وكسر دائرة الاكتئاب",
    descriptionEn: "Plan enjoyable activities to improve your mood and break the cycle of depression",
    icon: Target,
    color: "bg-[hsl(35,90%,55%)]",
    type: "behavioral",
  },
  {
    id: "reframing",
    title: "اعادة الصياغة",
    titleEn: "Reframing",
    description: "تدرّب على رؤية المواقف من زوايا مختلفة وايجابية",
    descriptionEn: "Practice seeing situations from different, positive perspectives",
    icon: RefreshCw,
    color: "bg-[hsl(280,50%,55%)]",
    type: "reframing",
  },
];

const cognitiveDistortions = [
  {
    name: "التفكير الكارثي",
    nameEn: "Catastrophizing",
    description: "توقع اسوأ النتائج دائماً",
    descriptionEn: "Always expecting the worst outcomes",
    example: "لو رسبت في هذا الاختبار، حياتي كلها ستنتهي",
    exampleEn: "If I fail this test, my entire life will be over",
    fix: "ما هو اسوأ سيناريو واقعي؟ وما احتمال حدوثه فعلاً؟",
    fixEn: "What is the worst realistic scenario? And what is the actual probability?",
  },
  {
    name: "التعميم المفرط",
    nameEn: "Overgeneralization",
    description: "تعميم تجربة سلبية واحدة على كل شيء",
    descriptionEn: "Generalizing one negative experience to everything",
    example: "فشلت مرة واحدة، اذاً انا فاشل دائماً",
    exampleEn: "I failed once, so I'm always a failure",
    fix: "هل هذا حدث مرة واحدة ام نمط حقيقي؟ ما الادلة المخالفة؟",
    fixEn: "Did this happen once or is it a real pattern? What evidence contradicts it?",
  },
  {
    name: "قراءة الافكار",
    nameEn: "Mind Reading",
    description: "افتراض معرفة ما يفكر به الاخرون بدون دليل",
    descriptionEn: "Assuming you know what others are thinking without evidence",
    example: "اكيد زملائي يعتقدون اني غبي",
    exampleEn: "My colleagues definitely think I'm stupid",
    fix: "هل سألتهم مباشرة؟ ما الادلة الحقيقية على ذلك؟",
    fixEn: "Did you ask them directly? What real evidence is there?",
  },
];

export default function CBTPage() {
  const { isRTL, flexDir, textAlign, alignItems } = useLocalization();
  const [activeExercise, setActiveExercise] = useState<CBTExercise | null>(null);

  return (
    <View className="flex-1 bg-[#FDFDFD]">
      <View className="bg-white pb-2">
        <AppHeader />
      </View>

      {/* Organic Background Blobs */}
      <View className="absolute inset-0 overflow-hidden opacity-[0.05]">
        <View
          className="absolute -top-20 -left-20 h-[400px] w-[400px] rounded-full bg-primary/20"
          style={{ transform: [{ scaleX: 1.5 }, { rotate: '45deg' }] }}
        />
        <View
          className="absolute top-1/4 -right-40 h-[350px] w-[350px] rounded-full bg-orange-200/50"
          style={{ transform: [{ scaleX: 1.2 }] }}
        />
        <View
          className="absolute -bottom-20 left-0 h-[300px] w-[300px] rounded-full bg-blue-200/50"
        />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 py-6">
          {!activeExercise ? (
            <>
              {/* Hero Introduction Section */}
              <View
                className="bg-white border border-slate-100 rounded-[35px] p-6 mb-8 shadow-2xl overflow-hidden"
                style={{ shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 30, shadowOffset: { width: 0, height: 12 } }}
              >
                {/* Background Glass Accent */}
                <View className="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-primary/5" />

                <View className={cn("items-center justify-start mb-6", flexDir())}>
                  <View
                    className="h-14 w-14 items-center justify-center rounded-2xl bg-primary/10"
                    style={{ shadowColor: '#3b82f6', shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }}
                  >
                    <Brain color="#3b82f6" size={28} />
                  </View>
                  <View className={cn(alignItems('start'), isRTL ? "mr-4" : "ml-4")}>
                    <Text className={cn("text-2xl font-bold text-slate-900", textAlign())}>{isRTL ? 'العلاج المعرفي السلوكي' : 'Cognitive Behavioral Therapy'}</Text>
                    <Text className={cn("text-sm text-slate-500 mt-0.5 font-medium", textAlign())}>{isRTL ? 'أدوات عملية لتحسين نمط تفكيرك' : 'Practical tools to improve your thinking patterns'}</Text>
                  </View>
                </View>

                <View className="w-full h-52 mb-6 rounded-[28px] overflow-hidden bg-slate-100/50 border border-white items-center justify-center">
                  <Brain color="#cbd5e1" size={48} />
                  <Text className="text-slate-400 text-xs font-bold mt-2">{isRTL ? 'فيديو تعريفي' : 'Intro Video'}</Text>
                </View>

                <Text className={cn("text-sm text-slate-600 leading-6 font-medium bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50", textAlign())}>
                  {isRTL
                    ? 'يساعدك العلاج المعرفي السلوكي (CBT) على فهم العلاقة بين افكارك ومشاعرك وسلوكياتك، وتغيير الانماط السلبية.'
                    : 'Cognitive Behavioral Therapy (CBT) helps you understand the relationship between your thoughts, feelings, and behaviors, and change negative patterns.'}
                </Text>
              </View>

              <View className={cn("items-center justify-between mb-6 px-1", flexDir())}>
                <Text className="text-xl font-bold text-slate-800">{isRTL ? 'التمارين المتاحة' : 'Available Exercises'}</Text>
              </View>

              <View>
                {exercises.map((exercise, index) => {
                  const Icon = exercise.icon;
                  const shadowColor = exercise.id === 'thought-record' ? '#3B82F6' :
                    exercise.id === 'distortions' ? '#10B981' :
                      exercise.id === 'behavioral' ? '#F59E0B' :
                        '#8B5CF6';

                  return (
                    <TouchableOpacity
                      key={exercise.id}
                      onPress={() => setActiveExercise(exercise)}
                      activeOpacity={0.9}
                      className={cn(
                        "w-full rounded-[30px] border border-slate-100 overflow-hidden shadow-2xl bg-white",
                        index > 0 && "mt-5"
                      )}
                      style={{ shadowColor: shadowColor, shadowOpacity: 0.1, shadowRadius: 20, shadowOffset: { width: 0, height: 8 } }}
                    >
                      {/* Side Highlight */}
                      <View
                        className={cn("absolute top-0 bottom-0 w-2", exercise.color, isRTL ? "right-0" : "left-0")}
                      />

                      <View className={cn("p-5 items-center justify-between", flexDir())}>
                        {/* Icon Container */}
                        <View
                          className={cn("h-14 w-14 items-center justify-center rounded-[20px]", exercise.color)}
                          style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }}
                        >
                          <Icon color="white" size={26} />
                        </View>

                        {/* Content */}
                        <View className={cn("flex-1", alignItems('start'), isRTL ? "mr-4" : "ml-4")}>
                          <Text className={cn("text-lg font-bold text-slate-900 mb-1", textAlign())}>
                            {isRTL ? exercise.title : exercise.titleEn}
                          </Text>
                          <Text className={cn("text-xs text-slate-500 leading-5 font-medium opacity-80", textAlign())}>
                            {isRTL ? exercise.description : exercise.descriptionEn}
                          </Text>
                        </View>

                        {/* Indicator */}
                        <View
                          className="h-10 w-10 items-center justify-center rounded-2xl bg-slate-50/80 border border-slate-100"
                          style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } }}
                        >
                          {isRTL ? <ChevronLeft color="#94a3b8" size={18} /> : <ChevronRight color="#94a3b8" size={18} />}
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          ) : (
            <View className="gap-6">
              <TouchableOpacity
                activeOpacity={0.7}
                className={cn("self-end items-center gap-2 bg-white/80 px-4 py-2.5 rounded-2xl border border-slate-100", flexDir(),
                  isRTL ? "self-end" : "self-start"
                )}
                style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } }}
                onPress={() => setActiveExercise(null)}
              >
                <Text className="text-slate-600 font-bold text-sm">{isRTL ? 'العودة للتمارين' : 'Back to Exercises'}</Text>
                {isRTL ? <ArrowRight size={18} color="#64748B" /> : <ArrowLeft size={18} color="#64748B" />}
              </TouchableOpacity>

              <View
                className="bg-white border border-slate-100 rounded-[35px] p-6 overflow-hidden"
                style={{
                  shadowColor: activeExercise.id === 'thought-record' ? '#3B82F6' : '#10B981',
                  shadowOpacity: 0.1,
                  shadowRadius: 30,
                  shadowOffset: { width: 0, height: 12 }
                }}
              >
                {/* Header Decoration */}
                <View className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-slate-50/50" />

                <View className={cn("items-center justify-between mb-6", flexDir())}>
                  <View className={cn("items-center gap-3", flexDir())}>
                    <View
                      className={cn("h-12 w-12 items-center justify-center rounded-2xl", activeExercise.color)}
                      style={{ shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }}
                    >
                      <activeExercise.icon color="white" size={24} />
                    </View>
                    <View className={alignItems('start')}>
                      <Text className={cn("text-xl font-bold text-slate-900", textAlign())}>{isRTL ? activeExercise.title : activeExercise.titleEn}</Text>
                      <Text className={cn("text-xs text-slate-500 mt-0.5 font-medium", textAlign())}>{isRTL ? activeExercise.description : activeExercise.descriptionEn}</Text>
                    </View>
                  </View>
                </View>

                <View className="pt-2 border-t border-slate-100/50">
                  {activeExercise.type === 'thought-record' && (
                    <View className="gap-5">
                      <View className="gap-2">
                        <Text className={cn("font-bold text-slate-800 text-sm", textAlign())}>{isRTL ? 'الموقف' : 'Situation'}</Text>
                        <TextInput
                          className={cn("min-h-[100px] w-full rounded-2xl border border-slate-100 bg-white px-4 py-3 text-sm text-slate-700 font-medium shadow-inner", textAlign())}
                          placeholder={isRTL ? "ماذا حدث؟ اين كنت؟ ومع من؟" : "What happened? Where were you? And with whom?"}
                          placeholderTextColor="#94a3b8"
                          multiline
                          textAlignVertical="top"
                        />
                      </View>
                      <View className="gap-2">
                        <Text className={cn("font-bold text-slate-800 text-sm", textAlign())}>{isRTL ? 'الافكار التلقائية' : 'Automatic Thoughts'}</Text>
                        <TextInput
                          className={cn("min-h-[100px] w-full rounded-2xl border border-slate-100 bg-white px-4 py-3 text-sm text-slate-700 font-medium shadow-inner", textAlign())}
                          placeholder={isRTL ? "ما الذي دار في ذهنك مباشرة؟" : "What went through your mind immediately?"}
                          placeholderTextColor="#94a3b8"
                          multiline
                          textAlignVertical="top"
                        />
                      </View>
                      <TouchableOpacity
                        className={cn("w-full py-4 rounded-2xl active:scale-[0.98]", activeExercise.color)}
                        style={{ shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 15, shadowOffset: { width: 0, height: 5 } }}
                      >
                        <Text className="text-white font-bold text-center text-sm">{isRTL ? 'حفظ السجل' : 'Save Record'}</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {activeExercise.type === 'distortions' && (
                    <View className="gap-5">
                      {cognitiveDistortions.map((distortion, i) => (
                        <View key={i} className="rounded-2xl bg-white border border-slate-100 p-5 gap-3 shadow-sm">
                          <View className={cn("items-center gap-2", flexDir())}>
                            <View className="h-8 w-8 items-center justify-center rounded-xl bg-orange-100/50">
                              <AlertCircle size={18} color="#ea580c" />
                            </View>
                            <Text className={cn("font-bold text-slate-900", textAlign())}>{isRTL ? distortion.name : distortion.nameEn}</Text>
                          </View>

                          <Text className={cn("text-xs text-slate-500 leading-5 font-medium mb-1", textAlign())}>
                            {isRTL ? distortion.description : distortion.descriptionEn}
                          </Text>

                          <View className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                            <Text className={cn("text-[11px] text-slate-600 leading-5 italic", textAlign())}>{isRTL ? `مثال: «${distortion.example}»` : `Example: "${distortion.exampleEn}"`}</Text>
                          </View>

                          <View className={cn("items-start gap-3 mt-1 bg-teal-50/40 p-3 rounded-xl border border-teal-100/30", flexDir())}>
                            <Lightbulb size={16} color="#0d9488" />
                            <Text className={cn("text-[11px] text-teal-800 flex-1 font-bold leading-5", textAlign())}>{isRTL ? distortion.fix : distortion.fixEn}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}

                  {activeExercise.type === 'behavioral' && (
                    <View className="items-center justify-center py-12">
                      <View className="h-20 w-20 items-center justify-center rounded-full bg-slate-50 border border-slate-100 mb-4 shadow-inner">
                        <Target size={32} color="#94a3b8" />
                      </View>
                      <Text className="text-slate-400 font-bold">{isRTL ? 'تمرين التنشيط السلوكي قريباً...' : 'Behavioral activation exercise coming soon...'}</Text>
                    </View>
                  )}

                  {activeExercise.type === 'reframing' && (
                    <View className="items-center justify-center py-12">
                      <View className="h-20 w-20 items-center justify-center rounded-full bg-slate-50 border border-slate-100 mb-4 shadow-inner">
                        <RefreshCw size={32} color="#94a3b8" />
                      </View>
                      <Text className="text-slate-400 font-bold">{isRTL ? 'تمرين اعادة الصياغة قريباً...' : 'Reframing exercise coming soon...'}</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
