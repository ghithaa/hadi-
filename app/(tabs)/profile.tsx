import { View, Text, TouchableOpacity, ScrollView, Image, Alert, Platform, Modal, ActivityIndicator, Switch } from 'react-native';
import { useState, useEffect } from 'react';
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
  Globe,
  Palette
} from 'lucide-react-native';
import { useLocalization } from '@/context/LocalizationContext';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { useThemeMode } from '@/hooks/use-color-scheme';
import { authService } from '@/services/auth.service';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getItem, setItem } from '@/lib/token-storage';

const SHOW_PREMIUM = false;

export default function ProfilePage() {
  const router = useRouter();
  const { t, language, setLanguage, isRTL, flexDir, textAlign, alignItems, justifyContent, l, r } = useLocalization();
  const { user, updateUser, signOut } = useAuth();
  const { colorScheme, toggleTheme } = useThemeMode();

  // Profile Form State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | undefined>(undefined);
  const [isProfileUpdating, setIsProfileUpdating] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Password Form State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Notifications Toggle State
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [notificationsToggles, setNotificationsToggles] = useState({
    daily: true,
    updates: true,
    tips: false,
    reminders: true
  });

  // Load toggles from storage on mount/open
  useEffect(() => {
    const loadToggles = async () => {
      const stored = await getItem('hadi_notification_settings');
      if (stored) {
        try {
          setNotificationsToggles(JSON.parse(stored));
        } catch (e) {
          // Ignore parsing errors
        }
      }
    };
    loadToggles();
  }, [isNotificationsModalOpen]);

  const saveNotifications = async (key: string, value: boolean) => {
    const updated = { ...notificationsToggles, [key]: value };
    setNotificationsToggles(updated);
    await setItem('hadi_notification_settings', JSON.stringify(updated));
  };

  const doLogout = async () => {
    await signOut();
    router.replace('/auth/login' as any);
  };

  const handleLogout = async () => {
    if (Platform.OS === 'web') {
      if (window.confirm(language === 'ar' ? 'هل أنت متأكد أنك تريد تسجيل الخروج؟' : 'Are you sure you want to logout?')) {
        await doLogout();
      }
      return;
    }
    Alert.alert(
      language === 'ar' ? 'تسجيل الخروج' : 'Logout',
      language === 'ar' ? 'هل أنت متأكد أنك تريد تسجيل الخروج؟' : 'Are you sure you want to logout?',
      [
        { text: language === 'ar' ? 'إلغاء' : 'Cancel', style: 'cancel' },
        { text: language === 'ar' ? 'تسجيل الخروج' : 'Logout', style: 'destructive', onPress: doLogout },
      ]
    );
  };

  const handleSaveProfile = async () => {
    if (!fullName.trim()) {
      setProfileError(language === 'ar' ? 'الاسم الكامل مطلوب' : 'Full Name is required');
      return;
    }
    setProfileError(null);
    setIsProfileUpdating(true);
    try {
      const updatedUser = await authService.updateMe({
        fullName: fullName.trim(),
        phone: phone.trim() || undefined,
        dateOfBirth: dateOfBirth.trim() || undefined,
        gender: gender || undefined,
      });
      if (updateUser) {
        await updateUser(updatedUser);
      }
      setIsProfileModalOpen(false);
      Alert.alert(
        language === 'ar' ? 'نجاح' : 'Success',
        t('profile.settings.successProfileUpdate')
      );
    } catch (e: any) {
      setProfileError(e?.message || (language === 'ar' ? 'فشل التحديث' : 'Failed to update'));
    } finally {
      setIsProfileUpdating(false);
    }
  };

  const handleSavePassword = async () => {
    if (!oldPassword) {
      setPasswordError(language === 'ar' ? 'كلمة المرور الحالية مطلوبة' : 'Current password is required');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError(language === 'ar' ? 'يجب أن تكون كلمة المرور الجديدة 6 أحرف على الأقل' : 'New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError(t('profile.settings.passwordMismatch'));
      return;
    }
    
    setPasswordError(null);
    setIsPasswordUpdating(true);
    try {
      await authService.changePassword({
        oldPassword,
        newPassword,
      });
      setIsPasswordModalOpen(false);
      Alert.alert(
        language === 'ar' ? 'نجاح' : 'Success',
        t('profile.settings.successPasswordUpdate')
      );
    } catch (e: any) {
      setPasswordError(e?.message || (language === 'ar' ? 'فشل تغيير كلمة المرور' : 'Failed to change password'));
    } finally {
      setIsPasswordUpdating(false);
    }
  };

  const performDelete = async () => {
    try {
      await authService.deleteMe();
      await signOut();
      router.replace('/auth/login' as any);
    } catch (e: any) {
      Alert.alert(t('common.error'), e?.message || t('common.error'));
    }
  };

  const handleDeleteAccount = () => {
    if (Platform.OS === 'web') {
      if (window.confirm(t('profile.settings.deleteConfirmDesc'))) {
        performDelete();
      }
      return;
    }
    Alert.alert(
      t('profile.settings.deleteConfirmTitle'),
      t('profile.settings.deleteConfirmDesc'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { 
          text: t('profile.settings.deleteConfirmButton'), 
          style: 'destructive', 
          onPress: performDelete 
        }
      ]
    );
  };

  const handleRowPress = (id: string) => {
    if (id === 'profile') {
      setFullName(user?.full_name || '');
      setPhone(user?.phone || '');
      setDateOfBirth(user?.dateOfBirth || '');
      setGender(user?.gender);
      setProfileError(null);
      setIsProfileModalOpen(true);
    } else if (id === 'password') {
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordError(null);
      setIsPasswordModalOpen(true);
    } else if (id === 'notifications') {
      setIsNotificationsModalOpen(true);
    } else if (id === 'language') {
      setLanguage(language === 'ar' ? 'en' : 'ar');
    } else if (id === 'appearance') {
      toggleTheme();
    } else if (id === 'privacy') {
      router.push('/profile-details/privacy');
    } else if (id === 'help') {
      router.push('/profile-details/help');
    } else if (id === 'terms') {
      router.push('/profile-details/terms');
    } else if (id === 'about') {
      router.push('/profile-details/about');
    }
  };

  const settingsItems = [
    { id: 'profile', label: t('profile.settings.editProfile'), chevron: language === 'ar' ? ChevronLeft : ChevronRight, icon: User, iconColor: '#3b82f6', iconBg: 'bg-blue-500/10 dark:bg-blue-500/20' },
    { id: 'password', label: t('profile.settings.changePassword'), value: '••••••••', chevron: language === 'ar' ? ChevronLeft : ChevronRight, icon: Lock, iconColor: '#8b5cf6', iconBg: 'bg-purple-500/10 dark:bg-purple-500/20' },
    { id: 'notifications', label: t('profile.notifications.title'), value: (notificationsToggles.daily || notificationsToggles.updates || notificationsToggles.tips || notificationsToggles.reminders) ? (language === 'ar' ? 'مفعل' : 'On') : (language === 'ar' ? 'معطل' : 'Off'), chevron: language === 'ar' ? ChevronLeft : ChevronRight, icon: Bell, iconColor: '#f97316', iconBg: 'bg-orange-500/10 dark:bg-orange-500/20' },
    { id: 'language', label: t('profile.settings.language'), value: language === 'ar' ? 'العربية' : 'English', chevron: language === 'ar' ? ChevronLeft : ChevronRight, icon: Globe, iconColor: '#10b981', iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20' },
    { id: 'appearance', label: t('profile.settings.appearance'), value: colorScheme === 'dark' ? (language === 'ar' ? 'داكن' : 'Dark') : (language === 'ar' ? 'فاتح' : 'Light'), chevron: language === 'ar' ? ChevronLeft : ChevronRight, icon: Palette, iconColor: '#06b6d4', iconBg: 'bg-cyan-500/10 dark:bg-cyan-500/20' },
    // { id: 'privacy', label: t('profile.privacy.title'), chevron: language === 'ar' ? ChevronLeft : ChevronRight, icon: Shield, iconColor: '#22c55e', iconBg: 'bg-green-500/10 dark:bg-green-500/20' },
    // { id: 'help', label: t('profile.help.title'), chevron: language === 'ar' ? ChevronLeft : ChevronRight, icon: HelpCircle, iconColor: '#06b6d4', iconBg: 'bg-cyan-500/10 dark:bg-cyan-500/20' },
    { id: 'terms', label: t('profile.terms.title'), chevron: language === 'ar' ? ChevronLeft : ChevronRight, icon: FileText, iconColor: '#6b7280', iconBg: 'bg-gray-500/10 dark:bg-gray-500/20' },
    { id: 'about', label: t('profile.about.title'), chevron: language === 'ar' ? ChevronLeft : ChevronRight, icon: Info, iconColor: '#6366f1', iconBg: 'bg-indigo-500/10 dark:bg-indigo-500/20' },
  ];

  return (
    <View className="flex-1 bg-background">
      <AppHeader />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={true} contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 100 }}>
        {/* Profile Header */}
        <View className="items-center mb-8">
          <View className="relative">
            <View className="h-28 w-28 rounded-full bg-primary/10 items-center justify-center border-4 border-background shadow-xl shadow-black/5 mb-4 overflow-hidden">
              <User size={48} className="text-primary" />
            </View>
            {SHOW_PREMIUM && (
              <View className={cn("absolute bottom-5 bg-amber-400 h-9 w-9 rounded-full items-center justify-center border-4 border-background shadow-sm", isRTL ? 'right-1' : 'left-1')}>
                <Crown size={16} color="white" fill="white" />
              </View>
            )}
          </View>
          <Text className="text-2xl font-bold text-foreground">
            {user?.full_name || t('profile.main.guestName')}
          </Text>
          <Text className="text-sm text-muted-foreground font-medium mt-1">
            {user?.email || 'guest@hadee.sa'}
          </Text>
        </View>

        {/* Premium Banner */}
        {SHOW_PREMIUM && (
          <TouchableOpacity
            onPress={() => router.push('/profile-details/subscription')}
            className="relative overflow-hidden rounded-[32px] mb-10 shadow-xl shadow-primary/25 active:scale-[0.98]"
          >
            <View className="absolute inset-0 bg-primary dark:bg-indigo-900" />
            <View className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />

            <View className={cn("items-center p-7 py-8", flexDir(), justifyContent('between'))}>
              <View className="h-14 w-14 bg-white rounded-2xl items-center justify-center rotate-12 shadow-sm border border-slate-100">
                <Camera color="#64748B" size={24} />
              </View>
              <View className={cn("flex-1", alignItems('start'), isRTL ? "mr-4" : "ml-4")}>
                <View className={cn("bg-white/20 px-3 py-1 rounded-full mb-2 border border-white/10")}>
                  <Text className="text-white text-[10px] font-bold uppercase tracking-wider">{t('profile.main.bannerBadge')}</Text>
                </View>
                <Text className={cn("text-white font-bold text-2xl mb-1", textAlign())}>
                  {t('profile.main.bannerTitle')}
                </Text>
                <Text className={cn("text-white/80 text-[13px] font-bold leading-5", textAlign())}>
                  {t('profile.main.bannerDesc')}
                </Text>
              </View>
            </View>

            {/* Subtle Decorative Elements */}
            <View className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10" />
            <View className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-white/5" />
          </TouchableOpacity>
        )}

        {/* Settings Rows Card */}
        <View className="bg-card rounded-[32px] border border-border/50 overflow-hidden shadow-sm shadow-black/[0.01] mb-6">
          {settingsItems.map((item, i, arr) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleRowPress(item.id)}
                className={cn(
                  "p-5 items-center justify-between active:bg-secondary/40",
                  flexDir(),
                  i !== arr.length - 1 && "border-b border-border/40"
                )}
              >
                {/* Left/Start side: Icon + Label */}
                <View className={cn("flex-row items-center gap-3", flexDir())}>
                  <View className={cn("h-10 w-10 rounded-xl items-center justify-center shadow-sm shadow-black/[0.02]", item.iconBg)}>
                    <Icon size={20} color={item.iconColor} />
                  </View>
                  <Text className="text-foreground font-bold text-[15px] max-w-[160px]" numberOfLines={1}>
                    {item.label}
                  </Text>
                </View>
                
                {/* Right/End side: Value + Chevron */}
                <View className={cn("flex-row items-center gap-3", flexDir())}>
                  {item.value && (
                    <Text className="text-muted-foreground text-sm font-semibold">
                      {item.value}
                    </Text>
                  )}
                  <item.chevron size={18} className="text-muted-foreground/40" />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Destructive Delete Account Card */}
        <TouchableOpacity 
          onPress={handleDeleteAccount}
          className={cn("bg-destructive/5 dark:bg-destructive/10 p-5 rounded-[32px] border border-destructive/15 flex-row items-center justify-between active:scale-[0.98] shadow-sm shadow-destructive/5 mb-6", language === 'en' && "flex-row-reverse")}
        >
          <View className="h-10 w-10 bg-destructive/10 rounded-xl items-center justify-center">
            <Shield size={20} className="text-destructive" />
          </View>
          <View className={cn("flex-1 items-end mr-4", language === 'en' && "items-start ml-4 mr-0")}>
            <Text className="text-destructive font-bold text-base">{t('profile.settings.deleteAccount')}</Text>
            <Text className="text-destructive/60 text-[10px] font-semibold mt-0.5">{t('profile.settings.deleteDesc')}</Text>
          </View>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className={cn("items-center justify-center p-5 rounded-[24px] bg-destructive/10 dark:bg-destructive/20 mb-8 border border-destructive/10 active:scale-[0.98]", flexDir())}
        >
          <LogOut size={22} className="text-destructive" />
          <Text className={cn("text-destructive font-bold text-base", isRTL ? "mr-3" : "ml-3")}>{t('profile.main.logout')}</Text>
        </TouchableOpacity>

        {/* Admissions */}
        <View className="items-center mb-8">
          <Text className="text-center text-xs text-muted-foreground">
            {t('profile.main.version')} 1.0.0
          </Text>
          <Text className="text-center text-[10px] text-muted-foreground/60 mt-1">
            {t('profile.main.copyright')}
          </Text>
        </View>

        {/* Edit Profile Modal */}
        <Modal
          visible={isProfileModalOpen}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsProfileModalOpen(false)}
        >
          <View className="flex-1 justify-end bg-black/60">
            <View className="bg-card dark:bg-slate-900 rounded-t-[40px] p-6 pb-12 border-t border-border/50 shadow-2xl">
              <View className="w-12 h-1.5 bg-muted rounded-full self-center mb-6" />
              <Text className="text-xl font-bold text-foreground text-center mb-6">
                {t('profile.settings.editProfile')}
              </Text>
              {profileError && (
                <Text className="text-destructive text-sm text-center mb-4 font-semibold">{profileError}</Text>
              )}
              <View className="gap-4 mb-8">
                <Input
                  label={t('profile.settings.fullName')}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder={language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                  className="text-foreground"
                />
                <Input
                  label={t('profile.settings.phone')}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="+966500000000"
                  keyboardType="phone-pad"
                  className="text-foreground"
                />
                <Input
                  label={t('profile.settings.dateOfBirth')}
                  value={dateOfBirth}
                  onChangeText={setDateOfBirth}
                  placeholder="YYYY-MM-DD"
                  className="text-foreground"
                />
                <View className="space-y-2">
                  <Text className={cn("text-sm font-semibold text-foreground mb-1", language === 'ar' ? "text-right" : "text-left")}>
                    {t('profile.settings.gender')}
                  </Text>
                  <View className={cn("flex-row gap-2 w-full", language === 'en' && "flex-row-reverse")}>
                    {(['male', 'female', 'other'] as const).map((g) => {
                      const label = g === 'male' ? t('profile.settings.genderMale') : g === 'female' ? t('profile.settings.genderFemale') : t('profile.settings.genderOther');
                      const isSelected = gender === g;
                      return (
                        <TouchableOpacity
                          key={g}
                          onPress={() => setGender(g)}
                          className={cn(
                            "flex-1 py-3.5 rounded-2xl items-center border",
                            isSelected 
                              ? "bg-primary border-primary" 
                              : "bg-secondary border-border/50"
                          )}
                        >
                          <Text className={cn(
                            "font-bold text-sm",
                            isSelected ? "text-primary-foreground" : "text-muted-foreground"
                          )}>
                            {label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </View>
              <View className={cn("flex-row gap-4", language === 'en' && "flex-row-reverse")}>
                <Button
                  variant="outline"
                  className="flex-1 h-14 rounded-2xl border-border/60"
                  onPress={() => setIsProfileModalOpen(false)}
                >
                  {t('common.cancel')}
                </Button>
                <Button
                  className="flex-1 h-14 rounded-2xl bg-primary"
                  onPress={handleSaveProfile}
                  disabled={isProfileUpdating}
                >
                  {isProfileUpdating ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    t('common.save')
                  )}
                </Button>
              </View>
            </View>
          </View>
        </Modal>

        {/* Change Password Modal */}
        <Modal
          visible={isPasswordModalOpen}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsPasswordModalOpen(false)}
        >
          <View className="flex-1 justify-end bg-black/60">
            <View className="bg-card dark:bg-slate-900 rounded-t-[40px] p-6 pb-12 border-t border-border/50 shadow-2xl">
              <View className="w-12 h-1.5 bg-muted rounded-full self-center mb-6" />
              <View className="items-center mb-6">
                <View className="h-14 w-14 rounded-2xl bg-purple-500/10 items-center justify-center mb-3">
                  <Lock size={24} color="#8b5cf6" />
                </View>
                <Text className="text-xl font-bold text-foreground text-center">
                  {t('profile.settings.changePassword')}
                </Text>
              </View>
              {passwordError && (
                <Text className="text-destructive text-sm text-center mb-4 font-semibold">{passwordError}</Text>
              )}
              <View className="gap-4 mb-8 rounded-[28px] bg-secondary/35 border border-border/30 p-4">
                <Input
                  label={t('profile.settings.oldPassword')}
                  value={oldPassword}
                  onChangeText={setOldPassword}
                  secureTextEntry
                  placeholder="••••••••"
                  className="text-foreground bg-background border-border/40"
                />
                <Input
                  label={t('profile.settings.newPassword')}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                  placeholder="••••••••"
                  className="text-foreground bg-background border-border/40"
                />
                <Input
                  label={t('profile.settings.confirmPassword')}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  placeholder="••••••••"
                  className="text-foreground bg-background border-border/40"
                />
              </View>
              <View className={cn("flex-row gap-4", language === 'en' && "flex-row-reverse")}>
                <Button
                  variant="outline"
                  className="flex-1 h-14 rounded-2xl border-border/60 bg-background"
                  onPress={() => setIsPasswordModalOpen(false)}
                >
                  {t('common.cancel')}
                </Button>
                <Button
                  className="flex-1 h-14 rounded-2xl bg-primary shadow-sm shadow-primary/20"
                  onPress={handleSavePassword}
                  disabled={isPasswordUpdating}
                >
                  {isPasswordUpdating ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    t('common.save')
                  )}
                </Button>
              </View>
            </View>
          </View>
        </Modal>

        {/* Notifications Preferences Modal */}
        <Modal
          visible={isNotificationsModalOpen}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsNotificationsModalOpen(false)}
        >
          <View className="flex-1 justify-end bg-black/60">
            <View className="bg-card dark:bg-slate-900 rounded-t-[40px] p-6 pb-12 border-t border-border/50 shadow-2xl">
              <View className="w-12 h-1.5 bg-muted rounded-full self-center mb-6" />
              
              <Text className="text-xl font-bold text-foreground text-center mb-6">
                {t('profile.notifications.title')}
              </Text>

              <View className="bg-secondary/40 rounded-3xl border border-border/30 overflow-hidden mb-8">
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
                      i !== arr.length - 1 && "border-b border-border/30"
                    )}
                  >
                    <Switch
                      value={notificationsToggles[item.id as keyof typeof notificationsToggles]}
                      onValueChange={(v: boolean) => saveNotifications(item.id, v)}
                      trackColor={{ false: '#767577', true: '#0284c7' }}
                      thumbColor={Platform.OS === 'ios' ? undefined : '#f4f3f4'}
                    />
                    <View className={cn("flex-1 items-end mr-4", language === 'en' && "items-start ml-4 mr-0")}>
                      <Text className={cn("text-foreground font-bold text-base", language === 'ar' ? "text-right" : "text-left")}>{item.label}</Text>
                      <Text className={cn("text-muted-foreground text-[10px] mt-1 font-medium leading-4", language === 'ar' ? "text-right" : "text-left")}>{item.desc}</Text>
                    </View>
                  </View>
                ))}
              </View>

              <Button
                className="h-14 rounded-2xl bg-primary w-full"
                onPress={() => setIsNotificationsModalOpen(false)}
              >
                {language === 'ar' ? 'تم' : 'Done'}
              </Button>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}
