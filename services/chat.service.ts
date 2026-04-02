import { apiClient } from '@/lib/api-client';
import { getAccessToken } from '@/lib/token-storage';
import { ChatSession, ChatMessage, CreateSessionPayload, SendMessagePayload } from '@/types';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3002/api/v1';

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

  /** Returns a ReadableStream for SSE — reads token-by-token from the backend */
  async sendMessageStream(
    sessionId: string,
    data: SendMessagePayload,
    onChunk: (text: string) => void,
    onDone: () => void,
    onError: (err: Error) => void
  ): Promise<void> {
    try {
      const token = getAccessToken();
      const response = await fetch(`${BASE_URL}/chat/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
      });

      if (!response.ok || !response.body) {
        onError(new Error(`Stream failed: ${response.status}`));
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data:')) {
            const rawData = line.slice(5).trim();
            if (rawData === '[DONE]') {
              onDone();
              return;
            }
            try {
              const parsed = JSON.parse(rawData);
              if (parsed?.done === true) {
                onDone();
                return;
              } else if (parsed?.token !== undefined) {
                onChunk(parsed.token);
              }
            } catch {
              // Skip non-JSON lines
            }
          }
        }
      }

      onDone();
    } catch (err) {
      onError(err instanceof Error ? err : new Error(String(err)));
    }
  },
};
