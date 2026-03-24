import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import {
  Home,
  MessageCircle,
  BarChart3,
  LayoutGrid,
  ClipboardList,
  Palette,
  Wind,
  BookOpen,
  Moon,
  Phone,
  User,
  Users,
  X,
  Target,
  Brain,
  Smile,
} from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalization } from '@/context/LocalizationContext';

const mainNavItems = [
  { id: 'index', labelKey: 'tabs.home', icon: Home },
  { id: 'chat', labelKey: 'tabs.chat', icon: MessageCircle },
  { id: 'insights', labelKey: 'tabs.insights', icon: BarChart3 },
  { id: 'society', labelKey: 'tabs.society', icon: Users },
  { id: 'profile', labelKey: 'tabs.profile', icon: User },
];

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { t } = useLocalization();

  const currentRouteName = state.routes[state.index].name;

  const handleTabChange = (id: string) => {
    navigation.navigate(id);
  };

  return (
    <View
      style={{ paddingBottom: insets.bottom + 12 }}
      className="flex-row items-center justify-around border-t border-border/40 bg-card px-4 pt-4 shadow-xl"
    >
      {mainNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentRouteName === item.id;

        return (
          <TouchableOpacity
            key={item.id}
            onPress={() => handleTabChange(item.id)}
            className={cn(
              "flex-1 items-center justify-center py-2 px-1 rounded-2xl transition-all",
              isActive ? "bg-primary/10" : "bg-transparent"
            )}
          >
            <Icon
              size={22}
              strokeWidth={isActive ? 2.5 : 2}
              className={cn(
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            />
            <Text
              className={cn(
                'mt-1.5 text-[10px] uppercase tracking-tighter font-bold',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {t(item.labelKey)}
            </Text>
            {isActive && (
              <View className="absolute -bottom-1 h-1 w-4 bg-primary rounded-full" />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
