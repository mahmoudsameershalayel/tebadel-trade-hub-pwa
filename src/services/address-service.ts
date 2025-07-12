import { API_BASE } from '@/config/api-config';
import { Address, AddressForCreateUpdateDto, ConfirmLocationDto, ApiResponse } from '@/types/address';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const AddressService = {
  async getAllAddresses(): Promise<Address[]> {
    const response = await fetch(`${API_BASE}/api/address`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch addresses');
    }

    const data = await response.json();
    return data;
  },

  async getAddressById(id: number): Promise<Address> {
    const response = await fetch(`${API_BASE}/api/address/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch address');
    }

    const data = await response.json();
    return data;
  },

  async createAddress(address: AddressForCreateUpdateDto): Promise<ApiResponse<Address>> {
    const response = await fetch(`${API_BASE}/api/address`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(address),
    });

    if (!response.ok) {
      throw new Error('Failed to create address');
    }

    return await response.json();
  },

  async updateAddress(address: AddressForCreateUpdateDto): Promise<ApiResponse<Address>> {
    const response = await fetch(`${API_BASE}/api/address`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(address),
    });

    if (!response.ok) {
      throw new Error('Failed to update address');
    }

    return await response.json();
  },

  async deleteAddress(id: number): Promise<ApiResponse<void>> {
    const response = await fetch(`${API_BASE}/api/address/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete address');
    }

    return await response.json();
  },

  async confirmLocation(locationData: ConfirmLocationDto): Promise<ApiResponse<void>> {
    const response = await fetch(`${API_BASE}/api/address/confirm-location`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(locationData),
    });

    if (!response.ok) {
      throw new Error('Failed to confirm location');
    }

    return await response.json();
  },
};