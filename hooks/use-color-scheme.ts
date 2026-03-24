import React, { createContext, useContext, useEffect, useState } from 'react';
import { ColorSchemeName } from 'react-native';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';

type ThemeContextValue = {
  colorScheme: NonNullable<ColorSchemeName>;
  toggleTheme: () => void;
  setTheme: (scheme: NonNullable<ColorSchemeName>) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

type Props = {
  children: React.ReactNode;
};

export function ThemeModeProvider({ children }: Props) {
  const { colorScheme, setColorScheme } = useNativeWindColorScheme();

  const toggleTheme = () => {
    const newTheme = colorScheme === 'dark' ? 'light' : 'dark';
    setColorScheme(newTheme);
  };

  const setTheme = (scheme: NonNullable<ColorSchemeName>) => {
    setColorScheme(scheme);
  };

  return React.createElement(
    ThemeContext.Provider,
    { value: { colorScheme: colorScheme ?? 'light', toggleTheme, setTheme } },
    children
  );
}

export function useThemeMode() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useThemeMode must be used within ThemeModeProvider');
  }
  return ctx;
}

export function useColorScheme() {
  const { colorScheme } = useNativeWindColorScheme();
  return colorScheme ?? 'light';
}


