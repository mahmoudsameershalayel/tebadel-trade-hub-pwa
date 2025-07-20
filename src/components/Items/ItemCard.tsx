import React from 'react';
import { Heart, MapPin, Clock, ArrowUpDown, ChevronRight, ChevronLeft, Calendar, User } from 'lucide-react';
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
  onView?: (item: ItemDto) => void;
  isFavorited?: boolean;
}

const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onTradeClick,
  onFavoriteClick,
  onView,
  isFavorited = false,
}) => {
  const { t, isRTL } = useLanguage();

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
    return parts.join(' - ') || 'لا يوجد عنوان';
  };

  // Format category display
  const formatCategory = () => {
    if (!item.category) return '';
    const name = isRTL ? item.category.nameAR : item.category.nameEN;
    if (item.category.parent) {
      const parentName = isRTL ? item.category.parent.nameAR : item.category.parent.nameEN;
      return (
        <span className="inline-flex items-center gap-1">
          <span className="font-medium text-gray-500">{parentName}</span>
          <ChevronLeft className="inline w-4 h-4 text-gray-400" />
          <span className="font-semibold text-gray-900">{name}</span>
        </span>
      );
    }
    return <span className="font-semibold text-gray-900">{name}</span>;
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer" onClick={() => onView?.(item)}>
      <div className="relative rounded-lg overflow-hidden shadow-sm w-full h-48 bg-gray-100">
        {/* Ribbon */}
        <div className="absolute top-11 left-0 z-20">
          <div className="relative">
            <div className="absolute -top-7 -left-10 w-32 transform -rotate-45 bg-amber-400 text-amber-900 text-center font-bold italic shadow-md py-1"
              style={{ fontSize: '0.70rem', letterSpacing: '0.05em' }}>
              غرض تجريبي
            </div>
          </div>
        </div>
        {/* Overlay label above the image */}
        <div className="absolute top-2 left-2 right-2 flex justify-between z-10 pointer-events-none">
          <Badge className="bg-gradient-to-r from-emerald-100 to-amber-100 text-emerald-800 border-0 px-3 py-1 rounded-full shadow-sm pointer-events-auto">
            {formatCategory()}
          </Badge>
        </div>
        <div className="aspect-square overflow-hidden rounded-t-lg">
          <img
            src={firstImage}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>


      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">{item.title}</h3>
            <p className="text-gray-600 text-sm line-clamp-2 mt-1">
              {item.description}
            </p>
          </div>

          <div className="flex items-center text-sm text-gray-600 space-x-4 rtl:space-x-reverse">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0" />
              {formatAddress()}
            </div>
            {item.createdAtDate && item.createdAtTime && (
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="text-xs text-gray-600">
                  {item.createdAtDate}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center">
            <User className="text-gray-600 h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0" />
            <span className="text-xs text-gray-600">
              {item.customer.fullName}

            </span>
          </div>

          <Button
            onClick={e => { e.stopPropagation(); onTradeClick?.(item); }}
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
