export interface MessageDto {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  receiverName: string;
  sentAt: string;
  isRead: boolean;
}

export interface SendMessageRequest {
  receiverId: string;
  content: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  receiverName: string;
  sentAt: Date;
  isRead: boolean;
  isSent: boolean; // Helper to distinguish sent vs received
}