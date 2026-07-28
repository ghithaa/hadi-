import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Pressable } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader } from '@/components/app-header';
import { ArrowLeft, BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Lightbulb, MessageCircle, Pencil, Wind } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { useLocalization } from '@/context/LocalizationContext';
import { getActiveJourneyRoute, journeysData, mergeJourneysWithProgress, setActiveJourneyLessonRoute, setActiveJourneyRoute, type Journey } from '@/constants/journeys-data';
import { getPersistedJourneysProgress } from '@/lib/token-storage';

export default function JourneysPage() {
  const { isRTL, flexDir, textAlign, alignItems } = useLocalization();
  const insets = useSafeAreaInsets();
  const [journeys, setJourneys] = useState<Journey[]>(journeysData);
  const [selectedJourneyId, setSelectedJourneyId] = useState<string | undefined>(() => getActiveJourneyRoute().journeyId);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const loadJourneys = async () => {
        const progressMap = await getPersistedJourneysProgress();
        if (!active) return;
        const mergedJourneys = mergeJourneysWithProgress(progressMap);
        setJourneys(mergedJourneys);
        setSelectedJourneyId((current) => current ?? getActiveJourneyRoute().journeyId);
      };

      loadJourneys();

      return () => {
        active = false;
      };
    }, [])
  );

  const handleNavigate = (id: string) => {
    setActiveJourneyRoute(id);
    setSelectedJourneyId(id);
  };

  const selectedJourney = journeys.find((journey) => journey.id === selectedJourneyId);

  const handleBackToList = () => {
    setSelectedJourneyId(undefined);
    setActiveJourneyRoute(undefined);
  };

  const openSelectedUnit = (journey: Journey, unitIndex: number) => {
    const unit = journey.units[unitIndex];
    if (!unit || unit.isLocked) return;

    if (typeof unit.moduleIndex === 'number' && typeof unit.lessonIndex === 'number') {
      setActiveJourneyLessonRoute(journey.id, unit.moduleIndex, unit.lessonIndex);
      router.push('/journey-lesson' as any);
    }
  };

  if (selectedJourney) {
    const Icon = selectedJourney.icon;
    const units = (Array.isArray(selectedJourney.units) ? selectedJourney.units : []).filter(
      (unit): unit is NonNullable<(typeof selectedJourney.units)[number]> => !!unit && typeof unit === 'object'
    );
    const modules = Array.isArray(selectedJourney.modules) ? selectedJourney.modules : [];
    const getUnitForLesson = (moduleIndex: number, lessonIndex: number) =>
      units.find((unit) => unit.moduleIndex === moduleIndex && unit.lessonIndex === lessonIndex);

    return (
      <View className="flex-1 bg-background">
        <View className="bg-card/80 pb-2">
          <AppHeader />
        </View>

        <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 100 + insets.bottom }}>
          <View className="mb-4 overflow-hidden rounded-[32px] border border-border/40 bg-card shadow-sm">
            <Image source={{ uri: selectedJourney.image }} className="h-48 w-full" resizeMode="cover" />
            <View className="absolute inset-0 bg-black/30" />
            <View
              className="absolute left-4 right-4 z-20 flex-row items-start justify-between"
              style={{ top: Math.max(16, insets.top * 0.25 + 12) }}
            >
              <Pressable
                onPress={handleBackToList}
                hitSlop={12}
                className="h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-white/95"
                style={{ elevation: 3 }}
              >
                <ArrowLeft size={20} color="#0f172a" />
              </Pressable>
            </View>
            <View className="absolute bottom-5 left-4 right-4">
              <View className={cn("mb-3 items-center", flexDir())}>
                <View
                  className="h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: selectedJourney.color }}
                >
                  <Icon size={24} color="white" />
                </View>
              </View>
              <Text className="text-right text-[28px] font-bold text-white">
                {isRTL ? selectedJourney.title : selectedJourney.titleEn ?? selectedJourney.title}
              </Text>
              <Text className="mt-2 text-right text-sm leading-6 text-white/90">
                {isRTL ? selectedJourney.description : selectedJourney.descriptionEn ?? selectedJourney.description}
              </Text>
            </View>
          </View>

          <View className="mb-4 rounded-[28px] border border-border/50 bg-card px-4 py-5 shadow-sm">
            <View className="mb-4 flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-right text-base font-bold text-foreground">
                  {isRTL ? 'تقدمك في الرحلة' : 'Your Journey Progress'}
                </Text>
                <Text className="mt-1 text-right text-xs leading-5 text-muted-foreground">
                  {isRTL ? 'استمر خطوة بخطوة، وسيتم فتح الدروس تلقائياً مع التقدم.' : 'Keep going lesson by lesson. New content unlocks automatically as you progress.'}
                </Text>
              </View>
              <View className="ml-3 rounded-full px-3 py-2" style={{ backgroundColor: `${selectedJourney.color}18` }}>
                <Text className="text-sm font-bold" style={{ color: selectedJourney.color }}>
                  {selectedJourney.progress}%
                </Text>
              </View>
            </View>

            <View className="mb-4 h-2.5 overflow-hidden rounded-full bg-slate-100">
              <View
                className="h-full rounded-full"
                style={{
                  width: `${selectedJourney.progress}%`,
                  backgroundColor: selectedJourney.color,
                  alignSelf: isRTL ? 'flex-end' : 'flex-start',
                }}
              />
            </View>

            <View className={cn("rounded-[24px] border border-border/40 bg-background px-2 py-3", isRTL ? "flex-row-reverse" : "flex-row")}>
              <View className={cn("flex-1 items-center", isRTL ? "border-l border-border" : "border-r border-border")}>
                <Text className="text-lg font-bold text-primary">{selectedJourney.progress}%</Text>
                <Text className="text-xs text-muted-foreground">{isRTL ? 'التقدم' : 'Progress'}</Text>
              </View>
              <View className={cn("flex-1 items-center", isRTL ? "border-l border-border" : "border-r border-border")}>
                <Text className="text-lg font-bold text-primary">{selectedJourney.units_count}</Text>
                <Text className="text-xs text-muted-foreground">{isRTL ? 'دروس' : 'Lessons'}</Text>
              </View>
              <View className="flex-1 items-center">
                <Text className="text-lg font-bold text-primary">
                  {isRTL ? selectedJourney.duration : selectedJourney.durationEn ?? selectedJourney.duration}
                </Text>
                <Text className="text-xs text-muted-foreground">{isRTL ? 'المدة' : 'Duration'}</Text>
              </View>
            </View>
          </View>

          <View className={cn("mb-4 items-center justify-between", flexDir())}>
            <View className="flex-1">
              <Text className="text-right text-lg font-bold text-foreground">
                {isRTL ? 'خطة الرحلة' : 'Journey Plan'}
              </Text>
              <Text className="mt-1 text-right text-xs leading-5 text-muted-foreground">
                {isRTL ? 'افتح كل درس عند اكتمال الدرس السابق.' : 'Each lesson unlocks after the previous one is completed.'}
              </Text>
            </View>
          </View>

          <View className="gap-3">
            {modules.map((module, moduleIndex) => {
              const moduleLessons = module.lessons ?? [];
              const moduleUnits = moduleLessons.map((_, lessonIndex) => getUnitForLesson(moduleIndex, lessonIndex));
              const allModuleLessonsLocked = moduleUnits.every((unit) => !unit || unit.isLocked);
              const completedLessonsCount = moduleUnits.filter((unit) => unit?.isCompleted).length;

              return (
                <View
                  key={module.id}
                  className="rounded-[24px] border px-4 py-4 "
                  style={
                    allModuleLessonsLocked
                      ? { backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }
                      : { backgroundColor: `${selectedJourney.color}10`, borderColor: `${selectedJourney.color}30` }
                  }
                >
                  <View className="mb-3 flex-row items-start justify-between">
                    <View className="ml-3 h-9 w-9 items-center justify-center rounded-full bg-white">
                      {allModuleLessonsLocked ? (
                        <View className="min-w-[34px] rounded-full bg-indigo-500 px-2 py-1 items-center">
                          <Text className="text-xs font-bold text-white">{moduleIndex + 1}</Text>
                        </View>
                      ) : (
                        <CheckCircle2 size={20} color={selectedJourney.color} />
                      )}
                    </View>

                    <View className="flex-1">
                      <Text className="text-right text-base font-bold text-foreground">
                        {isRTL ? module.title : module.titleEn ?? module.title}
                      </Text>
                      <Text className="mt-1 text-right text-xs leading-5 text-muted-foreground">
                        {isRTL ? module.description : module.descriptionEn ?? module.description}
                      </Text>
                    </View>
                  </View>

                  <View className="gap-2">
                    {moduleLessons.map((lesson, lessonIndex) => {
                      const unit = getUnitForLesson(moduleIndex, lessonIndex);
                      const unitIndex = units.findIndex((item) => item.id === unit?.id);
                      const isLocked = !!unit?.isLocked;
                      const isPracticeLesson =
                        !!lesson.reflectionPrompt ||
                        lesson.exercise?.type === 'multi_step_reflection' ||
                        lesson.exercise?.type === 'grounding_senses';
                      const LessonIcon = lesson.action?.type === 'chat'
                        ? MessageCircle
                        : lesson.action?.type === 'breathing'
                          ? Wind
                          : isPracticeLesson
                            ? Pencil
                            : BookOpen;

                      return (
                        <Pressable
                          key={`${module.id}-${lesson.id}`}
                          disabled={isLocked || unitIndex < 0}
                          onPress={() => openSelectedUnit(selectedJourney, unitIndex)}
                          className={cn(
                            "flex-row items-center rounded-[18px] border px-4 py-4",
                            isLocked ? "border-slate-200 bg-slate-100" : "bg-white"
                          )}
                          style={isLocked ? undefined : { borderColor: `${selectedJourney.color}22` }}
                        >
                          {isRTL ? (
                            <>
                              <ChevronLeft size={18} color="#94a3b8" />
                              <View className="flex-1 mx-3">
                                <Text className={cn("text-right text-sm font-semibold", isLocked ? "text-slate-500" : "text-foreground")}>
                                  {lesson.title}
                                </Text>
                                <Text className="mt-1 text-right text-[11px] text-muted-foreground">
                                  {(isPracticeLesson ? 'تطبيق' : lesson.action?.type === 'chat' ? 'محادثة' : lesson.action?.type === 'breathing' ? 'تمارين تنفس' : 'تعليمي') + ' • ' + lesson.duration}
                                </Text>
                              </View>
                              <View
                                className={cn(
                                  "h-8 w-8 items-center justify-center rounded-xl",
                                  isLocked ? "bg-slate-200" : ""
                                )}
                                style={isLocked ? undefined : { backgroundColor: selectedJourney.color }}
                              >
                                {unit?.isCompleted ? (
                                  <CheckCircle2 size={16} color="white" />
                                ) : (
                                  <LessonIcon size={15} color={isLocked ? "#64748b" : "white"} />
                                )}
                              </View>
                            </>
                          ) : (
                            <>
                              <View
                                className={cn(
                                  "h-8 w-8 items-center justify-center rounded-xl",
                                  isLocked ? "bg-slate-200" : ""
                                )}
                                style={isLocked ? undefined : { backgroundColor: selectedJourney.color }}
                              >
                                {unit?.isCompleted ? (
                                  <CheckCircle2 size={16} color="white" />
                                ) : (
                                  <LessonIcon size={15} color={isLocked ? "#64748b" : "white"} />
                                )}
                              </View>
                              <View className="flex-1 mx-3">
                                <Text className={cn("text-left text-sm font-semibold", isLocked ? "text-slate-500" : "text-foreground")}>
                                  {lesson.titleEn ?? lesson.title}
                                </Text>
                                <Text className="mt-1 text-left text-[11px] text-muted-foreground">
                                  {(isPracticeLesson ? 'Practice' : lesson.action?.type === 'chat' ? 'Conversation' : lesson.action?.type === 'breathing' ? 'Breathing' : 'Learning') + ' • ' + (lesson.durationEn ?? lesson.duration)}
                                </Text>
                              </View>
                              <ChevronRight size={18} color="#94a3b8" />
                            </>
                          )}
                        </Pressable>
                      );
                    })}
                  </View>

                  {completedLessonsCount > 0 ? (
                    <Text className="mt-3 text-right text-[11px] font-semibold" style={{ color: selectedJourney.color }}>
                      {isRTL ? `${completedLessonsCount} مكتمل` : `${completedLessonsCount} completed`}
                    </Text>
                  ) : null}
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <View className="bg-card/80 pb-2">
        <AppHeader />
      </View>

      {/* Organic Background Blobs */}
      <View pointerEvents="none" className="absolute inset-0 overflow-hidden opacity-[0.1]">
        <View
          className="absolute -top-20 -left-20 h-[400px] w-[400px] rounded-full bg-primary/10"
          style={{ transform: [{ scaleX: 1.5 }, { rotate: '45deg' }] }}
        />
        <View
          className="absolute top-1/4 -right-40 h-[350px] w-[350px] rounded-full bg-accent/10"
          style={{ transform: [{ scaleX: 1.2 }] }}
        />
        <View
          className="absolute -bottom-20 left-0 h-[300px] w-[300px] rounded-full bg-secondary/20"
        />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-8 mb-8">
          <Text className={cn("text-2xl font-bold text-foreground tracking-tight", textAlign())}>{isRTL ? 'رحلاتك العلاجية' : 'Your Healing Journeys'}</Text>
          <Text className={cn("text-muted-foreground text-sm mt-1 font-medium", textAlign())}>{isRTL ? 'باشر تقدمك في البرامج العلاجية المتكاملة' : 'Track your progress in comprehensive healing programs'}</Text>
        </View>

        <View className="gap-6 mb-8">
          {journeys.map((journey, index) => {
            const Icon = journey.icon;
            return (
              <TouchableOpacity
                key={journey.id}
                onPress={() => handleNavigate(journey.id)}
                activeOpacity={0.9}
                className={cn(
                  "w-full rounded-[35px] border border-border/40 overflow-hidden bg-card/60",
                  index > 0 && "mt-2"
                )}
                style={{
                  shadowColor: '#000',
                  shadowOpacity: 0.08,
                  shadowRadius: 25,
                  shadowOffset: { width: 0, height: 12 }
                }}
              >
                {/* Subtle side highlight */}
                <View
                  className={cn("absolute top-0 bottom-0 w-2", isRTL ? "right-0" : "left-0")}
                  style={{ backgroundColor: journey.color }}
                />

                <View className="p-6">
                  <View className={cn("items-center justify-between mb-5", flexDir())}>
                    {/* Icon Container */}
                    <View
                      className="h-14 w-14 items-center justify-center rounded-[22px]"
                      style={{
                        backgroundColor: journey.color,
                        shadowColor: journey.color,
                        shadowOpacity: 0.22,
                        shadowRadius: 12,
                        shadowOffset: { width: 0, height: 5 }
                      }}
                    >
                      <Icon color="white" size={26} />
                    </View>

                    {/* Content */}
                    <View className={cn("flex-1", alignItems('start'), isRTL ? "mr-5" : "ml-5")}>
                      <Text className={cn("text-xl font-bold text-foreground mb-1 tracking-tight", textAlign())}>
                        {isRTL ? journey.title : journey.titleEn ?? journey.title}
                      </Text>
                      <Text className={cn("text-xs text-muted-foreground font-bold opacity-80 leading-5 uppercase tracking-tighter", textAlign())}>
                        {isRTL ? journey.description : journey.descriptionEn ?? journey.description}
                      </Text>
                    </View>
                  </View>

                  <View className={cn("items-center justify-between mb-4 px-1", flexDir())}>
                    <View className={cn("items-center gap-4", flexDir())}>
                      <View className="px-3 py-1 rounded-lg bg-secondary/50 border border-border/40">
                        <Text className="text-[10px] font-bold text-muted-foreground uppercase">
                          {isRTL ? `${journey.units_count} وحدات` : `${journey.units_count} Units`}
                        </Text>
                      </View>
                      <View className="px-3 py-1 rounded-lg bg-secondary/50 border border-border/40">
                        <Text className="text-[10px] font-bold text-muted-foreground uppercase">
                          {isRTL ? journey.duration : journey.durationEn ?? journey.duration}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Progress Bar */}
                  <View className="w-full pt-4 border-t border-slate-50">
                    <View className={cn("justify-between items-center mb-2 px-1", flexDir())}>
                      <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{isRTL ? 'التقدم المحرز' : 'Progress'}</Text>
                      <View className={cn("items-center gap-1", flexDir())}>
                        <Text className="text-xs font-bold text-primary">
                          {journey.progress}%
                        </Text>
                        <Text className="text-[10px] font-bold text-slate-400">{isRTL ? 'مكتمل' : 'complete'}</Text>
                      </View>
                    </View>
                    <View className="h-2 w-full bg-slate-100/50 rounded-full overflow-hidden">
                      <View
                        className="h-full bg-primary rounded-full transition-all"
                        style={{
                          width: `${journey.progress}%`,
                          alignSelf: isRTL ? 'flex-end' : 'flex-start',
                        }}
                      >
                        <View className="absolute inset-0 bg-white/20" />
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Improved Tip Box */}
        <View
          className={cn("bg-orange-50/80 rounded-[28px] p-6 items-start border border-orange-100/50 mb-12", flexDir())}
          style={{ shadowColor: '#f97316', shadowOpacity: 0.05, shadowRadius: 15 }}
        >
          <View className="h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm shadow-orange-200">
            <Lightbulb size={22} color="#f97316" />
          </View>
          <View className={cn("flex-1", alignItems('start'), isRTL ? "mr-4" : "ml-4")}>
            <Text className={cn("text-orange-900 font-bold text-sm mb-1", textAlign())}>{isRTL ? 'نصيحة هادي' : 'Hadee Tip'}</Text>
            <Text className={cn("text-orange-800/70 text-xs leading-6 font-medium", textAlign())}>
              {isRTL
                ? 'كل رحلة مصممة بعناية مع محتوى تعليمي، تمارين تفاعلية، ومحادثات مع هادي لمساعدتك في رحلة التعافي. ابدأ رحلتك اليوم!'
                : 'Each journey is carefully designed with educational content, interactive exercises, and conversations with Hadee to help you on your recovery journey. Start your journey today!'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
