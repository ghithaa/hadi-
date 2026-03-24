import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { AppHeader } from '@/components/app-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart } from 'react-native-chart-kit';
import { Calendar, TrendingUp, Smile, Meh, Frown } from 'lucide-react-native';
import { cn } from '@/lib/utils';

const moods = [
  { emoji: "😫", label: "سيء جداً", level: 1, color: "bg-red-500" },
  { emoji: "😔", label: "سيء", level: 2, color: "bg-orange-500" },
  { emoji: "😐", label: "عادي", level: 3, color: "bg-yellow-500" },
  { emoji: "🙂", label: "جيد", level: 4, color: "bg-green-500" },
  { emoji: "🤩", label: "ممتاز", level: 5, color: "bg-emerald-500" },
];

const screenWidth = Dimensions.get("window").width;

export default function MoodPage() {
  const [selectedMood, setSelectedMood] = useState<number | null>(4); // Default to 'Good' for demo

  const chartData = {
    labels: ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"],
    datasets: [
      {
        data: [3, 4, 2, 5, 4, 3, 4],
        color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`, // primary color
        strokeWidth: 3,
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    backgroundGradientFromOpacity: 0,
    backgroundGradientToOpacity: 0,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "5",
      strokeWidth: "2",
      stroke: "#fff",
      fill: "#10b981",
    },
    propsForBackgroundLines: {
      strokeDasharray: "", // solid lines
      stroke: "rgba(241, 245, 249, 0.5)",
    },
    propsForLabels: {
      fontSize: 10,
      fontWeight: 'bold'
    }
  };

  return (
    <View className="flex-1 bg-[#FDFDFD]">
      <View className="bg-white pb-2">
        <AppHeader />
      </View>

      {/* Organic Background Blobs */}
      <View className="absolute inset-0 overflow-hidden opacity-[0.05]">
        <View
          className="absolute -top-20 -left-20 h-[400px] w-[400px] rounded-full bg-emerald-100"
          style={{ transform: [{ scaleX: 1.5 }, { rotate: '45deg' }] }}
        />
        <View
          className="absolute top-1/4 -right-40 h-[350px] w-[350px] rounded-full bg-blue-100"
          style={{ transform: [{ scaleX: 1.2 }] }}
        />
        <View
          className="absolute -bottom-20 left-0 h-[300px] w-[300px] rounded-full bg-primary/20"
        />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-8 mb-8">
          <Text className="text-2xl font-bold text-slate-900 text-right mb-2">كيف تشعر اليوم؟</Text>
          <Text className="text-sm text-slate-500 text-right font-medium leading-6">سجل حالتك المزاجية لنتمكن من مساعدتك بشكل أفضل</Text>
        </View>

        <View className="flex-row-reverse justify-between mb-8">
          {moods.map((mood) => (
            <TouchableOpacity
              key={mood.level}
              onPress={() => setSelectedMood(mood.level)}
              activeOpacity={0.8}
              className={cn(
                "items-center justify-between h-24 w-[18%] rounded-[24px] border py-4 transition-all",
                selectedMood === mood.level
                  ? "bg-white border-emerald-500 shadow-xl shadow-emerald-500/20 scale-105"
                  : "bg-white border-white shadow-sm shadow-black/5"
              )}
            >
              <Text className="text-3xl">{mood.emoji}</Text>
              <Text className={cn(
                "text-[10px] font-bold uppercase text-center",
                selectedMood === mood.level ? "text-emerald-600" : "text-slate-400"
              )}>
                {mood.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View
          className="bg-white border border-white/60 rounded-[35px] py-6 mb-8 shadow-2xl overflow-hidden"
          style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 30, shadowOffset: { width: 0, height: 12 } }}
        >
          <View className="flex-row-reverse items-center justify-between px-6 mb-4">
            <View>
              <Text className="text-xl font-bold text-slate-900 text-right">ملخص الأسبوع</Text>
              <Text className="text-xs text-slate-500 text-right mt-0.5 font-medium">بياناتك المسجلة خلال الـ 7 أيام الماضية</Text>
            </View>
            <View className="h-10 w-10 items-center justify-center rounded-xl bg-slate-50 border border-slate-100/50">
              <Calendar size={20} color="#94a3b8" />
            </View>
          </View>

          <LineChart
            data={chartData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={{
              marginVertical: 8,
              marginRight: 20
            }}
            withVerticalLines={false}
            withHorizontalLines={true}
            withInnerLines={true}
            withOuterLines={false}
            withShadow={true}
          />
        </View>

        <View className="flex-row gap-4">
          <View
            className="flex-1 bg-white/70 border border-white/60 rounded-[30px] p-5 items-center justify-center"
            style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 15, shadowOffset: { width: 0, height: 8 } }}
          >
            <View className="h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 mb-3">
              <TrendingUp color="#3b82f6" size={24} />
            </View>
            <Text className="text-xl font-bold text-slate-900 mb-1">تحسن</Text>
            <Text className="text-[10px] font-bold text-slate-400 text-center leading-4">مقارنة بالأسبوع الماضي</Text>
          </View>

          <View
            className="flex-1 bg-white/70 border border-white/60 rounded-[30px] p-5 items-center justify-center"
            style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 15, shadowOffset: { width: 0, height: 8 } }}
          >
            <View className="h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 mb-3">
              <Smile color="#10b981" size={24} />
            </View>
            <Text className="text-xl font-bold text-slate-900 mb-1">جيد</Text>
            <Text className="text-[10px] font-bold text-slate-400 text-center leading-4">متوسط المزاج العام</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
