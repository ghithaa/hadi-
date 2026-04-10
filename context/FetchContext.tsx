import { useAuth } from "@/context/AuthContext";
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { createContext, FC, ReactNode, useMemo } from "react";

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

interface AuthResponse {
  token: string;
  refreshToken: string;
}

type FetchContextInterface = {
  api: AxiosInstance;
};

type CreateInstanceParams = {
  url: string;
  token?: string;
  refreshToken?: string;
  callback: (authData: AuthResponse) => void;
  signOut: () => Promise<void>;
};

export const FetchContext = createContext<FetchContextInterface | null>(null);

const createInstance = ({
  url,
  refreshToken,
  callback,
  signOut,
  token,
}: CreateInstanceParams) => {
  const instance = axios.create({
    baseURL: url,
    timeout: 30000, // 30 seconds timeout
    timeoutErrorMessage: "Request timeout. Please try again.",
  });

  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }

      return config;
    },
    async (error: any) => await Promise.reject(error)
  );

  instance.interceptors.response.use(
    (res: any) => res.data,
    async (error: AxiosError) => {
      if (error.code === "ERR_NETWORK" || error.code === "ECONNABORTED") {
        const networkError = {
          message: "Network connection failed. Please check your internet connection and try again.",
          code: error.code,
          isNetworkError: true,
        };
        return await Promise.reject(networkError);
      }

      if (error.response?.status === 401) {
        if (!refreshToken) {
          return signOut();
        }

        try {
          // Token refresh logic can be added here later
          throw new Error("Token refresh not implemented");
        } catch (e) {
          signOut();
        }
      }

      return await Promise.reject(error?.response?.data || error.message);
    }
  );

  return instance;
};

export const FetchProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { authData, signOut } = useAuth();
  const refreshToken = ""; // Can be stored in AuthContext if available

  const api = useMemo(() => {
    return createInstance({
      url: API_URL as string,
      refreshToken,
      callback: () => {
        // TODO: update auth data after refresh
      },
      signOut: () => signOut(),
      token: authData?.token,
    });
  }, [authData, refreshToken, signOut]);

  const contextValue = useMemo(() => ({ api }), [api]);

  return (
    <FetchContext.Provider value={contextValue}>
      {children}
    </FetchContext.Provider>
  );
};
