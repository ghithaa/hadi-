import { getAccessToken, getRefreshToken, setTokens, clearTokens } from './token-storage';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export class ApiClientError extends Error {
  statusCode: number;
  errorBody: any;

  constructor(statusCode: number, message: string, errorBody?: any) {
    super(message);
    this.name = 'ApiClientError';
    this.statusCode = statusCode;
    this.errorBody = errorBody;
  }
}

let isRefreshing = false;
let refreshQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

function processQueue(error: any, token: string | null = null) {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token!);
    }
  });
  refreshQueue = [];
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    throw new ApiClientError(401, 'No refresh token available');
  }

  const response = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    await clearTokens();
    throw new ApiClientError(401, 'Token refresh failed');
  }

  const json = await response.json();
  const data = json.data || json;
  await setTokens(data.accessToken, data.refreshToken);
  return data.accessToken;
}

interface RequestOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  isMultipart?: boolean;
  skipAuth?: boolean;
  rawResponse?: boolean;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const {
    method = 'GET',
    body,
    headers = {},
    params,
    isMultipart = false,
    skipAuth = false,
    rawResponse = false,
  } = options;

  let url = `${BASE_URL}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const requestHeaders: Record<string, string> = { ...headers };

  if (!skipAuth) {
    const token = isRefreshing
      ? await new Promise<string>((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        })
      : getAccessToken();
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  if (!isMultipart) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  const fetchOptions: RequestInit = {
    method,
    headers: requestHeaders,
  };

  if (body) {
    fetchOptions.body = isMultipart ? body : JSON.stringify(body);
  }

  let response = await fetch(url, fetchOptions);

  // Handle 401 - attempt token refresh
  if (response.status === 401 && !skipAuth) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const newToken = await refreshAccessToken();
        isRefreshing = false;
        processQueue(null, newToken);

        // Retry the original request with new token
        requestHeaders['Authorization'] = `Bearer ${newToken}`;
        response = await fetch(url, { ...fetchOptions, headers: requestHeaders });
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError);
        throw refreshError;
      }
    } else {
      const newToken = await new Promise<string>((resolve, reject) => {
        refreshQueue.push({ resolve, reject });
      });
      requestHeaders['Authorization'] = `Bearer ${newToken}`;
      response = await fetch(url, { ...fetchOptions, headers: requestHeaders });
    }
  }

  if (rawResponse) {
    return response as any;
  }

  if (!response.ok) {
    let errorBody;
    try {
      errorBody = await response.json();
    } catch {
      errorBody = null;
    }
    throw new ApiClientError(
      response.status,
      errorBody?.message || `Request failed with status ${response.status}`,
      errorBody
    );
  }

  if (response.status === 204) {
    return undefined as any;
  }

  const json = await response.json();

  // Unwrap { success: true, data: T } wrapper
  if (json && typeof json === 'object' && 'success' in json && 'data' in json) {
    return json.data;
  }

  return json;
}

export const apiClient = {
  get<T>(endpoint: string, params?: Record<string, any>, options?: Omit<RequestOptions, 'method' | 'params'>) {
    return request<T>(endpoint, { ...options, method: 'GET', params });
  },

  post<T>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return request<T>(endpoint, { ...options, method: 'POST', body });
  },

  put<T>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return request<T>(endpoint, { ...options, method: 'PUT', body });
  },

  patch<T>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return request<T>(endpoint, { ...options, method: 'PATCH', body });
  },

  delete<T>(endpoint: string, options?: Omit<RequestOptions, 'method'>) {
    return request<T>(endpoint, { ...options, method: 'DELETE' });
  },

  /** Returns the raw Response for SSE streaming */
  stream(endpoint: string, body?: any): Promise<Response> {
    return request<Response>(endpoint, {
      method: 'POST',
      body,
      rawResponse: true,
    });
  },
};
