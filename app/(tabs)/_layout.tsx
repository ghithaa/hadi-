import { Tabs } from 'expo-router';
import React from 'react';
import { TabBar } from '@/components/TabBar';
import { useLocalization } from '@/context/LocalizationContext';

export default function TabLayout() {
  const { t } = useLocalization();

  return (
    <Tabs 
      tabBar={(props) => <TabBar {...props} />} 
      screenOptions={{ 
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: t('tabs.home') }} />
      <Tabs.Screen name="chat" options={{ title: t('tabs.chat') }} />
      <Tabs.Screen name="insights" options={{ title: t('tabs.insights') }} />
      <Tabs.Screen name="society" options={{ title: t('tabs.society') }} />
      
      <Tabs.Screen name="assessments" options={{ href: null }} />
      <Tabs.Screen name="mood" options={{ href: null }} />
      <Tabs.Screen name="breathing" options={{ href: null }} />
      <Tabs.Screen name="gratitude" options={{ href: null }} />
      <Tabs.Screen name="sleep" options={{ href: null }} />
      <Tabs.Screen name="drawing" options={{ href: null }} />
      <Tabs.Screen name="emergency" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ href: null }} />
      <Tabs.Screen name="reports" options={{ href: null }} />
      <Tabs.Screen name="plan" options={{ href: null }} />
      <Tabs.Screen name="cbt" options={{ href: null }} />
      <Tabs.Screen name="emotions" options={{ href: null }} />
    </Tabs>
  );
}
