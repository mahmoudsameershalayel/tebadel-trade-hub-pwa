export interface CityDto {
  id: number;
  name: string;
}
  export interface Address {
  id: number;
  street: string;
  city: CityDto;
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
  addressName?: string;
  cityId?: number;
  street?: string;
  buildingNo?: string;
  floorNo?: string;
  flatNo?: string;
  famousSign?: string;
  apartment?: string;
}

export interface ConfirmLocationDto {
  addressId: number;
  locationLong?: string;
  locationLat?: string;
}

export interface AddressDto {
  id?: number;
  addressName?: string;
  customerId: number;
  customerName?: string;
  shopId: number;
  shopName?: string;
  street?: string;
  apartment?: string;
  buildingNo?: string;
  floorNo?: string;
  flatNo?: string;
  famousSign?: string;
  notes?: string;
  locationLong?: string;
  locationLat?: string;
  address?: string;
  cityId?: number;
  cityName?: string;
  city: CityDto;
  isForMe?: boolean;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}