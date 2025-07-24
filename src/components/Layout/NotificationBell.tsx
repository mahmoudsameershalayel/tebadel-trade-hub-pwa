import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { useNotification } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { fcmService } from '@/services/fcm-service';
import { useLanguage } from '@/contexts/LanguageContext';
import { ProfileService } from '@/services/profile-service';

const NotificationBell: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const { isSupported } = useNotification();
  const { state } = useAuth();
  const navigate = useNavigate();
  const { isRTL, t } = useLanguage();

  // Fetch notifications on mount and when user changes
  useEffect(() => {
    if (state.user) {
      fetchNotifications();
    }
  }, [state.user]);

  // Optionally, also refresh when opening the dropdown
  useEffect(() => {
    if (open && state.user) {
      fetchNotifications();
    }
  }, [open, state.user]);

  const fetchNotifications = () => {
    fetch('https://tabadal20250701211825.azurewebsites.net/TabadalAPI/Notification/GetNotificationsHistory', {
      headers: ProfileService.getAuthHeaders(),
    })
      .then(res => res.json())
      .then(data => setNotifications(data.data || []));
  };

  // Mark notification as read in backend
  async function markNotificationAsRead(notificationId: number) {
    const token = localStorage.getItem('token');
    await fetch(`https://tabadal20250701211825.azurewebsites.net/TabadalAPI/Notification/MarkAsRead/${notificationId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="relative">
      <button
        className="relative p-1 rounded-full hover:bg-gray-100 transition-colors"
        onClick={() => setOpen(o => !o)}
        aria-label={t('notifications.bellAriaLabel')}
        style={{ direction: isRTL ? 'rtl' : 'ltr' }}
      >
        <Bell className="h-5 w-5 text-gray-500" />
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 bg-red-500 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center border border-white shadow"
            style={isRTL ? { left: '-0.25rem', right: 'auto' } : { right: '-0.25rem', left: 'auto' }}
          >
            {unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div
          className={`absolute mt-2 w-60 sm:w-72 md:w-80 min-w-[12rem] max-w-[90vw] bg-white shadow-xl rounded-xl z-50 overflow-y-auto overflow-x-hidden border border-gray-100 ${isRTL ? 'left-0' : 'right-0'}`}
          style={{ maxHeight: 'min(70vh, 400px)', direction: isRTL ? 'rtl' : 'ltr' }}
        >
          <div className="p-3 border-b text-sm font-semibold text-gray-700 bg-gray-50 rounded-t-xl flex items-center justify-between">
            {isRTL ? (
              <>
                <span className="flex-1">{t('notifications.title')}</span>
                <button
                  onClick={() => setOpen(false)}
                  aria-label={t('common.close')}
                  className="p-1 rounded hover:bg-gray-200 focus:outline-none ml-2"
                >
                  <X className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setOpen(false)}
                  aria-label={t('common.close')}
                  className="p-1 rounded hover:bg-gray-200 focus:outline-none mr-2"
                >
                  <X className="h-4 w-4" />
                </button>
                <span className="flex-1 text-center">{t('notifications.title')}</span>
              </>
            )}
          </div>
          {notifications.length === 0 ? (
            <div className="p-4 text-gray-400 text-sm text-center">{t('notifications.none')}</div>
          ) : (
            notifications.map((n, idx) => (
              <div
                key={n.id || idx}
                className={`p-3 border-b last:border-b-0 cursor-pointer hover:bg-amber-50 transition-colors ${!n.isRead ? 'bg-amber-50' : ''} w-full`}
                onClick={async () => {
                  fcmService.handleNotificationClick(n, navigate);
                  setNotifications(prev =>
                    prev.map((notif, i) =>
                      notif.id === n.id ? { ...notif, isRead: true } : notif
                    )
                  );
                  await markNotificationAsRead(n.id);
                  setOpen(false);
                }}
              >
                <div className="font-medium text-gray-900 text-sm truncate w-full">{n.notificationTitle}</div>
                <div className="font-medium text-gray-500 text-sm truncate w-full">{n.notificationSubTitle}</div>
                <div className="text-xs text-gray-600 break-words w-full">{n.notificationMessage}</div>
                <div className="text-[10px] text-gray-400 mt-1">{n.notificationDate} {n.notificationTime}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell; 