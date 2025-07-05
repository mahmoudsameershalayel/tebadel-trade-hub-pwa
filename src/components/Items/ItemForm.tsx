
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ItemForCreateUpdateDto, ItemDto } from '@/types/item';
import { CategoryDto } from '@/types/category';
import { ItemService } from '@/services/item-service';
import { CategoryService } from '@/services/category-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';

interface ItemFormProps {
  item?: ItemDto;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ItemForm: React.FC<ItemFormProps> = ({ item, onSuccess, onCancel }) => {
  const { t, isRTL } = useLanguage();
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

  const form = useForm<ItemForCreateUpdateDto>({
    defaultValues: {
      id: item?.id || 0,
      title: item?.title || '',
      description: item?.description || '',
      preferredExchangeNote: item?.preferredExchangeNote || '',
      categoryId: item?.category?.id || 0,
    },
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const categoriesData = await CategoryService.getAllCategories();
      setCategories(categoriesData);
    } catch (error) {
      toast({
        title: t('error'),
        description: 'Failed to load categories',
        variant: 'destructive',
      });
    } finally {
      setIsCategoriesLoading(false);
    }
  };

  const onSubmit = async (data: ItemForCreateUpdateDto) => {
    setIsLoading(true);
    try {
      if (item?.id) {
        await ItemService.updateItem(item.id, data);
        toast({
          title: t('success'),
          description: 'Item updated successfully',
        });
      } else {
        await ItemService.createItem(data);
        toast({
          title: t('success'),
          description: 'Item created successfully',
        });
      }
      onSuccess?.();
    } catch (error) {
      toast({
        title: t('error'),
        description: error instanceof Error ? error.message : 'Operation failed',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className={isRTL ? 'text-right' : 'text-left'}>
          {item ? 'Edit Item' : 'Create New Item'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              rules={{ required: 'Title is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={isRTL ? 'text-right' : 'text-left'}>Title</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Enter item title"
                      className={isRTL ? 'text-right' : 'text-left'}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={isRTL ? 'text-right' : 'text-left'}>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Enter item description"
                      className={`min-h-[100px] ${isRTL ? 'text-right' : 'text-left'}`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preferredExchangeNote"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={isRTL ? 'text-right' : 'text-left'}>Preferred Exchange Note</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Enter your preferred exchange details"
                      className={`min-h-[80px] ${isRTL ? 'text-right' : 'text-left'}`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              rules={{ required: 'Category is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={isRTL ? 'text-right' : 'text-left'}>Category</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                    disabled={isCategoriesLoading}
                  >
                    <FormControl>
                      <SelectTrigger className={isRTL ? 'text-right' : 'text-left'}>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? 'Saving...' : (item ? 'Update Item' : 'Create Item')}
              </Button>
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ItemForm;
