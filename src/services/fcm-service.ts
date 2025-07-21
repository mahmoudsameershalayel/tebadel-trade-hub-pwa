import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, MessagePayload } from 'firebase/messaging';
import { firebaseConfig, vapidKey } from '@/config/firebase-config';
import { API_BASE } from '@/config/api-config';

class FCMService {
  private app;
  private messaging;
  private currentToken: string | null = null;

  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.messaging = getMessaging(this.app);
  }

  // Request notification permission and get FCM token
  async requestPermissionAndGetToken(): Promise<string | null> {
    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        const token = await getToken(this.messaging, { vapidKey });
        this.currentToken = token;
        return token;
      } else {
        console.log('Notification permission denied');
        return null;
      }
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  // Get current token without requesting permission
  async getCurrentToken(): Promise<string | null> {
    try {
      if (Notification.permission === 'granted') {
        const token = await getToken(this.messaging, { vapidKey });
        this.currentToken = token;
        return token;
      }
      return null;
    } catch (error) {
      console.error('Error getting current FCM token:', error);
      return null;
    }
  }

  // Subscribe to FCM notifications
  async subscribe(): Promise<boolean> {
    try {
      const token = await this.requestPermissionAndGetToken();
      
      if (!token) {
        return false;
      }

      const authToken = localStorage.getItem('token');
      if (!authToken) {
        throw new Error('No auth token found');
      }

      const response = await fetch(`${API_BASE}/api/FCMSubscribtion/Subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ token })
      });

      if (!response.ok) {
        throw new Error('Failed to subscribe to notifications');
      }

      return true;
    } catch (error) {
      console.error('Error subscribing to FCM:', error);
      return false;
    }
  }

  // Unsubscribe from FCM notifications
  async unsubscribe(): Promise<boolean> {
    try {
      const authToken = localStorage.getItem('token');
      if (!authToken || !this.currentToken) {
        return false;
      }

      const response = await fetch(`${API_BASE}/api/FCMSubscribtion/Unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ token: this.currentToken })
      });

      if (!response.ok) {
        throw new Error('Failed to unsubscribe from notifications');
      }

      this.currentToken = null;
      return true;
    } catch (error) {
      console.error('Error unsubscribing from FCM:', error);
      return false;
    }
  }

  // Listen for foreground messages
  onForegroundMessage(callback: (payload: MessagePayload) => void) {
    return onMessage(this.messaging, callback);
  }

  // Handle notification click action
  handleNotificationClick(data: any, navigate: (path: string) => void) {
    if (!data) return;

    const { id, type } = data;
    
    if (!id || !type) return;

    // Route based on notification type
    switch (type) {
      case 'exchange_request':
        navigate('/exchange-requests');
        break;
      case 'chat':
        navigate('/chat');
        break;
      case 'item':
        navigate('/my-items');
        break;
      default:
        navigate('/');
        break;
    }
  }

  // Check if notifications are supported
  isSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator;
  }

  // Get current permission status
  getPermissionStatus(): NotificationPermission {
    return Notification.permission;
  }
}

export const fcmService = new FCMService();