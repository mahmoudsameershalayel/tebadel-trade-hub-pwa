
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import ItemList from '@/components/Items/ItemList';
import ItemForm from '@/components/Items/ItemForm';
import ItemDetails from '@/components/Items/ItemDetails';
import { ItemDto } from '@/types/item';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Plus } from 'lucide-react';

type ViewMode = 'list' | 'create' | 'edit' | 'details';

const MyItems = () => {
  const { t, isRTL } = useLanguage();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedItem, setSelectedItem] = useState<ItemDto | null>(null);

  const handleCreateNew = () => {
    setSelectedItem(null);
    setViewMode('create');
  };

  const handleEdit = (item: ItemDto) => {
    setSelectedItem(item);
    setViewMode('edit');
  };

  const handleView = (item: ItemDto) => {
    setSelectedItem(item);
    setViewMode('details');
  };

  const handleSuccess = () => {
    setViewMode('list');
    setSelectedItem(null);
  };

  const handleCancel = () => {
    setViewMode('list');
    setSelectedItem(null);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {viewMode === 'list' && (
            <>
              {/* Hero Section */}
              <div className="text-center mb-8">
                <div className="relative max-w-3xl mx-auto mb-6">
                  <img
                    src="https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=900&h=300&fit=crop"
                    alt="Traditional exchange and trading scene"
                    className="w-full h-48 object-cover rounded-2xl shadow-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-2xl"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                      {t('nav.myItems')}
                    </h1>
                    <p className="text-amber-100">Manage your items and track exchanges</p>
                  </div>
                </div>
              </div>

              {/* Header Card */}
              <Card className="mb-6 border-0 shadow-lg bg-white/95 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <Package className="h-6 w-6 text-amber-600" />
                      <h2 className="text-xl font-semibold text-gray-900">Your Items</h2>
                    </div>
                    <Button 
                      onClick={handleCreateNew}
                      className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                    >
                      <Plus className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                      Add New Item
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <ItemList onEdit={handleEdit} onView={handleView} />
            </>
          )}

          {(viewMode === 'create' || viewMode === 'edit') && (
            <div className="space-y-6">
              <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                    <CardTitle className="text-xl">
                      {viewMode === 'create' ? 'Create New Item' : 'Edit Item'}
                    </CardTitle>
                    <Button variant="outline" onClick={handleCancel} className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                      Back to List
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <ItemForm 
                    item={selectedItem || undefined}
                    onSuccess={handleSuccess}
                    onCancel={handleCancel}
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {viewMode === 'details' && selectedItem && (
            <div className="space-y-6">
              <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                    <CardTitle className="text-xl">Item Details</CardTitle>
                    <Button variant="outline" onClick={handleCancel} className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                      Back to List
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <ItemDetails 
                    item={selectedItem}
                    onEdit={() => handleEdit(selectedItem)}
                    onClose={handleCancel}
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default MyItems;
