import React, { useState, useRef, useEffect } from 'react';
import { ItemImageDto } from '@/types/item';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Upload, X, Image } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ItemImageUploadProps {
  itemId: number;
  currentImages: ItemImageDto[];
  onImagesUpdated?: (images: ItemImageDto[]) => void;
}

// Helper to resize image if too large
async function resizeImageIfNeeded(file: File, maxSizeMB = 5, maxDim = 1600, quality = 0.8): Promise<File> {
  if (file.size <= maxSizeMB * 1024 * 1024) return file;
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((maxDim / width) * height);
          width = maxDim;
        } else {
          width = Math.round((maxDim / height) * width);
          height = maxDim;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        blob => {
          if (!blob) return reject(new Error('Resize failed'));
          // Always output JPEG
          const resizedFile = new File([blob], file.name.replace(/\.[^.]+$/, '') + '-resized.jpg', {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          resolve(resizedFile);
        },
        'image/jpeg',
        quality
      );
      URL.revokeObjectURL(url);
    };
    img.onerror = reject;
    img.src = url;
  });
}

const ItemImageUpload: React.FC<ItemImageUploadProps> = ({ 
  itemId, 
  currentImages, 
  onImagesUpdated 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t, isRTL } = useLanguage();
  const [images, setImages] = useState<ItemImageDto[]>(currentImages || []);

  // Sync images state with currentImages prop
  useEffect(() => {
    setImages(currentImages || []);
  }, [currentImages]);

  // Upload each file in the queue sequentially
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setUploadQueue(files);
    setIsUploading(true);
    for (const file of files) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: t('common.error'),
          description: t('itemImage.selectImageError'),
          variant: 'destructive',
        });
        continue;
      }
      let uploadFile = file;
      if (file.size > 5 * 1024 * 1024) {
        try {
          uploadFile = await resizeImageIfNeeded(file);
          // Validate the resized image before uploading
          await new Promise<void>((resolve, reject) => {
            const testUrl = URL.createObjectURL(uploadFile);
            const testImg = new window.Image();
            testImg.onload = () => {
              URL.revokeObjectURL(testUrl);
              resolve();
            };
            testImg.onerror = () => {
              URL.revokeObjectURL(testUrl);
              toast({
                title: t('common.error'),
                description: t('itemImage.resizeCorruptError') || 'Resized image is corrupt.',
                variant: 'destructive',
              });
              reject(new Error('Resized image is corrupt.'));
            };
            testImg.src = testUrl;
          });
        } catch (err) {
          toast({
            title: t('common.error'),
            description: t('itemImage.sizeError'),
            variant: 'destructive',
          });
          continue;
        }
      }
      try {
        const formData = new FormData();
        formData.append('image', uploadFile);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error(t('itemImage.authError'));
        }
        const response = await fetch(`${import.meta.env.VITE_API_BASE || 'https://tabadal20250701211825.azurewebsites.net/TabadalAPI/Customer'}/items/${itemId}/image`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });
        const json = await response.json();
        console.log('Upload response:', json); // Debug: log the API response
        if (!response.ok || json.result?.code !== 200) {
          throw new Error(json.result?.message || 'Failed to upload image');
        }
        // Add fallback for imageURL
        const newImage: ItemImageDto = {
          ...json.data,
          imageURL: json.data.imageURL || '/placeholder.svg',
        };
        setImages(prev => {
          const updated = [...prev, newImage];
          onImagesUpdated?.(updated);
          return updated;
        });
        toast({
          title: t('common.success') || 'Success',
          description: t('itemImage.uploadSuccess'),
        });
      } catch (error) {
        toast({
          title: t('common.error'),
          description: error instanceof Error ? error.message : t('itemImage.uploadError'),
          variant: 'destructive',
        });
      }
    }
    setIsUploading(false);
    setUploadQueue([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Remove a specific image by ID
  const handleRemoveImage = async (imageId: number) => {
    setIsUploading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error(t('itemImage.authError'));
      }
      const response = await fetch(`${import.meta.env.VITE_API_BASE || 'https://tabadal20250701211825.azurewebsites.net/TabadalAPI/Customer'}/items/${imageId}/remove-image`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const json = await response.json();
      if (!response.ok || json.result?.code !== 200) {
        throw new Error(json.result?.message || 'Failed to remove image');
      }
      setImages(prev => {
        const updated = prev.filter(img => img.id !== imageId);
        onImagesUpdated?.(updated);
        return updated;
      });
      toast({
        title: t('common.success') || 'Success',
        description: t('itemImage.removeSuccess'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: error instanceof Error ? error.message : t('itemImage.removeError'),
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <h3 className={`text-lg font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>{t('itemImage.heading')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.length > 0 ? images.map(img => (
              <div key={img.id} className="relative group">
                <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={img.imageURL || '/placeholder.svg'}
                    alt="Item preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-80 group-hover:opacity-100"
                  onClick={() => handleRemoveImage(img.id)}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )) : (
              <div className="w-full h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center col-span-2 md:col-span-3">
                <div className="text-center">
                  <Image className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className={`text-gray-500 ${isRTL ? 'text-right' : 'text-left'}`}>{t('itemImage.noImage')}</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? t('itemImage.uploading') : t('itemImage.upload')}
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemImageUpload;
