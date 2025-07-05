
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Upload, X, Image } from 'lucide-react';

interface ItemImageUploadProps {
  itemId: number;
  currentImageUrl?: string;
  onImageUploaded?: (imageUrl: string) => void;
}

const ItemImageUpload: React.FC<ItemImageUploadProps> = ({ 
  itemId, 
  currentImageUrl, 
  onImageUploaded 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Error',
        description: 'Please select an image file',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'Image size must be less than 5MB',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE || 'https://tabadal20250701211825.azurewebsites.net/TabadalAPI'}/items/${itemId}/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const json = await response.json();
      
      if (!response.ok || json.result?.code !== 200) {
        throw new Error(json.result?.message || 'Failed to upload image');
      }

      const imageUrl = json.data.imageURL || json.data.imagePath;
      setPreviewUrl(imageUrl);
      onImageUploaded?.(imageUrl);

      toast({
        title: 'Success',
        description: 'Image uploaded successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upload image',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = async () => {
    setIsUploading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE || 'https://tabadal20250701211825.azurewebsites.net/TabadalAPI'}/items/${itemId}/image`, {
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

      setPreviewUrl(null);
      onImageUploaded?.('');

      toast({
        title: 'Success',
        description: 'Image removed successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to remove image',
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
          <h3 className="text-lg font-semibold">Item Image</h3>
          
          {previewUrl ? (
            <div className="relative">
              <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={previewUrl} 
                  alt="Item preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={handleRemoveImage}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="w-full h-64 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Image className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No image uploaded</p>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? 'Uploading...' : (previewUrl ? 'Change Image' : 'Upload Image')}
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemImageUpload;
