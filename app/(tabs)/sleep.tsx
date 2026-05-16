import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { AppHeader } from '@/components/app-header';
import { Button } from '@/components/ui/button';
import Slider from '@react-native-community/slider';
import { Moon, Clock, TrendingUp, Zap } from 'lucide-react-native';
import { LineChart } from 'react-native-chart-kit';
import { cn } from '@/lib/utils';
import { useSleepStats, useSleepChart, useSleepToday, useLogSleep } from '@/hooks/use-sleep';
import { useLocalization } from '@/context/LocalizationContext';

const qualityLabelsAr = ["", "سيء جدا", "سيء", "متوسط", "جيد", "ممتاز"];
const qualityLabelsEn = ["", "Very Bad", "Bad", "Average", "Good", "Excellent"];
const qualityColors = ["", "text-destructive", "text-orange-500", "text-amber-500", "text-primary", "text-accent"];

export default function SleepPage() {
  const { isRTL, flexDir, textAlign, alignItems } = useLocalization();
  const [hours, setHours] = useState(7);
  const [quality, setQuality] = useState<number | null>(null);
  const [note, setNote] = useState('');

  const { data: stats } = useSleepStats();
  const { data: chartData, isLoading: chartLoading } = useSleepChart();
  const { data: todayEntry } = useSleepToday();
  const logSleep = useLogSleep();

  const qualityLabels = isRTL ? qualityLabelsAr : qualityLabelsEn;
  const hasLoggedToday = todayEntry?.logged ?? false;

  const formattedChartData = useMemo(() => {
    if (chartData?.data && chartData.data.length > 0) {
      return {
        labels: chartData.labels,
        datasets: [
          { data: chartData.data, color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`, strokeWidth: 3 },
          { data: [12], withDots: false, color: () => 'transparent' }
        ],
      };
    }
    return {
      labels: isRTL
        ? ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"]
        : ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
      datasets: [
        { data: [6, 7.5, 5.5, 8, 7, 6.5, 7.5], color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`, strokeWidth: 3 },
        { data: [12], withDots: false, color: () => 'transparent' }
      ],
    };
  }, [chartData, isRTL]);

  const handleSave = async () => {
    if (quality === null) return;
    try {
      await logSleep.mutateAsync({ hours, quality, note: note.trim() || undefined });
      setNote('');
      setQuality(null);
    } catch {
      // Error handled by React Query
    }
  };

  return (
    <View className="flex-1 bg-background">
      <View className="bg-card/80 pb-2">
        <AppHeader />
      </View>

      <View className="absolute inset-0 overflow-hidden opacity-[0.1]">
        <View className="absolute -top-20 -left-20 h-[400px] w-[400px] rounded-full bg-primary/10" style={{ transform: [{ scaleX: 1.5 }, { rotate: '45deg' }] }} />
        <View className="absolute top-1/4 -right-40 h-[350px] w-[350px] rounded-full bg-accent/10" style={{ transform: [{ scaleX: 1.2 }] }} />
        <View className="absolute -bottom-20 left-0 h-[300px] w-[300px] rounded-full bg-secondary/20" />
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <View className="mt-8 gap-6">
          <View className={cn("justify-between gap-4", flexDir())}>
            <View className="flex-1 bg-card/60 border border-border/40 rounded-[30px] p-5 items-center justify-center" style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 15, shadowOffset: { width: 0, height: 8 } }}>
              <View className="h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 mb-3">
                <Moon color="#0f766e" size={24} />
              </View>
              <Text className="text-2xl font-bold text-foreground">
                {stats?.averageHours?.toFixed(1) ?? '—'}
              </Text>
              <Text className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{isRTL ? 'متوسط الساعات' : 'Avg Hours'}</Text>
            </View>
            <View className="flex-1 bg-card/60 border border-border/40 rounded-[30px] p-5 items-center justify-center" style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 15, shadowOffset: { width: 0, height: 8 } }}>
              <View className="h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 mb-3">
                <Zap color="#3b82f6" size={24} />
              </View>
              <Text className="text-2xl font-bold text-foreground">
                {stats?.averageQuality?.toFixed(1) ?? '—'}
              </Text>
              <Text className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{isRTL ? 'جودة النوم' : 'Sleep Quality'}</Text>
            </View>
          </View>

          <View className="bg-card border border-border/40 rounded-[35px] py-6 shadow-2xl overflow-hidden" style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 30, shadowOffset: { width: 0, height: 12 } }}>
            <View className="px-6 mb-4">
              <Text className={cn("text-xl font-bold text-foreground", textAlign())}>{isRTL ? 'تحليل النوم' : 'Sleep Analysis'}</Text>
              <Text className={cn("text-xs text-muted-foreground mt-0.5 font-medium", textAlign())}>{isRTL ? 'نظرة عامة على نمط نومك خلال الاسبوع' : 'An overview of your sleep pattern this week'}</Text>
            </View>
            <View className="items-center">
              <LineChart
                data={formattedChartData}
                width={Dimensions.get("window").width - 40}
                height={200}
                fromZero={true}
                segments={4}
                chartConfig={{
                  backgroundColor: "transparent",
                  backgroundGradientFrom: "#ffffff",
                  backgroundGradientTo: "#ffffff",
                  backgroundGradientFromOpacity: 0,
                  backgroundGradientToOpacity: 0,
                  decimalPlaces: 1,
                  color: (opacity = 1) => `rgba(15, 118, 110, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
                  style: { borderRadius: 24 },
                  propsForDots: { r: "5", strokeWidth: "2", stroke: "#ffffff", fill: "#0f766e" },
                  propsForLabels: { fontSize: 10, fontWeight: 'bold' },
                }}
                bezier
                withVerticalLines={false}
                withHorizontalLines={true}
                withShadow={true}
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                  paddingRight: 20, // Extra padding for labels
                }}
              />
            </View>
          </View>

          <View className="bg-card border border-border/40 rounded-[35px] p-6 shadow-2xl" style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 30, shadowOffset: { width: 0, height: 12 } }}>
            <View className="mb-6">
              <Text className={cn("text-xl font-bold text-foreground", textAlign())}>{isRTL ? 'تسجيل النوم' : 'Log Sleep'}</Text>
              <Text className={cn("text-xs text-muted-foreground mt-0.5 font-medium", textAlign())}>
                {new Date().toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
              </Text>
            </View>

            {!hasLoggedToday ? (
              <View className="gap-6">
                <View className="gap-4">
                  <View className={cn("justify-between items-center px-1", flexDir())}>
                    <Text className="text-sm font-bold text-slate-800">{isRTL ? `ساعات النوم: ${hours}` : `Sleep Hours: ${hours}`}</Text>
                    <View className="h-8 w-8 items-center justify-center rounded-lg bg-violet-50">
                      <Clock size={16} color="#8B5CF6" />
                    </View>
                  </View>
                  <View className="bg-slate-50/50 p-2 rounded-2xl border border-slate-100">
                    <Slider
                      style={{ width: '100%', height: 40 }}
                      minimumValue={0}
                      maximumValue={12}
                      step={0.5}
                      value={hours}
                      onValueChange={setHours}
                      minimumTrackTintColor="#8B5CF6"
                      maximumTrackTintColor="#E2E8F0"
                      thumbTintColor="#8B5CF6"
                    />
                  </View>
                </View>

                <View className="gap-4">
                  <Text className={cn("text-sm font-bold text-slate-800 px-1", textAlign())}>{isRTL ? 'جودة النوم' : 'Sleep Quality'}</Text>
                  <View className={cn("justify-between", flexDir())}>
                    {[1, 2, 3, 4, 5].map((q) => (
                      <TouchableOpacity
                        key={q}
                        onPress={() => setQuality(q)}
                        activeOpacity={0.7}
                        className={cn(
                          "h-12 w-12 items-center justify-center rounded-2xl border transition-all",
                          quality === q ? "bg-primary border-primary shadow-lg shadow-primary/30" : "bg-card border-border/40"
                        )}
                      >
                        <Text className={cn("text-base font-bold", quality === q ? "text-primary-foreground" : "text-muted-foreground")}>
                          {q}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {quality && (
                    <View className="bg-slate-50 p-3 rounded-2xl items-center">
                      <Text className={cn("text-xs font-bold", qualityColors[quality])}>
                        {qualityLabels[quality]}
                      </Text>
                    </View>
                  )}
                </View>

                <View className="gap-3">
                  <Text className={cn("text-sm font-bold text-slate-800 px-1", textAlign())}>{isRTL ? 'ملاحظات' : 'Notes'}</Text>
                  <TextInput
                    className={cn("min-h-[100px] w-full rounded-[25px] border border-slate-100 bg-white/50 px-5 py-4 text-sm text-slate-700 font-medium", textAlign())}
                    placeholder={isRTL ? "كيف كان نومك؟ هل واجهت صعوبات؟" : "How was your sleep? Any difficulties?"}
                    placeholderTextColor="#94a3b8"
                    multiline
                    value={note}
                    onChangeText={setNote}
                    textAlignVertical="top"
                  />
                </View>

                <TouchableOpacity
                  onPress={handleSave}
                  disabled={quality === null || logSleep.isPending}
                  className={cn(
                    "w-full h-14 rounded-2xl items-center justify-center active:scale-[0.98]",
                    quality === null ? "bg-muted" : "bg-primary shadow-xl shadow-primary/20"
                  )}
                >
                  <Text className="text-primary-foreground font-bold text-base">
                    {logSleep.isPending ? (isRTL ? 'جاري الحفظ...' : 'Saving...') : (isRTL ? 'حفظ السجل' : 'Save Record')}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="items-center justify-center py-10">
                <View className="h-20 w-20 items-center justify-center rounded-[28px] bg-emerald-500/10 mb-6" style={{ shadowColor: '#10b981', shadowOpacity: 0.1, shadowRadius: 20 }}>
                  <TrendingUp color="#10b981" size={40} />
                </View>
                <Text className="text-xl font-bold text-slate-900 mb-2">{isRTL ? 'تم تسجيل نوم اليوم' : 'Today\'s sleep logged'}</Text>
                <Text className="text-sm text-slate-500 font-medium">{isRTL ? 'طاب نومك!' : 'Sleep well!'}</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
