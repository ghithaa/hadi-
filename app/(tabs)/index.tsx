import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { AppHeader } from '@/components/app-header';
import {
  MessageCircle,
  ClipboardList,
  Brain,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Wind,
  BookOpen,
  Moon,
  Phone,
  Map,
  Target,
  Image as ImageIcon,
  Shield,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { useLocalization } from '@/context/LocalizationContext';
import { useAuth } from '@/context/AuthContext';

export default function HomePage() {
  const router = useRouter();
  const { t, isRTL, flexDir, textAlign, alignItems, justifyContent, l, r } = useLocalization();
  const { user } = useAuth();

  const mainServices = [
    {
      id: 'chat',
      title: t('home.card.chat'),
      description: t('home.card.chat.desc'),
      icon: MessageCircle,
      iconBg: 'bg-primary/20',
      iconColor: '#0f766e', // teal-700
    },
    {
      id: 'assessments',
      title: t('home.card.assessments'),
      description: t('home.card.assessments.desc'),
      icon: ClipboardList,
      iconBg: 'bg-accent/20',
      iconColor: '#3b82f6', // blue-500
    },
    {
      id: 'mood',
      title: t('home.card.mood'),
      description: t('home.card.mood.desc'),
      icon: BarChart3,
      iconBg: 'bg-secondary',
      iconColor: '#334155', // slate-700
    },
    {
      id: 'breathing',
      title: t('home.card.breathing'),
      description: t('home.card.breathing.desc'),
      icon: Wind,
      iconBg: 'bg-primary/10',
      iconColor: '#0f766e', // teal-700
    },
    {
      id: 'plan',
      title: t('home.card.plan'),
      description: t('home.card.plan.desc'),
      icon: Target,
      iconBg: 'bg-accent/10',
      iconColor: '#3b82f6', // blue-500
    },
    {
      id: 'cbt',
      title: t('home.card.cbt'),
      description: t('home.card.cbt.desc'),
      icon: Brain,
      iconBg: 'bg-primary/15',
      iconColor: '#0f766e', // teal-700
    },
    {
      id: 'drawing',
      title: t('home.card.drawing'),
      description: t('home.card.drawing.desc'),
      icon: ImageIcon,
      iconBg: 'bg-secondary',
      iconColor: '#334155', // slate-700
    },
    {
      id: 'journeys',
      title: t('home.card.journeys'),
      description: t('home.card.journeys.desc'),
      icon: Map,
      iconBg: 'bg-accent/15',
      iconColor: '#3b82f6', // blue-500
    },
  ];

  const moreServices = [
    {
      id: 'gratitude',
      title: t('home.card.gratitude'),
      description: t('home.card.gratitude.desc'),
      icon: BookOpen,
      iconBg: 'bg-primary/20',
      iconColor: '#0f766e', // teal-700
    },
    {
      id: 'sleep',
      title: t('home.card.sleep'),
      description: t('home.card.sleep.desc'),
      icon: Moon,
      iconBg: 'bg-accent/20',
      iconColor: '#3b82f6', // blue-500
    },
    {
      id: 'parental',
      title: t('home.card.parental'),
      description: t('home.card.parental.desc'),
      icon: Shield,
      iconBg: 'bg-secondary',
      iconColor: '#334155', // slate-700
      isSoon: true,
    },
    {
      id: 'emergency',
      title: t('home.card.emergency'),
      description: t('home.card.emergency.desc'),
      icon: Phone,
      iconBg: 'bg-destructive/10',
      iconColor: '#ef4444', // red-500
    },
    {
      id: 'insights',
      title: t('tabs.insights'),
      description: t('home.card.reports.desc'),
      icon: BarChart3,
      iconBg: 'bg-primary/10',
      iconColor: '#0f766e', // teal-700
    },
  ];

  const handleNavigate = (id: string) => {
    if (id === 'parental') return;

    // Use explicit route map for typed routing
    const routes: Record<string, string> = {
      chat: '/(tabs)/chat',
      assessments: '/(tabs)/assessments',
      mood: '/(tabs)/mood',
      breathing: '/(tabs)/breathing',
      plan: '/(tabs)/plan',
      cbt: '/(tabs)/cbt',
      drawing: '/(tabs)/drawing',
      journeys: '/(tabs)/journeys',
      gratitude: '/(tabs)/gratitude',
      sleep: '/(tabs)/sleep',
      emergency: '/(tabs)/emergency',
      insights: '/(tabs)/insights',
      emotions: '/(tabs)/emotions',
    };
    const route = routes[id];
    if (route) router.push(route as any);
  };

  return (
    <View className="flex-1 bg-background">
      <AppHeader />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={true} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Hero Section */}
        <View className="px-5 pt-6 mb-8">
          <View className="relative overflow-hidden rounded-[40px] bg-primary p-8 shadow-2xl shadow-primary/30">
            {/* Decorative background shapes */}
            <View className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10" />
            <View className="absolute -left-8 -bottom-8 h-40 w-40 rounded-full bg-white/5" />

            <View className={cn("relative z-10", alignItems('start'))}>
              <View className={cn("mb-4 items-center rounded-full border border-white/20 bg-primary px-3 py-1.5 shadow-sm", flexDir())}>
                <Text className="text-primary-foreground text-[10px] font-bold tracking-widest uppercase px-1">{t('home.hero.badge')}</Text>
                <Sparkles size={12} color="white" />
              </View>
              <Text className={cn("mb-3 text-3xl font-bold leading-tight text-primary-foreground tracking-tight", textAlign())}>
                {t('intro.title')}
              </Text>
              <Text className={cn("mb-6 text-[15px] leading-relaxed text-primary-foreground/90 font-medium max-w-[90%]", textAlign())}>
                {t('intro.subtitle')}
              </Text>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => handleNavigate('chat')}
                className={cn("bg-background rounded-[20px] h-14 px-7 items-center shadow-lg shadow-black/5 border border-white/20", flexDir())}
              >
                {isRTL ? <ArrowLeft size={18} color="#0f766e" className="mr-3" /> : <ArrowRight size={18} color="#0f766e" className="ml-3" />}
                <Text className="text-[#0f766e] font-bold text-[15px]">{t('home.hero.button')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Main Services Grid */}
        <View className="mb-8 px-5">
          <Text className={cn("mb-4 text-xl font-bold text-foreground px-1", textAlign())}>
            {t('home.services.main')}
          </Text>
          <View className="gap-4">
            {Array.from({ length: Math.ceil(mainServices.length / 2) }).map((_, rowIndex) => {
              const rowItems = mainServices.slice(rowIndex * 2, rowIndex * 2 + 2);
              return (
                <View key={rowIndex} className={cn("justify-between w-full", flexDir())}>
                  {rowItems.map((action) => {
                    const Icon = action.icon;
                    return (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        key={action.id}
                        className={cn("w-[48%] rounded-[28px] bg-card p-5 border border-border/40 shadow-sm shadow-black/5 flex flex-col", isRTL ? 'items-end' : 'items-start')}
                        onPress={() => handleNavigate(action.id)}
                      >
                        <View
                          className={cn(
                            `flex h-12 w-12 items-center justify-center rounded-[20px] mb-5 shadow-sm`,
                            action.iconBg
                          )}
                        >
                          <Icon size={22} color={action.iconColor || "white"} />
                        </View>
                        <View className={isRTL ? 'items-end' : 'items-start'}>
                          <Text className={cn("text-[15px] font-bold text-foreground mb-1", isRTL ? 'text-right' : 'text-left')}>
                            {action.title}
                          </Text>
                          <Text className={cn("text-[12px] text-muted-foreground leading-[18px] font-medium opacity-90", isRTL ? 'text-right' : 'text-left')}>
                            {action.description}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                  {rowItems.length === 1 && <View className="w-[48%]" />}
                </View>
              );
            })}
          </View>
        </View>

        {/* More Services List */}
        <View className="mb-10 px-5">
          <Text className={cn("mb-4 text-xl font-bold text-foreground px-1", textAlign())}>
            {t('home.services.more')}
          </Text>
          <View className="gap-4">
            {moreServices.map((action) => {
              const Icon = action.icon;
              return (
                <TouchableOpacity
                  activeOpacity={0.8}
                  key={action.id}
                  className={cn("w-full rounded-[28px] bg-card p-4 border border-border/40 shadow-sm shadow-black/5 items-center justify-between gap-4", flexDir())}
                  onPress={() => handleNavigate(action.id)}
                  disabled={action.isSoon}
                  style={{ opacity: action.isSoon ? 0.6 : 1 }}
                >
                  <View
                    className={cn(
                      "h-12 w-12 items-center justify-center rounded-[18px] shadow-sm",
                      action.iconBg
                    )}
                  >
                    <Icon size={20} color={action.iconColor || "white"} />
                  </View>

                  <View className={cn("flex-1", alignItems('start'))}>
                    <Text className={cn("text-[15px] font-bold text-foreground mb-1", textAlign())}>
                      {action.title}
                      {action.isSoon && <Text className="text-xs text-muted-foreground mx-2"> (Soon)</Text>}
                    </Text>
                    <Text className={cn("text-[12px] text-muted-foreground leading-[18px] font-medium opacity-90", textAlign())}>
                      {action.description}
                    </Text>
                  </View>

                  <View className={cn("h-8 w-8 items-center justify-center rounded-full bg-secondary/50")}>
                    {isRTL ? <ChevronLeft size={16} color="#64748b" /> : <ChevronRight size={16} color="#64748b" />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
