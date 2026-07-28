import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
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
  Moon,
  Phone,
  Map,
  Target,
  Image as ImageIcon,
  Shield,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  RefreshCw,
} from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { useLocalization } from '@/context/LocalizationContext';
import { useAuth } from '@/context/AuthContext';
import { useMoodToday, useLogMood, useMoodEntries } from '@/hooks/use-mood';

const moodsList = [
  { emoji: "😫", level: 1 },
  { emoji: "😔", level: 2 },
  { emoji: "😐", level: 3 },
  { emoji: "🙂", level: 4 },
  { emoji: "🤩", level: 5 },
];

const supportMessagesAr = [
  "أهلاً بك! لاحظت أنك لم تسجل مزاجك منذ فترة، وأحب أن أعرف كيف تسير الأمور معك. يمكن أن يكون من المفيد أن تأخذ لحظة لتدوين شعورك اليوم، حتى لو كان بسيطاً. أنا هنا لدعمك دائماً!",
  "مرحباً! لقد لاحظت أنك لم تسجل مزاجك منذ فترة، وأحببت أن أطمئن على حالتك. ربما يمكنك كتابة جملة واحدة عن شعورك اليوم، فهي خطوة بسيطة ولكنها قد تساعدك في فهم نفسك أكثر.",
  "مرحباً! لاحظت أنك لم تسجل مزاجك منذ فترة، وأنا هنا لأدعمك. هل تود أن نبدأ بتسجيل شعورك اليوم؟ يمكنك الكتابة عنه في بضع كلمات فقط."
];

const supportMessagesEn = [
  "Welcome! I noticed you haven't recorded your mood in a while, and I'd love to know how things are going. It might be helpful to take a moment to write down how you feel today, even if it's simple. I'm always here to support you!",
  "Hi! I noticed you haven't logged your mood in a while, and I wanted to check on you. Maybe you can write one sentence about how you feel today; it's a simple step but it might help you understand yourself better.",
  "Hello! I noticed you haven't recorded your mood in a while, and I'm here to support you. Would you like to start by recording how you feel today? You can write about it in just a few words."
];

