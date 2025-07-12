export interface Address {
  id: number;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddressForCreateUpdateDto {
  id?: number;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
}

export interface ConfirmLocationDto {
  addressId: number;
  latitude: number;
  longitude: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}