export interface UserDto {
  id: string | number;
  fullName: string;
  phone: string;
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

