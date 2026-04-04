import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';
import { ColorSchemeName } from 'react-native';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const colorScheme = useRNColorScheme();

  if (hasHydrated) {
    return colorScheme;
  }

  return 'light';
}

// ── ThemeModeProvider (web version) ──────────────────────────────────────────

type ThemeContextValue = {
  colorScheme: NonNullable<ColorSchemeName>;
  toggleTheme: () => void;
  setTheme: (scheme: NonNullable<ColorSchemeName>) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

type Props = { children: React.ReactNode };

export function ThemeModeProvider({ children }: Props) {
  const systemScheme = useColorScheme();
  const [colorScheme, setColorSchemeState] = useState<NonNullable<ColorSchemeName>>(
    systemScheme ?? 'light'
  );

  const toggleTheme = () => {
    setColorSchemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (scheme: NonNullable<ColorSchemeName>) => {
    setColorSchemeState(scheme);
  };

  return React.createElement(
    ThemeContext.Provider,
    { value: { colorScheme, toggleTheme, setTheme } },
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
