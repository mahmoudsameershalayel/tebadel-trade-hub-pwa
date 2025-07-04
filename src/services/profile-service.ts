
import { UserProfileDto, UpdateProfileDto } from '@/types/profile';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-api-url.com';

export class ProfileService {
  private static getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  static async getProfile(): Promise<UserProfileDto> {
    const response = await fetch(`${API_BASE_URL}/api/account/me`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    return response.json();
  }

  static async updateProfile(data: UpdateProfileDto): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/account`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }
  }

  static async uploadProfileImage(file: File): Promise<void> {
    const formData = new FormData();
    formData.append('image', file);

    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/api/account`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload profile image');
    }
  }
}
