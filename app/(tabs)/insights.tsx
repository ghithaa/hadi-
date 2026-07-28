import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { AppHeader } from '@/components/app-header';
import { Smile, Wind, ClipboardList, Calendar, Sparkles, TrendingUp, Info } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useLocalization } from '@/context/LocalizationContext';
import { useReportOverview, useMoodTrends } from '@/hooks/use-reports';
import { useBreathingStats } from '@/hooks/use-breathing';
import { useAssessmentHistory } from '@/hooks/use-assessments';
import { useSleepChart } from '@/hooks/use-sleep';
import { LineChart, BarChart } from 'react-native-chart-kit';

export default function InsightsPage() {
  const { t, language, isRTL, flexDir, textAlign, alignItems, justifyContent, l, r } = useLocalization();
  const { data: overview, isLoading: overviewLoading } = useReportOverview();
  const { data: breathingStats } = useBreathingStats();
  const { data: assessmentHistory } = useAssessmentHistory();

  const { data: moodTrends, isLoading: moodLoading } = useMoodTrends();
  const { data: sleepChart, isLoading: sleepLoading } = useSleepChart();

  const stats = [
    {
      label: t('insights.stat.mood'),
      value: overview?.moodAverage ? `${overview.moodAverage.toFixed(1)}/5` : `0/5`,
      icon: Smile,
      color: '#0f766e',
      bg: 'bg-primary/10',
    },
    {
      label: t('insights.stat.breathing'),
      value: `${breathingStats?.totalMinutes ?? 0} ${t('insights.stat.minutes')}`,
      icon: Wind,
      color: '#8b5cf6',
      bg: 'bg-purple-500/10',
    },
    {
      label: t('insights.stat.assessments'),
      value: `${assessmentHistory?.length ?? 0} ${t('insights.stat.tests')}`,
      icon: ClipboardList,
      color: '#10b981',
      bg: 'bg-emerald-500/10',
    },
    {
      label: t('insights.stat.days'),
      value: `${overview?.gratitudeStreak ?? 0} ${t('insights.stat.daySuffix')}`,
      icon: Calendar,
      color: '#f59e0b',
      bg: 'bg-amber-500/10',
    },
  ];

  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const moodData = {
    labels: last7Days.map(dateStr => {
      const d = new Date(dateStr);
      return `${d.getDate()}/${d.getMonth() + 1}`;
    }),
    datasets: [
      {
        data: last7Days.map(dateStr => {
          const match = moodTrends?.find(t => t.date && t.date.startsWith(dateStr));
          const val = match ? Number(match.score) : 0;
          return isNaN(val) ? 0 : val;
        })
      },
      { data: [5], withDots: false, color: () => 'transparent' }
    ]
  };

  const sleepData = {
    labels: last7Days.map(dateStr => {
      const d = new Date(dateStr);
      return `${d.getDate()}/${d.getMonth() + 1}`;
    }),
    datasets: [
      {
        data: last7Days.map(dateStr => {
          const matchIndex = sleepChart?.labels?.findIndex(l => l && l.startsWith(dateStr));
          const val = (matchIndex !== undefined && matchIndex !== -1) ? Number(sleepChart?.data?.[matchIndex]) : 0;
          return isNaN(val) ? 0 : val;
        })
      },
      { data: [12], withDots: false, color: () => 'transparent' }
    ]
  };



  const chartConfigBase = {
    backgroundColor: 'transparent',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#ffffff',
    backgroundGradientToOpacity: 0,
    decimalPlaces: 0,
    labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`, // slate-500
    propsForLabels: { fontSize: 10, fontWeight: 'bold' },
    style: { borderRadius: 16 },
  };

  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 88;

  return (
    <View className="flex-1 bg-background">
      <AppHeader />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        <View className={cn("mb-8", alignItems('start'))}>
          <View className={cn("items-center gap-2 mb-1", flexDir())}>
            <Text className="text-3xl font-bold text-foreground tracking-tight">{t('insights.title')}</Text>
            <TrendingUp size={28} color="#0284c7" />
          </View>
          <Text className={cn("text-muted-foreground font-medium", textAlign())}>{t('insights.subtitle')}</Text>
        </View>

        {overviewLoading ? (
          <View className="h-40 items-center justify-center">
            <ActivityIndicator size="large" color="#0f766e" />
          </View>
        ) : (
          <View className={cn("flex-wrap gap-y-4 mb-8", flexDir(), justifyContent('between'))}>
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="w-[48%] border-none shadow-sm shadow-black/5 rounded-[32px] overflow-hidden">
                  <CardContent className={cn("p-5 justify-center", alignItems('start'))}>
                    <View className={cn("h-12 w-12 rounded-2xl items-center justify-center mb-4", stat.bg)}>
                      <Icon size={24} color={stat.color} />
                    </View>
                    <Text className="text-2xl font-bold text-foreground mb-1">{stat.value}</Text>
                    <Text
                      className="text-[10px] font-bold text-muted-foreground/80"
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.82}
                    >
                      {stat.label}
                    </Text>
                  </CardContent>
                </Card>
              );
            })}
          </View>
        )}

        <Card
          className="border rounded-[40px] mb-8 overflow-hidden"
          style={{
            // backgroundColor: 'rgba(15, 118, 110, 0.03)',
            borderColor: 'rgba(15, 118, 110, 0.10)',
            shadowColor: '#000',
            shadowOpacity: 0.04,
            shadowRadius: 18,
          }}
        >
          <CardHeader className={cn("pb-0 pt-6 px-6", alignItems('start'))}>
            <CardTitle className={cn("text-xl font-bold text-foreground w-full", textAlign())}>{t('insights.chart.title')}</CardTitle>
            <CardDescription className={cn("mt-1 w-full", textAlign())}>{t('insights.chart.desc')}</CardDescription>
          </CardHeader>
          <CardContent className="p-0 pt-4 pb-4">
            {moodLoading ? (
              <View className="h-56 items-center justify-center">
                <ActivityIndicator size="small" color="#0f766e" />
              </View>
            ) : (
              <View className="items-center w-full px-2" style={{ direction: 'ltr' }}>
                <LineChart
                  data={moodData}
                  width={chartWidth}
                  height={210}
                  chartConfig={{
                    ...chartConfigBase,
                    color: (opacity = 1) => `rgba(15, 118, 110, ${Math.max(opacity, 0.35)})`,
                    propsForDots: { r: "5", strokeWidth: "2", stroke: "#0f766e", fill: "#149484" },
                    propsForBackgroundLines: { stroke: 'rgba(15, 118, 110, 0.10)' },
                  }}
                  bezier
                  fromZero={true}
                  segments={5}
                  withVerticalLines={false}
                  withHorizontalLines={true}
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                    direction: 'ltr',
                    backgroundColor: 'transparent',
                  }}
                />
              </View>
            )}
          </CardContent>
        </Card>

        <Card
          className="border rounded-[40px] mb-8 overflow-hidden relative"
          style={{
            // backgroundColor: 'rgba(59, 130, 246, 0.03)',
            borderColor: 'rgba(59, 130, 246, 0.10)',
            shadowColor: '#000',
            shadowOpacity: 0.04,
            shadowRadius: 18,
          }}
        >
          <CardHeader className={cn("pb-0 pt-6 px-6", alignItems('start'))}>
            <View className={cn("items-center gap-2", flexDir())}>
              <CardTitle className="text-xl font-bold text-foreground">{t('insights.chart.sleep.title')}</CardTitle>
              <View className="bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
                <Text className="text-[10px] font-bold text-primary">{isRTL ? "قريباً" : "Soon"}</Text>
              </View>
            </View>
            <CardDescription className={cn("mt-1 w-full", textAlign())}>{t('insights.chart.sleep.desc')}</CardDescription>
          </CardHeader>
          <CardContent className="p-0 pt-4 pb-4 opacity-40">
            {sleepLoading ? (
              <View className="h-56 items-center justify-center">
                <ActivityIndicator size="small" color="#3b82f6" />
              </View>
            ) : (
              <View className="items-center w-full px-2" style={{ direction: 'ltr' }}>
                <BarChart
                  data={sleepData}
                  width={chartWidth}
                  height={210}
                  yAxisLabel=""
                  yAxisSuffix="h"
                  fromZero={true}
                  segments={4}
                  chartConfig={{
                    ...chartConfigBase,
                    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`, // blue-500
                    propsForBackgroundLines: { stroke: 'rgba(59, 130, 246, 0.10)' },
                  }}
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                    direction: 'ltr',
                    backgroundColor: 'transparent',
                  }}
                  showValuesOnTopOfBars
                  withInnerLines={true}
                />
              </View>
            )}
          </CardContent>
        </Card>



        <TouchableOpacity activeOpacity={0.9} className="mb-10">
          <View className="relative overflow-hidden rounded-[36px] bg-primary p-7 shadow-xl shadow-primary/20">
            <View className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
            <View className="absolute -left-5 -bottom-5 h-24 w-24 rounded-full bg-white/5" />
            <View className={cn("items-center gap-5", flexDir())}>
              <View className={cn("flex-1", alignItems('start'))}>
                <Text className={cn("text-white text-xl font-bold mb-2", textAlign())}>{t('insights.premium.title')}</Text>
                <Text className={cn("text-white/80 text-[13px] font-medium leading-5", textAlign())}>
                  {t('insights.premium.desc')}
                </Text>
              </View>
              <View className="h-14 w-14 bg-white/20 rounded-2xl items-center justify-center rotate-12">
                <ClipboardList size={28} color="white" />
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <View className={cn("items-center justify-center gap-2 mb-12 opacity-40", flexDir())}>
          <Text className="text-[10px] text-muted-foreground font-bold">{t('insights.footer.info')}</Text>
          <Info size={12} color="gray" />
        </View>
      </ScrollView>
    </View>
  );
}
