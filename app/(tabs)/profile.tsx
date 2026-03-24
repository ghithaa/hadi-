import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { AppHeader } from '@/components/app-header';
import {
  User,
  Settings,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Crown,
  CreditCard,
  FileText,
  Lock,
  Info,
  Camera,
} from 'lucide-react-native';
import { useLocalization } from '@/context/LocalizationContext';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const router = useRouter();
  const { t, language } = useLocalization();

  const menuGroups = [
    {
      title: t('profile.main.groupAccount'),
      items: [
        { id: 'subscription', label: t('profile.subscription.title'), icon: CreditCard, color: '#a855f7', bg: 'bg-purple-500/10' },
        { id: 'settings', label: t('profile.settings.title'), icon: Settings, color: '#3b82f6', bg: 'bg-blue-500/10' },
      ]
    },
    {
      title: t('profile.main.groupPrefs'),
      items: [
        { id: 'notifications', label: t('profile.notifications.title'), icon: Bell, color: '#f97316', bg: 'bg-orange-500/10' },
        { id: 'privacy', label: t('profile.privacy.title'), icon: Shield, color: '#22c55e', bg: 'bg-green-500/10' },
      ]
    },
    {
      title: t('profile.main.groupSupport'),
      items: [
        { id: 'help', label: t('profile.help.title'), icon: HelpCircle, color: '#06b6d4', bg: 'bg-cyan-500/10' },
        { id: 'terms', label: t('profile.terms.title'), icon: FileText, color: '#6b7280', bg: 'bg-gray-500/10' },
        { id: 'about', label: t('profile.about.title'), icon: Info, color: '#6366f1', bg: 'bg-indigo-500/10' },
      ]
    }
  ];

  const handleNavigate = (id: string) => {
    router.push(`/profile-details/${id}`);
  };

  return (
    <View className="flex-1 bg-background">
      <AppHeader />
      <ScrollView className="flex-1 px-4 py-6">
        {/* Profile Header */}
        <View className="items-center mb-8">
          <View className="relative">
            <View className="h-28 w-28 rounded-full bg-primary/10 items-center justify-center border-4 border-background shadow-xl shadow-black/5 mb-4 overflow-hidden">
              <User size={48} className="text-primary" />
            </View>
            <View className={cn("absolute bottom-5 bg-amber-400 h-9 w-9 rounded-full items-center justify-center border-4 border-background shadow-sm", language === 'ar' ? 'right-1' : 'left-1')}>
              <Crown size={16} color="white" fill="white" />
            </View>
          </View>
          <Text className="text-2xl font-bold text-foreground">{t('profile.main.guestName')}</Text>
          <Text className="text-sm text-muted-foreground font-medium mt-1">guest@hadi.sa</Text>
        </View>

        {/* Premium Banner */}
        <TouchableOpacity
          onPress={() => handleNavigate('subscription')}
          className="relative overflow-hidden rounded-[32px] mb-10 shadow-xl shadow-primary/25 active:scale-[0.98]"
        >
          <View className="absolute inset-0 bg-primary dark:bg-indigo-900" />
          <View className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />

          <View className={cn("flex-row items-center justify-between p-7 py-8", language === 'en' && "flex-row-reverse")}>
            <View className="h-14 w-14 bg-white rounded-2xl items-center justify-center rotate-12 shadow-sm border border-slate-100">
              <Camera color="#64748B" size={24} />
            </View>
            <View className={cn("flex-1 items-end ml-4", language === 'en' && "items-start mr-4 ml-0")}>
              <View className={cn("bg-white/20 px-3 py-1 rounded-full mb-2 border border-white/10", language === 'ar' ? "self-end" : "self-start")}>
                <Text className="text-white text-[10px] font-bold uppercase tracking-wider">{t('profile.main.bannerBadge')}</Text>
              </View>
              <Text className={cn("text-white font-bold text-2xl mb-1", language === 'ar' ? "text-right" : "text-left")}>
                {t('profile.main.bannerTitle')}
              </Text>
              <Text className={cn("text-white/80 text-[13px] font-bold leading-5", language === 'ar' ? "text-right" : "text-left")}>
                {t('profile.main.bannerDesc')}
              </Text>
            </View>
          </View>

          {/* Subtle Decorative Elements */}
          <View className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10" />
          <View className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-white/5" />
        </TouchableOpacity>

        {/* Menu Groups */}
        <View className="gap-6 mb-8">
          {menuGroups.map((group, groupIndex) => (
            <View key={groupIndex}>
              <Text className={cn("text-sm font-bold text-muted-foreground mb-3 px-2", language === 'ar' ? "text-right" : "text-left")}>
                {group.title}
              </Text>
              <View className="bg-card rounded-2xl border border-border overflow-hidden">
                {group.items.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => handleNavigate(item.id)}
                      activeOpacity={0.7}
                      className={cn(
                        "flex-row items-center justify-between p-4 px-5",
                        language === 'en' && "flex-row-reverse",
                        index !== group.items.length - 1 && "border-b border-border/50"
                      )}
                    >
                      {language === 'ar' ? <ChevronLeft size={18} className="text-muted-foreground/50" /> : <ChevronRight size={18} className="text-muted-foreground/50" />}
                      <View className={cn("flex-row items-center gap-4", language === 'en' && "flex-row-reverse")}>
                        <Text className="text-[15px] font-bold text-foreground/90">{item.label}</Text>
                        <View className={`h-11 w-11 rounded-2xl items-center justify-center shadow-sm shadow-black/[0.02] ${item.bg}`}>
                          <Icon size={20} color={item.color} />
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity className={cn("flex-row items-center justify-center p-5 rounded-[24px] bg-destructive/10 dark:bg-destructive/20 mb-8 border border-destructive/10 active:scale-[0.98]", language === 'en' && "flex-row-reverse")}>
          <Text className={cn("text-destructive font-bold text-base", language === 'ar' ? "mr-3" : "ml-3")}>{t('profile.main.logout')}</Text>
          <LogOut size={22} className="text-destructive" />
        </TouchableOpacity>
        {/* admissions */}
        <View className="items-center mb-8">
          <Text className="text-center text-xs text-muted-foreground">
            {t('profile.main.version')} 1.0.0
          </Text>
          <Text className="text-center text-[10px] text-muted-foreground/60 mt-1">
            {t('profile.main.copyright')}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
