import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { signalRService } from '@/services/signalr-service';
import { ChatMessage } from '@/types/message';
import { Send, MessageCircle } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';

interface ChatBoxProps {
  chatPartnerId: string;
  chatPartnerName: string;
  onClose?: () => void;
}

export const ChatBox: React.FC<ChatBoxProps> = ({
  chatPartnerId,
  chatPartnerName,
  onClose,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { state: authState } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        setIsLoading(true);
        
        // Connect to SignalR
        await signalRService.connect();
        setIsConnected(true);

        // Load previous messages
        const previousMessages = await signalRService.getPreviousMessages(chatPartnerId);
        
        // Mark messages as sent/received based on current user
        const processedMessages = previousMessages.map(msg => ({
          ...msg,
          isSent: msg.senderId === authState.user?.id,
        }));
        
        setMessages(processedMessages);
        
      } catch (error) {
        console.error('Failed to initialize chat:', error);
        toast({
          title: t('error'),
          description: t('chatConnectionFailed'),
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    const handleNewMessage = (message: ChatMessage) => {
      // Only add messages relevant to this chat
      if (message.senderId === chatPartnerId || message.receiverId === chatPartnerId) {
        const processedMessage = {
          ...message,
          isSent: message.senderId === authState.user?.id,
        };
        setMessages(prev => [...prev, processedMessage]);
      }
    };

    const handleReconnect = () => {
      setIsConnected(true);
      toast({
        title: t('chatReconnected'),
        description: t('chatReconnectedDesc'),
      });
    };

    initializeChat();
    
    // Set up SignalR event handlers
    signalRService.onMessage(handleNewMessage);
    signalRService.onReconnect(handleReconnect);

    return () => {
      // Clean up handlers
      signalRService.removeMessageHandler(handleNewMessage);
      signalRService.removeReconnectHandler(handleReconnect);
    };
  }, [chatPartnerId, authState.user?.id, t, toast]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || !isConnected) return;

    try {
      const messageContent = inputMessage.trim();
      setInputMessage('');

      // Create optimistic message
      const optimisticMessage: ChatMessage = {
        id: Date.now().toString(),
        content: messageContent,
        senderId: authState.user?.id || '',
        receiverId: chatPartnerId,
        senderName: authState.user?.firstName || '',
        receiverName: chatPartnerName,
        sentAt: new Date(),
        isRead: false,
        isSent: true,
      };

      // Add to UI immediately
      setMessages(prev => [...prev, optimisticMessage]);

      // Send via SignalR
      await signalRService.sendMessage(chatPartnerId, messageContent);

    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: t('error'),
        description: t('messageSendFailed'),
        variant: 'destructive',
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatMessageTime = (date: Date) => {
    if (isToday(date)) {
      return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
      return t('yesterday') + ' ' + format(date, 'HH:mm');
    } else {
      return format(date, 'dd/MM HH:mm');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto flex flex-col h-[600px]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">
                {getInitials(chatPartnerName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">{chatPartnerName}</CardTitle>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span>{isConnected ? t('online') : t('offline')}</span>
              </div>
            </div>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
          <div className="space-y-4 pb-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                <MessageCircle className="h-8 w-8 mb-2" />
                <p className="text-sm">{t('noMessagesYet')}</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isSent ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${message.isSent ? 'order-1' : 'order-2'}`}>
                    <div
                      className={`rounded-2xl px-3 py-2 ${
                        message.isSent
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                    <div className={`text-xs text-muted-foreground mt-1 ${
                      message.isSent ? 'text-right' : 'text-left'
                    }`}>
                      {formatMessageTime(message.sentAt)}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('typeMessage')}
              disabled={!isConnected}
              className="flex-1"
            />
            <Button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || !isConnected}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};