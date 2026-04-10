import { View, Text, TouchableOpacity, ScrollView, Switch, Image, Platform, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Crown,
  Check,
  ChevronRight,
  ChevronLeft,
  CreditCard,
  Shield,
  HelpCircle,
  FileText,
  Info,
  Bell,
  Settings,
  Twitter,
  Instagram,
  ExternalLink,
  Globe
} from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useLocalization } from '@/context/LocalizationContext';

export default function ProfileDetailsPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language, setLanguage, t } = useLocalization();

  const sections = {
    subscription: {
      title: t('profile.subscription.title'),
      icon: CreditCard,
      content: () => (
        <View className="p-4 gap-6">
          <View
            className="relative overflow-hidden rounded-[32px] shadow-xl shadow-primary/25"
          >
            <View className="absolute inset-0 bg-primary dark:bg-indigo-900" />
            <View className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />

            <View className={cn("flex-row items-center justify-between p-6 w-full", language === 'en' && "flex-row-reverse")}>
              <View className="h-14 w-14 bg-primary rounded-2xl items-center justify-center rotate-12 shadow-sm border border-slate-100">
                <Crown size={28} color="white" fill="white" />
              </View>
              <View className={cn("flex-1 items-end ml-4", language === 'en' && "items-start mr-4 ml-0")}>
                <View className={cn("bg-white/20 px-3 py-1 rounded-full mb-2 border border-white/10", language === 'ar' ? "self-end" : "self-start")}>
                  <Text className="text-white text-[10px] font-bold uppercase tracking-wider">{t('profile.subscription.currentPlan')}</Text>
                </View>
                <Text className="text-white font-bold text-2xl text-right mb-1">
                  {t('header.app.title')} {t('profile.subscription.premium')}
                </Text>
                <Text className={cn("text-white/80 text-[13px] font-bold leading-5", language === 'ar' ? "text-right" : "text-left")}>
                  {t('profile.subscription.activeUntil')} 2024/12/31
                </Text>
              </View>
            </View>

            {/* Subtle Decorative Elements */}
            <View className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10" />
            <View className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-white/5" />
          </View>

          <TouchableOpacity
            className="bg-card rounded-[24px] py-5 items-center shadow-lg shadow-black/[0.05] border border-border/50 active:scale-[0.98]"
            onPress={() => Alert.alert(t('common.soon'), t('profile.subscription.manageSoon'))}
          >
            <Text className="text-primary font-bold text-base">{t('profile.subscription.manage')}</Text>
          </TouchableOpacity>
          <View>
            <Text className={cn("text-lg font-bold text-foreground mb-4", language === 'ar' ? "text-right" : "text-left")}>{t('profile.subscription.features')}</Text>
            <View className="gap-3">
              {[
                t('profile.subscription.feature1'),
                t('profile.subscription.feature2'),
                t('profile.subscription.feature3'),
              ].map((feature, i) => (
                <View key={i} className={cn("flex-row items-center justify-end gap-3 p-4 bg-card rounded-2xl border border-border/50 shadow-sm shadow-black/[0.02]", language === 'en' && "flex-row-reverse")}>
                  <Text className="text-foreground font-medium">{feature}</Text>
                  <View className="h-6 w-6 rounded-full bg-emerald-500/10 items-center justify-center">
                    <Check size={14} className="text-emerald-500" />
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      )
    },
    settings: {
      title: t('profile.settings.title'),
      icon: Settings,
      content: () => (
        <View className="p-4 gap-6">
          <View className="bg-card rounded-[32px] border border-border/50 overflow-hidden shadow-sm shadow-black/[0.01]">
            {[
              { label: t('profile.settings.editProfile'), icon: language === 'ar' ? ChevronLeft : ChevronRight },
              { label: t('profile.settings.changePassword'), id: 'password', value: '********', icon: language === 'ar' ? ChevronLeft : ChevronRight },
              { label: t('profile.settings.language'), value: t('profile.settings.languageValue'), icon: language === 'ar' ? ChevronLeft : ChevronRight },
              { label: t('profile.settings.appearance'), value: t('profile.settings.appearanceValue'), icon: language === 'ar' ? ChevronLeft : ChevronRight },
            ].map((item, i, arr) => (
              <TouchableOpacity
                key={item.label}
                className={cn(
                  "flex-row items-center justify-between p-5",
                  language === 'en' && "flex-row-reverse",
                  i !== arr.length - 1 && "border-b border-border/40"
                )}
              >
                <item.icon size={18} className="text-muted-foreground/50" />
                <View className={cn("flex-row items-center gap-4", language === 'en' && "flex-row-reverse")}>
                  {item.value && <Text className="text-muted-foreground text-sm font-medium">{item.value}</Text>}
                  <Text className="text-foreground font-bold text-base">{item.label}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity className={cn("bg-destructive/5 dark:bg-destructive/10 p-6 rounded-[32px] border border-destructive/10 flex-row items-center justify-between active:scale-[0.98]", language === 'en' && "flex-row-reverse")}>
            <View className="h-10 w-10 bg-destructive/10 rounded-xl items-center justify-center">
              <Shield size={20} className="text-destructive" />
            </View>
            <View className={cn("flex-1 items-end mr-4", language === 'en' && "items-start ml-4 mr-0")}>
              <Text className="text-destructive font-bold text-base">{t('profile.settings.deleteAccount')}</Text>
              <Text className="text-destructive/60 text-[10px] font-medium mt-0.5">{t('profile.settings.deleteDesc')}</Text>
            </View>
          </TouchableOpacity>
        </View>
      )
    },
    notifications: {
      title: t('profile.notifications.title'),
      icon: Bell,
      content: function NotificationsContent() {
        const [toggles, setToggles] = useState({
          daily: true,
          updates: true,
          tips: false,
          reminders: true
        });

        return (
          <View className="p-4 gap-4">
            <View className="bg-card rounded-[32px] border border-border/50 overflow-hidden shadow-sm shadow-black/[0.01]">
              {[
                { id: 'daily', label: t('profile.notifications.daily'), desc: t('profile.notifications.dailyDesc') },
                { id: 'updates', label: t('profile.notifications.updates'), desc: t('profile.notifications.updatesDesc') },
                { id: 'tips', label: t('profile.notifications.tips'), desc: t('profile.notifications.tipsDesc') },
                { id: 'reminders', label: t('profile.notifications.reminders'), desc: t('profile.notifications.remindersDesc') },
              ].map((item, i, arr) => (
                <View
                  key={item.id}
                  className={cn(
                    "flex-row items-center justify-between p-5",
                    language === 'en' && "flex-row-reverse",
                    i !== arr.length - 1 && "border-b border-border/40"
                  )}
                >
                  <Switch
                    value={toggles[item.id as keyof typeof toggles]}
                    onValueChange={(v) => setToggles(prev => ({ ...prev, [item.id]: v }))}
                    trackColor={{ false: '#767577', true: '#0284c7' }}
                    thumbColor={Platform.OS === 'ios' ? undefined : '#f4f3f4'}
                  />
                  <View className={cn("flex-1 items-end mr-4", language === 'en' && "items-start ml-4 mr-0")}>
                    <Text className={cn("text-foreground font-bold text-base", language === 'ar' ? "text-right" : "text-left")}>{item.label}</Text>
                    <Text className={cn("text-muted-foreground text-[10px] mt-1 font-medium", language === 'ar' ? "text-right" : "text-left")}>{item.desc}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        );
      }
    },
    privacy: {
      title: t('profile.privacy.title'),
      icon: Shield,
      content: () => (
        <View className="p-4 gap-6">
          <View className="bg-emerald-500/10 dark:bg-emerald-500/5 p-8 rounded-3xl items-center gap-4 border border-emerald-500/20">
            <View className="h-16 w-16 bg-emerald-500/20 rounded-2xl items-center justify-center rotate-6">
              <Shield size={32} className="text-emerald-600 dark:text-emerald-400" />
            </View>
            <Text className="text-center text-emerald-900 dark:text-emerald-100 font-bold text-xl">{t('profile.privacy.protected')}</Text>
            <Text className="text-center text-emerald-800/60 dark:text-emerald-200/60 text-sm leading-6">
              {t('profile.privacy.protectedDesc')}
            </Text>
          </View>

          <View className="bg-card rounded-[32px] border border-border/50 overflow-hidden shadow-sm shadow-black/[0.01]">
            {[
              { label: t('profile.privacy.activity'), id: 'activity', icon: FileText },
              { label: t('profile.privacy.devices'), id: 'devices', icon: Shield },
              { label: t('profile.privacy.policy'), id: 'privacy-policy', icon: Info },
            ].map((item, i, arr) => (
              <TouchableOpacity
                key={item.id}
                className={cn(
                  "flex-row items-center justify-between p-5",
                  language === 'en' && "flex-row-reverse",
                  i !== arr.length - 1 && "border-b border-border/40"
                )}
              >
                <View className="rotate-0">
                  {language === 'ar' ? <ChevronLeft size={18} className="text-muted-foreground/50" /> : <ChevronRight size={18} className="text-muted-foreground/50" />}
                </View>
                <View className={cn("flex-row items-center gap-4", language === 'en' && "flex-row-reverse")}>
                  <Text className="text-foreground font-bold text-base">{item.label}</Text>
                  <item.icon size={20} className="text-primary" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )
    },
    help: {
      title: t('profile.help.title'),
      icon: HelpCircle,
      content: () => (
        <View className="p-4 gap-4">
          <Text className={cn("text-lg font-bold text-foreground mb-2", language === 'ar' ? "text-right" : "text-left")}>{t('profile.help.question')}</Text>

          <View className={cn("flex-row flex-wrap gap-4", language === 'en' && "flex-row-reverse")}>
            {[
              { label: t('profile.help.start'), icon: language === 'ar' ? ChevronLeft : ChevronRight },
              { label: t('profile.help.payment'), icon: language === 'ar' ? ChevronLeft : ChevronRight },
              { label: t('profile.help.plan'), icon: language === 'ar' ? ChevronLeft : ChevronRight },
              { label: t('profile.help.forgot'), icon: language === 'ar' ? ChevronLeft : ChevronRight },
              { label: t('profile.help.delete'), icon: language === 'ar' ? ChevronLeft : ChevronRight },
              { label: t('profile.help.contact'), icon: language === 'ar' ? ChevronLeft : ChevronRight }
            ].map((topic, i) => (
              <TouchableOpacity
                key={i}
                className={cn("bg-card border border-border/40 p-5 rounded-[24px] w-[47%] items-center justify-between flex-row shadow-sm shadow-black/[0.01]", language === 'en' && "flex-row-reverse")}
              >
                <topic.icon size={16} className="text-muted-foreground/40" />
                <Text className={cn("text-foreground font-bold text-sm", language === 'ar' ? "text-right" : "text-left")}>{topic.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="mt-4 bg-background p-8 rounded-[32px] border border-border items-center gap-6 shadow-sm shadow-primary/5">
            <View className="h-20 w-20 bg-primary/10 rounded-[24px] items-center justify-center rotate-3 border border-primary/20">
              <HelpCircle size={32} className="text-primary" />
            </View>
            <View className="items-center gap-2">
              <Text className="text-center font-bold text-xl text-foreground">{t('profile.help.noResults')}</Text>
              <Text className="text-center text-muted-foreground text-sm font-medium">{t('profile.help.supportDesc')}</Text>
            </View>
            <TouchableOpacity className="bg-primary px-10 py-4 rounded-2xl w-full shadow-lg shadow-primary/20 active:scale-[0.98]">
              <Text className="text-white text-center font-bold text-base">{t('profile.help.talkButton')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    },
    terms: {
      title: t('profile.terms.title'),
      icon: FileText,
      content: () => (
        <ScrollView className="p-4">
          <View className="bg-card p-8 rounded-[32px] border border-border/50 gap-6 shadow-sm shadow-black/[0.01]">
            <View className={cn("items-end gap-2", language === 'en' && "items-start")}>
              <Text className={cn("font-bold text-2xl text-foreground", language === 'ar' ? "text-right" : "text-left")}>{t('profile.terms.header')}</Text>
              <View className="h-1 w-12 bg-primary rounded-full" />
            </View>

            <Text className={cn("text-muted-foreground leading-7 font-medium", language === 'ar' ? "text-right" : "text-left")}>
              {t('profile.terms.intro')}
            </Text>

            <View className={cn("items-end gap-3 mt-4", language === 'en' && "items-start")}>
              <View className="bg-muted px-4 py-1 rounded-full border border-border/50">
                <Text className={cn("font-bold text-xs text-foreground uppercase tracking-wider", language === 'ar' ? "text-right" : "text-left")}>{t('profile.terms.section1')}</Text>
              </View>
              <Text className={cn("text-muted-foreground leading-7 font-medium", language === 'ar' ? "text-right" : "text-left")}>
                {t('profile.terms.desc1')}
              </Text>
            </View>

            <View className={cn("items-end gap-3 mt-4", language === 'en' && "items-start")}>
              <View className="bg-muted px-4 py-1 rounded-full border border-border/50">
                <Text className={cn("font-bold text-xs text-foreground uppercase tracking-wider", language === 'ar' ? "text-right" : "text-left")}>{t('profile.terms.section2')}</Text>
              </View>
              <Text className={cn("text-muted-foreground leading-7 font-medium", language === 'ar' ? "text-right" : "text-left")}>
                {t('profile.terms.desc2')}
              </Text>
            </View>
          </View>
        </ScrollView>
      )
    },
    about: {
      title: t('profile.about.title'),
      icon: Info,
      content: () => (
        <View className="items-center p-8 gap-6">
          <View className="h-32 w-32 bg-background rounded-[40px] items-center justify-center shadow-xl shadow-primary/10 border border-primary/5">
            <View className="h-20 w-20 bg-primary/10 rounded-[24px] items-center justify-center rotate-12 border border-primary/20">
              <Image
                source={require('../../assets/images/logoTrans.png')}
                className="h-20 w-20"
                resizeMode="contain"
              />
            </View>
          </View>
          <View className="items-center gap-1">
            <Text className="text-3xl font-bold text-foreground">{t('header.app.title')}</Text>
            <Text className="text-muted-foreground font-bold text-base">{t('profile.about.subtitle')}</Text>
          </View>
          <View className="flex-row items-center gap-2 bg-secondary px-5 py-2 rounded-full border border-border/50">
            <Text className="text-foreground/70 font-bold text-xs">{t('profile.main.version')} 1.0.0</Text>
          </View>

          <Text className="text-center text-muted-foreground leading-7 font-medium px-4 mt-2">
            {t('profile.about.desc')}
          </Text>

          <View className="flex-row gap-5 mt-6">
            <TouchableOpacity className="h-14 w-14 bg-card rounded-[20px] border border-border items-center justify-center shadow-sm shadow-black/[0.03] active:scale-90">
              <Twitter size={24} className="text-foreground" />
            </TouchableOpacity>
            <TouchableOpacity className="h-14 w-14 bg-card rounded-[20px] border border-border items-center justify-center shadow-sm shadow-black/[0.03] active:scale-90">
              <Instagram size={24} className="text-foreground" />
            </TouchableOpacity>
            <TouchableOpacity className="h-14 w-14 bg-card rounded-[20px] border border-border items-center justify-center shadow-sm shadow-black/[0.03] active:scale-90">
              <ExternalLink size={24} className="text-foreground" />
            </TouchableOpacity>
          </View>
        </View>
      )
    }
  };

  // @ts-ignore
  const section = sections[id as keyof typeof sections];

  if (!section) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text>{t('profile.details.notFound')}</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text className="text-primary">{t('profile.details.back')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const Content = section.content;

  return (
    <View className="flex-1 bg-background">
      <View
        className="flex-row items-center justify-between px-4 pb-4 border-b border-border bg-card shadow-sm shadow-black/[0.02]"
        style={{ paddingTop: Math.max(insets.top, 20) }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="h-12 w-12 items-center justify-center rounded-2xl bg-secondary active:scale-95 border border-border"
        >
          {language === 'ar' ? <ChevronRight size={24} className="text-foreground" /> : <ChevronLeft size={24} className="text-foreground" />}
        </TouchableOpacity>
        <Text className="text-xl font-bold text-foreground text-center flex-1">{section.title}</Text>
        <TouchableOpacity
          onPress={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
          className="h-12 w-12 items-center justify-center rounded-2xl bg-secondary active:scale-95 border border-border"
        >
          <Globe size={20} className="text-foreground" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        <Content />
      </ScrollView>
    </View>
  );
}
