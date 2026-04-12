import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, ActivityIndicator, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { useLocalization } from '@/context/LocalizationContext';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, error, clearError } = useAuth();
  const { t } = useLocalization();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Clear error when screen is entered
  useEffect(() => {
    clearError();
  }, []);

  const handleSignIn = async () => {
    clearError();
    setIsLoading(true);
    try {
      await signIn(email.trim(), password);
      router.replace('/(tabs)');
    } catch (err) {
      // Error is handled in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    Alert.alert(t('common.soon'), t('auth.login.googleSoon'));
  };

  const handleAppleLogin = () => {
    Alert.alert(t('common.soon'), t('auth.login.appleSoon'));
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center mb-8 space-y-4">
            <View className="h-24 w-24 items-center justify-center rounded-full bg-primary/10 mb-4 overflow-hidden">
              <Image
                source={require('../../assets/images/logoTrans.png')}
                className="h-20 w-20"
                resizeMode="contain"
              />
            </View>
            <Text className="text-2xl font-bold text-foreground text-center">
              {t('auth.login.title')}
            </Text>
            <Text className="text-muted-foreground text-center">
              {t('auth.login.subtitle')}
            </Text>
          </View>

          <View className="gap-4 w-full max-w-sm mx-auto">
            <Button variant="outline" className="flex-row gap-2 w-full justify-center h-14" onPress={handleGoogleLogin}>
              <Text className="text-xl">G</Text>
              <Text className="text-foreground font-medium text-lg">
                {t('auth.login.google')}
              </Text>
            </Button>

            <Button variant="outline" className="flex-row gap-2 w-full justify-center h-14" onPress={handleAppleLogin}>
              <Text className="text-xl text-foreground"></Text>
              <Text className="text-foreground font-medium text-lg">
                {t('auth.login.apple')}
              </Text>
            </Button>

            <View className="flex-row items-center gap-4 my-4">
              <View className="flex-1 h-[1px] bg-border" />
              <Text className="text-muted-foreground text-xs uppercase">Or</Text>
              <View className="flex-1 h-[1px] bg-border" />
            </View>

            <Input
              label={t('auth.login.emailLabel')}
              placeholder={t('auth.login.emailPlaceholder')}
              value={email}
              onChangeText={setEmail}
              icon={<Mail size={18} className="text-muted-foreground" />}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Input
              label={t('auth.login.passwordLabel')}
              placeholder={t('auth.login.passwordPlaceholder')}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
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
              className="w-full mt-4 h-14"
              onPress={handleSignIn}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-primary-foreground font-bold text-lg">
                  {t('auth.login.button')}
                </Text>
              )}
            </Button>

            <View className="flex-row justify-center mt-4">
              <Text className="text-muted-foreground">
                {t('auth.login.noAccount')}{' '}
              </Text>
              <TouchableOpacity onPress={() => router.push('/auth/signup' as any)}>
                <Text className="text-primary font-bold">
                  {t('auth.login.signupLink')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
