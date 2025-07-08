import { API_BASE } from '../config/api-config.js';

export const testApiConnectivity = async () => {
  try {
    console.log('Testing API connectivity to:', API_BASE);
    
    // Test basic connectivity
    const response = await fetch(`${API_BASE}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Health check response:', response.status, response.statusText);
    
    if (response.ok) {
      const data = await response.text();
      console.log('Health check data:', data);
      return { success: true, message: 'API is reachable' };
    } else {
      return { success: false, message: `API returned ${response.status}: ${response.statusText}` };
    }
  } catch (error) {
    console.error('API connectivity test failed:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error',
      error 
    };
  }
};

export const testAuthEndpoint = async () => {
  try {
    console.log('Testing auth endpoint...');
    
    const response = await fetch(`${API_BASE}/Auth/Authenticate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: 'test@test.com',
        password: 'test'
      }),
    });
    
    console.log('Auth test response:', response.status, response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Auth test data:', data);
      return { success: true, message: 'Auth endpoint is reachable' };
    } else {
      const errorText = await response.text();
      console.log('Auth test error:', errorText);
      return { success: false, message: `Auth endpoint returned ${response.status}: ${errorText}` };
    }
  } catch (error) {
    console.error('Auth endpoint test failed:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error',
      error 
    };
  }
}; 