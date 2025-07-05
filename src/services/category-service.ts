
import { CategoryDto } from '@/types/category';
import { API_BASE } from '../config/api-config.js';

export class CategoryService {
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

  static async getAllCategories(): Promise<CategoryDto[]> {
    const response = await fetch(`${API_BASE}/categories`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    const json = await response.json();
    if (!response.ok || json.result?.code !== 200) {
      throw new Error(json.result?.message || 'Failed to fetch categories');
    }
    return json.data;
  }
}
