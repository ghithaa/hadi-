import { View, Text, ScrollView, Dimensions } from 'react-native';
import { Stack } from 'expo-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { useReportOverview, useMoodTrends } from '@/hooks/use-reports';
import { useSleepChart } from '@/hooks/use-sleep';
import { LoadingState } from '@/components/ui/loading-state';

export default function Reports() {
  const primary = useThemeColor({}, 'tint');
  const background = useThemeColor({}, 'background');
  const text = useThemeColor({}, 'text');

  const { data: overview, isLoading: overviewLoading } = useReportOverview();
  const { data: moodTrends } = useMoodTrends();
  const { data: sleepChart } = useSleepChart();

  const chartConfig = {
    backgroundGradientFrom: background,
    backgroundGradientTo: background,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) => text,
    style: { borderRadius: 16 },
    propsForDots: { r: "6", strokeWidth: "2", stroke: "#ffa726" },
  };

  const moodData = moodTrends && moodTrends.length > 0
    ? {
        labels: moodTrends.slice(-7).map((t) => {
          const d = new Date(t.date);
          return d.toLocaleDateString('ar-SA', { weekday: 'short' });
        }),
        datasets: [{ data: moodTrends.slice(-7).map((t) => t.score), color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, strokeWidth: 2 }],
        legend: ['المزاج العام'],
      }
    : {
        labels: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
        datasets: [{ data: [0, 0, 0, 0, 0, 0, 0], color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, strokeWidth: 2 }],
        legend: ['المزاج العام'],
      };

  const sleepData = sleepChart && (sleepChart.data?.length ?? 0) > 0
    ? { labels: sleepChart.labels, datasets: [{ data: sleepChart.data }] }
    : { labels: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'], datasets: [{ data: [0, 0, 0, 0, 0, 0, 0] }] };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView className="flex-1 bg-background p-4" contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="flex-row items-center justify-between mb-6 pt-12">
          <View>
            <Text className="text-2xl font-bold text-foreground text-right">التقارير والإحصائيات</Text>
            <Text className="text-muted-foreground text-right">تحليل شامل لحالتك الصحية والنفسية</Text>
          </View>
          <View className="bg-primary/10 p-2 rounded-full">
            <Ionicons name="stats-chart" size={24} color={primary} />
          </View>
        </View>

        {overviewLoading ? <LoadingState /> : (
          <Card className="mb-6 border-primary/20">
            <CardHeader>
              <CardTitle className="text-right">ملخص الأسبوع</CardTitle>
              <CardDescription className="text-right">نظرة عامة على أدائك هذا الأسبوع</CardDescription>
            </CardHeader>
            <CardContent>
              <View className="flex-row justify-between flex-wrap">
                <View className="w-[48%] bg-secondary/10 p-3 rounded-lg mb-3 items-center">
                  <Text className="text-2xl font-bold text-primary">
                    {overview?.moodAverage?.toFixed(1) ?? '—'}
                  </Text>
                  <Text className="text-xs text-muted-foreground">متوسط المزاج</Text>
                </View>
                <View className="w-[48%] bg-secondary/10 p-3 rounded-lg mb-3 items-center">
                  <Text className="text-2xl font-bold text-primary">
                    {overview?.sleepAverage?.toFixed(1) ?? '—'}
                  </Text>
                  <Text className="text-xs text-muted-foreground">ساعات النوم</Text>
                </View>
                <View className="w-[48%] bg-secondary/10 p-3 rounded-lg items-center">
                  <Text className="text-2xl font-bold text-primary">
                    {overview?.gratitudeStreak ?? 0}
                  </Text>
                  <Text className="text-xs text-muted-foreground">أيام متتالية</Text>
                </View>
                <View className="w-[48%] bg-secondary/10 p-3 rounded-lg items-center">
                  <Text className="text-2xl font-bold text-primary">
                    {overview?.breathingSessionsThisWeek ?? 0}
                  </Text>
                  <Text className="text-xs text-muted-foreground">جلسات تنفس</Text>
                </View>
              </View>
            </CardContent>
          </Card>
        )}

        <View className="mb-6">
          <Text className="text-lg font-bold text-foreground mb-4 text-right">تحليل المزاج</Text>
          <LineChart
            data={moodData}
            width={Dimensions.get('window').width - 32}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={{ marginVertical: 8, borderRadius: 16 }}
          />
        </View>

        <View className="mb-6">
          <Text className="text-lg font-bold text-foreground mb-4 text-right">جودة النوم</Text>
          <BarChart
            data={sleepData}
            width={Dimensions.get('window').width - 32}
            height={220}
            yAxisLabel=""
            yAxisSuffix=" س"
            chartConfig={{ ...chartConfig, color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})` }}
            style={{ marginVertical: 8, borderRadius: 16 }}
            verticalLabelRotation={0}
          />
        </View>
      </ScrollView>
    </>
  );
}
