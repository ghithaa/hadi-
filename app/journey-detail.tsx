import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, Pressable } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Play, CheckCircle, Lock } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import {
  getActiveJourneyRoute,
  journeysData,
  mergeJourneysWithProgress,
  setActiveJourneyLessonRoute,
  type Journey,
} from '@/constants/journeys-data';
import { getPersistedJourneysProgress } from '@/lib/token-storage';

export default function JourneyDetailPage() {
  const journeyId = getActiveJourneyRoute().journeyId;
  const [journey, setJourney] = useState<Journey | undefined>(() => journeysData.find((item) => item.id === journeyId));

  useEffect(() => {
    let active = true;

    const loadJourney = async () => {
      const progressMap = await getPersistedJourneysProgress();
      if (!active) return;
      const mergedJourney = mergeJourneysWithProgress(progressMap).find((item) => item.id === journeyId);
      setJourney(mergedJourney);
    };

    void loadJourney();

    return () => {
      active = false;
    };
  }, [journeyId]);

  if (!journey) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text>الرحلة غير موجودة</Text>
      </View>
    );
  }

  const Icon = journey.icon;
  const units = (Array.isArray(journey.units) ? journey.units : []).filter(
    (unit): unit is NonNullable<(typeof journey.units)[number]> => !!unit && typeof unit === 'object'
  );
  const nextUnitIndex = units.findIndex((unit) => !unit?.isCompleted && !unit?.isLocked);
  const allUnitsCompleted = units.length > 0 && units.every((unit) => unit?.isCompleted);

  const openUnit = (unitIndex: number) => {
    const unit = units[unitIndex];
    if (!unit || unit.isLocked) return;

    if (typeof unit.moduleIndex === 'number' && typeof unit.lessonIndex === 'number') {
      setActiveJourneyLessonRoute(journey.id, unit.moduleIndex, unit.lessonIndex);
      router.push('/journey-lesson' as any);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="relative h-64 w-full">
          <Image
            source={{ uri: journey.image }}
            className="h-full w-full"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-black/40" />

          <Pressable
            onPress={() => router.back()}
            className="absolute top-12 left-4 h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md"
          >
            <ArrowLeft size={24} color="white" />
          </Pressable>

          <View className="absolute bottom-6 right-4 left-4">
            <View
              className="self-end mb-3 h-12 w-12 items-center justify-center rounded-xl"
              style={{ backgroundColor: journey.color }}
            >
              <Icon size={24} color="white" />
            </View>
            <Text className="text-3xl font-bold text-white text-right mb-2 shadow-sm">
              {journey.title}
            </Text>
            <Text className="text-white/90 text-right text-sm leading-5 shadow-sm">
              {journey.description}
            </Text>
          </View>
        </View>

        <View className="px-4 py-6">
          <View className="flex-row justify-between mb-8 bg-card p-4 rounded-xl border border-border shadow-sm">
            <View className="items-center flex-1 border-r border-border">
              <Text className="text-lg font-bold text-primary">{journey.progress}%</Text>
              <Text className="text-xs text-muted-foreground">التقدم</Text>
            </View>
            <View className="items-center flex-1 border-r border-border">
              <Text className="text-lg font-bold text-primary">{journey.units_count}</Text>
              <Text className="text-xs text-muted-foreground">وحدات</Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-lg font-bold text-primary">{journey.duration}</Text>
              <Text className="text-xs text-muted-foreground">المدة</Text>
            </View>
          </View>

          <Text className="text-xl font-bold text-foreground text-right mb-4">مسار الرحلة</Text>

          <View className="gap-4">
            {units.map((unit, index) => (
              <Pressable
                key={unit.id ?? `${journey.id}-${index}`}
                disabled={!!unit.isLocked}
                onPress={() => openUnit(index)}
                className={cn(
                  "flex-row items-center justify-between p-4 rounded-xl border",
                  unit.isLocked ? "bg-secondary/30 border-border opacity-70" : "bg-card border-border shadow-sm"
                )}
              >
                <View className="items-center justify-center w-10">
                  {unit.isCompleted ? (
                    <CheckCircle size={24} className="text-green-500" color="#22c55e" />
                  ) : unit.isLocked ? (
                    <Lock size={20} className="text-muted-foreground" color="#9ca3af" />
                  ) : (
                    <View className={cn("h-8 w-8 rounded-full items-center justify-center bg-emerald-100")}>
                      <Play size={14} className="ml-0.5" color="#10b981" fill="#10b981" />
                    </View>
                  )}
                </View>

                <View className="flex-1 mr-4">
                  <Text className={cn(
                    "text-base font-semibold text-right mb-1",
                    unit.isLocked ? "text-muted-foreground" : "text-foreground"
                  )}>
                    {unit.title ?? 'بدون عنوان'}
                  </Text>
                  <Text className="text-xs text-muted-foreground text-right">
                    {unit.description ?? ''}
                  </Text>
                </View>

                <Text className="text-lg font-bold text-muted-foreground/20 ml-2">
                  {(index + 1).toString().padStart(2, '0')}
                </Text>
              </Pressable>
            ))}
          </View>
          {units.length === 0 ? (
            <View className="rounded-xl border border-border bg-card p-4">
              <Text className="text-right text-muted-foreground">لا توجد وحدات متاحة لهذه الرحلة حالياً</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      <View className="p-4 bg-background border-t border-border">
        <Pressable
          className={cn("w-full h-14 rounded-xl items-center justify-center shadow-md", allUnitsCompleted ? "bg-emerald-600" : "bg-primary")}
          onPress={() => openUnit(nextUnitIndex)}
          disabled={allUnitsCompleted || nextUnitIndex < 0}
        >
          <Text className="text-primary-foreground font-bold text-lg">
            {allUnitsCompleted ? 'تم إكمال الرحلة' : 'تابع الرحلة'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
