
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import ItemList from '@/components/Items/ItemList';
import ItemForm from '@/components/Items/ItemForm';
import ItemDetails from '@/components/Items/ItemDetails';
import { ItemDto } from '@/types/item';
import { Button } from '@/components/ui/button';

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewMode === 'list' && (
          <>
            <div className={`flex justify-between items-center mb-8 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
              <h1 className="text-3xl font-bold text-gray-900">
                {t('nav.myItems')}
              </h1>
              <Button onClick={handleCreateNew}>
                Add New Item
              </Button>
            </div>
            <ItemList onEdit={handleEdit} onView={handleView} />
          </>
        )}

        {(viewMode === 'create' || viewMode === 'edit') && (
          <div className="space-y-6">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
              <h1 className="text-3xl font-bold text-gray-900">
                {viewMode === 'create' ? 'Create New Item' : 'Edit Item'}
              </h1>
              <Button variant="outline" onClick={handleCancel}>
                Back to List
              </Button>
            </div>
            <ItemForm 
              item={selectedItem || undefined}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </div>
        )}

        {viewMode === 'details' && selectedItem && (
          <div className="space-y-6">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
              <h1 className="text-3xl font-bold text-gray-900">
                Item Details
              </h1>
              <Button variant="outline" onClick={handleCancel}>
                Back to List
              </Button>
            </div>
            <ItemDetails 
              item={selectedItem}
              onEdit={() => handleEdit(selectedItem)}
              onClose={handleCancel}
            />
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default MyItems;
