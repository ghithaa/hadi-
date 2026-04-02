import { View, Text, Image, TouchableOpacity } from 'react-native';
import { User, Bell, Moon, Sun, Globe } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useLocalization } from '@/context/LocalizationContext';
import { useThemeMode } from '@/hooks/use-color-scheme';
import { useUnreadCount } from '@/hooks/use-notifications';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

export function AppHeader() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t, language, setLanguage } = useLocalization();
  const { colorScheme, toggleTheme } = useThemeMode();
  const { user } = useAuth();
  const { data: unreadData } = useUnreadCount();
  const unreadCount = unreadData?.unreadCount ?? 0;

  return (
    <View
      className={cn(
        "bg-background px-5 flex-row items-center justify-between border-b border-border/40",
        language === 'en' && "flex-row-reverse"
      )}
      style={{
        paddingTop: Math.max(insets.top, 16),
        paddingBottom: 16,
      }}
    >
      {/* Branding Section */}
      <View className={cn("flex-row items-center gap-3", language === 'en' && "flex-row-reverse")}>
        <View
          className="h-[46px] w-[46px] items-center justify-center rounded-[18px] bg-primary/10 border border-primary/20"
        >
          <Image
            source={require('../assets/images/logoTrans.png')}
            className="h-8 w-8"
            resizeMode="contain"
          />
        </View>
        <View className={cn(language === 'ar' ? "items-start" : "items-end")}>
          <Text className="text-xl font-bold tracking-tight text-foreground leading-6">
            {t('header.app.title')}
          </Text>
          <Text className="text-[10px] font-bold text-primary uppercase tracking-widest mt-0.5">
            {t('header.app.subtitle')}
          </Text>
        </View>
      </View>

      {/* Actions Section */}
      <View className={cn("flex-row items-center gap-2", language === 'en' && "flex-row-reverse")}>
        <TouchableOpacity
          activeOpacity={0.7}
          className="h-10 w-10 items-center justify-center rounded-full bg-secondary border border-border/50"
          onPress={toggleTheme}
        >
          {colorScheme === 'dark' ? (
            <Sun size={18} color="#64748b" /> // slate-500
          ) : (
            <Moon size={18} color="#64748b" /> // slate-500
          )}
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          className="h-10 w-10 items-center justify-center rounded-full bg-secondary border border-border/50"
          onPress={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
        >
          <Globe size={18} color="#64748b" /> 
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          className="h-10 w-10 items-center justify-center rounded-full bg-secondary border border-border/50 relative"
        >
          <Bell size={18} color="#64748b" /> 
          {/* Notification Dot — only show when authenticated and has unread */}
          {user && unreadCount > 0 && (
            <View className={cn(
              "absolute top-2.5 h-2.5 w-2.5 rounded-full bg-rose-500 border-2 border-background",
              language === 'ar' ? "right-2.5" : "left-2.5"
            )} />
          )}
        </TouchableOpacity>

        {/* Highlighted Profile Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          className={cn(
            "h-10 w-10 items-center justify-center rounded-full bg-primary/10 border border-primary/20",
            language === 'ar' ? "mr-1" : "ml-1"
          )}
          onPress={() => router.push('/(tabs)/profile')}
        >
          <User size={18} color="#0f766e" /> 
        </TouchableOpacity>
      </View>
    </View>
  );
}
