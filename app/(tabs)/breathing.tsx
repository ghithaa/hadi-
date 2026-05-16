import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { AppHeader } from '@/components/app-header';
import { Play } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { patterns } from '@/constants/breathing-patterns';
import { useLocalization } from '@/context/LocalizationContext';

export default function BreathingPage() {
  const router = useRouter();
  const { t, isRTL, flexDir, textAlign, alignItems } = useLocalization();

  const handlePatternSelect = (id: string) => {
    router.push(`/breathing-exercise/${id}`);
  };

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
          className="absolute top-1/4 -right-40 h-[350px] w-[350px] rounded-full bg-teal-200/50"
          style={{ transform: [{ scaleX: 1.2 }] }}
        />
        <View
          className="absolute -bottom-20 left-0 h-[300px] w-[300px] rounded-full bg-purple-200/50"
        />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="my-8 px-2">
          <Text className={cn("text-2xl font-bold text-slate-900", textAlign())}>{isRTL ? 'اختر تمرينك' : 'Choose Your Exercise'}</Text>
          <Text className={cn("text-slate-500 text-sm mt-1", textAlign())}>{isRTL ? 'مجموعة من تمارين التنفس لمساعدتك في مختلف الحالات' : 'A collection of breathing exercises to help you in various situations'}</Text>
        </View>

        <View className="gap-6">
          {patterns.map((pattern) => {
            const Icon = pattern.icon;

            return (
              <TouchableOpacity
                key={pattern.id}
                onPress={() => handlePatternSelect(pattern.id)}
                activeOpacity={0.9}
                className="w-full rounded-[35px] border border-white/60 overflow-hidden shadow-2xl bg-white/70"
                style={{ shadowColor: pattern.color, shadowOpacity: 0.12, shadowRadius: 25, shadowOffset: { width: 0, height: 10 } }}
              >
                {/* Subtle side highlight */}
                <View
                  className={cn("absolute top-0 bottom-0 w-2", isRTL ? "right-0" : "left-0")}
                  style={{ backgroundColor: pattern.color }}
                />

                <View className={cn("p-6 items-center justify-between", flexDir())}>
                  {/* Pattern Icon Header */}
                  <View
                    className="h-14 w-14 items-center justify-center rounded-[22px] shadow-xl"
                    style={{ backgroundColor: pattern.color, shadowColor: pattern.color, shadowOpacity: 0.3 }}
                  >
                    <Icon size={26} color="white" />
                  </View>

                  {/* Center: Content */}
                  <View className={cn("flex-1", alignItems('start'), isRTL ? "mr-5" : "ml-5")}>
                    <View className={cn("items-center gap-2 mb-1", flexDir())}>
                      <Text className={cn("text-xl font-bold text-slate-900", textAlign())}>
                        {pattern.title}
                      </Text>
                      <View className="bg-white/80 px-2 py-0.5 rounded-full border border-slate-100">
                        <Text className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                          {pattern.subtitle}
                        </Text>
                      </View>
                    </View>

                    <Text className={cn("text-xs text-slate-500 leading-5 mb-3 font-medium opacity-80", textAlign())} numberOfLines={1}>
                      {pattern.description}
                    </Text>

                    {/* Simple Timing Pills */}
                    <View className={cn("flex-wrap gap-2", flexDir())}>
                      {pattern.timings.inhale > 0 && (
                        <View className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100/50">
                          <Text className="text-[10px] font-bold text-slate-600">{isRTL ? `استنشق ${pattern.timings.inhale / 1000}ث` : `Inhale ${pattern.timings.inhale / 1000}s`}</Text>
                        </View>
                      )}
                      {pattern.timings.hold > 0 && (
                        <View className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100/50">
                          <Text className="text-[10px] font-bold text-slate-600">{isRTL ? `احبس ${pattern.timings.hold / 1000}ث` : `Hold ${pattern.timings.hold / 1000}s`}</Text>
                        </View>
                      )}
                      {pattern.timings.exhale > 0 && (
                        <View className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100/50">
                          <Text className="text-[10px] font-bold text-slate-600">{isRTL ? `أخرج ${pattern.timings.exhale / 1000}ث` : `Exhale ${pattern.timings.exhale / 1000}s`}</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Play Button Action */}
                  <View
                    className="h-12 w-12 items-center justify-center rounded-2xl bg-slate-50/80 border border-slate-100 shadow-sm"
                  >
                    <Play size={20} color={pattern.color} fill={pattern.color} />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
