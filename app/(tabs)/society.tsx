import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { AppHeader } from '@/components/app-header';
import { Shield, Brain, Users, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { useLocalization } from '@/context/LocalizationContext';

interface CommunityGroup {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  bg: string;
}

export default function SocietyPage() {
  const { t, language, isRTL, flexDir, textAlign, alignItems, justifyContent, l, r } = useLocalization();

  const groups: CommunityGroup[] = [
    {
      id: 'anxiety',
      title: t('society.group.anxiety.title'),
      description: t('society.group.anxiety.desc'),
      icon: Brain,
      color: 'bg-indigo-500',
      bg: 'bg-indigo-50',
    },
    {
      id: 'parenting',
      title: t('society.group.parenting.title'),
      description: t('society.group.parenting.desc'),
      icon: Users,
      color: 'bg-rose-500',
      bg: 'bg-rose-50',
    },
    {
      id: 'work',
      title: t('society.group.work.title'),
      description: t('society.group.work.desc'),
      icon: Briefcase,
      color: 'bg-blue-500',
      bg: 'bg-blue-50',
    },
  ];

  const handleJoinGroup = (groupId: string) => {
    Alert.alert(t('common.soon'), t('society.groups.joinSoon'));
  };

  const handleEnterGroup = (groupId: string) => {
    Alert.alert(t('common.soon'), t('society.groups.enterSoon'));
  };

  return (
    <View className="flex-1 bg-background">
      <View className="bg-background pb-2">
        <AppHeader />
      </View>

      {/* Organic Background Blobs */}
      <View className="absolute inset-0 overflow-hidden opacity-[0.04]">
        <View
          className="absolute -top-20 -left-20 h-[400px] w-[400px] rounded-full bg-primary/20"
          style={{ transform: [{ scaleX: 1.5 }, { rotate: '45deg' }] }}
        />
        <View
          className="absolute top-1/3 -right-40 h-[350px] w-[350px] rounded-full bg-indigo-200/50"
          style={{ transform: [{ scaleX: 1.2 }] }}
        />
        <View
          className="absolute -bottom-20 left-0 h-[300px] w-[300px] rounded-full bg-rose-200/50"
        />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={true}
      >
        {/* Header Section */}
        <View className="px-6 py-6 mb-1">
          <View className={cn("items-center mb-4", flexDir(), justifyContent('between'))}>
            <View className={alignItems('start')}>
              <Text className={cn("text-2xl font-bold text-foreground", textAlign())}>{t('society.title')}</Text>
              <Text className={cn("text-muted-foreground text-sm mt-0.5", textAlign())}>{t('society.subtitle')}</Text>
            </View>
            <TouchableOpacity className={cn("items-center bg-card px-3 py-1.5 rounded-full border border-border shadow-sm shadow-black/5", flexDir())}>
              <Shield size={16} color="#007AFF" />
              <Text className={cn("text-primary text-[10px] font-bold uppercase tracking-wider", isRTL ? "mr-2" : "ml-2")}>{t('society.guidelines')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Safety Banner - Redesigned */}
        <View className="px-7 mb-8">
          <View className={cn("bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-100/40 dark:border-emerald-800/20 rounded-[20px] p-5 items-center gap-4 shadow-sm shadow-emerald-900/5", flexDir())}>
            <View className="h-10 w-10 rounded-xl bg-card items-center justify-center shadow-sm shadow-emerald-900/10">
              <Shield size={20} color="#059669" />
            </View>
            <View className={cn("flex-1", alignItems('start'))}>
              <Text className={cn("font-bold text-emerald-900 dark:text-emerald-100 text-[16px] mb-1", textAlign())}>{t('society.safety.title')}</Text>
              <Text className={cn("text-emerald-800/60 dark:text-emerald-200/60 text-xs leading-5", textAlign())}>
                {t('society.safety.desc')}
              </Text>
            </View>
          </View>
        </View>

        {/* Groups List */}
        <View className="px-6">
          <View className={cn("items-center justify-between mb-6 px-1", flexDir())}>
            <Text className="text-xl font-bold text-foreground">{t('society.groups.title')}</Text>
            <TouchableOpacity>
              <Text className="text-primary text-sm font-bold">{t('society.groups.viewAll')}</Text>
            </TouchableOpacity>
          </View>

          <View className="gap-6">
            {groups.map((group) => {
              const Icon = group.icon;
              return (
                <View
                  key={group.id}
                  className={cn(
                    "rounded-[28px] p-5 shadow-2xl border border-border/30 overflow-hidden",
                    group.bg,
                    "dark:bg-slate-900/40"
                  )}
                  style={{ shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 24, shadowOffset: { width: 0, height: 8 } }}
                >
                  {/* Glassy Highlighting */}
                  <View className="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-white/5" />
                  <View className="absolute inset-0 bg-background/20" />

                  <View className={cn("items-start justify-between mb-5", flexDir())}>
                    <View className={cn("h-14 w-14 rounded-[20px] items-center justify-center shadow-xl shadow-black/5", group.color)}>
                      <Icon size={28} color="white" />
                    </View>
                    <View className={cn("flex-1", isRTL ? "mr-4" : "ml-4", alignItems('start'))}>
                      <View className={cn("items-center gap-2 mb-2", flexDir())}>
                        <Text className={cn("text-xl font-bold text-foreground", textAlign())}>
                          {group.title}
                        </Text>
                        <View className="bg-card/80 px-2 py-0.5 rounded-full border border-border">
                          <Text className="text-[10px] text-muted-foreground font-bold tracking-wide uppercase">{t('society.groups.active')}</Text>
                        </View>
                      </View>
                      <Text className={cn("text-sm text-muted-foreground leading-6 mb-3 font-medium", textAlign())}>
                        {group.description}
                      </Text>
                      <View className={cn("items-center gap-3", flexDir())}>
                        <View className={cn("items-center gap-1.5", flexDir())}>
                          <Users size={12} className="text-muted-foreground" />
                          <Text className="text-[12px] text-muted-foreground font-bold">1.2k {t('society.groups.members')}</Text>
                        </View>
                        <View className="h-1 w-1 rounded-full bg-emerald-500" />
                        <Text className="text-[12px] text-emerald-600 font-bold">45 {t('society.groups.online')}</Text>
                      </View>
                    </View>
                  </View>

                  <View className={cn("gap-3 pt-1", flexDir())}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      className="flex-1 bg-card border border-border/50 py-3.5 rounded-xl shadow-sm active:scale-[0.97]"
                      onPress={() => handleJoinGroup(group.id)}
                    >
                      <Text className="text-foreground font-bold text-sm text-center">{t('society.groups.join')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className={cn("flex-[1.5] py-3.5 rounded-xl shadow-lg shadow-black/5 active:scale-[0.97]", group.color)}
                      onPress={() => handleEnterGroup(group.id)}
                    >
                      <Text className="text-white font-bold text-sm text-center">{t('society.groups.enter')}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

      </ScrollView>
    </View>
  );
}
