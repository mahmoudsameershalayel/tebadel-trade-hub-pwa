import React, { createContext, useContext, useEffect, useState } from 'react';
import { MessagePayload } from 'firebase/messaging';
import { fcmService } from '@/services/fcm-service';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  isSupported: boolean;
  permission: NotificationPermission;
  isSubscribed: boolean;
  requestPermission: () => Promise<boolean>;
  subscribe: () => Promise<boolean>;
  unsubscribe: () => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [permission, setPermission] = useState<NotificationPermission>(
    fcmService.isSupported() ? Notification.permission : 'denied'
  );
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { state } = useAuth();
  const { user } = state;

  const isSupported = fcmService.isSupported();

  useEffect(() => {
    if (!isSupported || !user) return;

    // Listen for foreground messages
    const unsubscribe = fcmService.onForegroundMessage((payload: MessagePayload) => {
      const { notification, data } = payload;
      
      if (notification) {
        // Show toast notification when app is in foreground
        toast({
          title: notification.title || 'New Notification',
          description: notification.body || data?.subTitle || '',
          action: data ? (
            <button
              onClick={() => fcmService.handleNotificationClick(data, navigate)}
              className="text-sm underline"
            >
              View
            </button>
          ) : undefined,
        });
      }
    });

    return unsubscribe;
  }, [isSupported, user, toast, navigate]);

  useEffect(() => {
    // Auto-subscribe when user logs in
    if (user && isSupported && permission === 'granted') {
      subscribe();
    }
  }, [user, isSupported, permission]);

  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported) return false;

    try {
      const token = await fcmService.requestPermissionAndGetToken();
      setPermission(Notification.permission);
      return token !== null;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  };

  const subscribe = async (): Promise<boolean> => {
    if (!isSupported || !user) return false;

    try {
      const success = await fcmService.subscribe();
      setIsSubscribed(success);
      
      if (success) {
        toast({
          title: 'Notifications Enabled',
          description: 'You will receive push notifications for important updates.',
        });
      }
      
      return success;
    } catch (error) {
      console.error('Error subscribing to notifications:', error);
      toast({
        title: 'Subscription Failed',
        description: 'Unable to enable notifications. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const unsubscribe = async (): Promise<boolean> => {
    if (!isSupported) return false;

    try {
      const success = await fcmService.unsubscribe();
      setIsSubscribed(!success);
      
      if (success) {
        toast({
          title: 'Notifications Disabled',
          description: 'You will no longer receive push notifications.',
        });
      }
      
      return success;
    } catch (error) {
      console.error('Error unsubscribing from notifications:', error);
      return false;
    }
  };

  const value: NotificationContextType = {
    isSupported,
    permission,
    isSubscribed,
    requestPermission,
    subscribe,
    unsubscribe,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};