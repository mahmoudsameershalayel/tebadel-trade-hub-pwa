import { UserProfileDto, UpdateProfileDto } from '@/types/profile';
import { API_BASE } from '../config/api-config.js';


export class ProfileService {
  private static getAuthHeaders() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found');
    }
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  static async getProfile(): Promise<UserProfileDto> {
    const response = await fetch(`${API_BASE}/Account/Me`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    const json = await response.json();
    if (!response.ok || json.result?.code !== 200) {
      throw new Error(json.result?.message || 'Failed to fetch profile');
    }
    return json.data;
  }

  static async updateProfile(data: UpdateProfileDto): Promise<void> {
    const response = await fetch(`${API_BASE}/Account/Profile`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const json = await response.json();
    if (!response.ok || json.result?.code !== 200) {
      throw new Error(json.result?.message || 'Failed to update profile');
    }
  }

    static async uploadProfileImage(file: File): Promise<void> {
    const formData = new FormData();
    formData.append('image', file);

    const token = localStorage.getItem('token');
  

    const response = await fetch(`${API_BASE}/account/UploadProfileImage`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    const json = await response.json();
    if (!response.ok || json.result?.code !== 200) {
      throw new Error(json.result?.message || 'Failed to upload profile image');
    }
  }
}
