import React from 'react';
import { ExchangeRequestDto } from '@/types/exchange';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, DollarSign, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface ExchangeRequestCardProps {
  request: ExchangeRequestDto;
  onAccept?: (id: number) => void;
  onReject?: (id: number) => void;
  onCancel?: (id: number) => void;
  type: 'sent' | 'received';
}

const ExchangeRequestCard: React.FC<ExchangeRequestCardProps> = ({
  request,
  onAccept,
  onReject,
  onCancel,
  type
}) => {
  const { t, isRTL } = useLanguage();
  const { state } = useAuth();
  
  const currentUserId = state.user?.id;
  const canManage = type === 'received' && request.status === 'Pending';
  const canCancel = type === 'sent' && request.status === 'Pending';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Accepted': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm hover:shadow-xl transition-shadow">
      <CardHeader className="pb-3">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <CardTitle className={`text-lg font-semibold text-primary ${isRTL ? 'text-right' : 'text-left'}`}>
            {type === 'sent' ? t('exchange.sentRequest') : t('exchange.receivedRequest')}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(request.status)}>
              {t(`exchange.status.${request.status.toLowerCase()}`)}
            </Badge>
            <div className={`flex items-center text-sm text-muted-foreground ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
              <Calendar className="h-4 w-4 mr-1" />
              {format(new Date(request.createdAt), isRTL ? 'yyyy/MM/dd' : 'MMM dd, yyyy')}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Items Exchange Visualization */}
        <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          {/* Offered Item */}
          <div className="flex-1 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4">
            <div className={`text-sm font-medium text-amber-800 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}> 
              {type === 'sent' ? t('exchange.yourItem') : t('exchange.theirItem')}
            </div>
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
              {request.offeredItem.itemImages && request.offeredItem.itemImages.length > 0 && (
                <img
                  src={request.offeredItem.itemImages[0].imageURL}
                  alt={request.offeredItem.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              )}
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <h4 className="font-medium text-gray-900">{request.offeredItem.title}</h4>
                <p className="text-sm text-gray-600">{isRTL ? request.offeredItem.category.nameAR : request.offeredItem.category.nameEN}</p>
              </div>
            </div>
          </div>

          {/* Exchange Arrow */}
          <div className="flex-shrink-0 p-2">
            <ArrowRight className={`h-6 w-6 text-primary ${isRTL ? 'rotate-180' : ''}`} />
          </div>

          {/* Requested Item */}
          <div className="flex-1 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-4">
            <div className={`text-sm font-medium text-emerald-800 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}> 
              {type === 'sent' ? t('exchange.theirItem') : t('exchange.yourItem')}
            </div>
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
              {request.requestedItem.itemImages && request.requestedItem.itemImages.length > 0 && (
                <img
                  src={request.requestedItem.itemImages[0].imageURL}
                  alt={request.requestedItem.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              )}
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <h4 className="font-medium text-gray-900">{request.requestedItem.title}</h4>
                <p className="text-sm text-gray-600">{isRTL ? request.requestedItem.category.nameAR : request.requestedItem.category.nameEN}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Money Difference */}
        {request.moneyDifference && request.moneyDifference > 0 && (
          <div className={`flex items-center gap-2 rounded-lg p-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'} ${request.moneyDirection === 'Pay' ? 'bg-red-50' : 'bg-green-50'}`}>
            <DollarSign className={`h-5 w-5 ${request.moneyDirection === 'Pay' ? 'text-red-600' : 'text-green-600'}`} />
            <span className={`font-medium ${request.moneyDirection === 'Pay' ? 'text-red-700' : 'text-green-700'} ${isRTL ? 'text-right' : 'text-left'}`}>
              {isRTL ? (
                request.moneyDirection === 'Pay'
                  ? `أريد دفع فرق المال: -$${request.moneyDifference}`
                  : `أريد إستلام فرق المال: +$${request.moneyDifference}`
              ) : (
                <>
                  {t('exchange.moneyDifference')}: {request.moneyDirection === 'Pay' ? '-' : '+'}${request.moneyDifference}
                </>
              )}
            </span>
          </div>
        )}

        {/* Users Info */}
        <div className={`flex items-center justify-between text-sm text-gray-600 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className={isRTL ? 'text-right' : 'text-left'}>{t('exchange.from')}: {request.offeredByUser.fullName}</span>
          <span className={isRTL ? 'text-right' : 'text-left'}>{t('exchange.to')}: {request.requestedToUser.fullName}</span>
        </div>

        {/* Action Buttons */}
        {request.status === 'Pending' && (
          <div className={`flex gap-3 pt-3 border-t ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            {canManage && (
              <>
                <Button
                  onClick={() => onAccept?.(request.id)}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                >
                  {t('exchange.accept')}
                </Button>
                <Button
                  onClick={() => onReject?.(request.id)}
                  variant="destructive"
                  className="flex-1"
                >
                  {t('exchange.reject')}
                </Button>
              </>
            )}
            {canCancel && (
              <Button
                onClick={() => onCancel?.(request.id)}
                variant="outline"
                className="flex-1"
              >
                {t('exchange.cancel')}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExchangeRequestCard;