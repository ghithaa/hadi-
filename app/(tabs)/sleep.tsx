import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { AppHeader } from '@/components/app-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Slider from '@react-native-community/slider';
import { Moon, Sun, Clock, TrendingUp, Zap, Info } from 'lucide-react-native';
import { LineChart } from 'react-native-chart-kit';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cn } from '@/lib/utils';

interface SleepEntry {
  id: string;
  date: string;
  hours: number;
  quality: number;
  note: string;
}

const qualityLabels = ["", "سيء جدا", "سيء", "متوسط", "جيد", "ممتاز"];
const qualityColors = [
  "",
  "text-destructive",
  "text-orange-500",
  "text-amber-500",
  "text-primary",
  "text-accent",
];

function generateSampleSleep(): SleepEntry[] {
  const entries: SleepEntry[] = [];
  const today = new Date();
  const hours = [6, 7.5, 5.5, 8, 7, 6.5, 7.5];
  const qualities = [3, 4, 2, 5, 4, 3, 4];
  const notes = [
    "استيقظت مرتين خلال الليل",
    "نمت نوم عميق ومريح",
    "سهرت بسبب ضغط العمل",
    "افضل ليلة نوم هذا الاسبوع",
    "نوم جيد بشكل عام",
    "تأخرت في النوم بسبب الهاتف",
    "نوم مريح بعد تمرين رياضي",
  ];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    entries.push({
      id: `s-${i}`,
      date: date.toISOString().split("T")[0],
      hours: hours[6 - i],
      quality: qualities[6 - i],
      note: notes[6 - i],
    });
  }
  return entries;
}

