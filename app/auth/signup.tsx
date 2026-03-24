import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock, ArrowLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { useLocalization } from '@/context/LocalizationContext';

export default function SignupScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { t } = useLocalization();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = () => {
    signIn();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-6">
      <TouchableOpacity
        onPress={() => router.back()}
        className="flex-row items-center gap-2 mb-8"
      >
        <ArrowLeft size={20} className="text-muted-foreground" />
        <Text className="text-muted-foreground font-medium">
          {t('auth.signup.backToLogin')}
        </Text>
      </TouchableOpacity>

      <View className="items-center mb-8 space-y-4">
        <View className="h-24 w-24 items-center justify-center rounded-full bg-primary/10 mb-4 overflow-hidden">
          <Image
            source={require('../../assets/images/logoTrans.png')}
            className="h-20 w-20"
            resizeMode="contain"
          />
        </View>
        <Text className="text-2xl font-bold text-foreground text-center">
          {t('auth.signup.title')}
        </Text>
        <Text className="text-muted-foreground text-center">
          {t('auth.signup.subtitle')}
        </Text>
      </View>

      <View className="gap-4 w-full max-w-sm mx-auto">
        <Input
          label={t('auth.signup.emailLabel')}
          placeholder={t('auth.signup.emailPlaceholder')}
          value={email}
          onChangeText={setEmail}
          icon={<Mail size={18} className="text-muted-foreground" />}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Input
          label={t('auth.signup.passwordLabel')}
          placeholder={t('auth.signup.passwordPlaceholder')}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          icon={<Lock size={18} className="text-muted-foreground" />}
        />

        <Input
          label={t('auth.signup.confirmPasswordLabel')}
          placeholder={t('auth.signup.confirmPasswordPlaceholder')}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          icon={<Lock size={18} className="text-muted-foreground" />}
        />

        <Button
          className="w-full mt-6 h-14"
          onPress={handleSignUp}
        >
          <Text className="text-primary-foreground font-bold text-lg">
            {t('auth.signup.button')}
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
