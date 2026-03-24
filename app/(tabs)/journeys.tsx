import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { AppHeader } from '@/components/app-header';
import { Brain, Moon, Heart, Lightbulb } from 'lucide-react-native';
import { cn } from '@/lib/utils';

interface Journey {
  id: string;
  title: string;
  description: string;
  duration: string;
  units: number;
  progress: number;
  icon: any;
  color: string;
}

const journeys: Journey[] = [
  {
    id: 'anxiety',
    title: 'إدارة القلق',
    description: 'تعلم كيف تتحكم في قلقك',
    duration: '4 أسابيع',
    units: 4,
    progress: 0,
    icon: Brain,
    color: 'bg-purple-500',
  },
  {
    id: 'sleep',
    title: 'تحسين النوم',
    description: 'نم بشكل أفضل وأعمق',
    duration: '3 أسابيع',
    units: 3,
    progress: 14,
    icon: Moon,
    color: 'bg-blue-500',
  },
  {
    id: 'self-esteem',
    title: 'بناء تقدير الذات',
    description: 'اكتشف قيمتك الحقيقية',
    duration: '4 أسابيع',
    units: 4,
    progress: 22,
    icon: Heart,
    color: 'bg-rose-500',
  },
];

export default function JourneysPage() {
  const router = useRouter();

  const handleNavigate = (id: string) => {
    router.push(`/journeys/${id}`);
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
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-8 mb-8">
          <Text className="text-2xl font-bold text-foreground text-right tracking-tight">رحلاتك العلاجية</Text>
          <Text className="text-muted-foreground text-right text-sm mt-1 font-medium">باشر تقدمك في البرامج العلاجية المتكاملة</Text>
        </View>

        <View className="gap-6 mb-8">
          {journeys.map((journey, index) => {
            const Icon = journey.icon;
            return (
              <TouchableOpacity
                key={journey.id}
                onPress={() => handleNavigate(journey.id)}
                activeOpacity={0.9}
                className={cn(
                  "w-full rounded-[35px] border border-border/40 overflow-hidden bg-card/60",
                  index > 0 && "mt-2"
                )}
                style={{
                  shadowColor: '#000',
                  shadowOpacity: 0.08,
                  shadowRadius: 25,
                  shadowOffset: { width: 0, height: 12 }
                }}
              >
                {/* Subtle side highlight */}
                <View
                  className={cn("absolute right-0 top-0 bottom-0 w-2", journey.color)}
                />

                <View className="p-6">
                  <View className="flex-row-reverse items-center justify-between mb-5">
                    {/* Right: Icon Container */}
                    <View
                      className={cn("h-14 w-14 items-center justify-center rounded-[22px]", journey.color)}
                      style={{ shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }}
                    >
                      <Icon color="white" size={26} />
                    </View>

                    {/* Left/Center: Content */}
                    <View className="flex-1 items-end mr-5">
                      <Text className="text-xl font-bold text-foreground text-right mb-1 tracking-tight">
                        {journey.title}
                      </Text>
                      <Text className="text-xs text-muted-foreground text-right font-bold opacity-80 leading-5 uppercase tracking-tighter">
                        {journey.description}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row-reverse items-center justify-between mb-4 px-1">
                    <View className="flex-row-reverse items-center gap-4">
                      <View className="px-3 py-1 rounded-lg bg-secondary/50 border border-border/40">
                        <Text className="text-[10px] font-bold text-muted-foreground uppercase">
                          {journey.units} وحدات
                        </Text>
                      </View>
                      <View className="px-3 py-1 rounded-lg bg-secondary/50 border border-border/40">
                        <Text className="text-[10px] font-bold text-muted-foreground uppercase">
                          {journey.duration}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Progress Bar Redesigned */}
                  <View className="w-full pt-4 border-t border-slate-50">
                    <View className="flex-row-reverse justify-between items-center mb-2 px-1">
                      <View className="flex-row-reverse items-center gap-1">
                        <Text className="text-xs font-bold text-primary">
                          {journey.progress}%
                        </Text>
                        <Text className="text-[10px] font-bold text-slate-400">مكتمل</Text>
                      </View>
                      <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">التقدم المحرز</Text>
                    </View>
                    <View className="h-2 w-full bg-slate-100/50 rounded-full overflow-hidden">
                      <View
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${journey.progress}%` }}
                      >
                        <View className="absolute inset-0 bg-white/20" />
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Improved Tip Box */}
        <View
          className="bg-orange-50/80 rounded-[28px] p-6 flex-row-reverse items-start border border-orange-100/50 mb-12"
          style={{ shadowColor: '#f97316', shadowOpacity: 0.05, shadowRadius: 15 }}
        >
          <View className="h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm shadow-orange-200">
            <Lightbulb size={22} color="#f97316" />
          </View>
          <View className="flex-1 items-end mr-4">
            <Text className="text-orange-900 font-bold text-sm mb-1 text-right">نصيحة هادي</Text>
            <Text className="text-orange-800/70 text-xs text-right leading-6 font-medium">
              كل رحلة مصممة بعناية مع محتوى تعليمي، تمارين تفاعلية، ومحادثات مع هادي لمساعدتك في رحلة التعافي. ابدأ رحلتك اليوم!
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
