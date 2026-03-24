import React from 'react';
import { View, Text, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalization } from '@/context/LocalizationContext';

export default function IntroScreen() {
  const router = useRouter();
  const { t } = useLocalization();

  return (
    <SafeAreaView className="flex-1 bg-background p-6 justify-center items-center">
      <View className="items-center mb-12 space-y-6">
        <View className="h-40 w-40 items-center justify-center rounded-full bg-primary/10 mb-8 overflow-hidden">
          <Image
            source={require('../assets/images/logoTrans.png')}
            className="h-32 w-32"
            resizeMode="contain"
          />
        </View>
        <Text className="text-4xl font-bold text-foreground text-center">
          {t('intro.title')}
        </Text>
        <Text className="text-xl text-muted-foreground text-center px-8">
          {t('intro.subtitle')}
        </Text>
      </View>

      <Button
        className="w-full max-w-sm h-14"
        onPress={() => router.replace('/auth/login')}
      >
        <Text className="text-primary-foreground font-bold text-lg">
          {t('intro.button')}
        </Text>
      </Button>
    </SafeAreaView>
  );
}
