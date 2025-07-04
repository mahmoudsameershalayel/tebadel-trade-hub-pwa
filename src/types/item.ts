import { CategoryDto } from "./category";
import { UserDto } from "./user";

export type ItemStatus = 'Available' | 'Pending' | 'Exchanged' | string;


export interface ItemDto {
    id: number;
    title: string;
    description?: string;
    preferredExchangeNote?: string;
    status: ItemStatus;
    imagePath?: string;
    imageURL?: string;
    imageFileLength?: string;
    category: CategoryDto;
    customer: UserDto;
}

export interface ItemForCreateUpdateDto {
    id: number;
    title: string;
    description?: string;
    preferredExchangeNote?: string;
    categoryId: number;
}

export interface UploadItemImageDto {
    itemId: number;
    image: File;
}

export interface itemResponse {
    itemId: number;
    image: File;
}

export interface singleItemResponse {
    itemId: number;
    image: File;
} 