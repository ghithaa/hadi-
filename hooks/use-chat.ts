import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '@/services/chat.service';
import { CreateSessionPayload } from '@/types';

export function useChatSessions() {
  return useQuery({
    queryKey: ['chat', 'sessions'],
    queryFn: () => chatService.getSessions(),
  });
}

export function useChatSession(sessionId: string) {
  return useQuery({
    queryKey: ['chat', 'session', sessionId],
    queryFn: () => chatService.getSession(sessionId),
    enabled: !!sessionId,
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSessionPayload) => chatService.createSession(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'sessions'] });
    },
  });
}

export function useDeleteSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) => chatService.deleteSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'sessions'] });
    },
  });
}

export function useChatMessages(sessionId: string | undefined) {
  return useQuery({
    queryKey: ['chat', 'session', sessionId, 'messages'],
    queryFn: () => chatService.getMessages(sessionId!),
    enabled: !!sessionId,
  });
}
