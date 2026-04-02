import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { AppHeader } from '@/components/app-header';
import { Brain, ChevronLeft, Target, RefreshCw, PenLine, ArrowRight, AlertCircle, Lightbulb } from 'lucide-react-native';
import { cn } from '@/lib/utils';

interface CBTExercise {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  type: "thought-record" | "distortions" | "behavioral" | "reframing";
}

const exercises: CBTExercise[] = [
  {
    id: "thought-record",
    title: "سجل الافكار",
    description: "حدد وحلل افكارك التلقائية السلبية واستبدلها بافكار واقعية",
    icon: PenLine,
    color: "bg-primary",
    type: "thought-record",
  },
  {
    id: "distortions",
    title: "التشوهات المعرفية",
    description: "تعرّف على انماط التفكير المشوّه وتعلّم كيف تتعرف عليها",
    icon: Brain,
    color: "bg-accent",
    type: "distortions",
  },
  {
    id: "behavioral",
    title: "التنشيط السلوكي",
    description: "خطط لانشطة ممتعة لتحسين مزاجك وكسر دائرة الاكتئاب",
    icon: Target,
    color: "bg-[hsl(35,90%,55%)]",
    type: "behavioral",
  },
  {
    id: "reframing",
    title: "اعادة الصياغة",
    description: "تدرّب على رؤية المواقف من زوايا مختلفة وايجابية",
    icon: RefreshCw,
    color: "bg-[hsl(280,50%,55%)]",
    type: "reframing",
  },
];

const cognitiveDistortions = [
  {
    name: "التفكير الكارثي",
    description: "توقع اسوأ النتائج دائماً",
    example: "لو رسبت في هذا الاختبار، حياتي كلها ستنتهي",
    fix: "ما هو اسوأ سيناريو واقعي؟ وما احتمال حدوثه فعلاً؟",
  },
  {
    name: "التعميم المفرط",
    description: "تعميم تجربة سلبية واحدة على كل شيء",
    example: "فشلت مرة واحدة، اذاً انا فاشل دائماً",
    fix: "هل هذا حدث مرة واحدة ام نمط حقيقي؟ ما الادلة المخالفة؟",
  },
  {
    name: "قراءة الافكار",
    description: "افتراض معرفة ما يفكر به الاخرون بدون دليل",
    example: "اكيد زملائي يعتقدون اني غبي",
    fix: "هل سألتهم مباشرة؟ ما الادلة الحقيقية على ذلك؟",
  },
];

