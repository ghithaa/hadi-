import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { AppHeader } from '@/components/app-header';
import { Brain, ChevronLeft, ChevronRight, RefreshCw, ArrowRight, ArrowLeft, Lightbulb, ThumbsUp, Sparkles } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { useLocalization } from '@/context/LocalizationContext';
import { router } from 'expo-router';
import { useCreateThoughtRecord } from '@/hooks/use-cbt';

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
    title: "تحدي الأفكار السلبية",
    titleEn: "Challenging Negative Thoughts",
    description: "تعلم كيف تتعرف على الأفكار السلبية وتحولها إلى أفكار أكثر توازناً",
    descriptionEn: "Learn how to identify negative thoughts and turn them into more balanced ones",
    icon: Brain,
    color: "bg-[#8B5CF6]", // purple
    type: "thought-record",
  },
  {
    id: "gratitude",
    title: "تمرين الامتنان",
    titleEn: "Gratitude Exercise",
    description: "ركز على الأشياء الإيجابية في حياتك لتحسين مزاجك",
    descriptionEn: "Focus on positive things in your life to improve your mood",
    icon: ThumbsUp,
    color: "bg-[#10B981]", // green
    type: "behavioral",
  },
  {
    id: "reframing",
    title: "إعادة صياغة المواقف",
    titleEn: "Reframing Situations",
    description: "انظر للمواقف الصعبة من زاوية مختلفة",
    descriptionEn: "Look at difficult situations from a different perspective",
    icon: RefreshCw,
    color: "bg-[#3B82F6]", // blue
    type: "reframing",
  },
];



const step2Distortions = [
  {
    id: "catastrophizing",
    name: "التهويل",
    nameEn: "Catastrophizing",
    desc: "توقع أسوأ النتائج",
    descEn: "Always expecting the worst outcomes",
  },
  {
    id: "black_and_white",
    name: "التفكير الأبيض والأسود",
    nameEn: "Black & White Thinking",
    desc: "رؤية الأمور بشكل متطرف",
    descEn: "Seeing things in extremes (all-or-nothing)",
  },
  {
    id: "mind_reading",
    name: "قراءة الأفكار",
    nameEn: "Mind Reading",
    desc: "افتراض ما يفكر به الآخرون",
    descEn: "Assuming you know what others think without proof",
  },
  {
    id: "should_statements",
    name: "عبارات الـ \"يجب\"",
    nameEn: "Should Statements",
    desc: "قواعد صارمة لنفسك وللآخرين",
    descEn: "Rigid rules for how you or others 'should' act",
  },
  {
    id: "personalization",
    name: "الشخصنة",
    nameEn: "Personalization",
    desc: "لوم نفسك على أشياء خارج سيطرتك",
    descEn: "Blaming yourself for events beyond your control",
  }
];

const generateFallbackReframing = (thought: string, distortions: string[], isRTL: boolean) => {
  if (isRTL) {
    if (thought.toLowerCase().includes("test") || thought.includes("اختبار") || thought.includes("امتحان") || thought.includes("دراسة")) {
      return "شكراً لمشاركتك هذه الفكرة. من الطبيعي أن نشعر بالتوتر عندما نواجه اختباراً، وقد تؤدي هذه المشاعر إلى تهويل الوضع. يمكنك التفكير بدلاً من ذلك في: \"هذا الاختبار هو فرصة لتقييم معرفتي، وسأبذل قصارى جهدي\" لمساعدتك في إعادة التفكير، اسأل نفسك: \"ما هي الخطوات التي يمكنني اتخاذها للاستعداد بشكل أفضل؟\"";
    }
    if (thought.includes("فشل") || thought.includes("فاشل")) {
      return "تذكر أن الفشل في موقف معين لا يحدد هويتك ككل. يمكنك إعادة صياغة الفكرة: \"الفشل في هذه المحاولة هو تجربة تعلم وفرصة للنمو والتحسن في المرة القادمة، وليس نهاية المطاف.\"";
    }
    if (thought.includes("الناس") || thought.includes("شخص") || thought.includes("هم") || thought.includes("أحد")) {
      return "قد نقوم أحياناً بافتراض ما يدور في عقول الآخرين (قراءة الأفكار). بدلاً من ذلك، فكر في: \"لا يمكنني التحكم أو معرفة ما يفكر به الآخرون بدقة، وسأركز على أن أكون فخوراً بنفسي وبأفعالي.\"";
    }
    return `من المفيد التفكير بدلاً من ذلك بطريقة أكثر توازناً: "سأبذل ما في وسعي، والمواقف لا تحدد قيمتي الشخصية. سأركز على الخطوات الصغيرة التي يمكنني اتخاذها الآن لتحسين الوضع."`;
  } else {
    if (thought.toLowerCase().includes("test") || thought.toLowerCase().includes("exam")) {
      return "Thank you for sharing this thought. It's natural to feel anxious about tests, and these feelings can catastrophize the situation. Try thinking instead: \"This exam is an opportunity to evaluate my progress, and I will do my best.\" To help reframe further, ask yourself: \"What actions can I take now to prepare better?\"";
    }
    if (thought.toLowerCase().includes("fail")) {
      return "Remember that failing in one instance does not make you a failure. Try reframing: \"A setback is a learning experience and an opportunity to grow, not the end of the road.\"";
    }
    return `Try a more balanced perspective: "I will do my best, and this situation does not define my self-worth. I will focus on the small steps I can control right now."`;
  }
};

