import { api } from '@/config/api-config';
import { MessageDto } from '@/types/message';

export class MessageService {
  static async getPreviousMessages(userId: string): Promise<MessageDto[]> {
    const response = await api.get(`/messages/previous/${userId}`);
    return response.data;
  }

  static async markAsRead(messageIds: string[]): Promise<void> {
    await api.put('/messages/mark-read', { messageIds });
  }

  static async getUnreadCount(): Promise<number> {
    const response = await api.get('/messages/unread-count');
    return response.data.count;
  }
}