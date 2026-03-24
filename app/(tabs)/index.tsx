import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { AppHeader } from '@/components/app-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MessageCircle,
  ClipboardList,
  Palette,
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

export default function HomePage() {
  const router = useRouter();
  const { t, language } = useLocalization();

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
      id: 'reports',
      title: t('tabs.insights'),
      description: t('home.card.reports.desc'),
      icon: BarChart3,
      iconBg: 'bg-primary/10',
      iconColor: '#0f766e', // teal-700
    },
  ];

  const handleNavigate = (id: string) => {
    // @ts-ignore
    router.push(`/(tabs)/${id}`);
  };

  return (
    <View className="flex-1 bg-background">
      <AppHeader />
      <ScrollView className="flex-1 px-4 pb-6">
        {/* Hero Section */}
        <View className="relative mt-2 overflow-hidden rounded-[32px] bg-primary px-6 pb-8 pt-8 mb-8 shadow-xl shadow-primary/20 border border-primary/10">
          <View className="absolute inset-0 opacity-20">
            <View className="absolute -left-12 -top-12 h-64 w-64 rounded-full bg-white/30" />
            <View className="absolute -bottom-8 -right-8 h-48 w-48 rounded-full bg-white/20" />
          </View>
          <View className={cn("relative z-10 items-end", language === 'en' && "items-start")}>
            <Badge className={cn("mb-4 border border-white/20 bg-primary shadow-sm", language === 'ar' ? "self-end" : "self-start")}>
              <Text className="text-primary-foreground text-[10px] font-bold tracking-widest uppercase px-1">{t('home.hero.badge')}</Text>
              <Sparkles size={12} color="white" className={language === 'ar' ? "mr-1" : "ml-1"} />
            </Badge>
            <Text className={cn("mb-3 text-3xl font-bold leading-tight text-primary-foreground tracking-tight", language === 'ar' ? "text-right" : "text-left")}>
              {t('intro.title')}
            </Text>
            <Text className={cn("mb-6 text-[15px] leading-relaxed text-primary-foreground/90 font-medium max-w-[90%]", language === 'ar' ? "text-right" : "text-left")}>
              {t('intro.subtitle')}
            </Text>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => handleNavigate('chat')}
              className={cn("bg-background rounded-[20px] h-14 px-7 flex-row items-center shadow-lg shadow-black/5 border border-white/20", language === 'ar' ? "self-end" : "self-start")}
            >
              {language === 'ar' ? <ArrowLeft size={18} color="#0f766e" className="mr-3" /> : <ArrowRight size={18} color="#0f766e" className="ml-3" />}
              <Text className="text-[#0f766e] font-bold text-[15px]">{t('home.hero.button')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Services Grid */}
        <View className="mb-8">
          <Text className={cn("mb-4 text-xl font-bold text-foreground px-1", language === 'ar' ? "text-right" : "text-left")}>
            {t('home.services.main')}
          </Text>
          <View className={cn("flex-row flex-wrap justify-between gap-4", language === 'en' && "flex-row-reverse")}>
            {mainServices.map((action) => {
              const Icon = action.icon;
              return (
                <TouchableOpacity
                  activeOpacity={0.8}
                  key={action.id}
                  className={cn("w-[48%] rounded-[28px] bg-card p-5 border border-border/40 shadow-sm shadow-black/5 flex flex-col mb-4", language === 'ar' ? "items-end" : "items-start")}
                  onPress={() => handleNavigate(action.id)}
                >
                  <View
                    className={cn(
                      `flex h-12 w-12 items-center justify-center rounded-[20px] mb-5 shadow-sm`,
                      action.iconBg
                    )}
                  >
                    <Icon size={22} color={action.iconColor || "white"}  />
                  </View>
                  <View className={language === 'ar' ? "items-end" : "items-start"}>
                    <Text className={cn("text-[15px] font-bold text-foreground mb-1", language === 'ar' ? "text-right" : "text-left")}>
                      {action.title}
                    </Text>
                    <Text className={cn("text-[12px] text-muted-foreground leading-[18px] font-medium opacity-90", language === 'ar' ? "text-right" : "text-left")}>
                      {action.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* More Services List */}
        <View className="mb-10">
          <Text className={cn("mb-4 text-xl font-bold text-foreground px-1", language === 'ar' ? "text-right" : "text-left")}>
            {t('home.services.more')}
          </Text>
          <View className="gap-4">
            {moreServices.map((action) => {
              const Icon = action.icon;
              return (
                <TouchableOpacity
                  activeOpacity={0.8}
                  key={action.id}
                  className={cn("w-full rounded-[28px] bg-card p-4 border border-border/40 shadow-sm shadow-black/5 flex-row items-center justify-between", language === 'en' && "flex-row-reverse")}
                  onPress={() => handleNavigate(action.id)}
                  disabled={action.isSoon}
                  style={{ opacity: action.isSoon ? 0.6 : 1 }}
                >
                  <View className={cn("h-8 w-8 items-center justify-center rounded-full bg-secondary/50", language === 'ar' ? "mr-2" : "ml-2")}>
                    {language === 'ar' ? <ChevronLeft size={16} color="#64748b"  /> : <ChevronRight size={16} color="#64748b"  />}
                  </View>

                  <View className={cn("flex-1 flex-row items-center gap-4", language === 'ar' ? "justify-end" : "justify-start")}>
                    <View className={cn("flex-1", language === 'ar' ? "items-end pr-2" : "items-start pl-2")}>
                      <Text className={cn("text-[15px] font-bold text-foreground mb-1", language === 'ar' ? "text-right" : "text-left")}>
                        {action.title}
                        {action.isSoon && <Text className="text-xs text-muted-foreground ml-2"> (Soon)</Text>}
                      </Text>
                      <Text className={cn("text-[12px] text-muted-foreground leading-[18px] font-medium opacity-90", language === 'ar' ? "text-right" : "text-left")}>
                        {action.description}
                      </Text>
                    </View>
                    <View
                      className={cn(
                        `flex h-12 w-12 items-center justify-center rounded-[20px] shadow-sm`,
                        action.iconBg
                      )}
                    >
                      <Icon size={22} color={action.iconColor || "white"}  />
                    </View>
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
