import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const REFRESH_TOKEN_KEY = 'hadi_refresh_token';
const ACCESS_TOKEN_KEY = 'hadi_access_token';
const USER_DATA_KEY = 'hadi_user_data';
const JOURNEYS_PROGRESS_KEY = 'hadi_journeys_progress';
const CHAT_CONSENT_KEY = 'hadi_chat_consent';

// Access token is also kept in-memory for fast sync access
let _accessToken: string | null = null;
export const DEMO_ACCESS_TOKEN = 'mock-demo-jwt-token';
export const DEMO_REFRESH_TOKEN = 'mock-demo-refresh-jwt-token';

export async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    try {
      if (typeof localStorage === 'undefined') return null;
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }
  try {
    return await SecureStore.getItemAsync(key);
  } catch {
    return null;
  }
}

export async function setItem(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(key, value);
      return;
    } catch {
      return;
    }
  }
  try {
    await SecureStore.setItemAsync(key, value);
  } catch {
    return;
  }
}

async function deleteItem(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.removeItem(key);
      return;
    } catch {
      return;
    }
  }
  try {
    await SecureStore.deleteItemAsync(key);
  } catch {
    return;
  }
}

export function getAccessToken(): string | null {
  return _accessToken;
}

export function isDemoAccessToken(token?: string | null): boolean {
  return token === DEMO_ACCESS_TOKEN;
}

export function isDemoRefreshToken(token?: string | null): boolean {
  return token === DEMO_REFRESH_TOKEN;
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

export async function getPersistedJourneysProgress(): Promise<Record<string, any> | null> {
  const value = await getItem(JOURNEYS_PROGRESS_KEY);
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export async function setPersistedJourneysProgress(progress: Record<string, any> | null): Promise<void> {
  if (progress) {
    await setItem(JOURNEYS_PROGRESS_KEY, JSON.stringify(progress));
  } else {
    await deleteItem(JOURNEYS_PROGRESS_KEY);
  }
}

export async function getChatConsent(): Promise<boolean> {
  const value = await getItem(CHAT_CONSENT_KEY);
  return value === 'true';
}

export async function setChatConsent(consentGiven: boolean): Promise<void> {
  await setItem(CHAT_CONSENT_KEY, consentGiven ? 'true' : 'false');
}

export async function clearTokens(): Promise<void> {
  _accessToken = null;
  await deleteItem(ACCESS_TOKEN_KEY);
  await deleteItem(REFRESH_TOKEN_KEY);
  await deleteItem(USER_DATA_KEY);
}
