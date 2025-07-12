import { ExchangeRequestDto, CreateExchangeRequestPayload, UpdateExchangeRequestPayload, ExchangeRequestResponse } from '@/types/exchange';
import { API_BASE } from '../config/api-config.js';

export class ExchangeService {
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

  static async createExchangeRequest(data: CreateExchangeRequestPayload): Promise<ExchangeRequestResponse> {
    const response = await fetch(`${API_BASE}/Customer/ExchangeRequests`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const json = await response.json();
    if (!response.ok || json.result?.code !== 200) {
      throw new Error(json.result?.message || 'Failed to create exchange request');
    }
    return json.data;
  }

  static async updateExchangeRequest(id: number, data: UpdateExchangeRequestPayload): Promise<ExchangeRequestResponse> {
    const response = await fetch(`${API_BASE}/Customer/ExchangeRequests/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const json = await response.json();
    if (!response.ok || json.result?.code !== 200) {
      throw new Error(json.result?.message || 'Failed to update exchange request');
    }
    return json.data;
  }

  static async cancelExchangeRequest(id: number): Promise<ExchangeRequestResponse> {
    const response = await fetch(`${API_BASE}/Customer/ExchangeRequests/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    const json = await response.json();
    if (!response.ok || json.result?.code !== 200) {
      throw new Error(json.result?.message || 'Failed to cancel exchange request');
    }
    return json.data;
  }

  static async getAllExchangeRequests(): Promise<ExchangeRequestDto[]> {
    const response = await fetch(`${API_BASE}/Customer/ExchangeRequests`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    const json = await response.json();
    if (!response.ok || json.result?.code !== 200) {
      throw new Error(json.result?.message || 'Failed to fetch exchange requests');
    }
    return json.data;
  }

  static async getSentExchangeRequests(): Promise<ExchangeRequestDto[]> {
    const response = await fetch(`${API_BASE}/Customer/ExchangeRequests/sent`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    const json = await response.json();
    if (!response.ok || json.result?.code !== 200) {
      throw new Error(json.result?.message || 'Failed to fetch sent exchange requests');
    }
    return json.data;
  }

  static async getReceivedExchangeRequests(): Promise<ExchangeRequestDto[]> {
    const response = await fetch(`${API_BASE}/Customer/ExchangeRequests/received`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    const json = await response.json();
    if (!response.ok || json.result?.code !== 200) {
      throw new Error(json.result?.message || 'Failed to fetch received exchange requests');
    }
    return json.data;
  }
}