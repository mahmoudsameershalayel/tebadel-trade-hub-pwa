
export interface UserProfileDto {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phoneNumber: string;
  phone1?: string;
  phone2?: string;
  userType: string;
  isActive: boolean;
  isAvaliable: boolean;
  imageURL: string;
  hasNewNotifications: number;
  referralCode?: string;
  myReferrerCode?: string;
  myPoints?: number;
}

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export interface ProfileImageUploadDto {
  image: File;
}
