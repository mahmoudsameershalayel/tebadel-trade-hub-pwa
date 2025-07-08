import { ItemDto, ItemForCreateUpdateDto } from '@/types/item';
import { API_BASE } from '../config/api-config.js';

export class ItemService {
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

  static async getAllItems(): Promise<ItemDto[]> {
    const response = await fetch(`${API_BASE}/customer/items`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    const json = await response.json();
    if (!response.ok || json.result?.code !== 200) {
      throw new Error(json.result?.message || 'Failed to fetch items');
    }
    return json.data;
  }

  static async getMyAllItems(): Promise<ItemDto[]> {
    const response = await fetch(`${API_BASE}/customer/items/my-items`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    const json = await response.json();
    if (!response.ok || json.result?.code !== 200) {
      throw new Error(json.result?.message || 'Failed to fetch items');
    }
    return json.data;
  }

  static async getItemById(id: number): Promise<ItemDto> {
    const response = await fetch(`${API_BASE}/customer/items/${id}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    const json = await response.json();
    if (!response.ok || json.result?.code !== 200) {
      throw new Error(json.result?.message || 'Failed to fetch item');
    }
    return json.data;
  }

  static async createItem(data: ItemForCreateUpdateDto): Promise<ItemDto> {
    const response = await fetch(`${API_BASE}/customer/items`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const json = await response.json();
    if (!response.ok || json.result?.code !== 200) {
      throw new Error(json.result?.message || 'Failed to create item');
    }
    return json.data;
  }

  static async updateItem(id: number, data: ItemForCreateUpdateDto): Promise<ItemDto> {
    const response = await fetch(`${API_BASE}/customer/items/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const json = await response.json();
    if (!response.ok || json.result?.code !== 200) {
      throw new Error(json.result?.message || 'Failed to update item');
    }
    return json.data;
  }

  static async deleteItem(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}/customer/items/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    const json = await response.json();
    if (!response.ok || json.result?.code !== 200) {
      throw new Error(json.result?.message || 'Failed to delete item');
    }
  }

  static async getItemQrCode(id: number): Promise<string> {
    const response = await fetch(`${API_BASE}/customer/items/${id}/qr`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch QR code');
    }
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }
}
