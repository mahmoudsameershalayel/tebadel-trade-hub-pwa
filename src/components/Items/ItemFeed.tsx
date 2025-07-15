import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import ItemCard from './ItemCard';
import { Link } from 'react-router-dom';
import { ItemService } from '@/services/item-service';
import { CategoryService } from '@/services/category-service';
import { ItemDto } from '@/types/item';
import { CategoryDto } from '@/types/category';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { ExchangeService } from '@/services/exchange-service';
import { useToast } from '@/hooks/use-toast';

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

const ItemFeed = () => {
  const [items, setItems] = useState<ItemDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [mainCategories, setMainCategories] = useState<CategoryDto[]>([]);
  const [subCategories, setSubCategories] = useState<CategoryDto[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const { t, isRTL } = useLanguage();
  const { state } = useAuth();
  const { toast } = useToast();
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [selectedTradeItem, setSelectedTradeItem] = useState<ItemDto | null>(null);
  const [myItems, setMyItems] = useState<ItemDto[]>([]);
  const [selectedMyItemId, setSelectedMyItemId] = useState<string>('');
  const [moneyDifference, setMoneyDifference] = useState('');
  const [tradeLoading, setTradeLoading] = useState(false);
  const [tradeError, setTradeError] = useState<string | null>(null);
  const [tradeSuccess, setTradeSuccess] = useState<string | null>(null);
  const [moneyDirection, setMoneyDirection] = useState<'Pay' | 'Receive'>('Pay');
  const [tradeDescription, setTradeDescription] = useState('');

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsCategoriesLoading(true);
        const categoriesData = await CategoryService.getAllCategories();
        setCategories(categoriesData);
        
        // Filter main categories (categories where parent is null)
        const mains = categoriesData.filter(cat => !cat.parent);
        setMainCategories(mains);
      } catch (error) {
        console.error('Error loading categories:', error);
        toast({
          title: t('error'),
          description: t('items.loadCategoriesError'),
          variant: 'destructive',
        });
      } finally {
        setIsCategoriesLoading(false);
      }
    };
    loadCategories();
  }, [t, toast]);

  // Load items
  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await ItemService.getAllItems();
        setItems(data);
      } catch (err) {
        setError(t('items.loadError'));
      } finally {
        setIsLoading(false);
      }
    };
    loadItems();
  }, [t]);

  // Update subcategories when main category changes
  useEffect(() => {
    if (selectedMainCategory === 'all') {
      setSubCategories([]);
      setSelectedSubCategory('all');
    } else {
      const mainId = parseInt(selectedMainCategory);
      const children = categories.filter(cat => cat.parent && cat.parent.id === mainId);
      setSubCategories(children);
      setSelectedSubCategory('all');
    }
  }, [selectedMainCategory, categories]);

  useEffect(() => {
    if (showTradeModal && state.isAuthenticated) {
      ItemService.getMyAllItems().then(setMyItems).catch(() => setMyItems([]));
    }
  }, [showTradeModal, state.isAuthenticated]);

  const handleMainCategoryChange = (mainCategoryId: string) => {
    setSelectedMainCategory(mainCategoryId);
  };

  const handleSubCategoryChange = (subCategoryId: string) => {
    setSelectedSubCategory(subCategoryId);
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.description?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    let matchesCategory = true;
    
    if (selectedMainCategory !== 'all') {
      const mainId = parseInt(selectedMainCategory);
      if (selectedSubCategory !== 'all') {
        // Filter by specific subcategory
        const subId = parseInt(selectedSubCategory);
        matchesCategory = item.category?.id === subId;
      } else {
        // Filter by main category (item belongs to main category or any of its subcategories)
        const itemCategory = item.category;
        if (itemCategory) {
          if (itemCategory.parent) {
            // Item is in a subcategory, check if parent matches main category
            matchesCategory = itemCategory.parent.id === mainId;
          } else {
            // Item is in a main category
            matchesCategory = itemCategory.id === mainId;
          }
        } else {
          matchesCategory = false;
        }
      }
    }
    
    return matchesSearch && matchesCategory;
  });

  const handleTradeClick = (item: ItemDto) => {
    setSelectedTradeItem(item);
    setShowTradeModal(true);
    setSelectedMyItemId('');
    setMoneyDifference('');
    setMoneyDirection('Pay');
    setTradeDescription('');
    setTradeError(null);
    setTradeSuccess(null);
  };

  const handleFavoriteClick = (item: Item) => {
    setFavorites(prev => 
      prev.includes(item.id) 
        ? prev.filter(id => id !== item.id)
        : [...prev, item.id]
    );
  };

  const handleSubmitTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    setTradeLoading(true);
    setTradeError(null);
    setTradeSuccess(null);
    try {
      if (!selectedMyItemId || !moneyDirection || !tradeDescription) {
        setTradeError(t('trade.fillAllFields'));
        setTradeLoading(false);
        return;
      }
      await ExchangeService.createExchangeRequest({
          offeredItemId: Number(selectedMyItemId),
          requestedItemId: Number(selectedTradeItem!.id),
          moneyDifference: moneyDifference ? Number(moneyDifference) : undefined,
          moneyDirection: moneyDirection === 'Pay' ? 1 : 2,
          description: tradeDescription,
      });
      setTradeSuccess(t('trade.offerSent'));
      setShowTradeModal(false);
      toast({
        title: t('trade.offerSent'),
        description: t('trade.offerSent'),
        variant: 'default',
        duration: 1500,
      });
    } catch (err: any) {
      setTradeError(err.message || t('common.error'));
    } finally {
      setTradeLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('items.title')}
          </h1>
          <p className="text-gray-600">
            {t('items.subTitle')}
          </p>
        </div>
        
        {state.isAuthenticated && (
          <Button asChild className="mt-4 sm:mt-0">
            <Link to="/post-item">
              <Plus className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
              {t('items.postNew')}
            </Link>
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 rtl:left-auto rtl:right-3" />
              <Input
                placeholder={t('items.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rtl:pl-3 rtl:pr-10"
              />
            </div>
          </div>
          
          <Select value={selectedMainCategory} onValueChange={handleMainCategoryChange}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
              <SelectValue placeholder={t('items.mainCategory')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('items.allCategories')}</SelectItem>
              {mainCategories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {isRTL ? category.nameAR : category.nameEN}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Subcategory Tabs */}
      {selectedMainCategory !== 'all' && subCategories.length > 0 && (
        <div className="mb-8">
          <Tabs value={selectedSubCategory} onValueChange={handleSubCategoryChange} className="w-full">
            <TabsList className="grid w-full grid-cols-auto-fit gap-3 bg-background border border-border rounded-xl p-2 h-auto">
              <TabsTrigger 
                value="all" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-lg px-6 py-3 text-sm font-medium transition-all duration-200 hover:bg-muted hover:scale-105"
              >
                {t('items.allSubCategories')}
              </TabsTrigger>
              {subCategories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id.toString()}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-lg px-6 py-3 text-sm font-medium transition-all duration-200 hover:bg-muted hover:scale-105"
                >
                  {isRTL ? category.nameAR : category.nameEN}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      )}

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onTradeClick={handleTradeClick}
            onFavoriteClick={handleFavoriteClick}
          />
        ))}
      </div>

      {isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">{t('common.loading')}</p>
        </div>
      )}
      {error && (
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      )}
      {!isLoading && !error && filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">{t('items.noItems')}</p>
        </div>
      )}

      <Dialog open={showTradeModal} onOpenChange={setShowTradeModal}>
        <DialogContent>
          <DialogHeader className={isRTL ? 'text-right flex flex-col items-end' : 'text-left flex flex-col items-start'}>
            <DialogTitle className={isRTL ? 'text-right w-full' : 'text-left w-full'}>{t('trade.makeOffer')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitTrade} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">{t('trade.yourItem')}</label>
              <select
                className="w-full border rounded p-2"
                value={selectedMyItemId}
                onChange={e => setSelectedMyItemId(e.target.value)}
                required
              >
                <option value="">{t('trade.selectYourItemPlaceholder')}</option>
                {myItems.map(myItem => (
                  <option key={myItem.id} value={myItem.id}>
                    {myItem.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block mb-1 font-medium">{t('trade.moneyDifference')}</label>
                <input
                  type="number"
                  className="w-full border rounded p-2"
                  value={moneyDifference}
                  onChange={e => setMoneyDifference(e.target.value)}
                  min="0"
                  placeholder={t('trade.moneyDifferencePlaceholder')}
                />
              </div>
              <div className="flex-1">
                <label className="block mb-1 font-medium">{t('trade.moneyDirection')}</label>
                <select
                  className="w-full border rounded p-2"
                  value={moneyDirection}
                  onChange={e => setMoneyDirection(e.target.value as 'Pay' | 'Receive')}
                  required
                >
                  <option value="">{t('trade.moneyDirectionPlaceholder')}</option>
                  <option value="Pay">{t('trade.pay')}</option>
                  <option value="Receive">{t('trade.receive')}</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block mb-1 font-medium">{t('trade.description')}</label>
              <textarea
                className="w-full border rounded p-2"
                value={tradeDescription}
                onChange={e => setTradeDescription(e.target.value)}
                placeholder={t('trade.descriptionPlaceholder')}
                rows={2}
              />
            </div>
            {tradeError && <div className="text-red-500 text-sm">{tradeError}</div>}
            {tradeSuccess && <div className="text-green-600 text-sm">{tradeSuccess}</div>}
            <DialogFooter>
              <Button type="submit" disabled={tradeLoading}>
                {tradeLoading ? t('common.loading') : t('trade.sendOffer')}
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">{t('common.cancel')}</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ItemFeed;
