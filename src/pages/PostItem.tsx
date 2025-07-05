
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import ItemForm from '@/components/Items/ItemForm';
import { useNavigate } from 'react-router-dom';

const PostItem = () => {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/my-items');
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`flex items-center justify-between mb-8 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <h1 className="text-3xl font-bold text-gray-900">
            Add New Item
          </h1>
        </div>
        <ItemForm 
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </ProtectedRoute>
  );
};

export default PostItem;
