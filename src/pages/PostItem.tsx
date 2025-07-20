
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import ItemForm from '@/components/Items/ItemForm';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section with Exchange Theme */}
          <div className="text-center mb-8">
            <div className="relative max-w-2xl mx-auto mb-6">
              <img
                src="https://images.unsplash.com/photo-1466442929976-97f336a657be?w=800&h=300&fit=crop"
                alt={t('items.image')}
                className="w-full h-48 object-cover rounded-2xl shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-2xl"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                  {t('items.postNew')}
                </h1>
                <p className="text-amber-100">{t('items.subTitle')}</p>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg">
              <CardTitle className={`text-xl ${isRTL ? 'text-right' : 'text-left'}`}>{t('myItems.itemDetails')}</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ItemForm 
                onSuccess={handleSuccess}
                onCancel={handleCancel}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default PostItem;
