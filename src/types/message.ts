import { UserDto } from "./user";

export interface MessageDto {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  receiverName: string;
  message: string;
  sentAt: string;
  timestamp: string;
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
  sender?: UserDto;
  receiverName: string;
  receiver?: UserDto;
  sentAt: Date;
  isRead: boolean;
  isSent: boolean; // Helper to distinguish sent vs received
}