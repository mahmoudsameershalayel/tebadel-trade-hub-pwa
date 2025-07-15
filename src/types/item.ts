
import { AddressDto } from './address';
import { CategoryDto } from './category';
import { UserDto } from './user';

export interface ItemImageDto {
  id: number;
  itemId: number;
  imageURL: string;
  imagePath: string;
  imageFileLength: number;
}


export interface ItemForCreateUpdateDto {
  id: number;
  title: string;
  description?: string;
  preferredExchangeNote?: string;
  categoryId: number;
  addressId: number;
}

export interface ItemDto {
  id: number;
  title: string;
  description?: string;
  preferredExchangeNote?: string;
  status: string;
  category: CategoryDto;
  address: AddressDto;
  customer: UserDto;
  itemImages : ItemImageDto[]
}
