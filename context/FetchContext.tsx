import { config } from "@/config";
import { useAuth } from "@/context/AuthContext";
import axios, { AxiosError, AxiosInstance } from "axios";
import { createContext, FC, ReactNode, useMemo } from "react";

const API_URL = config.BASE_URL;

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
  logout: () => void;
};

export const FetchContext = createContext<FetchContextInterface | null>(null);

const createInstance = ({
  url,
  refreshToken,
  callback,
  logout,
  token,
}: CreateInstanceParams) => {
  const instance = axios.create({
    baseURL: url,
    timeout: 30000, // 30 seconds timeout
    timeoutErrorMessage: "Request timeout. Please try again.",
  });

  instance.interceptors.request.use(
    (config) => {
      const axiosConfig = {
        ...config,
      };

      if (token) {
        axiosConfig.headers["Authorization"] = `Bearer ${token}`;
      }

      return axiosConfig;
    },
    async (error) => await Promise.reject(error)
  );

  instance.interceptors.response.use(
    (res) => res.data,
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
          return logout();
        }

        try {
          // Token refresh logic can be added here later
          throw new Error("Token refresh not implemented");
        } catch (e) {
          logout();
        }
      }

      return await Promise.reject(error?.response?.data || error.message);
    }
  );

  return instance;
};

export const FetchProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { authData, logout } = useAuth();
  const refreshToken = ""; // Can be stored in AuthContext if available

  const api = useMemo(() => {
    return createInstance({
      url: API_URL as string,
      refreshToken,
      callback: () => {
        // TODO: update auth data after refresh
      },
      logout: () => {
        logout();
      },
      token: authData?.token,
    });
  }, [authData, refreshToken, logout]);

  const contextValue = useMemo(() => ({ api }), [api]);

  return (
    <FetchContext.Provider value={contextValue}>
      {children}
    </FetchContext.Provider>
  );
};
