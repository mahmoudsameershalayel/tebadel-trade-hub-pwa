// Import Firebase scripts for service worker
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Firebase configuration
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Background message received:', payload);

  const { notification, data } = payload;
  
  const notificationTitle = notification?.title || 'New Notification';
  const notificationOptions = {
    body: notification?.body || data?.subTitle || '',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    data: data || {},
    actions: data ? [
      {
        action: 'view',
        title: 'View'
      }
    ] : [],
    requireInteraction: true,
    tag: data?.type || 'default'
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();

  const { data } = event.notification;
  
  if (data && data.id && data.type) {
    let url = '/';
    
    // Route based on notification type
    switch (data.type) {
      case 'exchange_request':
        url = '/exchange-requests';
        break;
      case 'chat':
        url = '/chat';
        break;
      case 'item':
        url = '/my-items';
        break;
      default:
        url = '/';
        break;
    }

    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        // Check if there's already a window/tab open with the target URL
        for (const client of clientList) {
          if (client.url.includes(url) && 'focus' in client) {
            return client.focus();
          }
        }
        
        // If no existing window/tab, open a new one
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
    );
  }
});