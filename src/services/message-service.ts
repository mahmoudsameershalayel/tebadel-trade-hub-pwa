import { ChatMessage, MessageDto } from '@/types/message';
import { API_BASE } from '@/config/api-config.js';
import { UserDto } from '@/types/user';

export class MessageService {
  static async getPreviousMessages(userId: string): Promise<MessageDto[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    const response = await fetch(`${API_BASE}/Customer/ChatMessage/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch previous messages');
    }
    const json = await response.json();
    return json.data;
  }

  static async markAsRead(messageIds: string[]): Promise<void> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    const response = await fetch(`${API_BASE}/messages/mark-read`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ messageIds }),
    });
    if (!response.ok) {
      throw new Error('Failed to mark messages as read');
    }
  }

  static async getUnreadCount(): Promise<number> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    const response = await fetch(`${API_BASE}/messages/unread-count`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch unread count');
    }
    const json = await response.json();
    return json.data?.count ?? 0;
  }

  static async getChatPartners(): Promise<ChatMessage[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    const response = await fetch(`${API_BASE}/Customer/ChatMessage`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch chat partners');
    }
    const json = await response.json();
    return json.data; // Adjust if your API returns a different structure
  }
}