import { apiClient } from '@/lib/api-client';
import { getAccessToken } from '@/lib/token-storage';
import { ChatSession, ChatMessage, CreateSessionPayload, SendMessagePayload } from '@/types';
import EventSource from 'react-native-sse';

const PROD_API_URL = 'http://34.18.213.53:3000/api/v1';
const BASE_URL = (__DEV__
  ? (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3002/api/v1')
  : (process.env.EXPO_PUBLIC_API_URL || PROD_API_URL)
).replace(/\/$/, '');

export const chatService = {
  createSession(data: CreateSessionPayload): Promise<ChatSession> {
    return apiClient.post<ChatSession>('/chat/sessions', data);
  },

  getSessions(): Promise<ChatSession[]> {
    return apiClient.get<ChatSession[]>('/chat/sessions');
  },

  getSession(sessionId: string): Promise<ChatSession> {
    return apiClient.get<ChatSession>(`/chat/sessions/${sessionId}`);
  },

  deleteSession(sessionId: string): Promise<void> {
    return apiClient.delete(`/chat/sessions/${sessionId}`);
  },

  getMessages(sessionId: string): Promise<ChatMessage[]> {
    return apiClient.get<ChatMessage[]>(`/chat/sessions/${sessionId}/messages`);
  },

  submitTestResult(sessionId: string, data: any): Promise<any> {
    return apiClient.post(`/chat/sessions/${sessionId}/test-result`, data);
  },

  /** Returns a ReadableStream for SSE — reads token-by-token from the backend */
  async sendMessageStream(
    sessionId: string,
    data: SendMessagePayload,
    onChunk: (text: string) => void,
    onDone: () => void,
    onError: (err: Error) => void,
    isRetry = false
  ): Promise<void> {
    try {
      const token = getAccessToken();
      const url = `${BASE_URL}/chat/sessions/${sessionId}/messages`;
      
      const es = new EventSource(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
      });

      es.addEventListener('message', (event) => {
        if (!event.data) return;
        
        if (event.data === '[DONE]') {
          es.close();
          onDone();
          return;
        }

        try {
          const parsed = JSON.parse(event.data);
          if (parsed?.done === true) {
            es.close();
            onDone();
          } else if (parsed?.token !== undefined) {
            onChunk(parsed.token);
          }
        } catch {
          // Skip non-JSON lines
        }
      });

      es.addEventListener('error', async (event: any) => {
        if (event.type === 'error') {
          es.close();
          const errorMsg = event.message || event.error?.message || 'Connection interrupted';
          
          // If the token is expired, EventSource fails directly because it bypasses apiClient's interceptors.
          if ((errorMsg.includes('401') || errorMsg.includes('Unauthorized') || errorMsg.includes('Authentication required')) && !isRetry) {
            try {
              // Trigger a dummy request to force token refresh via apiClient
              await apiClient.get('/chat/sessions');
              // Retry stream with new token
              chatService.sendMessageStream(sessionId, data, onChunk, onDone, onError, true);
              return;
            } catch (e) {
              onError(new Error('Authentication failed. Please log in again.'));
              return;
            }
          }

          onError(new Error(errorMsg));
        }
      });
      
      es.addEventListener('close', () => {
        onDone();
      });

    } catch (err) {
      onError(err instanceof Error ? err : new Error(String(err)));
    }
  },
};
