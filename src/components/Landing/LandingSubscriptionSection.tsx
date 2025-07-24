import React, { useEffect, useState } from 'react';
import { subscriptionService } from '@/services/subscription-service';
import { SubscriptionPlan } from '@/types/subscription';
import { useLanguage } from '@/contexts/LanguageContext';
import SubscriptionCard from './SubscriptionCard';
import Loading from '@/components/ui/loading';

const LandingSubscriptionSection: React.FC = () => {
  const { t } = useLanguage();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const fetchedPlans = await subscriptionService.getSubscriptionPlans();
        setPlans(fetchedPlans);
      } catch (err) {
        console.error('Error fetching subscription plans:', err);
        setError('Failed to load subscription plans');
        // Fallback data for demonstration
        setPlans([
          {
            id: 1,
            name: 'الخطة المجانية',
            type: 'Free',
            pricePer3Monthes: 0,
            maxItems: 3,
            maxTradeRequests: 2,
            hasRealTimeChat: false,
          },
          {
            id: 2,
            name: 'الخطة الأساسية',
            type: 'Basic',
            pricePer3Monthes: 20,
            maxItems: 10,
            maxTradeRequests: 10,
            hasRealTimeChat: true,
          },
          {
            id: 3,
            name: 'الخطة المميزة',
            type: 'Premium',
            pricePer3Monthes: 50,
            maxItems: 50,
            maxTradeRequests: 50,
            hasRealTimeChat: true,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading) {
    return (
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <Loading />
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-20 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t('subscription.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('subscription.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <SubscriptionCard 
              key={plan.id} 
              plan={plan} 
              isPopular={plan.type === 'Premium'}
            />
          ))}
        </div>
        
        {error && (
          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm">
              {t('subscription.demoNotice')}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default LandingSubscriptionSection;