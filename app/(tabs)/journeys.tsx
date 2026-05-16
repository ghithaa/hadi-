import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { AppHeader } from '@/components/app-header';
import { Brain, Moon, Heart, Lightbulb } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { useLocalization } from '@/context/LocalizationContext';

interface Journey {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  duration: string;
  durationEn: string;
  units: number;
  progress: number;
  icon: any;
  color: string;
}

const journeys: Journey[] = [
  {
    id: 'anxiety',
    title: 'إدارة القلق',
    titleEn: 'Managing Anxiety',
    description: 'تعلم كيف تتحكم في قلقك',
    descriptionEn: 'Learn how to manage your anxiety',
    duration: '4 أسابيع',
    durationEn: '4 Weeks',
    units: 4,
    progress: 0,
    icon: Brain,
    color: 'bg-purple-500',
  },
  {
    id: 'sleep',
    title: 'تحسين النوم',
    titleEn: 'Better Sleep',
    description: 'نم بشكل أفضل وأعمق',
    descriptionEn: 'Sleep better and deeper',
    duration: '3 أسابيع',
    durationEn: '3 Weeks',
    units: 3,
    progress: 14,
    icon: Moon,
    color: 'bg-blue-500',
  },
  {
    id: 'self-esteem',
    title: 'بناء تقدير الذات',
    titleEn: 'Building Self-Esteem',
    description: 'اكتشف قيمتك الحقيقية',
    descriptionEn: 'Discover your true value',
    duration: '4 أسابيع',
    durationEn: '4 Weeks',
    units: 4,
    progress: 22,
    icon: Heart,
    color: 'bg-rose-500',
  },
];

export default function JourneysPage() {
  const router = useRouter();
  const { isRTL, flexDir, textAlign, alignItems } = useLocalization();

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
          <Text className={cn("text-2xl font-bold text-foreground tracking-tight", textAlign())}>{isRTL ? 'رحلاتك العلاجية' : 'Your Healing Journeys'}</Text>
          <Text className={cn("text-muted-foreground text-sm mt-1 font-medium", textAlign())}>{isRTL ? 'باشر تقدمك في البرامج العلاجية المتكاملة' : 'Track your progress in comprehensive healing programs'}</Text>
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
                  className={cn("absolute top-0 bottom-0 w-2", journey.color, isRTL ? "right-0" : "left-0")}
                />

                <View className="p-6">
                  <View className={cn("items-center justify-between mb-5", flexDir())}>
                    {/* Icon Container */}
                    <View
                      className={cn("h-14 w-14 items-center justify-center rounded-[22px]", journey.color)}
                      style={{ shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }}
                    >
                      <Icon color="white" size={26} />
                    </View>

                    {/* Content */}
                    <View className={cn("flex-1", alignItems('start'), isRTL ? "mr-5" : "ml-5")}>
                      <Text className={cn("text-xl font-bold text-foreground mb-1 tracking-tight", textAlign())}>
                        {isRTL ? journey.title : journey.titleEn}
                      </Text>
                      <Text className={cn("text-xs text-muted-foreground font-bold opacity-80 leading-5 uppercase tracking-tighter", textAlign())}>
                        {isRTL ? journey.description : journey.descriptionEn}
                      </Text>
                    </View>
                  </View>

                  <View className={cn("items-center justify-between mb-4 px-1", flexDir())}>
                    <View className={cn("items-center gap-4", flexDir())}>
                      <View className="px-3 py-1 rounded-lg bg-secondary/50 border border-border/40">
                        <Text className="text-[10px] font-bold text-muted-foreground uppercase">
                          {isRTL ? `${journey.units} وحدات` : `${journey.units} Units`}
                        </Text>
                      </View>
                      <View className="px-3 py-1 rounded-lg bg-secondary/50 border border-border/40">
                        <Text className="text-[10px] font-bold text-muted-foreground uppercase">
                          {isRTL ? journey.duration : journey.durationEn}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Progress Bar */}
                  <View className="w-full pt-4 border-t border-slate-50">
                    <View className={cn("justify-between items-center mb-2 px-1", flexDir())}>
                      <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{isRTL ? 'التقدم المحرز' : 'Progress'}</Text>
                      <View className={cn("items-center gap-1", flexDir())}>
                        <Text className="text-xs font-bold text-primary">
                          {journey.progress}%
                        </Text>
                        <Text className="text-[10px] font-bold text-slate-400">{isRTL ? 'مكتمل' : 'complete'}</Text>
                      </View>
                    </View>
                    <View className="h-2 w-full bg-slate-100/50 rounded-full overflow-hidden">
                      <View
                        className="h-full bg-primary rounded-full transition-all"
                        style={{
                          width: `${journey.progress}%`,
                          alignSelf: isRTL ? 'flex-end' : 'flex-start',
                        }}
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
          className={cn("bg-orange-50/80 rounded-[28px] p-6 items-start border border-orange-100/50 mb-12", flexDir())}
          style={{ shadowColor: '#f97316', shadowOpacity: 0.05, shadowRadius: 15 }}
        >
          <View className="h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm shadow-orange-200">
            <Lightbulb size={22} color="#f97316" />
          </View>
          <View className={cn("flex-1", alignItems('start'), isRTL ? "mr-4" : "ml-4")}>
            <Text className={cn("text-orange-900 font-bold text-sm mb-1", textAlign())}>{isRTL ? 'نصيحة هادي' : 'Hadee Tip'}</Text>
            <Text className={cn("text-orange-800/70 text-xs leading-6 font-medium", textAlign())}>
              {isRTL
                ? 'كل رحلة مصممة بعناية مع محتوى تعليمي، تمارين تفاعلية، ومحادثات مع هادي لمساعدتك في رحلة التعافي. ابدأ رحلتك اليوم!'
                : 'Each journey is carefully designed with educational content, interactive exercises, and conversations with Hadee to help you on your recovery journey. Start your journey today!'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
