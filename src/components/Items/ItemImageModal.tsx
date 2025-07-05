
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ItemImageUpload from './ItemImageUpload';
import { ItemDto } from '@/types/item';

interface ItemImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ItemDto;
  onImageUpdated: (item: ItemDto) => void;
}

const ItemImageModal: React.FC<ItemImageModalProps> = ({
  isOpen,
  onClose,
  item,
  onImageUpdated,
}) => {
  const handleImageUploaded = (imageUrl: string) => {
    const updatedItem = {
      ...item,
      imageURL: imageUrl,
      imagePath: imageUrl,
    };
    onImageUpdated(updatedItem);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Image for "{item.title}"</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <ItemImageUpload
            itemId={item.id}
            currentImageUrl={item.imageURL}
            onImageUploaded={handleImageUploaded}
          />
          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ItemImageModal;
