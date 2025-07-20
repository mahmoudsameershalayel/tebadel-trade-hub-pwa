import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ItemForCreateUpdateDto, ItemDto } from '@/types/item';
import { CategoryDto } from '@/types/category';
import { ItemService } from '@/services/item-service';
import { CategoryService } from '@/services/category-service';
import { AddressService } from '@/services/address-service';
import { AddressDto } from '@/types/address';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import { add } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import AddressForm from '@/components/Address/AddressForm';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

interface ItemFormProps {
  item?: ItemDto;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ItemForm: React.FC<ItemFormProps> = ({ item, onSuccess, onCancel }) => {
  const { t, isRTL } = useLanguage();
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [mainCategories, setMainCategories] = useState<CategoryDto[]>([]);
  const [childCategories, setChildCategories] = useState<CategoryDto[]>([]);
  const [selectedMainCategoryId, setSelectedMainCategoryId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [addresses, setAddresses] = useState<AddressDto[]>([]);
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const navigate = useNavigate();

  const form = useForm<ItemForCreateUpdateDto>({
    defaultValues: {
      id: item?.id || 0,
      title: item?.title || '',
      description: item?.description || '',
      preferredExchangeNote: item?.preferredExchangeNote || '',
      categoryId: item?.category?.id ?? undefined,
      addressId: item?.address?.id ?? undefined,
    },
  });

  useEffect(() => {
    loadCategories();
  }, []);

  // Set initial main category when editing an item
  useEffect(() => {
    if (item?.category?.parent?.id) {
      setSelectedMainCategoryId(item.category.parent.id);
      // Filter child categories for the selected main category
      const children = categories.filter(cat => cat.parent && cat.parent.id === item.category.parent.id);
      setChildCategories(children);
    }
  }, [item, categories]);

  // Fetch addresses for the current user
  useEffect(() => {
    AddressService.getAllAddresses()
      .then(setAddresses)
      .catch(() => setAddresses([]));
  }, []);
  const formatAddress = (address: AddressDto) => {
    const parts = [];
    if (address?.addressName) parts.push(address.addressName);
    if (address?.city?.name) parts.push(address.city.name);
    if (address?.street) parts.push(address.street);
    if (address?.famousSign) parts.push(address.famousSign);
    return parts.join(' - ') || 'لا يوجد عنوان';
  };



  const loadCategories = async () => {
    try {
      const categoriesData = await CategoryService.getAllCategories();
      setCategories(categoriesData);

      // Filter main categories (categories where parent is null)
      const mains = categoriesData.filter(cat => !cat.parent);
      setMainCategories(mains);
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('items.loadCategoriesError'),
        variant: 'destructive',
      });
    } finally {
      setIsCategoriesLoading(false);
    }
  };

  const handleMainCategoryChange = (mainCategoryId: string) => {
    const mainIdNum = parseInt(mainCategoryId);
    setSelectedMainCategoryId(mainIdNum);

    // Filter child categories where parent.id matches the selected main category
    const children = categories.filter(cat => cat.parent && cat.parent.id === mainIdNum);
    setChildCategories(children);

    // Reset child category selection when main category changes
    form.setValue('categoryId', 0);
  };

