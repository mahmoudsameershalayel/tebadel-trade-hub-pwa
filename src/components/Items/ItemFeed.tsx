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
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import ItemCard from './ItemCard';
import { Link } from 'react-router-dom';
import { ItemService } from '@/services/item-service';
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

const ItemFeed = () => {
  const [items, setItems] = useState<ItemDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const { t } = useLanguage();
  const { state } = useAuth();

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

  // Collect unique categories from items
  const categories = Array.from(new Set(items.map(item => item.category?.nameEN || ''))).filter(Boolean);

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.description?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || (item.category && item.category.nameEN === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const handleTradeClick = (item: Item) => {
    console.log('Propose trade for:', item);
    // Navigate to trade proposal page
  };

  const handleFavoriteClick = (item: Item) => {
    setFavorites(prev => 
      prev.includes(item.id) 
        ? prev.filter(id => id !== item.id)
        : [...prev, item.id]
    );
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
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
              <SelectValue placeholder={t('items.category')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('items.allCategories')}</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

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
    </div>
  );
};

export default ItemFeed;
