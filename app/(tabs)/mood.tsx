import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { AppHeader } from '@/components/app-header';
import { LineChart } from 'react-native-chart-kit';
import { Calendar, TrendingUp, Smile } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { useMoodChart, useMoodStats, useMoodToday, useLogMood } from '@/hooks/use-mood';

import { useLocalization } from '@/context/LocalizationContext';

const moods = [
  { emoji: "😫", label: "سيء جداً", level: 1, color: "bg-red-500" },
  { emoji: "😔", label: "سيء", level: 2, color: "bg-orange-500" },
  { emoji: "😐", label: "عادي", level: 3, color: "bg-yellow-500" },
  { emoji: "🙂", label: "جيد", level: 4, color: "bg-green-500" },
  { emoji: "🤩", label: "ممتاز", level: 5, color: "bg-emerald-500" },
];

const screenWidth = Dimensions.get("window").width;

const chartConfig = {
  backgroundColor: "transparent",
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  backgroundGradientFromOpacity: 0,
  backgroundGradientToOpacity: 0,
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
  style: { borderRadius: 16 },
  propsForDots: { r: "5", strokeWidth: "2", stroke: "#fff", fill: "#10b981" },
  propsForBackgroundLines: { strokeDasharray: "", stroke: "rgba(241, 245, 249, 0.5)" },
  propsForLabels: { fontSize: 10, fontWeight: 'bold' },
};

const getDayName = (dateStr: string, isRTL: boolean) => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  
  if (isRTL) {
    const daysAr = ["ح", "ن", "ث", "ر", "خ", "ج", "س"];
    return daysAr[date.getDay()];
  } else {
    const daysEn = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return daysEn[date.getDay()];
  }
};

