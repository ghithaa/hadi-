import '../global.css';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import * as SplashScreen from 'expo-splash-screen';

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/react-query';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { LocalizationProvider } from '@/context/LocalizationContext';
import { View } from 'react-native';

import { ThemeModeProvider } from '@/hooks/use-color-scheme';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';

void SplashScreen.preventAutoHideAsync();

function SplashController() {
  const { loading: authLoading } = useAuth();
  const [fontsLoaded, fontError] = useFonts({
    'Cairo-Regular': require('../assets/fonts/Cairo-Regular.ttf'),
    'Cairo-Medium': require('../assets/fonts/Cairo-Medium.ttf'),
    'Cairo-SemiBold': require('../assets/fonts/Cairo-SemiBold.ttf'),
    'Cairo-Bold': require('../assets/fonts/Cairo-Bold.ttf'),
    'Cairo-Light': require('../assets/fonts/Cairo-Light.ttf'),
    'Cairo-Black': require('../assets/fonts/Cairo-Black.ttf'),
    'Cairo-ExtraBold': require('../assets/fonts/Cairo-ExtraBold.ttf'),
    'Cairo-ExtraLight': require('../assets/fonts/Cairo-ExtraLight.ttf'),
  });

  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  useEffect(() => {
    // Failsafe: hide splash screen after 5 seconds regardless of state
    const timeout = setTimeout(() => {
      void SplashScreen.hideAsync();
    }, 5000);

    if (!authLoading && fontsLoaded) {
      void SplashScreen.hideAsync();
      clearTimeout(timeout);
    }

    return () => clearTimeout(timeout);
  }, [authLoading, fontsLoaded]);

  return null;
}

function AppContent() {
  const { colorScheme } = useNativeWindColorScheme();

  useEffect(() => {
  }, [colorScheme]);

  return (
    <View key={colorScheme ?? 'light'} className={`flex-1 ${colorScheme === 'dark' ? 'dark' : ''}`}>
      <LocalizationProvider>
        <AuthProvider>
          <SplashController />
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="auth/login" options={{ headerShown: false }} />
              <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
              <Stack.Screen name="intro" options={{ headerShown: false }} />
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="breathing-exercise/[id]" options={{ headerShown: false }} />
              <Stack.Screen name="journey-detail" options={{ headerShown: false }} />
              <Stack.Screen name="journey-lesson" options={{ headerShown: false }} />
              <Stack.Screen name="journeys/[id]" options={{ headerShown: false }} />
              <Stack.Screen name="journeys/lesson" options={{ headerShown: false }} />
              <Stack.Screen name="profile-details/[id]" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          </ThemeProvider>
        </AuthProvider>
      </LocalizationProvider>
    </View>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeModeProvider>
        <AppContent />
      </ThemeModeProvider>
    </QueryClientProvider>
  );
}
