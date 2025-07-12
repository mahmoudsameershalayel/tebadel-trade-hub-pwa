import { ItemDto } from './item';
import { UserDto } from './user';

export interface ExchangeRequestDto {
  id: number;
  offeredItem: ItemDto;
  requestedItem: ItemDto;
  offeredByUser: UserDto;
  requestedToUser: UserDto;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Canceled';
  moneyDirection: 'Pay' | 'Receive';
  description: string;
  moneyDifference?: number;
  createdAt: string;
}

export interface CreateExchangeRequestPayload {
  offeredItemId: number;
  requestedItemId: number;
  moneyDifference?: number;
  moneyDirection: number;
  description: string;
}

export interface UpdateExchangeRequestPayload {
  action: number;
}

export interface ExchangeRequestResponse {
  success: boolean;
  message: string;
}