export default function CBTPage() {
  const { isRTL, flexDir, textAlign, alignItems } = useLocalization();
  const createThoughtRecord = useCreateThoughtRecord();

  const [activeExercise, setActiveExercise] = useState<CBTExercise | null>(null);

  // Step state for Challenging Negative Thoughts
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [negativeThought, setNegativeThought] = useState<string>('');
  const [selectedDistortions, setSelectedDistortions] = useState<string[]>([]);
  const [evidenceFor, setEvidenceFor] = useState<string>('');
  const [evidenceAgainst, setEvidenceAgainst] = useState<string>('');
  const [reframedThought, setReframedThought] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // States for Reframing Situations
  const [reframeSituation, setReframeSituation] = useState<string>('');
  const [reframeNegative, setReframeNegative] = useState<string>('');
  const [reframeRealistic, setReframeRealistic] = useState<string>('');
  const [isReframeSubmitting, setIsReframeSubmitting] = useState<boolean>(false);

  const handleSelectExercise = (exercise: CBTExercise) => {
    if (exercise.id === 'gratitude') {
      router.push('/(tabs)/gratitude');
    } else {
      setActiveExercise(exercise);
      setCurrentStep(1);
      setNegativeThought('');
      setSelectedDistortions([]);
      setEvidenceFor('');
      setEvidenceAgainst('');
      setReframedThought('');
      setReframeSituation('');
      setReframeNegative('');
      setReframeRealistic('');
    }
  };

  const handleBackToExercises = () => {
    setActiveExercise(null);
    setCurrentStep(1);
  };

  return (
    <View className="flex-1 bg-[#FDFDFD]">
      <View className="bg-white pb-2">
        <AppHeader />
      </View>

      {/* Organic Background Blobs */}
      <View pointerEvents="none" className="absolute inset-0 overflow-hidden opacity-[0.05]">
        <View
          className="absolute -top-20 -left-20 h-[400px] w-[400px] rounded-full bg-primary-20"
          style={{ transform: [{ scaleX: 1.5 }, { rotate: '45deg' }] }}
        />
        <View
          className="absolute top-1/4 -right-40 h-[350px] w-[350px] rounded-full"
          style={{ backgroundColor: 'rgba(254, 215, 170, 0.5)', transform: [{ scaleX: 1.2 }] }}
        />
        <View
          className="absolute -bottom-20 left-0 h-[300px] w-[300px] rounded-full"
          style={{ backgroundColor: 'rgba(191, 219, 254, 0.5)' }}
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
                className="bg-white border border-slate-100 rounded-[35px] p-6 mb-8 overflow-hidden"
                style={{ shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 30, shadowOffset: { width: 0, height: 12 } }}
              >
                {/* Background Glass Accent */}
                <View className="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-primary-5" />

                <View className={cn("items-center justify-start mb-6", flexDir())}>
                  <View
                    className="h-14 w-14 items-center justify-center rounded-2xl bg-primary-10"
                    style={{ shadowColor: '#3b82f6', shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }}
                  >
                    <Brain color="#3b82f6" size={28} />
                  </View>
                  <View className={cn(alignItems('start'), isRTL ? "mr-4" : "ml-4")}>
                    <Text className={cn("text-2xl font-bold text-slate-900", textAlign())}>{isRTL ? 'العلاج المعرفي السلوكي' : 'Cognitive Behavioral Therapy'}</Text>
                    <Text className={cn("text-sm text-slate-500 mt-0.5 font-medium", textAlign())}>{isRTL ? 'أدوات عملية لتحسين نمط تفكيرك' : 'Practical tools to improve your thinking patterns'}</Text>
                  </View>
                </View>

                <View 
                  className="w-full h-52 mb-6 rounded-[28px] overflow-hidden border border-white items-center justify-center"
                  style={{ backgroundColor: 'rgba(241, 245, 249, 0.5)' }}
                >
                  <Brain color="#cbd5e1" size={48} />
                  <Text className="text-slate-400 text-xs font-bold mt-2">{isRTL ? 'فيديو تعريفي' : 'Intro Video'}</Text>
                </View>

                <Text 
                  className={cn("text-sm text-slate-600 leading-6 font-medium p-4 rounded-2xl", textAlign())}
                  style={{ backgroundColor: 'rgba(248, 250, 252, 0.5)', borderColor: 'rgba(241, 245, 249, 0.5)', borderWidth: 1 }}
                >
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
                  const shadowColor = exercise.id === 'thought-record' ? '#8B5CF6' :
                    exercise.id === 'gratitude' ? '#10B981' : '#3B82F6';

                  return (
                    <TouchableOpacity
                      key={exercise.id}
                      onPress={() => handleSelectExercise(exercise)}
                      activeOpacity={0.9}
                      className={cn(
                        "w-full rounded-[30px] border border-slate-100 overflow-hidden bg-white",
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
                          className="h-10 w-10 items-center justify-center rounded-2xl border border-slate-100"
                          style={{ backgroundColor: 'rgba(248, 250, 252, 0.8)', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } }}
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
            <View className="gap-4">
              {/* Clean Back Button above the card */}
              <TouchableOpacity
                onPress={handleBackToExercises}
                activeOpacity={0.7}
                className={cn("items-center gap-1.5 px-3 py-2 rounded-2xl active:bg-slate-100/80", isRTL ? "self-end flex-row-reverse" : "self-start flex-row")}
              >
                {isRTL ? <ChevronRight size={18} color="#64748b" /> : <ChevronLeft size={18} color="#64748b" />}
                <Text className="text-sm font-bold text-slate-500">
                  {isRTL ? 'العودة للتمارين' : 'Back to Exercises'}
                </Text>
              </TouchableOpacity>

              <View
                className="bg-white border border-slate-100 rounded-[35px] p-6 overflow-hidden"
                style={{
                  shadowColor: activeExercise.id === 'thought-record' ? '#8B5CF6' : '#3B82F6',
                  shadowOpacity: 0.1,
                  shadowRadius: 30,
                  shadowOffset: { width: 0, height: 12 }
                }}
              >
                
                {/* Header Decoration */}
                <View className="absolute -top-10 -right-10 h-32 w-32 rounded-full" style={{ backgroundColor: 'rgba(248, 250, 252, 0.5)' }} />

                <View className={cn("items-center gap-3 mb-6", isRTL ? "flex-row-reverse" : "flex-row")}>
                  <View
                    className={cn("h-12 w-12 items-center justify-center rounded-2xl", activeExercise.color)}
                    style={{ shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }}
                  >
                    <activeExercise.icon color="white" size={24} />
                  </View>
                  <View className={cn("flex-1", isRTL ? "items-end mr-3" : "items-start ml-3")}>
                    <Text className={cn("text-xl font-bold text-slate-900", isRTL ? "text-right" : "text-left")}>{isRTL ? activeExercise.title : activeExercise.titleEn}</Text>
                    <Text className={cn("text-xs text-slate-500 mt-0.5 font-medium leading-5", isRTL ? "text-right" : "text-left")}>{isRTL ? activeExercise.description : activeExercise.descriptionEn}</Text>
                  </View>
                </View>

                <View className="pt-4 border-t" style={{ borderTopColor: 'rgba(241, 245, 249, 0.5)' }}>
                  {activeExercise.id === 'thought-record' && (
                    <View className="gap-5">
                      {/* Step Indicators */}
                      <View className="flex-row justify-between items-center px-2 mb-2">
                        {[1, 2, 3, 4].map((step) => (
                          <View key={step} className="flex-row items-center flex-1">
                            <View
                              className={cn(
                                "h-8 w-8 rounded-full items-center justify-center border font-bold text-sm",
                                currentStep === step
                                  ? "bg-[#8B5CF6] border-[#8B5CF6] text-white"
                                  : currentStep > step
                                  ? "text-[#8B5CF6]"
                                  : "bg-white border-slate-200 text-slate-400"
                              )}
                              style={currentStep > step ? { backgroundColor: 'rgba(139, 92, 246, 0.1)', borderColor: 'rgba(139, 92, 246, 0.3)' } : {}}
                            >
                              {currentStep > step ? <ThumbsUp size={12} color="#8B5CF6" /> : <Text className={currentStep === step ? "text-white font-bold" : "text-slate-400 font-medium"}>{step}</Text>}
                            </View>
                            {step < 4 && (
                              <View
                                className={cn(
                                  "h-0.5 flex-1 mx-2",
                                  currentStep > step ? "bg-[#8B5CF6]" : "bg-slate-100"
                                )}
                              />
                            )}
                          </View>
                        ))}
                      </View>

                      {/* Step Content */}
                      {currentStep === 1 && (
                        <View className="gap-5">
                          {/* Info card */}
                          <View className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex-row items-start gap-3">
                            <View className="h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}>
                              <Lightbulb size={20} color="#8B5CF6" />
                            </View>
                            <View className="flex-1">
                              <Text className={cn("font-bold text-slate-800 text-sm", textAlign())}>
                                {isRTL ? "كيف يعمل هذا التمرين؟" : "How does this exercise work?"}
                              </Text>
                              <Text className={cn("text-xs text-slate-500 mt-1 leading-5", textAlign())}>
                                {isRTL
                                  ? "سنساعدك على التعرف على الأفكار السلبية وتحويلها إلى أفكار أكثر واقعية وتوازناً."
                                  : "We will help you identify negative thoughts and transform them into more realistic and balanced ones."}
                              </Text>
                            </View>
                          </View>

                          {/* Input */}
                          <View className="gap-2">
                            <Text className={cn("font-bold text-slate-800 text-sm", textAlign())}>
                              {isRTL ? "ما هي الفكرة السلبية التي تراودك؟" : "What is the negative thought that you have?"}
                            </Text>
                            <TextInput
                              className={cn("min-h-[120px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 font-medium", textAlign())}
                              placeholder={isRTL ? "مثال: أنا فاشل ولن أنجح أبداً..." : "Example: I am a failure and will never succeed..."}
                              placeholderTextColor="#94a3b8"
                              multiline
                              value={negativeThought}
                              onChangeText={setNegativeThought}
                              textAlignVertical="top"
                            />
                          </View>

                          {/* Next Button */}
                          <TouchableOpacity
                            disabled={!negativeThought.trim()}
                            onPress={() => setCurrentStep(2)}
                            className={cn(
                              "w-full py-4 rounded-2xl items-center active:scale-[0.98]",
                              negativeThought.trim() ? "bg-[#8B5CF6]" : "bg-slate-200"
                            )}
                            style={negativeThought.trim() ? { shadowColor: '#8B5CF6', shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } } : {}}
                          >
                            <Text className="text-white font-bold text-center text-sm">
                              {isRTL ? "التالي" : "Next"}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}

                      {currentStep === 2 && (
                        <View className="gap-5">
                          <Text className={cn("font-bold text-slate-800 text-sm mb-1", textAlign())}>
                            {isRTL ? "هل تعتقد أن فكرتك تتضمن أحد هذه الأنماط؟" : "Do you think your thought includes one of these patterns?"}
                          </Text>

                          <View className="gap-3">
                            {step2Distortions.map((distortion) => {
                              const isSelected = selectedDistortions.includes(distortion.id);
                              return (
                                <TouchableOpacity
                                  key={distortion.id}
                                  activeOpacity={0.8}
                                  onPress={() => {
                                    if (isSelected) {
                                      setSelectedDistortions(selectedDistortions.filter(id => id !== distortion.id));
                                    } else {
                                      setSelectedDistortions([...selectedDistortions, distortion.id]);
                                    }
                                  }}
                                  className={cn(
                                    "w-full rounded-2xl border p-4 flex-row items-center justify-between",
                                    isSelected
                                      ? "border-[#8B5CF6]"
                                      : "border-slate-100 bg-white"
                                  )}
                                  style={isSelected ? { backgroundColor: 'rgba(139, 92, 246, 0.05)' } : {}}
                                >
                                  <View className={cn("flex-1", alignItems('start'))}>
                                    <Text className={cn("font-bold text-slate-800 text-sm", textAlign())}>
                                      {isRTL ? distortion.name : distortion.nameEn}
                                    </Text>
                                    <Text className={cn("text-xs text-slate-500 mt-1", textAlign())}>
                                      {isRTL ? distortion.desc : distortion.descEn}
                                    </Text>
                                  </View>
                                  <View
                                    className={cn(
                                      "h-5 w-5 rounded-full border items-center justify-center",
                                      isSelected ? "border-[#8B5CF6] bg-[#8B5CF6]" : "border-slate-300 bg-white"
                                    )}
                                  >
                                    {isSelected && <View className="h-2 w-2 rounded-full bg-white" />}
                                  </View>
                                </TouchableOpacity>
                              );
                            })}
                          </View>

                          {/* Buttons */}
                          <View className="flex-row gap-3 mt-2">
                            <TouchableOpacity
                              onPress={() => setCurrentStep(1)}
                              className="flex-1 py-4 rounded-2xl border border-slate-200 bg-white"
                            >
                              <Text className="text-slate-600 font-bold text-center text-sm">
                                {isRTL ? "السابق" : "Back"}
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => setCurrentStep(3)}
                              className="flex-1 py-4 rounded-2xl bg-[#8B5CF6]"
                              style={{ shadowColor: '#8B5CF6', shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }}
                            >
                              <Text className="text-white font-bold text-center text-sm">
                                {isRTL ? "التالي" : "Next"}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      )}

                      {currentStep === 3 && (
                        <View className="gap-5">
                          <View className="gap-2">
                            <Text className={cn("font-bold text-slate-800 text-sm", textAlign())}>
                              {isRTL ? "ما الدليل الذي يدعم هذه الفكرة؟" : "What evidence supports this thought?"}
                            </Text>
                            <TextInput
                              className={cn("min-h-[90px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 font-medium", textAlign())}
                              placeholder={isRTL ? "اكتب الدليل المؤيد هنا..." : "Write supporting evidence here..."}
                              placeholderTextColor="#94a3b8"
                              multiline
                              value={evidenceFor}
                              onChangeText={setEvidenceFor}
                              textAlignVertical="top"
                            />
                          </View>

                          <View className="gap-2">
                            <Text className={cn("font-bold text-slate-800 text-sm", textAlign())}>
                              {isRTL ? "ما الدليل الذي يعارض هذه الفكرة؟" : "What evidence opposes this thought?"}
                            </Text>
                            <TextInput
                              className={cn("min-h-[90px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 font-medium", textAlign())}
                              placeholder={isRTL ? "اكتب الدليل المعارض هنا..." : "Write opposing evidence here..."}
                              placeholderTextColor="#94a3b8"
                              multiline
                              value={evidenceAgainst}
                              onChangeText={setEvidenceAgainst}
                              textAlignVertical="top"
                            />
                          </View>

                          {/* Buttons */}
                          <View className="flex-row gap-3 mt-2">
                            <TouchableOpacity
                              disabled={isSubmitting}
                              onPress={() => setCurrentStep(2)}
                              className="flex-1 py-4 rounded-2xl border border-slate-200 bg-white"
                            >
                              <Text className="text-slate-600 font-bold text-center text-sm">
                                {isRTL ? "الرجوع" : "Back"}
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              disabled={isSubmitting}
                              onPress={async () => {
                                setIsSubmitting(true);
                                try {
                                  const selectedDistortionNames = selectedDistortions
                                    .map(id => step2Distortions.find(d => d.id === id)?.name || id);
                                  
                                  const res = await createThoughtRecord.mutateAsync({
                                    situation: isRTL ? "تمرين تحدي الأفكار" : "Negative Thought Challenge",
                                    automaticThought: negativeThought,
                                    emotion: isRTL ? "قلق" : "Anxiety",
                                    emotionIntensity: 7,
                                    distortion: selectedDistortionNames.join(', '),
                                    alternativeThought: "", // let API generate
                                  });

                                  if (res && res.alternative_thought) {
                                    setReframedThought(res.alternative_thought);
                                  } else {
                                    setReframedThought(generateFallbackReframing(negativeThought, selectedDistortions, isRTL));
                                  }
                                } catch (err) {
                                  console.error("Save record failed:", err);
                                  setReframedThought(generateFallbackReframing(negativeThought, selectedDistortions, isRTL));
                                } finally {
                                  setIsSubmitting(false);
                                  setCurrentStep(4);
                                }
                              }}
                              className="flex-[1.5] py-4 rounded-2xl bg-[#8B5CF6] items-center justify-center"
                              style={{ shadowColor: '#8B5CF6', shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }}
                            >
                              <Text className="text-white font-bold text-center text-sm">
                                {isSubmitting
                                  ? (isRTL ? "جاري المعالجة..." : "Processing...")
                                  : (isRTL ? "احصل على اقتراح" : "Get Suggestion")}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      )}

                      {currentStep === 4 && (
                        <View className="gap-5 items-center">
                          {/* Sparkle Header Icon */}
                          <View className="h-16 w-16 items-center justify-center rounded-full mb-2" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}>
                            <Sparkles size={32} color="#8B5CF6" />
                          </View>

                          <Text className="text-xl font-bold text-slate-800 text-center">
                            {isRTL ? "إليك طريقة جديدة للتفكير" : "Here is a new way of thinking"}
                          </Text>

                          {/* Suggestion Card */}
                          <View className="w-full bg-[#F5F3FF] border border-[#DDD6FE] rounded-3xl p-5 mb-2">
                            <Text className={cn("text-slate-700 leading-6 text-sm font-medium", textAlign())}>
                              {reframedThought}
                            </Text>
                          </View>

                          {/* Original Thought Details */}
                          <View className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-4">
                            <Text className={cn("text-xs text-slate-400 font-bold", textAlign())}>
                              {isRTL ? "فكرتك الأصلية:" : "Your original thought:"}
                            </Text>
                            <Text className={cn("text-slate-600 text-sm mt-1 font-bold italic", textAlign())}>
                              {"\"" + negativeThought + "\""}
                            </Text>
                          </View>

                          {/* Finish Button */}
                          <TouchableOpacity
                            onPress={() => {
                              setActiveExercise(null);
                              setCurrentStep(1);
                            }}
                            className="w-full py-4 rounded-2xl bg-[#10B981] items-center"
                            style={{ shadowColor: '#10B981', shadowOpacity: 0.15, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }}
                          >
                            <Text className="text-white font-bold text-center text-sm">
                              {isRTL ? "إنهاء التمرين" : "End Exercise"}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  )}

                  {activeExercise.id === 'refaming' || activeExercise.id === 'reframing' ? (
                    <View className="gap-5">
                      {/* Info card */}
                      <View className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex-row items-start gap-3">
                        <View className="h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                          <RefreshCw size={20} color="#3B82F6" />
                        </View>
                        <View className="flex-1">
                          <Text className={cn("font-bold text-slate-800 text-sm", textAlign())}>
                            {isRTL ? "إعادة صياغة المواقف" : "Reframing Situations"}
                          </Text>
                          <Text className={cn("text-xs text-slate-500 mt-1 leading-5", textAlign())}>
                            {isRTL
                              ? "انظر للمواقف الصعبة من زوايا مختلفة وأكثر إيجابية وواقعية."
                              : "Look at difficult situations from different, positive, and realistic perspectives."}
                          </Text>
                        </View>
                      </View>

                      {/* Situation Input */}
                      <View className="gap-2">
                        <Text className={cn("font-bold text-slate-800 text-sm", textAlign())}>
                          {isRTL ? "ما هو الموقف الصعب الذي مررت به؟" : "What is the difficult situation you experienced?"}
                        </Text>
                        <TextInput
                          className={cn("min-h-[80px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 font-medium", textAlign())}
                          placeholder={isRTL ? "مثال: لم يرد صديقي على مكالمتي..." : "Example: My friend didn't return my call..."}
                          placeholderTextColor="#94a3b8"
                          multiline
                          value={reframeSituation}
                          onChangeText={setReframeSituation}
                          textAlignVertical="top"
                        />
                      </View>

                      {/* Negative Interpretation Input */}
                      <View className="gap-2">
                        <Text className={cn("font-bold text-slate-800 text-sm", textAlign())}>
                          {isRTL ? "ما هو التفسير السلبي التلقائي؟" : "What is the automatic negative interpretation?"}
                        </Text>
                        <TextInput
                          className={cn("min-h-[80px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 font-medium", textAlign())}
                          placeholder={isRTL ? "مثال: هو يتجاهلني ولا يريد التحدث معي..." : "Example: He is ignoring me and doesn't want to talk..."}
                          placeholderTextColor="#94a3b8"
                          multiline
                          value={reframeNegative}
                          onChangeText={setReframeNegative}
                          textAlignVertical="top"
                        />
                      </View>

                      {/* Realistic Reframe Input */}
                      <View className="gap-2">
                        <Text className={cn("font-bold text-slate-800 text-sm", textAlign())}>
                          {isRTL ? "أعد صياغة الموقف بتفسير أكثر واقعية:" : "Reframe the situation with a more realistic explanation:"}
                        </Text>
                        <TextInput
                          className={cn("min-h-[80px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 font-medium", textAlign())}
                          placeholder={isRTL ? "مثال: ربما هو مشغول أو نائم أو هاتفه صامت..." : "Example: Maybe he is busy, asleep, or his phone is silent..."}
                          placeholderTextColor="#94a3b8"
                          multiline
                          value={reframeRealistic}
                          onChangeText={setReframeRealistic}
                          textAlignVertical="top"
                        />
                      </View>

                      {/* Save Button */}
                      <TouchableOpacity
                        disabled={!reframeSituation.trim() || !reframeNegative.trim() || !reframeRealistic.trim() || isReframeSubmitting}
                        onPress={async () => {
                          setIsReframeSubmitting(true);
                          try {
                            await createThoughtRecord.mutateAsync({
                              situation: reframeSituation,
                              automaticThought: reframeNegative,
                              emotion: isRTL ? "إحباط" : "Frustrated",
                              emotionIntensity: 6,
                              distortion: isRTL ? "تفسير متسرع" : "Jumping to conclusions",
                              alternativeThought: reframeRealistic,
                            });
                            
                            // Clear and go back
                            setReframeSituation('');
                            setReframeNegative('');
                            setReframeRealistic('');
                            setActiveExercise(null);
                          } catch (err) {
                            console.error("Save reframe failed:", err);
                            setActiveExercise(null);
                          } finally {
                            setIsReframeSubmitting(false);
                          }
                        }}
                        className={cn(
                          "w-full py-4 rounded-2xl items-center active:scale-[0.98] mt-2",
                          (reframeSituation.trim() && reframeNegative.trim() && reframeRealistic.trim() && !isReframeSubmitting)
                            ? "bg-[#3B82F6]"
                            : "bg-slate-200"
                        )}
                        style={(reframeSituation.trim() && reframeNegative.trim() && reframeRealistic.trim() && !isReframeSubmitting) ? { shadowColor: '#3B82F6', shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } } : {}}
                      >
                        <Text className="text-white font-bold text-center text-sm">
                          {isReframeSubmitting
                            ? (isRTL ? "جاري الحفظ..." : "Saving...")
                            : (isRTL ? "حفظ الموقف" : "Save Reframe")}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : null}
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
