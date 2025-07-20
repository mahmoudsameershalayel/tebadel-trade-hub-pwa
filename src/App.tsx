
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Header from "@/components/Layout/Header";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import PostItem from "@/pages/PostItem";
import MyItems from "@/pages/MyItems";
import ExchangeRequests from "@/pages/ExchangeRequests";
import ProfilePage from "@/pages/ProfilePage";
import AddressListPage from "@/pages/AddressListPage";
import AddressForm from "@/components/Address/AddressForm";
import AddressEditPage from "@/pages/AddressEditPage";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect } from "react";
import ChatPage from "./pages/Chat";
import { useLanguage } from "@/contexts/LanguageContext";

const queryClient = new QueryClient();

// PWA Install and Service Worker Registration
const PWAManager = () => {
  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }

    // Handle PWA install prompt
    let deferredPrompt: any;
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      
      // Show install button or banner
      const installButton = document.getElementById('install-button');
      if (installButton) {
        installButton.style.display = 'block';
        installButton.addEventListener('click', () => {
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then((choiceResult: any) => {
            if (choiceResult.outcome === 'accepted') {
              console.log('User accepted the install prompt');
            }
            deferredPrompt = null;
          });
        });
      }
    });

    // Handle PWA install success
    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed');
    });
  }, []);

  return null;
};

// Localize document title and meta description
const LocalizedMeta = () => {
  const { t } = useLanguage();
  useEffect(() => {
    document.title = t('app.title');
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', t('app.description'));
    }
  }, [t]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <PWAManager />
            <LocalizedMeta />
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/post-item" element={<ProtectedRoute><PostItem /></ProtectedRoute>} />
                  <Route path="/my-items" element={<ProtectedRoute><MyItems /></ProtectedRoute>} />
                  <Route path="/exchange-requests" element={<ProtectedRoute><ExchangeRequests /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                  <Route path="/addresses" element={<ProtectedRoute><AddressListPage /></ProtectedRoute>} />
                  <Route path="/addresses/new" element={<ProtectedRoute><AddressForm /></ProtectedRoute>} />
                  <Route path="/addresses/edit/:id" element={<ProtectedRoute><AddressEditPage /></ProtectedRoute>} />
                  <Route path="/offers" element={<ProtectedRoute><ExchangeRequests /></ProtectedRoute>} />
                  <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
