import React from 'react';
import { Check, X, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SubscriptionPlan } from '@/types/subscription';
import { useLanguage } from '@/contexts/LanguageContext';

interface SubscriptionCardProps {
  plan: SubscriptionPlan;
  isPopular?: boolean;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ plan, isPopular = false }) => {
  const { t, isRTL } = useLanguage();

  const formatPrice = (price: number) => {
    if (price === 0) {
      return t('subscription.free');
    }
    return isRTL ? `${price} شيكل / 3 شهور` : `${price} ILS / 3 months`;
  };

  const formatFeature = (value: number, type: 'items' | 'requests') => {
    if (type === 'items') {
      return isRTL ? `${value} عناصر` : `${value} items`;
    }
    return isRTL ? `${value} طلبات` : `${value} requests`;
  };

  return (
    <Card className={`relative border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
      isPopular 
        ? 'bg-gradient-to-br from-amber-50 to-orange-50 ring-2 ring-amber-300' 
        : 'bg-gradient-to-br from-white to-gray-50'
    }`}>
      {isPopular && (
        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1">
          <Star className="h-3 w-3 mr-1 rtl:ml-1 rtl:mr-0" />
          {t('subscription.popular')}
        </Badge>
      )}
      
      <CardHeader className="text-center pb-4">
        <CardTitle className={`text-2xl font-bold ${
          isPopular ? 'text-amber-800' : 'text-gray-900'
        }`}>
          {plan.name}
        </CardTitle>
        <div className={`text-3xl font-bold ${
          isPopular ? 'text-amber-700' : 'text-gray-800'
        }`}>
          {formatPrice(plan.pricePer3Monthes)}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">{t('subscription.maxItems')}</span>
            <span className="font-semibold text-gray-900">
              {formatFeature(plan.maxItems, 'items')}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-700">{t('subscription.maxRequests')}</span>
            <span className="font-semibold text-gray-900">
              {formatFeature(plan.maxTradeRequests, 'requests')}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-700">{t('subscription.realTimeChat')}</span>
            <div className="flex items-center">
              {plan.hasRealTimeChat ? (
                <Check className="h-5 w-5 text-green-600" />
              ) : (
                <X className="h-5 w-5 text-red-500" />
              )}
            </div>
          </div>
        </div>
        
        <Button 
          className={`w-full mt-6 ${
            isPopular 
              ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700' 
              : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800'
          }`}
        >
          {t('subscription.subscribe')}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SubscriptionCard;