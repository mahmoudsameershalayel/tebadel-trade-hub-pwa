import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ItemDto } from '@/types/item';
import { ItemService } from '@/services/item-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { Upload } from 'lucide-react';
import ItemImageModal from './ItemImageModal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface ItemListProps {
  onEdit?: (item: ItemDto) => void;
  onView?: (item: ItemDto) => void;
}

const ItemList: React.FC<ItemListProps> = ({ onEdit, onView }) => {
  const { t, isRTL } = useLanguage();
  const [items, setItems] = useState<ItemDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemDto | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ItemDto | null>(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const itemsData = await ItemService.getMyAllItems();
      setItems(itemsData);
    } catch (error) {
      toast({
        title: t('error'),
        description: 'Failed to load items',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (item: ItemDto) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setDeletingId(itemToDelete.id);
    try {
      await ItemService.deleteItem(itemToDelete.id);
      setItems(items.filter(item => item.id !== itemToDelete.id));
      toast({
        title: t('success'),
        description: 'Item deleted successfully',
      });
    } catch (error) {
      toast({
        title: t('error'),
        description: error instanceof Error ? error.message : 'Failed to delete item',
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleUploadImage = (item: ItemDto) => {
    setSelectedItem(item);
    setImageModalOpen(true);
  };

  const handleImageUpdated = () => {
    loadItems();
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
      case 'Available':
        return t('items.status.available') || 'Available';
      case 'Pending':
        return t('items.status.inExchange') || 'In Exchange';
      case 'Exchanged':
        return t('items.status.exchanged') || 'Exchanged';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full mb-4" />
              <Skeleton className="h-8 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader className="text-center">
            <DialogTitle className="text-center">{t('common.delete')}</DialogTitle>
            <DialogDescription className="text-center">
              {t('myItems.deleteConfirm') || 'Are you sure you want to delete this item?'}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center gap-2 mt-4">
          <Button variant="outline" onClick={cancelDelete}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deletingId === (itemToDelete && itemToDelete.id)}
            >
              {deletingId === (itemToDelete && itemToDelete.id)
                ? t('common.loading')
                : t('common.delete')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <div className="space-y-6">
        <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <Badge variant="secondary">{items.length} {t('items.myItems')}</Badge>
          <h2 className={`text-2xl font-bold ${isRTL ? 'text-right' : 'text-left'}`}>{t('myItems.yourItems')}</h2>
        </div>

        {items.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className={`text-center text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                <p>{t('items.noItems')}</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Card key={item.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`flex justify-between items-start ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                    <CardTitle className={`text-lg truncate ${isRTL ? 'text-right' : 'text-left'}`}>
                      {item.title}
                    </CardTitle>
                    <Badge className={getStatusColor(item.status)}>
                      {getStatusText(item.status)}
                    </Badge>
                  </div>
                  <p className={`text-sm text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                    {isRTL ? item.category.nameAR : item.category.nameEN}
                  </p>
                </CardHeader>
                <CardContent>
                  {(item.itemImages && item.itemImages.length > 0) ? (
                    <div className="w-full h-32 mb-4 bg-gray-100 rounded-md overflow-hidden">
                      <img
                        src={item.itemImages[0].imageURL}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : item.imageURL ? (
                    <div className="w-full h-32 mb-4 bg-gray-100 rounded-md overflow-hidden">
                      <img
                        src={item.imageURL}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-32 mb-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <Upload className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">No image</p>
                      </div>
                    </div>
                  )}
                  {item.description && (
                    <p className={`text-sm text-muted-foreground mb-4 line-clamp-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {item.description}
                    </p>
                  )}
                  <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView?.(item)}
                      className="flex-1"
                    >
                      {t('common.view')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUploadImage(item)}
                      className="flex-1"
                    >
                      <Upload className="h-4 w-4 mr-1" />
                      {t('items.image')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit?.(item)}
                      className="flex-1"
                    >
                      {t('common.edit')}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(item)}
                      disabled={deletingId === item.id}
                      className="flex-1"
                    >
                      {deletingId === item.id ? t('common.loading') : t('common.delete')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {selectedItem && (
        <ItemImageModal
          isOpen={imageModalOpen}
          onClose={() => setImageModalOpen(false)}
          item={selectedItem}
          onImageUpdated={handleImageUpdated}
        />
      )}
    </>
  );
};

export default ItemList;
