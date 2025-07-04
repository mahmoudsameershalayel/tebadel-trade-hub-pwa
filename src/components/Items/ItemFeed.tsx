
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

const categories = [
  'Electronics',
  'Books',
  'Clothing',
  'Sports',
  'Home & Garden',
  'Toys',
  'Automotive',
  'Health & Beauty',
  'Art & Crafts',
  'Music',
];

// Mock data
const mockItems: Item[] = [
  {
    id: '1',
    title: 'MacBook Pro 13" 2020',
    description: 'Excellent condition MacBook Pro with M1 chip. Perfect for students or professionals.',
    images: ['https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500'],
    category: 'Electronics',
    location: 'New York, NY',
    userId: '2',
    userName: 'Sarah Johnson',
    createdAt: '2024-01-15T10:00:00Z',
    condition: 'like-new',
    preferredCategories: ['Books', 'Sports'],
  },
  {
    id: '2',
    title: 'Vintage Camera Collection',
    description: 'Beautiful collection of vintage film cameras from the 1960s-80s.',
    images: ['https://images.unsplash.com/photo-1518770660439-4636190af475?w=500'],
    category: 'Electronics',
    location: 'Los Angeles, CA',
    userId: '3',
    userName: 'Mike Chen',
    createdAt: '2024-01-14T15:30:00Z',
    condition: 'good',
    preferredCategories: ['Art & Crafts', 'Books'],
  },
  {
    id: '3',
    title: 'Programming Books Bundle',
    description: 'Complete set of programming books including React, Node.js, and Python guides.',
    images: ['https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500'],
    category: 'Books',
    location: 'Chicago, IL',
    userId: '4',
    userName: 'Alex Rodriguez',
    createdAt: '2024-01-13T08:45:00Z',
    condition: 'good',
    preferredCategories: ['Electronics'],
  },
];

const ItemFeed = () => {
  const [items, setItems] = useState<Item[]>(mockItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const { t } = useLanguage();
  const { state } = useAuth();

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
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
            Discover amazing items to trade in your community
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
            isFavorited={favorites.includes(item.id)}
          />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">{t('items.noItems')}</p>
        </div>
      )}
    </div>
  );
};

export default ItemFeed;
