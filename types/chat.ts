export interface ChatSession {
  id: string;
  title: string;
  is_active?: boolean;
  isActive?: boolean;
  message_count?: number;
  messageCount?: number;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
  messages?: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  role: 'USER' | 'BOT' | 'SYSTEM';
  content: string;
  created_at: string;
  test_result?: any;
  testResult?: any;
}

export interface CreateSessionPayload {
  title: string;
  systemPrompt?: string;
}

export interface SendMessagePayload {
  content: string;
}