export default function SleepPage() {
  const insets = useSafeAreaInsets();
  const [entries, setEntries] = useState<SleepEntry[]>(generateSampleSleep);
  const [hours, setHours] = useState(7);
  const [quality, setQuality] = useState<number | null>(null);
  const [note, setNote] = useState("");

  const todayStr = new Date().toISOString().split("T")[0];
  const hasLoggedToday = entries.some((e) => e.date === todayStr);

  const avgHours = useMemo(() => {
    if (entries.length === 0) return 0;
    return (entries.reduce((s, e) => s + e.hours, 0) / entries.length).toFixed(1);
  }, [entries]);

  const avgQuality = useMemo(() => {
    if (entries.length === 0) return 0;
    return (entries.reduce((s, e) => s + e.quality, 0) / entries.length).toFixed(1);
  }, [entries]);

  const chartData = useMemo(() => {
    return {
      labels: entries.map((e) => new Date(e.date).toLocaleDateString("ar-SA", { weekday: "short" })),
      datasets: [
        {
          data: entries.map((e) => e.hours),
          color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`, // primary
          strokeWidth: 3
        }
      ]
    };
  }, [entries]);

  const handleSave = () => {
    if (quality === null) return;
    const newEntry: SleepEntry = {
      id: Date.now().toString(),
      date: todayStr,
      hours,
      quality,
      note,
    };
    setEntries([...entries, newEntry]);
  };

  return (
    <View className="flex-1 bg-background">
      <View className="bg-card/80 pb-2">
        <AppHeader />
      </View>

      {/* Organic Background Blobs */}
      <View className="absolute inset-0 overflow-hidden opacity-[0.1]">
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
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-8 gap-6">
          <View className="flex-row-reverse justify-between gap-4">
            <View
              className="flex-1 bg-card/60 border border-border/40 rounded-[30px] p-5 items-center justify-center"
              style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 15, shadowOffset: { width: 0, height: 8 } }}
            >
              <View className="h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 mb-3">
                <Moon color="#0f766e" size={24} />
              </View>
              <Text className="text-2xl font-bold text-foreground">{avgHours}</Text>
              <Text className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">متوسط الساعات</Text>
            </View>
            <View
              className="flex-1 bg-card/60 border border-border/40 rounded-[30px] p-5 items-center justify-center"
              style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 15, shadowOffset: { width: 0, height: 8 } }}
            >
              <View className="h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 mb-3">
                <Zap color="#3b82f6" size={24} />
              </View>
              <Text className="text-2xl font-bold text-foreground">{avgQuality}</Text>
              <Text className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">جودة النوم</Text>
            </View>
          </View>

          <View
            className="bg-card border border-border/40 rounded-[35px] py-6 shadow-2xl overflow-hidden"
            style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 30, shadowOffset: { width: 0, height: 12 } }}
          >
            <View className="px-6 mb-4">
              <Text className="text-xl font-bold text-foreground text-right">تحليل النوم</Text>
              <Text className="text-xs text-muted-foreground text-right mt-0.5 font-medium">نظرة عامة على نمط نومك خلال الاسبوع</Text>
            </View>
            <View className="items-center">
              <LineChart
                data={chartData}
                width={Dimensions.get("window").width - 40}
                height={200}
                chartConfig={{
                  backgroundColor: "transparent",
                  backgroundGradientFrom: "#ffffff",
                  backgroundGradientTo: "#ffffff",
                  backgroundGradientFromOpacity: 0,
                  backgroundGradientToOpacity: 0,
                  decimalPlaces: 1,
                  color: (opacity = 1) => `rgba(15, 118, 110, ${opacity})`, // primary teal-700
                  labelColor: (opacity = 1) => `rgba(var(--foreground), ${opacity})`,
                  style: { borderRadius: 24 },
                  propsForDots: {
                    r: "5",
                    strokeWidth: "2",
                    stroke: "#ffffff",
                    fill: "#0f766e"
                  },
                  propsForLabels: {
                    fontSize: 10,
                    fontWeight: 'bold'
                  }
                }}
                bezier
                withVerticalLines={false}
                withHorizontalLines={true}
                withShadow={true}
                style={{
                  marginVertical: 8,
                  marginRight: 20
                }}
              />
            </View>
          </View>

          <View
            className="bg-card border border-border/40 rounded-[35px] p-6 shadow-2xl"
            style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 30, shadowOffset: { width: 0, height: 12 } }}
          >
            <View className="mb-6">
              <Text className="text-xl font-bold text-foreground text-right">تسجيل النوم</Text>
              <Text className="text-xs text-muted-foreground text-right mt-0.5 font-medium">
                {new Date().toLocaleDateString('ar-SA', { weekday: 'long', day: 'numeric', month: 'long' })}
              </Text>
            </View>

            {!hasLoggedToday ? (
              <View className="gap-6">
                <View className="gap-4">
                  <View className="flex-row-reverse justify-between items-center px-1">
                    <Text className="text-sm font-bold text-slate-800">ساعات النوم: {hours}</Text>
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
                  <Text className="text-sm font-bold text-slate-800 text-right px-1">جودة النوم</Text>
                  <View className="flex-row-reverse justify-between">
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
                  <Text className="text-sm font-bold text-slate-800 text-right px-1">ملاحظات</Text>
                  <TextInput
                    className="min-h-[100px] w-full rounded-[25px] border border-slate-100 bg-white/50 px-5 py-4 text-sm text-slate-700 text-right font-medium"
                    placeholder="كيف كان نومك؟ هل واجهت صعوبات؟"
                    placeholderTextColor="#94a3b8"
                    multiline
                    value={note}
                    onChangeText={setNote}
                    textAlignVertical="top"
                  />
                </View>

                <TouchableOpacity
                  onPress={handleSave}
                  disabled={quality === null}
                  className={cn(
                    "w-full h-14 rounded-2xl items-center justify-center active:scale-[0.98]",
                    quality === null ? "bg-muted" : "bg-primary shadow-xl shadow-primary/20"
                  )}
                >
                  <Text className="text-primary-foreground font-bold text-base">حفظ السجل</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="items-center justify-center py-10">
                <View
                  className="h-20 w-20 items-center justify-center rounded-[28px] bg-emerald-500/10 mb-6"
                  style={{ shadowColor: '#10b981', shadowOpacity: 0.1, shadowRadius: 20 }}
                >
                  <TrendingUp color="#10b981" size={40} />
                </View>
                <Text className="text-xl font-bold text-slate-900 mb-2">تم تسجيل نوم اليوم</Text>
                <Text className="text-sm text-slate-500 font-medium">طاب نومك!</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
