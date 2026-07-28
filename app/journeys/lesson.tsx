import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Clock3, MessageCircle, Wind } from 'lucide-react-native';
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

  const activeRoute = getActiveJourneyRoute();
  const journeyId = activeRoute.journeyId;
  const moduleIndex = typeof activeRoute.moduleIndex === 'number' ? activeRoute.moduleIndex : 0;
  const lessonIndex = typeof activeRoute.lessonIndex === 'number' ? activeRoute.lessonIndex : 0;

  const lessonData = useMemo(
    () => getJourneyLesson(journeyId, moduleIndex, lessonIndex),
    [journeyId, moduleIndex, lessonIndex]
  );

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

  const handleAction = () => {
    if (currentLesson.action?.type === 'breathing') {
      router.push('/(tabs)/breathing' as any);
      return;
    }

    if (currentLesson.action?.type === 'chat') {
      router.push('/(tabs)/chat' as any);
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

  const handleCompleteLesson = async () => {
    const progressMap = await getPersistedJourneysProgress();
    const mergedJourney = mergeJourneysWithProgress(progressMap).find((item) => item.id === currentJourney.id) ?? currentJourney;
    const unitIndex = getUnitIndexForLesson(mergedJourney, moduleIndex, lessonIndex);
    const updatedJourney = unitIndex >= 0 ? completeJourneyUnit(mergedJourney, unitIndex) : mergedJourney;

    await saveJourneyProgress(updatedJourney);

    const next = getNextLessonIndices(currentJourney, moduleIndex, lessonIndex);
    if (next) {
      setActiveJourneyLessonRoute(currentJourney.id, next.moduleIndex, next.lessonIndex);
      router.replace({
        pathname: '/journeys/lesson',
        params: {
          journey: currentJourney.id,
          module: String(next.moduleIndex),
          lesson: String(next.lessonIndex),
        },
      } as any);
      return;
    }

    setActiveJourneyRoute(currentJourney.id);
    router.replace(`/journeys/${currentJourney.id}` as any);
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 120 }}>
        <View className={cn("mb-6 items-center justify-between", flexDir())}>
          <TouchableOpacity
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full bg-card border border-border"
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

        <View className="mb-6">
          <Text className={cn("mb-2 text-sm font-semibold text-primary", textAlign())}>
            {getText(currentModule.title, currentModule.titleEn)}
          </Text>
          <Text className={cn("mb-3 text-3xl font-bold text-foreground", textAlign())}>
            {getText(currentLesson.title, currentLesson.titleEn)}
          </Text>
          <Text className={cn("text-base leading-7 text-muted-foreground", textAlign())}>
            {getText(currentLesson.summary, currentLesson.summaryEn)}
          </Text>
        </View>

        <View className="gap-5">
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
              className="rounded-3xl border border-sky-200 bg-sky-50 p-6 items-center"
            >
              <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-sky-500">
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
