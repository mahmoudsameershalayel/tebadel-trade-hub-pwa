import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { ChatMessage } from '@/types/message';
import { API_BASE } from '../config/api-config.js';

class SignalRService {
  private connection: HubConnection | null = null;
  private messageHandlers: ((message: ChatMessage) => void)[] = [];
  private reconnectHandlers: (() => void)[] = [];

  async connect(): Promise<void> {
    if (this.connection?.state === 'Connected') {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    this.connection = new HubConnectionBuilder()
      .withUrl("https://tabadal20250701211825.azurewebsites.net/chathub?access_token=" + encodeURIComponent(token))
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    // Set up event handlers
    this.connection.on('ReceiveMessage', (message: any) => {
      const chatMessage: ChatMessage = {
        id: message.id || Date.now().toString(),
        content: message.message,
        senderId: message.senderId,
        receiverId: message.receiverId,
        senderName: message.senderName,
        receiverName: message.receiverName,
        sentAt: new Date(message.timestamp),
        isRead: message.isRead || false,
        isSent: false, // This is a received message
      };
      
      this.messageHandlers.forEach(handler => handler(chatMessage));
    });

    this.connection.onreconnected(() => {
      console.log('SignalR reconnected');
      this.reconnectHandlers.forEach(handler => handler());
    });

    this.connection.onclose(() => {
      console.log('SignalR connection closed');
    });

    try {
      await this.connection.start();
      console.log('SignalR connected successfully');
    } catch (error) {
      console.error('SignalR connection failed:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
    }
  }

  async sendMessage(userId: string, message: string): Promise<void> {
    if (!this.connection || this.connection.state !== 'Connected') {
      throw new Error('SignalR connection is not established');
    }

    try {
      await this.connection.invoke('SendMessageToUser', userId, message);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async getPreviousMessages(userId: string): Promise<ChatMessage[]> {
    if (!this.connection || this.connection.state !== 'Connected') {
      throw new Error('SignalR connection is not established');
    }

    try {
      const messages = await this.connection.invoke('GetPreviousMessagesForUser', userId);
      return messages.map((msg: any) => ({
        id: msg.id,
        content: msg.content,
        senderId: msg.senderId,
        receiverId: msg.receiverId,
        senderName: msg.senderName,
        receiverName: msg.receiverName,
        sentAt: new Date(msg.sentAt),
        isRead: msg.isRead,
        isSent: false, // Will be updated in component based on current user
      }));
    } catch (error) {
      console.error('Error getting previous messages:', error);
      throw error;
    }
  }

  onMessage(handler: (message: ChatMessage) => void): void {
    this.messageHandlers.push(handler);
  }

  onReconnect(handler: () => void): void {
    this.reconnectHandlers.push(handler);
  }

  removeMessageHandler(handler: (message: ChatMessage) => void): void {
    const index = this.messageHandlers.indexOf(handler);
    if (index > -1) {
      this.messageHandlers.splice(index, 1);
    }
  }

  removeReconnectHandler(handler: () => void): void {
    const index = this.reconnectHandlers.indexOf(handler);
    if (index > -1) {
      this.reconnectHandlers.splice(index, 1);
    }
  }

  isConnected(): boolean {
    return this.connection?.state === 'Connected';
  }
}

export const signalRService = new SignalRService();