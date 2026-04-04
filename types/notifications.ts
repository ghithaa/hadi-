export interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  type: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface RegisterDeviceTokenPayload {
  token: string;
  platform: 'ios' | 'android' | 'web';
  deviceName?: string;
}