  const onSubmit = async (data: ItemForCreateUpdateDto) => {
    setIsLoading(true);
    try {
      if (item?.id) {
        await ItemService.updateItem(item.id, data);
        toast({
          title: t('success'),
          description: t('items.updateSuccess'),
        });
      } else {
        await ItemService.createItem(data);
        toast({
          title: t('success'),
          description: t('items.createSuccess'),
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
    <>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className={isRTL ? 'text-right' : 'text-left'}>
            {item ? t('items.editItem') : t('items.createNewItem')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                rules={{ required: t('items.title') + ' ' + t('common.required') }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={isRTL ? 'text-right' : 'text-left'}>{t('items.title')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t('items.titlePlaceholder')}
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
                    <FormLabel className={isRTL ? 'text-right' : 'text-left'}>{t('items.description')}</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder={t('items.descriptionPlaceholder')}
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
                    <FormLabel className={isRTL ? 'text-right' : 'text-left'}>{t('items.preferredExchangeNote')}</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder={t('items.preferredExchangeNotePlaceholder')}
                        className={`min-h-[80px] ${isRTL ? 'text-right' : 'text-left'}`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Main Category Selection */}
              <FormItem>
                <FormLabel className={isRTL ? 'text-right' : 'text-left'}>{t('items.mainCategory')}</FormLabel>
                <Select
                  onValueChange={handleMainCategoryChange}
                  value={selectedMainCategoryId?.toString() || ''}
                  disabled={isCategoriesLoading}
                  required
                >
                  <FormControl>
                    <SelectTrigger className={isRTL ? 'rtl text-right' : 'text-left'} dir={isRTL ? 'rtl' : 'ltr'}>
                      <SelectValue placeholder={t('items.selectMainCategory')} className={isRTL ? 'text-right' : 'text-left'} dir={isRTL ? 'rtl' : 'ltr'} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className={isRTL ? 'rtl' : ''} dir={isRTL ? 'rtl' : 'ltr'}>
                    {mainCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {isRTL ? category.nameAR : category.nameEN}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* Show validation message if no main category is selected */}
                {!selectedMainCategoryId && (form.formState.isSubmitted || form.formState.touchedFields.categoryId) && (
  <FormMessage>{t('items.mainCategory') + ' ' + t('common.required')}</FormMessage>
)}              </FormItem>

              {/* Child Category Selection */}
              {selectedMainCategoryId && childCategories.length > 0 && (
                <FormField
                  control={form.control}
                  name="categoryId"
                  // sub category is optional
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={isRTL ? 'text-right' : 'text-left'}>{t('items.subCategory')}</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        value={field.value ? field.value.toString() : undefined}
                        disabled={isCategoriesLoading}
                      >
                        <FormControl>
                          <SelectTrigger className={isRTL ? 'rtl text-right' : 'text-left'} dir={isRTL ? 'rtl' : 'ltr'}>
                            <SelectValue placeholder={t('items.selectSubCategory')} className={isRTL ? 'text-right' : 'text-left'} dir={isRTL ? 'rtl' : 'ltr'} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className={isRTL ? 'rtl' : ''} dir={isRTL ? 'rtl' : 'ltr'}>
                          {childCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {isRTL ? category.nameAR : category.nameEN}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Direct Category Selection (for main categories without children) */}
              {selectedMainCategoryId && childCategories.length === 0 && (
                <FormField
                  control={form.control}
                  name="categoryId"
                  rules={{ required: t('items.category') + ' ' + t('common.required') }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={isRTL ? 'text-right' : 'text-left'}>{t('items.category')}</FormLabel>
                      <FormControl>
                        <Input
                          value={selectedMainCategoryId.toString()}
                          disabled
                          className={isRTL ? 'text-right' : 'text-left'}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="addressId"
                rules={{ required: t('items.address') + ' ' + t('common.required') }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={isRTL ? 'text-right' : 'text-left'}>{t('items.address')}</FormLabel>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Select
                        onValueChange={value => field.onChange(parseInt(value))}
                        value={field.value ? field.value.toString() : undefined}
                        disabled={addresses.length === 0}
                      >
                        <FormControl>
                          <SelectTrigger className={isRTL ? 'rtl text-right' : 'text-left'} dir={isRTL ? 'rtl' : 'ltr'}>
                            <SelectValue placeholder={t('items.selectAddress')} className={isRTL ? 'text-right' : 'text-left'} dir={isRTL ? 'rtl' : 'ltr'} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className={isRTL ? 'rtl' : ''} dir={isRTL ? 'rtl' : 'ltr'}>
                          {addresses.map(addr => (
                            <SelectItem key={addr.id} value={addr.id?.toString() || ''}>
                              {formatAddress(addr)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="rounded-full"
                      onClick={() => setShowAddressDialog(true)}
                      aria-label={t('addAddress')}
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

              <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? t('items.saving') : (item ? t('items.editItem') : t('items.createNewItem'))}
                </Button>
                {onCancel && (
                  <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                    {t('common.cancel')}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <AddressForm
            onSave={async () => {
              // Show success toast
              toast({
                title: t('success'),
                description: t('addressCreated'),
              });
              setShowAddressDialog(false);
              // Refresh addresses after adding
              const updatedAddresses = await AddressService.getAllAddresses();
              setAddresses(updatedAddresses);
            }}
            onCancel={() => setShowAddressDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ItemForm;
