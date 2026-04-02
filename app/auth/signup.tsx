import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock, User, ArrowLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { useLocalization } from '@/context/LocalizationContext';

export default function SignupScreen() {
  const router = useRouter();
  const { signUp, error, clearError } = useAuth();
  const { t } = useLocalization();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    clearError();

    if (!fullName.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال الاسم الكامل');
      return;
    }
    if (!email.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال البريد الإلكتروني');
      return;
    }
    if (password.length < 8) {
      Alert.alert('خطأ', 'كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('خطأ', 'كلمة المرور غير متطابقة');
      return;
    }

    setIsLoading(true);
    try {
      await signUp({ email: email.trim(), password, fullName: fullName.trim() });
      router.replace('/(tabs)');
    } catch {
      // Error is already set in AuthContext
    } finally {
      setIsLoading(false);
    }
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
          label="الاسم الكامل"
          placeholder="أدخل اسمك الكامل"
          value={fullName}
          onChangeText={setFullName}
          icon={<User size={18} className="text-muted-foreground" />}
          autoCapitalize="words"
        />

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

        {error && (
          <View className="bg-destructive/10 border border-destructive/20 rounded-xl p-3">
            <Text className="text-destructive text-sm text-center font-medium">{error}</Text>
          </View>
        )}

        <Button
          className="w-full mt-6 h-14"
          onPress={handleSignUp}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-primary-foreground font-bold text-lg">
              {t('auth.signup.button')}
            </Text>
          )}
        </Button>
      </View>
    </SafeAreaView>
  );
}
