import { API_BASE } from '@/config/api-config';
import { SubscriptionPlan } from '@/types/subscription';

export const subscriptionService = {
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    try {
      const response = await fetch(`${API_BASE}/api/subscription`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const plans = await response.json();
      return plans;
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      throw error;
    }
  },
};