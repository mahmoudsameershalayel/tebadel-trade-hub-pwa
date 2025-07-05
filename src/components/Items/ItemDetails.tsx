
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ItemDto } from '@/types/item';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ItemDetailsProps {
  item: ItemDto;
  onEdit?: () => void;
  onClose?: () => void;
}

const ItemDetails: React.FC<ItemDetailsProps> = ({ item, onEdit, onClose }) => {
  const { t, isRTL } = useLanguage();

  const getStatusColor = (status: ItemDto['status']) => {
    switch (status) {
      case 'متاح':
        return 'bg-green-100 text-green-800';
      case 'قيد_التبديل':
        return 'bg-yellow-100 text-yellow-800';
      case 'تم_التبديل':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className={`flex justify-between items-start ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <CardTitle className={`text-2xl ${isRTL ? 'text-right' : 'text-left'}`}>
            {item.title}
          </CardTitle>
          <Badge className={getStatusColor(item.status)}>
            {item.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {item.imageURL && (
          <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src={item.imageURL} 
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h3 className="font-semibold text-sm text-muted-foreground mb-1">Category</h3>
            <p className="text-lg">{item.category.name}</p>
          </div>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h3 className="font-semibold text-sm text-muted-foreground mb-1">Owner</h3>
            <p className="text-lg">{item.customer.firstName} {item.customer.lastName}</p>
            <p className="text-sm text-muted-foreground">{item.customer.phone}</p>
          </div>
        </div>

        {item.description && (
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h3 className="font-semibold text-sm text-muted-foreground mb-2">Description</h3>
            <p className="text-base leading-relaxed">{item.description}</p>
          </div>
        )}

        {item.preferredExchangeNote && (
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h3 className="font-semibold text-sm text-muted-foreground mb-2">Preferred Exchange</h3>
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <p className="text-base leading-relaxed">{item.preferredExchangeNote}</p>
            </div>
          </div>
        )}

        <div className={`flex gap-4 pt-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          {onEdit && (
            <Button onClick={onEdit} className="flex-1">
              Edit Item
            </Button>
          )}
          {onClose && (
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemDetails;