export default function HomePage() {
  const router = useRouter();
  const { t, language, isRTL, flexDir, textAlign, alignItems, justifyContent, l, r } = useLocalization();
  const { user } = useAuth();
  const { data: todayEntry, isLoading: todayLoading } = useMoodToday();
  const { data: latestEntries } = useMoodEntries({ limit: 1 });
  const logMood = useLogMood();
  const hasLoggedToday = todayEntry?.logged ?? false;
  const [isSupportDismissed, setIsSupportDismissed] = useState(false);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);


  const supportMessage = useMemo(() => {
    const day = new Date().getDate();
    const idx = day % supportMessagesAr.length;
    return isRTL ? supportMessagesAr[idx] : supportMessagesEn[idx];
  }, [isRTL]);

  const showSupportMessage = useMemo(() => {
    if (hasLoggedToday) return false;
    if (!latestEntries || latestEntries.length === 0 || !latestEntries[0]) {
      return true;
    }
    const latestDateStr = latestEntries[0].date;
    if (!latestDateStr || typeof latestDateStr !== 'string') {
      return true;
    }
    const parts = latestDateStr.split('-');
    if (parts.length !== 3) return true;
    
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    if (isNaN(year) || isNaN(month) || isNaN(day)) return true;
    
    const latestDate = new Date(year, month, day);
    const today = new Date();

    latestDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(today.getTime() - latestDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays >= 2;
  }, [latestEntries, hasLoggedToday]);

  const handleQuickMoodSelect = async (level: number) => {
    setSelectedMood(level);
    try {
      await logMood.mutateAsync({ moodScore: level });
    } catch {
      setSelectedMood(null);
      Alert.alert(
        isRTL ? 'تعذر تسجيل المزاج' : 'Could not save mood',
        isRTL ? 'حدث خطأ أثناء حفظ حالتك المزاجية. حاول مرة أخرى.' : 'There was a problem saving your mood. Please try again.'
      );
    }
  };
  const anyUser = user as any;
  const fullName = (anyUser?.fullName ?? anyUser?.full_name ?? '').trim();
  const firstName = fullName ? fullName.split(' ')[0] : null;
  const displayName = firstName ? `\u200E${firstName}\u200E` : null;
  const heroTitle =
    language === 'ar'
      ? (displayName ? `أهلاً بك ${displayName} في هادي` : t('intro.title'))
      : (displayName ? `Welcome, ${displayName} to Hadee` : t('intro.title'));

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
      id: 'insights',
      title: t('tabs.insights'),
      description: t('home.card.reports.desc'),
      icon: BarChart3,
      iconBg: 'bg-primary/10',
      iconColor: '#0f766e', // teal-700
    },
    // {
    //   id: 'gratitude',
    //   title: t('home.card.gratitude'),
    //   description: t('home.card.gratitude.desc'),
    //   icon: BookOpen,
    //   iconBg: 'bg-primary/20',
    //   iconColor: '#0f766e', // teal-700
    //   isSoon: true,
    // },
    {
      id: 'sleep',
      title: t('home.card.sleep'),
      description: t('home.card.sleep.desc'),
      icon: Moon,
      iconBg: 'bg-accent/20',
      iconColor: '#3b82f6', // blue-500
      isSoon: true,
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
                {heroTitle}
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

        {/* Support Message Section */}
        {!todayLoading && showSupportMessage && !isSupportDismissed && (
          <View
            className="mx-5 mb-6 overflow-hidden rounded-[30px] border p-5 relative"
            style={{
              backgroundColor: 'rgba(15, 118, 110, 0.08)',
              borderColor: 'rgba(15, 118, 110, 0.14)',
              shadowColor: '#000',
              shadowOpacity: 0.03,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 6 },
            }}
          >
            <View className={cn("absolute h-28 w-28 rounded-full", isRTL ? "-left-8 -top-8" : "-right-8 -top-8")} style={{ backgroundColor: 'rgba(15, 118, 110, 0.08)' }} />
            <View className={cn("absolute h-16 w-16 rounded-full", isRTL ? "-right-4 bottom-4" : "-left-4 bottom-4")} style={{ backgroundColor: 'rgba(15, 118, 110, 0.06)' }} />

            {/* Dismiss button */}
            <TouchableOpacity 
              onPress={() => setIsSupportDismissed(true)}
              className={cn("absolute top-4 z-10 h-7 w-7 items-center justify-center rounded-full", isRTL ? "left-4" : "right-4")}
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
              activeOpacity={0.7}
            >
              <Text className="text-slate-400 text-xs font-bold">✕</Text>
            </TouchableOpacity>

            <View className={cn("relative z-0 items-start gap-4", flexDir(), isRTL ? "pl-9 pr-1" : "pr-9 pl-1")}>
              {/* Avatar Icon */}
              <View
                className="h-12 w-12 items-center justify-center rounded-full border overflow-hidden"
                style={{ backgroundColor: 'rgba(255,255,255,0.72)', borderColor: 'rgba(15, 118, 110, 0.12)' }}
              >
                <Image
                  source={require('../../assets/images/logoTrans.png')}
                  className="h-10 w-10"
                  resizeMode="contain"
                />
              </View>

              {/* Message Content */}
              <View className="flex-1 bg">
                <View className={cn("mb-2 items-center gap-2", flexDir())}>
                  <View
                    className="rounded-full px-3 py-1"
                    style={{ backgroundColor: 'rgba(15, 118, 110, 0.12)' }}
                  >
                    <Text className="text-[10px] font-bold uppercase tracking-[1px] text-[#0f766e]">
                      {isRTL ? "رسالة دعم" : "Support Note"}
                    </Text>
                  </View>
                  <Text className={cn("text-sm font-bold text-[#0f766e] flex-1", textAlign())}>
                    {isRTL ? "هادي يفكر فيك" : "Hadee is thinking of you"}
                  </Text>
                </View>
                <Text className={cn("text-slate-700 text-[14px] leading-7 font-medium", textAlign())}>
                  {supportMessage}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Mood Reminder Section */}
        {!todayLoading && !hasLoggedToday && (
          <View className="mx-5 mb-8 bg-card border border-border/40 rounded-[35px] p-6 shadow-xl" style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 20, shadowOffset: { width: 0, height: 8 } }}>
            <View className={cn("justify-between items-center mb-5", flexDir())}>
              <View className={alignItems('start')}>
                <Text className={cn("text-lg font-bold text-foreground", textAlign())}>
                  {isRTL ? "كيف تشعر اليوم؟" : "How do you feel today?"}
                </Text>
                <Text className={cn("text-xs text-muted-foreground mt-0.5 font-medium", textAlign())}>
                  {isRTL ? "سجل حالتك المزاجية لنتمكن من مساعدتك بشكل أفضل" : "Log your daily mood to help us support you better"}
                </Text>
              </View>
              <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                {/* <Smile size={20} color="#0f766e" /> */}
                <Image
                  source={require('../../assets/images/logoTrans.png')}
                  className="h-9 w-9"
                  resizeMode="contain"
                />
              </View>
            </View>

            <View className={cn("justify-between px-1", flexDir())}>
              {moodsList.map((mood) => (
                (() => {
                  const isSelected = selectedMood === mood.level || todayEntry?.entry?.moodScore === mood.level;

                  return (
                    <TouchableOpacity
                      key={mood.level}
                      onPress={() => handleQuickMoodSelect(mood.level)}
                      disabled={logMood.isPending}
                      activeOpacity={0.7}
                      className={cn(
                        "items-center justify-center h-14 w-[17%] rounded-[20px] border active:scale-95 transition-all shadow-sm",
                        isSelected ? "bg-primary/15 border-primary/50" : "bg-secondary/30 border-secondary/10"
                      )}
                    >
                      <Text className="text-2xl">{mood.emoji}</Text>
                    </TouchableOpacity>
                  );
                })()
              ))}
            </View>
          </View>
        )}

        {!todayLoading && hasLoggedToday && (
          <View className="mx-5 mb-8 border rounded-[30px] p-5 " style={{ backgroundColor: 'rgba(15, 118, 110, 0.1)', borderColor: 'rgba(15, 118, 110, 0.2)', shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 10 }}>
            <View className={cn("justify-between items-center", isRTL ? "flex-row-reverse" : "flex-row")}>
              <View className={cn("flex-1", isRTL ? "items-end ml-4" : "items-start mr-4")}>
                <Text className={cn("text-sm font-bold text-[#0f766e] mb-0.5", isRTL ? "text-right" : "text-left")}>
                  {isRTL ? "تم تسجيل مزاجك اليوم! 🎉" : "Mood registered for today! 🎉"}
                </Text>
                <Text className={cn("text-xs text-muted-foreground/80 font-medium", isRTL ? "text-right" : "text-left")}>
                  {isRTL ? "تابع تحليلاتك في قسم التقارير" : "View your analytics in the Insights tab"}
                </Text>
              </View>
              <TouchableOpacity 
                onPress={() => router.push('/(tabs)/insights')}
                activeOpacity={0.8}
                className="rounded-xl px-4 py-2 border self-center"
                style={{ backgroundColor: 'rgba(15, 118, 110, 0.2)', borderColor: 'rgba(15, 118, 110, 0.1)' }}
              >
                <Text className="text-[#0f766e] text-xs font-bold">{isRTL ? "التقارير" : "Insights"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}




        {/* Tip of the Day */}
        <View className="mx-5 mb-8 bg-[#fffbeb] border border-[#fde68a] rounded-[28px] p-5 shadow-sm relative overflow-hidden">
          <View className={cn("items-center justify-between gap-4", isRTL ? "flex-row-reverse" : "flex-row")}>
            {/* Refresh Icon */}
            <TouchableOpacity activeOpacity={0.7} className="h-8 w-8 items-center justify-center rounded-full bg-amber-100/50">
              <RefreshCw size={14} color="#d97706" />
            </TouchableOpacity>
            
            {/* Content */}
            <View className={cn("flex-1", isRTL ? "items-end" : "items-start")}>
              <Text className={cn("text-amber-800 text-[10px] font-bold tracking-wider uppercase mb-1", isRTL ? "text-right" : "text-left")}>{isRTL ? "نصيحة اليوم" : "Tip of the Day"}</Text>
              <Text className={cn("text-amber-900 text-xs font-bold leading-5", isRTL ? "text-right" : "text-left")}>
                {isRTL ? "تذكر: لا بأس ألا تكون بخير دائماً 💙" : "Remember: It's okay not to be okay always 💙"}
              </Text>
            </View>
            
            {/* Lightbulb Icon */}
            <View className="h-10 w-10 bg-amber-500/10 rounded-2xl items-center justify-center">
              <Lightbulb size={20} color="#d97706" />
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
