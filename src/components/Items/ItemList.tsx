
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ItemDto } from '@/types/item';
import { ItemService } from '@/services/item-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';

interface ItemListProps {
  onEdit?: (item: ItemDto) => void;
  onView?: (item: ItemDto) => void;
}

const ItemList: React.FC<ItemListProps> = ({ onEdit, onView }) => {
  const { t, isRTL } = useLanguage();
  const [items, setItems] = useState<ItemDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const itemsData = await ItemService.getAllItems();
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

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    setDeletingId(id);
    try {
      await ItemService.deleteItem(id);
      setItems(items.filter(item => item.id !== id));
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
    }
  };

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
    <div className="space-y-6">
      <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
        <h2 className="text-2xl font-bold">My Items</h2>
        <Badge variant="secondary">{items.length} items</Badge>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <p>No items found</p>
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
                    {item.status}
                  </Badge>
                </div>
                <p className={`text-sm text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                  {item.category.name}
                </p>
              </CardHeader>
              <CardContent>
                {item.imageURL && (
                  <div className="w-full h-32 mb-4 bg-gray-100 rounded-md overflow-hidden">
                    <img 
                      src={item.imageURL} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
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
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onEdit?.(item)}
                    className="flex-1"
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    className="flex-1"
                  >
                    {deletingId === item.id ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemList;
