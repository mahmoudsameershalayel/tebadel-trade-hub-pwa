import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ItemDto } from '@/types/item';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ItemService } from '@/services/item-service';

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
    : item.imageURL
      ? [{ imageURL: item.imageURL }]
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
        {images.length > 0 && (
          <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden relative flex items-center justify-center">
            <img
              src={images[currentImage].imageURL}
              alt={item.title}
              className={`w-full h-full object-cover transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h3 className="font-semibold text-sm text-muted-foreground mb-1">{t('myItems.category')}</h3>
            <p className="text-lg">{isRTL? item.category.nameAR : item.category.nameEN}</p>
          </div>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h3 className="font-semibold text-sm text-muted-foreground mb-1">{t('myItems.owner')}</h3>
            <p className="text-lg">{item.customer.fullName}</p>
            <p className="text-sm text-muted-foreground">{item.customer.phone}</p>
          </div>
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

        <div className={`flex gap-4 pt-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          {onEdit && (
            <Button onClick={onEdit} className="flex-1">
              {t('myItems.edit')}
            </Button>
          )}
          {onClose && (
            <Button variant="outline" onClick={onClose} className="flex-1">
              {t('myItems.close')}
            </Button>
          )}
          <Button onClick={handleShowQr} className="flex-1" variant="secondary" disabled={qrLoading}>
            {qrLoading ? t('myItems.qrLoading') : t('myItems.showQr')}
          </Button>
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
