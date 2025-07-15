import React from 'react';
import { Heart, MapPin, Clock, ArrowUpDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { ItemDto } from '@/types/item';

interface Item {
  id: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  location: string;
  userId: string;
  userName: string;
  createdAt: string;
  condition: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
  preferredCategories: string[];
}

interface ItemCardProps {
  item: ItemDto; // Accepts ItemDto or compatible
  onTradeClick?: (item: any) => void;
  onFavoriteClick?: (item: any) => void;
  isFavorited?: boolean;
}

const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onTradeClick,
  onFavoriteClick,
  isFavorited = false,
}) => {
  const { t } = useLanguage();

  const conditionColors = {
    new: 'bg-green-100 text-green-800',
    'like-new': 'bg-blue-100 text-blue-800',
    good: 'bg-yellow-100 text-yellow-800',
    fair: 'bg-orange-100 text-orange-800',
    poor: 'bg-red-100 text-red-800',
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Use first image from itemImages if available
  const firstImage = item.itemImages && item.itemImages.length > 0
    ? item.itemImages[0].imageURL
    : '/api/placeholder/300/300';

  // Format address display
  const formatAddress = () => {
    const parts = [];
    if (item.address?.city?.name) parts.push(item.address.city.name);
    if (item.address?.street) parts.push(item.address.street);
    if (item.address?.famousSign) parts.push(item.address.famousSign);
    return parts.join(' - ') || 'No address';
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <div className="aspect-square overflow-hidden rounded-t-lg">
          <img
            src={firstImage}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm hover:bg-white"
          onClick={() => onFavoriteClick?.(item)}
        >
          <Heart
            className={`h-4 w-4 ${
              isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </Button>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">{item.title}</h3>
            <p className="text-gray-600 text-sm line-clamp-2 mt-1">
              {item.description}
            </p>
          </div>

          <div className="flex items-center text-sm text-gray-500 space-x-4 rtl:space-x-reverse">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0" />
              {formatAddress()}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>by {item.customer.fullName}</span>
            <Badge variant="outline">{typeof item.category === 'string'
              ? item.category
              : ( item.category?.nameAR || item.category?.nameEN || item.category?.id)}
            </Badge>
          </div>

          <Button
            onClick={() => onTradeClick?.(item)}
            className="w-full"
            size="sm"
          >
            <ArrowUpDown className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {t('trade.makeOffer')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemCard;
