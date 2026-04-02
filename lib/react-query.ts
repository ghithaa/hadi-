import { QueryClient, QueryCache } from '@tanstack/react-query';
import { ApiClientError } from './api-client';

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      if (error instanceof ApiClientError && error.statusCode === 401) {
        // Token refresh failed — auth context will handle redirect
      }
    },
  }),
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error instanceof ApiClientError) {
          if (error.statusCode === 401 || error.statusCode === 403) {
            return false;
          }
        }
        return failureCount < 2;
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});
