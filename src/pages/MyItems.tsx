
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import ProtectedRoute from '@/components/ProtectedRoute';

const MyItems = () => {
  const { t } = useLanguage();

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {t('nav.myItems')}
        </h1>
        <div className="text-center py-12">
          <p className="text-gray-500">Feature coming soon...</p>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default MyItems;
