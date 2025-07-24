export interface UserDto {
  userId: string | number;
  fullName: string;
  phoneNumber: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
}

export interface LoginPayload {
  phone: string;
  password: string;
}

