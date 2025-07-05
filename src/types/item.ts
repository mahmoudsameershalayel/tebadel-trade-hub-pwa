
import { CategoryDto } from './category';
import { UserDto } from './user';

export interface ItemForCreateUpdateDto {
  id: number;
  title: string;
  description?: string;
  preferredExchangeNote?: string;
  categoryId: number;
}

export interface ItemDto {
  id: number;
  title: string;
  description?: string;
  preferredExchangeNote?: string;
  status: 'متاح' | 'قيد_التبديل' | 'تم_التبديل';
  imagePath?: string;
  imageURL?: string;
  imageFileLength?: string;
  category: CategoryDto;
  customer: UserDto;
}
