import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const REFRESH_TOKEN_KEY = 'hadi_refresh_token';
const ACCESS_TOKEN_KEY = 'hadi_access_token';
const USER_DATA_KEY = 'hadi_user_data';

// Access token is also kept in-memory for fast sync access
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

export async function getPersistedAccessToken(): Promise<string | null> {
  const token = await getItem(ACCESS_TOKEN_KEY);
  if (token) _accessToken = token;
  return token;
}

export async function getRefreshToken(): Promise<string | null> {
  return getItem(REFRESH_TOKEN_KEY);
}

export async function setTokens(accessToken?: string, refreshToken?: string): Promise<void> {
  if (accessToken) {
    _accessToken = accessToken;
    await setItem(ACCESS_TOKEN_KEY, accessToken);
  }
  if (refreshToken) {
    await setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
}

export function setAccessToken(token: string | null): void {
  _accessToken = token;
  if (token) {
    setItem(ACCESS_TOKEN_KEY, token).catch(() => {});
  } else {
    deleteItem(ACCESS_TOKEN_KEY).catch(() => {});
  }
}

export async function getPersistedUser(): Promise<any | null> {
  const userStr = await getItem(USER_DATA_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export async function setPersistedUser(user: any): Promise<void> {
  if (user) {
    await setItem(USER_DATA_KEY, JSON.stringify(user));
  } else {
    await deleteItem(USER_DATA_KEY);
  }
}

export async function clearTokens(): Promise<void> {
  _accessToken = null;
  await deleteItem(ACCESS_TOKEN_KEY);
  await deleteItem(REFRESH_TOKEN_KEY);
  await deleteItem(USER_DATA_KEY);
}
