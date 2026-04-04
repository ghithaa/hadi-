import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const REFRESH_TOKEN_KEY = 'hadi_refresh_token';

// Access token is kept in-memory only (never persisted)
let _accessToken: string | null = null;

async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  }
  return SecureStore.getItemAsync(key);
}

async function setItem(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

async function deleteItem(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.removeItem(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
}

export function getAccessToken(): string | null {
  return _accessToken;
}

export async function getRefreshToken(): Promise<string | null> {
  return getItem(REFRESH_TOKEN_KEY);
}

export async function setTokens(accessToken: string, refreshToken: string): Promise<void> {
  _accessToken = accessToken;
  await setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function setAccessToken(token: string | null): void {
  _accessToken = token;
}

export async function clearTokens(): Promise<void> {
  _accessToken = null;
  await deleteItem(REFRESH_TOKEN_KEY);
}
