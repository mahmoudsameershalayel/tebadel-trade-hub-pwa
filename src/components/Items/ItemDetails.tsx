import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ItemDto } from '@/types/item';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ItemService } from '@/services/item-service';
import { Calendar, ChevronLeft, MapPin, User } from 'lucide-react';

interface ItemDetailsProps {
  item: ItemDto;
  onEdit?: () => void;
  onClose?: () => void;
}

const ItemDetails: React.FC<ItemDetailsProps> = ({ item, onEdit, onClose }) => {
  const { t, isRTL } = useLanguage();
  const [currentImage, setCurrentImage] = useState(0);
  const [fade, setFade] = useState(true);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [qrError, setQrError] = useState<string | null>(null);

  // Prepare images array for slider
  const images = item.itemImages && item.itemImages.length > 0
    ? item.itemImages
    : [];

  const handlePrev = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      setFade(true);
    }, 200);
  };
  const handleNext = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      setFade(true);
    }, 200);
  };
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

  const formatAddress = () => {
    const parts = [];
    if (item.address?.city?.name) parts.push(item.address.city.name);
    if (item.address?.street) parts.push(item.address.street);
    if (item.address?.famousSign) parts.push(item.address.famousSign);
    return parts.join(' - ') || 'لا يوجد عنوان';
  };


  const getStatusColor = (status: ItemDto['status']) => {
    switch (status) {
      case 'Avaliable':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Exchanged':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };


  const getStatusText = (status: ItemDto['status']) => {
    switch (status) {
      case 'Avaliable':
        return t('items.status.available') || 'Available';
      case 'Pending':
        return t('items.status.inExchange') || 'In Exchange';
      case 'Exchanged':
        return t('items.status.exchanged') || 'Exchanged';
      default:
        return status;
    }
  };

  const handleShowQr = async () => {
    setQrLoading(true);
    setQrError(null);
    try {
      const url = await ItemService.getItemQrCode(item.id);
      setQrUrl(url);
    } catch (err) {
      setQrError(t('myItems.qrError'));
    } finally {
      setQrLoading(false);
    }
  };

  const handleHideQr = () => {
    setQrUrl(null);
    setQrError(null);
  };

  return (
    <Card className="w-full max-w-md mx-auto flex flex-col">
      <CardHeader>
        <div className={`flex justify-between items-start ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <Badge className={getStatusColor(item.status)}>
            {getStatusText(item.status)}
          </Badge>  <CardTitle className={`text-2xl ${isRTL ? 'text-right' : 'text-left'}`}>
            {item.title}
          </CardTitle>

        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {images.length > 0 && (
          <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden relative flex items-center justify-center">
            <img
              src={images[currentImage].imageURL}
              alt={item.title}
              className={`w-full h-full object-contain transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-700 rounded-full p-2 shadow"
                  aria-label="Previous image"
                >
                  &#x2039;
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-700 rounded-full p-2 shadow"
                  aria-label="Next image"
                >
                  &#x203A;
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {images.map((_, idx) => (
                    <span
                      key={idx}
                      className={`inline-block w-2 h-2 rounded-full ${idx === currentImage ? 'bg-amber-500' : 'bg-white/70'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <div className={isRTL ? 'text-right' : 'text-left'}>
          <h3 className="font-semibold text-sm text-muted-foreground mb-1">{t('myItems.category')}</h3>
          <Badge className="bg-gradient-to-r from-emerald-100 to-amber-100 text-emerald-800 border-0 px-3 py-1 rounded-full shadow-sm pointer-events-auto">
            {formatCategory()}
          </Badge>
        </div>
        {item.description && (
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h3 className="font-semibold text-sm text-muted-foreground mb-2">{t('myItems.description')}</h3>
            <p className="text-base leading-relaxed">{item.description}</p>
          </div>
        )}
        {item.preferredExchangeNote && (
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h3 className="font-semibold text-sm text-muted-foreground mb-2">{t('myItems.preferredExchange')}</h3>
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <p className="text-base leading-relaxed">{item.preferredExchangeNote}</p>
            </div>
          </div>
        )}
      
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0" />
          {formatAddress()}
        </div>
        
        <div className="flex items-center justify-between">
          <span className="flex items-center">
            <User className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0" />
            {item.customer.fullName}
          </span>
          <span className="text-muted-foreground text-xs">{item.customer.phone}</span>
        </div>
        {item.createdAtDate && item.createdAtTime && (
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span className="text-xs ">
              {item.createdAtDate}
            </span>
          </div>
        )}





        <div className={`flex flex-col gap-2 pt-4 sm:flex-row sm:gap-4 ${isRTL ? 'sm:flex-row-reverse sm:justify-end' : 'sm:flex-row sm:justify-start'}`}>
          {onEdit && (
            <Button onClick={onEdit} className="flex-1">
              {t('myItems.edit')}
            </Button>
          )}
          <Button onClick={handleShowQr} className="flex-1" variant="secondary" disabled={qrLoading}>
            {qrLoading ? t('myItems.qrLoading') : t('myItems.showQr')}
          </Button>
          {onClose && (
            <Button variant="outline" onClick={onClose} className="flex-1">
              {t('myItems.close')}
            </Button>
          )}

        </div>
        {(qrUrl || qrError) && (
          <div className="flex flex-col items-center mt-6">
            {qrError ? (
              <div className="text-red-500 mb-2">{qrError}</div>
            ) : (
              <img src={qrUrl!} alt={t('myItems.qrAlt')} className="w-40 h-40 border rounded bg-white p-2" />
            )}
            <Button size="sm" variant="outline" onClick={handleHideQr} className="mt-2">
              {t('myItems.hideQr')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ItemDetails;
