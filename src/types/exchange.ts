import { ItemDto } from './item';
import { UserDto } from './user';

export interface ExchangeRequestDto {
  id: number;
  offeredItem: ItemDto;
  requestedItem: ItemDto;
  fromUser: UserDto;
  toUser: UserDto;
  status: 'Pending' | 'Accepted' | 'Rejected';
  moneyDifference?: number;
  createdAt: string;
}

export interface CreateExchangeRequestPayload {
  offeredItemId: number;
  requestedItemId: number;
  moneyDifference?: number;
}

export interface UpdateExchangeRequestPayload {
  action: 'accept' | 'reject';
}

export interface ExchangeRequestResponse {
  success: boolean;
  message: string;
}