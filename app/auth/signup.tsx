import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, ActivityIndicator, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock, User, ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { useLocalization } from '@/context/LocalizationContext';

export default function SignupScreen() {
  const router = useRouter();
  const { signUp, error, clearError } = useAuth();
  const { t, language, isRTL, flexDir, textAlign, alignItems, alignSelf, justifyContent, l, r } = useLocalization();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Clear error when screen is entered
  useEffect(() => {
    clearError();
  }, []);

  const handleSignUp = async () => {
    clearError();

    if (!fullName.trim()) {
      Alert.alert(t('common.error') || 'Error', t('auth.signup.error.fullName') || 'Please enter full name');
      return;
    }
    if (!email.trim()) {
      Alert.alert(t('common.error') || 'Error', t('auth.signup.error.email') || 'Please enter email');
      return;
    }
    if (password.length < 8) {
      Alert.alert(t('common.error') || 'Error', t('auth.signup.error.passwordLength') || 'Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert(t('common.error') || 'Error', t('auth.signup.error.passwordMismatch') || 'Passwords do not match');
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
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 20}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 160 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={true}
          automaticallyAdjustKeyboardInsets={true}
        >
          <View className="flex-1 px-6 py-6">
            <TouchableOpacity
              onPress={() => router.back()}
              className={cn("items-center gap-2 mb-8", alignSelf('start'), flexDir())}
            >
              {isRTL ? (
                <ArrowRight size={20} className="text-muted-foreground" />
              ) : (
                <ArrowLeft size={20} className="text-muted-foreground" />
              )}
              <Text className="text-muted-foreground font-medium">
                {t('auth.signup.backToLogin')}
              </Text>
            </TouchableOpacity>
            <View className={cn("items-center mb-8 space-y-4", alignItems('center'))}>
              <View className="h-24 w-24 items-center justify-center rounded-full bg-primary/10 mb-4 overflow-hidden">
                <Image
                  source={require('../../assets/images/logoTrans.png')}
                  className="h-20 w-20"
                  resizeMode="contain"
                />
              </View>
              <Text className={cn("text-2xl font-bold text-foreground", textAlign())}>
                {t('auth.signup.title')}
              </Text>
              <Text className={cn("text-muted-foreground", textAlign())}>
                {t('auth.signup.subtitle')}
              </Text>
            </View>

            <View className="gap-4 w-full max-w-sm mx-auto">
              <Input
                label={t('auth.signup.fullNameLabel')}
                placeholder={t('auth.signup.fullNamePlaceholder')}
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
                secureTextEntry={!showPassword}
                textContentType="oneTimeCode"
                icon={<Lock size={18} className="text-muted-foreground" />}
                rightIcon={
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="p-2 -mr-2">
                    {showPassword ? (
                      <EyeOff size={18} className="text-muted-foreground" />
                    ) : (
                      <Eye size={18} className="text-muted-foreground" />
                    )}
                  </TouchableOpacity>
                }
              />

              <Input
                label={t('auth.signup.confirmPasswordLabel')}
                placeholder={t('auth.signup.confirmPasswordPlaceholder')}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
                textContentType="oneTimeCode"
                icon={<Lock size={18} className="text-muted-foreground" />}
                rightIcon={
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="p-2 -mr-2">
                    {showPassword ? (
                      <EyeOff size={18} className="text-muted-foreground" />
                    ) : (
                      <Eye size={18} className="text-muted-foreground" />
                    )}
                  </TouchableOpacity>
                }
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
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
