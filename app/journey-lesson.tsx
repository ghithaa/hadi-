import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, BrainCircuit, Clock3, Droplets, MessageCircle, Wind } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { useLocalization } from '@/context/LocalizationContext';
import {
  getActiveJourneyRoute,
  getJourneyLesson,
  getNextLessonIndices,
  getUnitIndexForLesson,
  mergeJourneysWithProgress,
  setActiveJourneyLessonRoute,
  setActiveJourneyRoute,
  type Journey,
} from '@/constants/journeys-data';
import { getPersistedJourneysProgress, setPersistedJourneysProgress } from '@/lib/token-storage';

function completeJourneyUnit(journey: Journey, unitIndex: number) {
  if (unitIndex < 0 || unitIndex >= journey.units.length) return journey;

  const units = journey.units.map((unit, index) => {
    if (index === unitIndex) {
      return { ...unit, isCompleted: true, isLocked: false };
    }
    if (index === unitIndex + 1) {
      return { ...unit, isLocked: false };
    }
    return unit;
  });

  const completedCount = units.filter((unit) => unit.isCompleted).length;
  const progress = Math.round((completedCount / units.length) * 100);

  return { ...journey, units, progress };
}

export default function JourneyLessonPage() {
  const { language, isRTL, flexDir, textAlign } = useLocalization();
  const insets = useSafeAreaInsets();
  const [note, setNote] = useState('');
  const [groundingAnswers, setGroundingAnswers] = useState<string[]>(['', '', '', '', '']);
  const [exerciseStepIndex, setExerciseStepIndex] = useState(0);
  const [exerciseAnswers, setExerciseAnswers] = useState<string[]>([]);

  const activeRoute = getActiveJourneyRoute();
  const journeyId = activeRoute.journeyId;
  const moduleIndex = typeof activeRoute.moduleIndex === 'number' ? activeRoute.moduleIndex : 0;
  const lessonIndex = typeof activeRoute.lessonIndex === 'number' ? activeRoute.lessonIndex : 0;

  const lessonData = useMemo(
    () => getJourneyLesson(journeyId, moduleIndex, lessonIndex),
    [journeyId, moduleIndex, lessonIndex]
  );

  useEffect(() => {
    setNote('');
    setGroundingAnswers(['', '', '', '', '']);
    setExerciseStepIndex(0);
    setExerciseAnswers([]);
  }, [lessonData.lesson?.id]);

  const currentJourney = lessonData.journey;
  const currentModule = lessonData.module;
  const currentLesson = lessonData.lesson;

  if (!currentJourney || !currentModule || !currentLesson) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text className="text-lg font-bold text-foreground text-center">الدرس غير موجود</Text>
      </View>
    );
  }

  const getText = (ar: string, en?: string) => (language === 'en' ? en ?? ar : ar);
  const exerciseSteps = currentLesson.exercise?.steps ?? [];
  const currentExerciseStep = exerciseSteps[exerciseStepIndex];
  const isLastExerciseStep = exerciseStepIndex >= exerciseSteps.length - 1;

  const updateExerciseAnswer = (value: string) => {
    setExerciseAnswers((current) => {
      const next = [...current];
      next[exerciseStepIndex] = value;
      return next;
    });
  };

  const handleBackToJourney = () => {
    setActiveJourneyRoute(currentJourney.id);
    router.replace('/(tabs)/journeys' as any);
  };

  const handleAction = () => {
    if (currentLesson.action?.type === 'breathing') {
      void buildCompletedJourney().then(async (updatedJourney) => {
        await saveJourneyProgress(updatedJourney);
        setActiveJourneyRoute(undefined);
        router.replace('/(tabs)/breathing' as any);
      });
      return;
    }

    if (currentLesson.action?.type === 'chat') {
      void buildCompletedJourney().then(async (updatedJourney) => {
        await saveJourneyProgress(updatedJourney);
        setActiveJourneyRoute(undefined);
        router.replace('/(tabs)/chat' as any);
      });
    }
  };

  const saveJourneyProgress = async (journeyToSave: Journey) => {
    const current = (await getPersistedJourneysProgress()) || {};
    await setPersistedJourneysProgress({
      ...current,
      [journeyToSave.id]: {
        progress: journeyToSave.progress,
        units: journeyToSave.units.map((unit) => ({
          id: unit.id,
          isLocked: unit.isLocked,
          isCompleted: unit.isCompleted,
        })),
      },
    });
  };

  const buildCompletedJourney = async () => {
    const progressMap = await getPersistedJourneysProgress();
    const mergedJourney = mergeJourneysWithProgress(progressMap).find((item) => item.id === currentJourney.id) ?? currentJourney;
    const unitIndex = getUnitIndexForLesson(mergedJourney, moduleIndex, lessonIndex);
    return unitIndex >= 0 ? completeJourneyUnit(mergedJourney, unitIndex) : mergedJourney;
  };

  const handleCompleteLesson = async () => {
    const updatedJourney = await buildCompletedJourney();
    await saveJourneyProgress(updatedJourney);

    const next = getNextLessonIndices(currentJourney, moduleIndex, lessonIndex);
    if (next) {
      setActiveJourneyLessonRoute(currentJourney.id, next.moduleIndex, next.lessonIndex);
      router.replace('/journey-lesson' as any);
      return;
    }

    setActiveJourneyRoute(undefined);
    router.replace('/(tabs)/journeys' as any);
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 16, paddingTop: Math.max(16, insets.top + 8), paddingBottom: 120 }}>
        <View className="mb-6 rounded-[28px] border border-border/50 bg-card px-4 py-4 shadow-sm">
          <View className={cn("items-center justify-between", flexDir())}>
            <TouchableOpacity
              onPress={handleBackToJourney}
              hitSlop={12}
              activeOpacity={0.85}
              className="h-11 w-11 items-center justify-center rounded-full border border-border bg-background"
            >
              <ArrowLeft size={20} color="#0f172a" />
            </TouchableOpacity>

            <View className={cn("items-center gap-2", flexDir())}>
              <Clock3 size={14} color="#64748b" />
              <Text className="text-xs font-medium text-muted-foreground">
                {getText(currentLesson.duration, currentLesson.durationEn)}
              </Text>
            </View>
          </View>

          <View className="mt-5">
            <Text className={cn("mb-2 text-sm font-semibold", textAlign())} style={{ color: currentJourney.color }}>
              {getText(currentModule.title, currentModule.titleEn)}
            </Text>
            <Text className={cn("mb-3 text-3xl font-bold text-foreground", textAlign())}>
              {getText(currentLesson.title, currentLesson.titleEn)}
            </Text>
            <Text className={cn("text-base leading-7 text-muted-foreground", textAlign())}>
              {getText(currentLesson.summary, currentLesson.summaryEn)}
            </Text>
          </View>
        </View>

        <View className={cn("mb-6 items-center justify-between rounded-[22px] border border-border/40 bg-card px-4 py-3", flexDir())}>
          <View className="flex-1 px-3">
            <Text className="text-right text-sm font-bold text-foreground">
              {isRTL ? 'ضمن رحلة' : 'Part of Journey'}
            </Text>
            <Text className="mt-1 text-right text-xs text-muted-foreground">
              {isRTL ? currentJourney.title : currentJourney.titleEn ?? currentJourney.title}
            </Text>
          </View>

          <View className="rounded-full px-3 py-2" style={{ backgroundColor: `${currentJourney.color}18` }}>
            <Text className="text-xs font-bold" style={{ color: currentJourney.color }}>
              {isRTL ? 'درس تفاعلي' : 'Interactive Lesson'}
            </Text>
          </View>
        </View>

        <View className="gap-5">
          {currentLesson.exercise?.type === 'grounding_senses' ? (
            <View className="rounded-3xl border border-emerald-100 bg-white p-5">
              <View className="mb-5 items-center">
                <View className="mb-4 h-14 w-14 items-center justify-center rounded-full bg-emerald-500">
                  <Droplets size={26} color="white" />
                </View>
                <Text className="text-center text-2xl font-bold text-foreground">
                  {getText(currentLesson.exercise.title ?? '', currentLesson.exercise.titleEn)}
                </Text>
                <Text className="mt-1 text-center text-sm text-muted-foreground">
                  {getText(currentLesson.exercise.subtitle ?? '', currentLesson.exercise.subtitleEn)}
                </Text>
              </View>

              <View className="gap-2">
                {groundingAnswers.map((answer, index) => (
                  <TextInput
                    key={`${currentLesson.id}-grounding-${index}`}
                    value={answer}
                    onChangeText={(value) =>
                      setGroundingAnswers((current) => current.map((item, itemIndex) => (itemIndex === index ? value : item)))
                    }
                    placeholder={
                      language === 'en'
                        ? currentLesson.exercise?.placeholdersEn?.[index] ?? currentLesson.exercise?.placeholders?.[index] ?? ''
                        : currentLesson.exercise?.placeholders?.[index] ?? ''
                    }
                    placeholderTextColor="#94a3b8"
                    textAlign={isRTL ? 'right' : 'left'}
                    className="rounded-2xl border border-border bg-background px-4 py-4 text-base text-foreground"
                  />
                ))}
              </View>
            </View>
          ) : null}

          {currentLesson.exercise?.type === 'multi_step_reflection' && currentExerciseStep ? (
            <View className="rounded-3xl border border-purple-100 bg-white p-5">
              <View className="mb-4 flex-row items-center justify-between">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-purple-500">
                  <BrainCircuit size={18} color="white" />
                </View>
                <View className="items-end">
                  <Text className="text-xs text-muted-foreground">
                    {language === 'en'
                      ? `Step ${exerciseStepIndex + 1} of ${exerciseSteps.length}`
                      : `الخطوة ${exerciseStepIndex + 1} من ${exerciseSteps.length}`}
                  </Text>
                  <Text className="text-lg font-bold text-foreground">
                    {getText(currentExerciseStep.title, currentExerciseStep.titleEn)}
                  </Text>
                </View>
              </View>

              <View className={cn("mb-4 gap-1", flexDir())}>
                {exerciseSteps.map((step, index) => (
                  <View
                    key={step.id}
                    className={cn("h-1.5 flex-1 rounded-full", index <= exerciseStepIndex ? "bg-purple-500" : "bg-slate-200")}
                  />
                ))}
              </View>

              <View className="rounded-2xl border border-purple-100 bg-purple-50/60 p-4">
                <Text className={cn("text-base font-semibold text-foreground", textAlign())}>
                  {getText(currentExerciseStep.prompt, currentExerciseStep.promptEn)}
                </Text>
              </View>

              <TextInput
                value={exerciseAnswers[exerciseStepIndex] ?? ''}
                onChangeText={updateExerciseAnswer}
                placeholder={getText(currentExerciseStep.placeholder ?? '', currentExerciseStep.placeholderEn)}
                placeholderTextColor="#94a3b8"
                multiline
                textAlign={isRTL ? 'right' : 'left'}
                className="mt-4 min-h-[140px] rounded-2xl border border-purple-300 bg-background px-4 py-4 text-base text-foreground"
              />

              <View className={cn("mt-4 gap-2", flexDir())}>
                <TouchableOpacity
                  onPress={() => {
                    if (!isLastExerciseStep) {
                      setExerciseStepIndex((current) => Math.min(current + 1, exerciseSteps.length - 1));
                    }
                  }}
                  className="h-12 flex-1 items-center justify-center rounded-2xl bg-primary"
                >
                  <Text className="font-bold text-primary-foreground">
                    {isLastExerciseStep ? (language === 'en' ? 'Finish' : 'إنهاء') : language === 'en' ? 'Next' : 'التالي'}
                  </Text>
                </TouchableOpacity>

                {exerciseStepIndex > 0 ? (
                  <TouchableOpacity
                    onPress={() => setExerciseStepIndex((current) => Math.max(current - 1, 0))}
                    className="h-12 flex-1 items-center justify-center rounded-2xl border border-border bg-background"
                  >
                    <Text className="font-bold text-foreground">
                      {language === 'en' ? 'Previous' : 'السابق'}
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          ) : null}

          {currentLesson.sections.map((section) => (
            <View key={section.id} className="rounded-3xl border border-border/50 bg-card p-5">
              <Text className={cn("mb-3 text-xl font-bold text-foreground", textAlign())}>
                {getText(section.heading, section.headingEn)}
              </Text>

              {!!getText(section.body, section.bodyEn) && (
                <Text className={cn("text-base leading-8 text-foreground/85", textAlign())}>
                  {getText(section.body, section.bodyEn)}
                </Text>
              )}

              {(language === 'en' ? section.itemsEn ?? section.items : section.items)?.length ? (
                <View className="mt-3 gap-2">
                  {(language === 'en' ? section.itemsEn ?? section.items : section.items)?.map((item) => (
                    <Text key={item} className={cn("text-base leading-7 text-foreground/85", textAlign())}>
                      {`\u2022 ${item}`}
                    </Text>
                  ))}
                </View>
              ) : null}
            </View>
          ))}

          {currentLesson.practice ? (
            <View className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
              <Text className={cn("text-base leading-7 text-foreground", textAlign())}>
                {getText(currentLesson.practice, currentLesson.practiceEn)}
              </Text>
            </View>
          ) : null}

          {currentLesson.reflectionPrompt ? (
            <View className="rounded-3xl border border-amber-200 bg-amber-50/60 p-5">
              <Text className={cn("mb-3 text-lg font-bold text-foreground", textAlign())}>
                {getText(currentLesson.reflectionPrompt, currentLesson.reflectionPromptEn)}
              </Text>
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder={getText(currentLesson.notePlaceholder ?? '', currentLesson.notePlaceholderEn)}
                placeholderTextColor="#94a3b8"
                multiline
                textAlign={isRTL ? 'right' : 'left'}
                className="min-h-[140px] rounded-2xl border border-border bg-background px-4 py-4 text-base text-foreground"
              />
            </View>
          ) : null}

          {(currentLesson.takeawaysEn?.length || currentLesson.takeaways.length) ? (
            <View className="rounded-3xl border border-border/50 bg-card p-5">
              <Text className={cn("mb-3 text-lg font-bold text-foreground", textAlign())}>
                {language === 'en' ? 'Key Takeaways' : 'أهم النقاط'}
              </Text>
              <View className="gap-2">
                {(language === 'en' ? currentLesson.takeawaysEn ?? currentLesson.takeaways : currentLesson.takeaways).map((item) => (
                  <Text key={item} className={cn("text-base leading-7 text-foreground/85", textAlign())}>
                    {`\u2022 ${item}`}
                  </Text>
                ))}
              </View>
            </View>
          ) : null}

          {currentLesson.action ? (
            <TouchableOpacity
              onPress={handleAction}
              activeOpacity={0.85}
              className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 items-center"
            >
              <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-emerald-500">
                {currentLesson.action.type === 'breathing' ? (
                  <Wind size={30} color="white" />
                ) : (
                  <MessageCircle size={30} color="white" />
                )}
              </View>
              <Text className="mb-2 text-lg font-bold text-foreground">
                {getText(currentLesson.action.label, currentLesson.action.labelEn)}
              </Text>
              {!!currentLesson.action.description && (
                <Text className="text-center text-sm leading-6 text-muted-foreground">
                  {getText(currentLesson.action.description, currentLesson.action.descriptionEn)}
                </Text>
              )}
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>

      <View 
        style={{ paddingBottom: Math.max(16, insets.bottom + 12) }}
        className="border-t border-border bg-background px-4 pt-4"
      >
        <TouchableOpacity
          onPress={handleCompleteLesson}
          className="h-14 items-center justify-center rounded-2xl bg-primary"
        >
          <Text className="text-lg font-bold text-primary-foreground">
            {language === 'en' ? 'Complete Lesson' : 'إكمال الدرس'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