export default function MoodPage() {
  const { t, isRTL, flexDir, textAlign, alignItems, justifyContent } = useLocalization();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const logMood = useLogMood();
  const { data: chartData, isLoading: chartLoading } = useMoodChart();
  const { data: stats } = useMoodStats();
  const { data: todayEntry } = useMoodToday();
  const hasLoggedToday = todayEntry?.logged ?? false;
  
  const formattedChartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    const labels = last7Days.map(dateStr => getDayName(dateStr, isRTL));
    const data = last7Days.map(dateStr => {
      const matchIndex = chartData?.labels?.findIndex(l => l && l.startsWith(dateStr));
      const val = (matchIndex !== undefined && matchIndex !== -1) ? Number(chartData?.data?.[matchIndex]) : 0;
      return isNaN(val) ? 0 : val;
    });

    return {
      labels,
      datasets: [
        {
          data,
          color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
          strokeWidth: 3,
        },
        { data: [5], withDots: false, color: () => 'transparent' }
      ]
    };
  }, [chartData, isRTL]);
    // console.log(formattedChartData, stats, todayEntry);


  const handleMoodSelect = async (level: number) => {
    setSelectedMood(level);
    try {
      await logMood.mutateAsync({ moodScore: level });
    } catch {
      setSelectedMood(null);
    }
  };

  const avgLabel = () => {
    const avg = stats?.averageMood ?? 0;
    if (avg >= 4.5) return 'ممتاز';
    if (avg >= 3.5) return 'جيد';
    if (avg >= 2.5) return 'متوسط';
    return 'يحتاج تحسين';
  };

  return (
    <View className="flex-1 bg-[#FDFDFD]">
      <View className="bg-white pb-2">
        <AppHeader />
      </View>
  
      <View pointerEvents="none" className="absolute inset-0 overflow-hidden opacity-[0.05]">
        <View className="absolute -top-20 -left-20 h-[400px] w-[400px] rounded-full bg-emerald-100" style={{ transform: [{ scaleX: 1.5 }, { rotate: '45deg' }] }} />
        <View className="absolute top-1/4 -right-40 h-[350px] w-[350px] rounded-full bg-blue-100" style={{ transform: [{ scaleX: 1.2 }] }} />
        <View className="absolute -bottom-20 left-0 h-[300px] w-[300px] rounded-full bg-primary/20" />
      </View>
  
      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={true}>
        <View className="mt-8 mb-8">
          <Text className={cn("text-2xl font-bold text-slate-900 mb-2", textAlign())}>كيف تشعر اليوم؟</Text>
          <Text className={cn("text-sm text-slate-500 font-medium leading-6", textAlign())}>
            {hasLoggedToday ? 'لقد سجلت مزاجك اليوم بالفعل' : 'سجل حالتك المزاجية لنتمكن من مساعدتك بشكل أفضل'}
          </Text>
        </View>
  
        <View className={cn("justify-between mb-8", flexDir())}>
          {moods.map((mood) => {
            const isSelected = selectedMood === mood.level || todayEntry?.entry?.moodScore === mood.level;
            return (
              <TouchableOpacity
                key={mood.level}
                onPress={() => handleMoodSelect(mood.level)}
                activeOpacity={0.8}
                disabled={logMood.isPending}
                className={cn(
                  "items-center justify-between h-24 w-[18%] rounded-[24px] border py-4 transition-all active:scale-95",
                  isSelected
                    ? "bg-white border-emerald-500 shadow-xl shadow-emerald-500/20 scale-105"
                    : "bg-white border-slate-100 shadow-sm shadow-black/5"
                )}
              >
                <Text className="text-3xl">{mood.emoji}</Text>
                <Text className={cn(
                  "text-[10px] font-bold uppercase text-center",
                  isSelected ? "text-emerald-600" : "text-slate-400"
                )}>
                  {mood.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View className="bg-white border border-white/60 rounded-[35px] py-6 mb-8 shadow-2xl overflow-hidden" style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 30, shadowOffset: { width: 0, height: 12 } }}>
          <View className={cn("items-center justify-between px-6 mb-4", flexDir())}>
            <View className={alignItems('start')}>
              <Text className={cn("text-xl font-bold text-slate-900", textAlign())}>ملخص الأسبوع</Text>
              <Text className={cn("text-xs text-slate-500 mt-0.5 font-medium", textAlign())}>بياناتك المسجلة خلال الـ 7 أيام الماضية</Text>
            </View>
            <View className="h-10 w-10 items-center justify-center rounded-xl bg-slate-50 border border-slate-100/50">
              <Calendar size={20} color="#94a3b8" />
            </View>
          </View>

          {chartLoading ? (
            <View className="h-[220px] items-center justify-center">
              <ActivityIndicator color="#10b981" />
            </View>
          ) : (
            <View style={{ direction: 'ltr', alignItems: 'center', width: '100%' }}>
              <LineChart
                data={formattedChartData}
                width={screenWidth - 40}
                height={220}
                fromZero={true}
                segments={5}
                chartConfig={chartConfig}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                  paddingRight: 20, // Extra padding for labels
                  direction: 'ltr',
                  backgroundColor: 'transparent',
                }}
                withVerticalLines={false}
                withHorizontalLines={true}
                withInnerLines={true}
                withOuterLines={false}
                withShadow={true}
              />
            </View>
          )}
        </View>

        <View className={cn("gap-4", flexDir())}>
          <View className="flex-1 bg-white/70 border border-white/60 rounded-[30px] p-5 items-center justify-center" style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 15, shadowOffset: { width: 0, height: 8 } }}>
            <View className="h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 mb-3">
              <TrendingUp color="#3b82f6" size={24} />
            </View>
            <Text className="text-xl font-bold text-slate-900 mb-1">
              {stats?.streak ?? 0} يوم
            </Text>
            <Text className="text-[10px] font-bold text-slate-400 text-center leading-4">أيام متتالية</Text>
          </View>

          <View className="flex-1 bg-white/70 border border-white/60 rounded-[30px] p-5 items-center justify-center" style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 15, shadowOffset: { width: 0, height: 8 } }}>
            <View className="h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 mb-3">
              <Smile color="#10b981" size={24} />
            </View>
            <Text className="text-xl font-bold text-slate-900 mb-1">{avgLabel()}</Text>
            <Text className="text-[10px] font-bold text-slate-400 text-center leading-4">متوسط المزاج العام</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
