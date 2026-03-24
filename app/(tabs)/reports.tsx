import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Stack } from 'expo-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';

export default function Reports() {
  const primary = useThemeColor({}, 'tint');
  const background = useThemeColor({}, 'background');
  const text = useThemeColor({}, 'text');

  // Sample data - in a real app this would come from the database
  const moodData = {
    labels: ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"],
    datasets: [
      {
        data: [3, 4, 2, 5, 4, 3, 4], // 1-5 scale
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ["المزاج العام"]
  };

  const sleepData = {
    labels: ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"],
    datasets: [
      {
        data: [6, 7, 5, 8, 7, 6, 7]
      }
    ]
  };

  const chartConfig = {
    backgroundGradientFrom: background,
    backgroundGradientTo: background,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) => text,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#ffa726"
    }
  };

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

        {/* Weekly Summary Card */}
        <Card className="mb-6 border-primary/20">
          <CardHeader>
            <CardTitle className="text-right">ملخص الأسبوع</CardTitle>
            <CardDescription className="text-right">نظرة عامة على أدائك هذا الأسبوع</CardDescription>
          </CardHeader>
          <CardContent>
            <View className="flex-row justify-between flex-wrap">
              <View className="w-[48%] bg-secondary/10 p-3 rounded-lg mb-3 items-center">
                <Text className="text-2xl font-bold text-primary">4.2</Text>
                <Text className="text-xs text-muted-foreground">متوسط المزاج</Text>
              </View>
              <View className="w-[48%] bg-secondary/10 p-3 rounded-lg mb-3 items-center">
                <Text className="text-2xl font-bold text-primary">6.8</Text>
                <Text className="text-xs text-muted-foreground">ساعات النوم</Text>
              </View>
              <View className="w-[48%] bg-secondary/10 p-3 rounded-lg items-center">
                <Text className="text-2xl font-bold text-primary">85%</Text>
                <Text className="text-xs text-muted-foreground">إكمال المهام</Text>
              </View>
              <View className="w-[48%] bg-secondary/10 p-3 rounded-lg items-center">
                <Text className="text-2xl font-bold text-primary">3</Text>
                <Text className="text-xs text-muted-foreground">جلسات تأمل</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Mood Chart */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-foreground mb-4 text-right">تحليل المزاج</Text>
          <LineChart
            data={moodData}
            width={Dimensions.get("window").width - 32}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
          />
        </View>

        {/* Sleep Chart */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-foreground mb-4 text-right">جودة النوم</Text>
          <BarChart
            data={sleepData}
            width={Dimensions.get("window").width - 32}
            height={220}
            yAxisLabel=""
            yAxisSuffix=" س"
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
            verticalLabelRotation={0}
          />
        </View>

        {/* Assessments Progress */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-right">تطور التقييمات النفسية</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="space-y-4">
              <View>
                <View className="flex-row justify-between mb-2">
                  <Badge variant="outline">تحسن ملحوظ</Badge>
                  <Text className="font-medium text-foreground">القلق (GAD-7)</Text>
                </View>
                <View className="h-2 bg-secondary/20 rounded-full overflow-hidden">
                  <View className="h-full bg-blue-500 w-[40%]" />
                </View>
                <Text className="text-xs text-muted-foreground mt-1 text-right">الدرجة الحالية: 8 (قلق خفيف)</Text>
              </View>

              <View>
                <View className="flex-row justify-between mb-2">
                  <Badge variant="outline">مستقر</Badge>
                  <Text className="font-medium text-foreground">الاكتئاب (PHQ-9)</Text>
                </View>
                <View className="h-2 bg-secondary/20 rounded-full overflow-hidden">
                  <View className="h-full bg-green-500 w-[30%]" />
                </View>
                <Text className="text-xs text-muted-foreground mt-1 text-right">الدرجة الحالية: 6 (اكتئاب خفيف)</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card className="mb-6 bg-primary/5 border-primary/20">
          <CardHeader>
            <View className="flex-row justify-end items-center gap-2">
              <Text className="text-lg font-bold text-primary">تحليلات الذكاء الاصطناعي</Text>
              <Ionicons name="sparkles" size={20} color={primary} />
            </View>
          </CardHeader>
          <CardContent>
            <Text className="text-foreground text-right leading-6">
              بناءً على بياناتك المسجلة، يلاحظ وجود تحسن في جودة نومك في الأيام التي تمارس فيها تمارين التنفس. 
              مزاجك يميل للتحسن في عطلة نهاية الأسبوع. 
              نوصي بالاستمرار في روتين ما قبل النوم الحالي ومحاولة دمج المشي القصير في أيام العمل.
            </Text>
          </CardContent>
        </Card>
      </ScrollView>
    </>
  );
}
