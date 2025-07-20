
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ItemImageUpload from './ItemImageUpload';
import { ItemDto, ItemImageDto } from '@/types/item';
import { useLanguage } from '@/contexts/LanguageContext';

interface ItemImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ItemDto;
  onImagesUpdated: (images: ItemImageDto[]) => void;
}

const ItemImageModal: React.FC<ItemImageModalProps> = ({
  isOpen,
  onClose,
  item,
  onImagesUpdated,
}) => {
  const { t, isRTL } = useLanguage();
  // Add local state for images
  const [images, setImages] = useState<ItemImageDto[]>(item.itemImages || []);

  // Update local state and call parent callback
  const handleImagesUpdated = (updatedImages: ItemImageDto[]) => {
    setImages(updatedImages);
    onImagesUpdated(updatedImages);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className={isRTL ? 'text-right' : 'text-left'}>
          <DialogTitle className={isRTL ? 'text-right' : 'text-left'}>
            {t('itemImage.heading')} - "{item.title}"
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <ItemImageUpload
            itemId={item.id}
            currentImages={images}
            onImagesUpdated={handleImagesUpdated}
          />
          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              {t('myItems.close')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ItemImageModal;
