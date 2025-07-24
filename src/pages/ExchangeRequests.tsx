import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import ExchangeRequestCard from '@/components/Exchange/ExchangeRequestCard';
import { ExchangeRequestDto } from '@/types/exchange';
import { ExchangeService } from '@/services/exchange-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Inbox, Send, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Loading from '@/components/ui/loading';
import { ChatBox } from '@/components/Chat/ChatBox';
import { useAuth } from '@/contexts/AuthContext';

const ExchangeRequests = () => {
  const { t, isRTL } = useLanguage();
  const { toast } = useToast();
  const { state: authState } = useAuth();
  const [sentRequests, setSentRequests] = useState<ExchangeRequestDto[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<ExchangeRequestDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [chatUser, setChatUser] = useState<{ id: string; name: string } | null>(null);

    const fetchExchangeRequests = async () => {
    try {
      setRefreshing(true);
      const [sent, received] = await Promise.all([
        ExchangeService.getSentExchangeRequests(),
        ExchangeService.getReceivedExchangeRequests()
      ]);
      setSentRequests(sent);
      setReceivedRequests(received);
    } catch (error) {
      toast({
        title: t('exchange.error'),
        description: error instanceof Error ? error.message : t('exchange.fetchError'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchExchangeRequests();
  }, []);

  const handleAccept = async (id: number) => {
    try {
      await ExchangeService.updateExchangeRequest(id, { action: 2 });
      toast({
        title: t('exchange.success'),
        description: t('exchange.acceptSuccess'),
      });
      fetchExchangeRequests();
    } catch (error) {
      toast({
        title: t('exchange.error'),
        description: error instanceof Error ? error.message : t('exchange.acceptError'),
        variant: 'destructive',
      });
    }
  };

  const handleReject = async (id: number) => {
    try {
      await ExchangeService.updateExchangeRequest(id, { action: 4 });
      toast({
        title: t('exchange.success'),
        description: t('exchange.rejectSuccess'),
      });
      fetchExchangeRequests();
    } catch (error) {
      toast({
        title: t('exchange.error'),
        description: error instanceof Error ? error.message : t('exchange.rejectError'),
        variant: 'destructive',
      });
    }
  };

  const handleCancel = async (id: number) => {
    try {
      await ExchangeService.cancelExchangeRequest(id);
      toast({
        title: t('exchange.success'),
        description: t('exchange.cancelSuccess'),
      });
      fetchExchangeRequests();
    } catch (error) {
      toast({
        title: t('exchange.error'),
        description: error instanceof Error ? error.message : t('exchange.cancelError'),
        variant: 'destructive',
      });
    }
  };

  const handleStartChat = (userId: string, userName: string) => {
    setChatUser({ id: userId, name: userName });
  };

  if (loading || authState.isLoading) {
    return <Loading />;
  }

  return (
    <ProtectedRoute>
      {/* Chat Modal */}
      {chatUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-2 max-w-lg w-full relative">
            <ChatBox
              chatPartnerId={chatUser.id}
              chatPartnerName={chatUser.name}
              onClose={() => setChatUser(null)}
            />
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold"
              onClick={() => setChatUser(null)}
              aria-label="Close chat"
            >
              ×
            </button>
          </div>
        </div>
      )}
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="relative max-w-3xl mx-auto mb-6">
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=300&fit=crop"
                alt={t('exchange.heroAlt')}
                className="w-full h-48 object-cover rounded-2xl shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-2xl"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                  {t('exchange.title')}
                </h1>
                <p className="text-amber-100">{t('exchange.subtitle')}</p>
              </div>
            </div>
          </div>

          {/* Header Card */}
          <Card className="mb-6 border-0 shadow-lg bg-white/95 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-row justify-between items-center">
                <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <ArrowUpDown className="h-6 w-6 text-amber-600" />
                  <h2 className={`text-xl font-semibold text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('exchange.manageRequests')}
                  </h2>
                </div>
                <Button
                  onClick={fetchExchangeRequests}
                  disabled={refreshing}
                  variant="outline"
                  className="border-amber-200 text-amber-700 hover:bg-amber-50"
                >
                  <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''} ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {t('exchange.refresh')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Exchange Requests Tabs */}
          <Tabs defaultValue="received" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-white/95 backdrop-blur-sm">
              <TabsTrigger 
                value="received" 
                className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <Inbox className="h-4 w-4" />
                {t('exchange.received')} ({receivedRequests.length})
              </TabsTrigger>
              <TabsTrigger 
                value="sent"
                className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <Send className="h-4 w-4" />
                {t('exchange.sent')} ({sentRequests.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="received" className="space-y-4">
              {receivedRequests.length === 0 ? (
                <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
                  <CardContent className="p-8 text-center">
                    <Inbox className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {t('exchange.noReceivedRequests')}
                    </h3>
                    <p className="text-gray-600">
                      {t('exchange.noReceivedRequestsDesc')}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                receivedRequests.map((request) => (
                  <ExchangeRequestCard
                    key={request.id}
                    request={request}
                    type="received"
                    onAccept={handleAccept}
                    onReject={handleReject}
                    onStartChat={handleStartChat}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="sent" className="space-y-4">
              {sentRequests.length === 0 ? (
                <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
                  <CardContent className="p-8 text-center">
                    <Send className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {t('exchange.noSentRequests')}
                    </h3>
                    <p className="text-gray-600">
                      {t('exchange.noSentRequestsDesc')}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                sentRequests.map((request) => (
                  <ExchangeRequestCard
                    key={request.id}
                    request={request}
                    type="sent"
                    onCancel={handleCancel}
                    onStartChat={handleStartChat}
                  />
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ExchangeRequests;