export interface ChatSession {
  id: string;
  title: string;
  is_active: boolean;
  message_count: number;
  created_at: string;
  updated_at: string;
  messages?: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  role: 'USER' | 'BOT' | 'SYSTEM';
  content: string;
  created_at: string;
}

export interface CreateSessionPayload {
  title: string;
  systemPrompt?: string;
}

export interface SendMessagePayload {
  content: string;
}