export default function CBTPage() {
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

                <View
                  className="flex-row-reverse items-center justify-start mb-6"
                >
                  <View
                    className="h-14 w-14 items-center justify-center rounded-2xl bg-primary/10"
                    style={{ shadowColor: '#3b82f6', shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }}
                  >
                    <Brain color="#3b82f6" size={28} />
                  </View>
                  <View className="items-end mr-4">
                    <Text className="text-2xl font-bold text-slate-900 text-right">العلاج المعرفي السلوكي</Text>
                    <Text className="text-sm text-slate-500 text-right mt-0.5 font-medium">أدوات عملية لتحسين نمط تفكيرك</Text>
                  </View>
                </View>

                <View className="w-full h-52 mb-6 rounded-[28px] overflow-hidden bg-slate-100/50 border border-white items-center justify-center">
                  <Brain color="#cbd5e1" size={48} />
                  <Text className="text-slate-400 text-xs font-bold mt-2">فيديو تعريفي</Text>
                </View>

                <Text className="text-sm text-slate-600 text-right leading-6 font-medium bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                  يساعدك العلاج المعرفي السلوكي (CBT) على فهم العلاقة بين افكارك ومشاعرك وسلوكياتك، وتغيير الانماط السلبية.
                </Text>
              </View>

              <View className="flex-row-reverse items-center justify-between mb-6 px-1">
                <Text className="text-xl font-bold text-slate-800">التمارين المتاحة</Text>
              </View>

              <View>
                {exercises.map((exercise, index) => {
                  const Icon = exercise.icon;
                  // Get a hex code equivalent for Tailwind colors for shadows
                  const shadowColor = exercise.id === 'thought-record' ? '#3B82F6' : // primary
                    exercise.id === 'distortions' ? '#10B981' : // accent/emerald
                      exercise.id === 'behavioral' ? '#F59E0B' : // orange
                        '#8B5CF6'; // purple/reframing

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
                        className={cn("absolute right-0 top-0 bottom-0 w-2", exercise.color)}
                      />

                      <View className="p-5 flex-row-reverse items-center justify-between">
                        {/* Right: Icon Container */}
                        <View
                          className={cn("h-14 w-14 items-center justify-center rounded-[20px]", exercise.color)}
                          style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }}
                        >
                          <Icon color="white" size={26} />
                        </View>

                        {/* Center: Content */}
                        <View className="flex-1 items-end mr-4">
                          <Text className="text-lg font-bold text-slate-900 text-right mb-1">
                            {exercise.title}
                          </Text>
                          <Text className="text-xs text-slate-500 text-right leading-5 font-medium opacity-80">
                            {exercise.description}
                          </Text>
                        </View>

                        {/* Left: Indicator */}
                        <View
                          className="h-10 w-10 items-center justify-center rounded-2xl bg-slate-50/80 border border-slate-100"
                          style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } }}
                        >
                          <ChevronLeft color="#94a3b8" size={18} />
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
                className="self-end flex-row items-center gap-2 bg-white/80 px-4 py-2.5 rounded-2xl border border-slate-100"
                style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } }}
                onPress={() => setActiveExercise(null)}
              >
                <Text className="text-slate-600 font-bold text-sm">العودة للتمارين</Text>
                <ArrowRight size={18} color="#64748B" />
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

                <View className="flex-row-reverse items-center justify-between mb-6">
                  <View className="flex-row-reverse items-center gap-3">
                    <View
                      className={cn("h-12 w-12 items-center justify-center rounded-2xl", activeExercise.color)}
                      style={{ shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }}
                    >
                      <activeExercise.icon color="white" size={24} />
                    </View>
                    <View>
                      <Text className="text-xl font-bold text-slate-900 text-right">{activeExercise.title}</Text>
                      <Text className="text-xs text-slate-500 text-right mt-0.5 font-medium">{activeExercise.description}</Text>
                    </View>
                  </View>
                </View>

                <View className="pt-2 border-t border-slate-100/50">
                  {activeExercise.type === 'thought-record' && (
                    <View className="gap-5">
                      <View className="gap-2">
                        <Text className="text-right font-bold text-slate-800 text-sm">الموقف</Text>
                        <TextInput
                          className="min-h-[100px] w-full rounded-2xl border border-slate-100 bg-white px-4 py-3 text-sm text-right text-slate-700 font-medium shadow-inner"
                          placeholder="ماذا حدث؟ اين كنت؟ ومع من؟"
                          placeholderTextColor="#94a3b8"
                          multiline
                          textAlignVertical="top"
                        />
                      </View>
                      <View className="gap-2">
                        <Text className="text-right font-bold text-slate-800 text-sm">الافكار التلقائية</Text>
                        <TextInput
                          className="min-h-[100px] w-full rounded-2xl border border-slate-100 bg-white px-4 py-3 text-sm text-right text-slate-700 font-medium shadow-inner"
                          placeholder="ما الذي دار في ذهنك مباشرة؟"
                          placeholderTextColor="#94a3b8"
                          multiline
                          textAlignVertical="top"
                        />
                      </View>
                      <TouchableOpacity
                        className={cn("w-full py-4 rounded-2xl active:scale-[0.98]", activeExercise.color)}
                        style={{ shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 15, shadowOffset: { width: 0, height: 5 } }}
                      >
                        <Text className="text-white font-bold text-center text-sm">حفظ السجل</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {activeExercise.type === 'distortions' && (
                    <View className="gap-5">
                      {cognitiveDistortions.map((distortion, i) => (
                        <View key={i} className="rounded-2xl bg-white border border-slate-100 p-5 gap-3 shadow-sm">
                          <View className="flex-row-reverse items-center gap-2">
                            <View className="h-8 w-8 items-center justify-center rounded-xl bg-orange-100/50">
                              <AlertCircle size={18} color="#ea580c" />
                            </View>
                            <Text className="font-bold text-slate-900 text-right">{distortion.name}</Text>
                          </View>

                          <Text className="text-xs text-slate-500 text-right leading-5 font-medium mb-1">
                            {distortion.description}
                          </Text>

                          <View className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                            <Text className="text-[11px] text-slate-600 text-right leading-5 italic">مثال: «{distortion.example}»</Text>
                          </View>

                          <View className="flex-row-reverse items-start gap-3 mt-1 bg-teal-50/40 p-3 rounded-xl border border-teal-100/30">
                            <Lightbulb size={16} color="#0d9488" />
                            <Text className="text-[11px] text-teal-800 flex-1 text-right font-bold leading-5">{distortion.fix}</Text>
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
                      <Text className="text-slate-400 font-bold">تمرين التنشيط السلوكي قريباً...</Text>
                    </View>
                  )}

                  {activeExercise.type === 'reframing' && (
                    <View className="items-center justify-center py-12">
                      <View className="h-20 w-20 items-center justify-center rounded-full bg-slate-50 border border-slate-100 mb-4 shadow-inner">
                        <RefreshCw size={32} color="#94a3b8" />
                      </View>
                      <Text className="text-slate-400 font-bold">تمرين اعادة الصياغة قريباً...</Text>
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
