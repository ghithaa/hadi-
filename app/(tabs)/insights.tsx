import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { AppHeader } from '@/components/app-header';
import { Smile, Wind, ClipboardList, Calendar, Sparkles, TrendingUp, Info } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useLocalization } from '@/context/LocalizationContext';
import { useReportOverview } from '@/hooks/use-reports';
import { useBreathingStats } from '@/hooks/use-breathing';
import { useAssessmentHistory } from '@/hooks/use-assessments';

export default function InsightsPage() {
  const { t, language } = useLocalization();
  const { data: overview } = useReportOverview();
  const { data: breathingStats } = useBreathingStats();
  const { data: assessmentHistory } = useAssessmentHistory();

  const stats = [
    {
      label: t('insights.stat.mood'),
      value: overview?.moodAverage ? `${overview.moodAverage.toFixed(1)}/5` : `0/5`,
      icon: Smile,
      color: '#0284c7',
      bg: 'bg-blue-500/10',
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

  return (
    <View className="flex-1 bg-background">
      <AppHeader />
      <ScrollView className="flex-1 px-5 py-6" showsVerticalScrollIndicator={false}>
        <View className={cn("mb-8", language === 'ar' ? "items-end" : "items-start")}>
          <View className={cn("flex-row items-center gap-2 mb-1", language === 'en' && "flex-row-reverse")}>
            <Text className="text-3xl font-bold text-foreground tracking-tight">{t('insights.title')}</Text>
            <TrendingUp size={28} color="#0284c7" />
          </View>
          <Text className={cn("text-muted-foreground font-medium", language === 'ar' ? "text-right" : "text-left")}>{t('insights.subtitle')}</Text>
        </View>

        <View className={cn("flex-row flex-wrap justify-between gap-y-4 mb-8", language === 'en' && "flex-row-reverse")}>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="w-[48%] border-none shadow-sm shadow-black/5 rounded-[32px] overflow-hidden">
                <CardContent className={cn("p-5 justify-center", language === 'ar' ? "items-end" : "items-start")}>
                  <View className={cn("h-12 w-12 rounded-2xl items-center justify-center mb-4", stat.bg)}>
                    <Icon size={24} color={stat.color} />
                  </View>
                  <Text className="text-2xl font-bold text-foreground mb-1">{stat.value}</Text>
                  <Text className="text-[11px] font-bold text-muted-foreground/80 lowercase">{stat.label}</Text>
                </CardContent>
              </Card>
            );
          })}
        </View>

        <Card className="border-none shadow-md shadow-black/5 rounded-[40px] mb-8 overflow-hidden bg-white dark:bg-card">
          <CardHeader className={cn("pb-2 pt-6 px-6", language === 'ar' ? "items-end" : "items-start")}>
            <CardTitle className="text-xl font-bold text-foreground">{t('insights.chart.title')}</CardTitle>
            <CardDescription className={cn("mt-1", language === 'ar' ? "text-right" : "text-left")}>{t('insights.chart.desc')}</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <View className="h-56 items-center justify-center bg-secondary/20 rounded-[32px] border border-dashed border-secondary-foreground/10">
              <View className="bg-background h-16 w-16 rounded-full items-center justify-center mb-4 shadow-sm">
                <Sparkles size={32} color="#94a3b8" />
              </View>
              <Text className="text-foreground font-bold text-lg">{t('insights.empty.title')}</Text>
              <Text className="text-sm text-muted-foreground/70 mt-1 max-w-[200px] text-center">
                {t('insights.empty.desc')}
              </Text>
            </View>
          </CardContent>
        </Card>

        <TouchableOpacity activeOpacity={0.9} className="mb-10">
          <View className="relative overflow-hidden rounded-[36px] bg-primary p-7 shadow-xl shadow-primary/20">
            <View className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
            <View className="absolute -left-5 -bottom-5 h-24 w-24 rounded-full bg-white/5" />
            <View className={cn("flex-row items-center gap-5", language === 'en' && "flex-row-reverse")}>
              <View className={cn("flex-1", language === 'ar' ? "items-end" : "items-start")}>
                <Text className={cn("text-white text-xl font-bold mb-2", language === 'ar' ? "text-right" : "text-left")}>{t('insights.premium.title')}</Text>
                <Text className={cn("text-white/80 text-[13px] font-medium leading-5", language === 'ar' ? "text-right" : "text-left")}>
                  {t('insights.premium.desc')}
                </Text>
              </View>
              <View className="h-14 w-14 bg-white/20 rounded-2xl items-center justify-center rotate-12">
                <ClipboardList size={28} color="white" />
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <View className={cn("flex-row items-center justify-center gap-2 mb-12 opacity-40", language === 'en' && "flex-row-reverse")}>
          <Text className="text-[10px] text-muted-foreground font-bold">{t('insights.footer.info')}</Text>
          <Info size={12} color="gray" />
        </View>
      </ScrollView>
    </View>
  );
}
