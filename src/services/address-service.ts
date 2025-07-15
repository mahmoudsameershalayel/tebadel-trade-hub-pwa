import { API_BASE } from '@/config/api-config';
import { Address, AddressForCreateUpdateDto, ConfirmLocationDto, ApiResponse, AddressDto } from '@/types/address';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const AddressService = {
  async getAllAddresses(): Promise<AddressDto[]> {
    const response = await fetch(`${API_BASE}/customer/address`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch addresses');
    }

    const data = await response.json();
    return Array.isArray(data) ? data : (data?.data || []);
  },

  async getAddressById(id: number): Promise<AddressDto> {
    const response = await fetch(`${API_BASE}/customer/address/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch address');
    }

    const data = await response.json();
    return data.data;
  },

  async createAddress(address: AddressForCreateUpdateDto): Promise<ApiResponse<AddressDto>> {
    const response = await fetch(`${API_BASE}/customer/address`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(address),
    });

    if (!response.ok) {
      throw new Error('Failed to create address');
    }

    return await response.json();
  },

  async updateAddress(address: AddressForCreateUpdateDto): Promise<ApiResponse<AddressDto>> {
    const response = await fetch(`${API_BASE}/customer/address`, {
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
    const response = await fetch(`${API_BASE}/customer/address/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete address');
    }

    return await response.json();
  },

  async confirmLocation(locationData: ConfirmLocationDto): Promise<ApiResponse<void>> {
    const response = await fetch(`${API_BASE}/customer/address/confirm-location`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(locationData),
    });

    if (!response.ok) {
      throw new Error('Failed to confirm location');
    }

    return await response.json();
  },

  async getAllCities(): Promise<any[]> {
    const response = await fetch(`${API_BASE}/customer/address/all-cities`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch cities');
    }
    const data = await response.json();
    return Array.isArray(data) ? data : (data?.data || []);
  },
};