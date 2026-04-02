import { apiClient } from '@/lib/api-client';
import { Notification, RegisterDeviceTokenPayload, PaginationParams } from '@/types';

export const notificationsService = {
  getNotifications(params?: PaginationParams): Promise<Notification[]> {
    return apiClient.get<Notification[]>('/notifications', params);
  },

  getUnreadCount(): Promise<{ unreadCount: number }> {
    return apiClient.get<{ unreadCount: number }>('/notifications/unread-count');
  },

  markAsRead(id: string): Promise<void> {
    return apiClient.patch(`/notifications/${id}/read`);
  },

  markAllAsRead(): Promise<void> {
    return apiClient.post('/notifications/read-all');
  },

  registerDeviceToken(data: RegisterDeviceTokenPayload): Promise<void> {
    return apiClient.post('/notifications/device-token', data);
  },
};
