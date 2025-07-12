import React, { useState } from 'react';
import { MapPin, Check, X } from 'lucide-react';
import { AddressService } from '@/services/address-service';
import { Address } from '@/types/address';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ConfirmLocationProps {
  address: Address;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmLocation: React.FC<ConfirmLocationProps> = ({ 
  address, 
  isOpen, 
  onClose, 
  onConfirm 
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [latitude, setLatitude] = useState(address.latitude?.toString() || '');
  const [longitude, setLongitude] = useState(address.longitude?.toString() || '');
  const [isLoading, setIsLoading] = useState(false);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toString());
          setLongitude(position.coords.longitude.toString());
          toast({
            title: t('success'),
            description: t('locationObtained'),
          });
        },
        (error) => {
          toast({
            title: t('error'),
            description: t('locationError'),
            variant: 'destructive',
          });
        }
      );
    } else {
      toast({
        title: t('error'),
        description: t('geolocationNotSupported'),
        variant: 'destructive',
      });
    }
  };

  const handleConfirm = async () => {
    if (!latitude || !longitude) {
      toast({
        title: t('error'),
        description: t('coordinatesRequired'),
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await AddressService.confirmLocation({
        addressId: address.id,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      });

      toast({
        title: t('success'),
        description: t('locationConfirmed'),
      });
      
      onConfirm();
      onClose();
    } catch (error) {
      toast({
        title: t('error'),
        description: t('locationConfirmFailed'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <MapPin className="h-5 w-5" />
            {t('confirmLocation')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p className="font-medium">{address.street}</p>
            <p>{address.city}, {address.state} {address.zipCode}</p>
            <p>{address.country}</p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="latitude">{t('latitude')}</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder={t('latitudePlaceholder')}
              />
            </div>

            <div>
              <Label htmlFor="longitude">{t('longitude')}</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder={t('longitudePlaceholder')}
              />
            </div>

            <Button
              variant="outline"
              onClick={getCurrentLocation}
              className="w-full border-accent/20 hover:bg-accent/10"
            >
              <MapPin className="mr-2 h-4 w-4" />
              {t('useCurrentLocation')}
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              <X className="mr-2 h-4 w-4" />
              {t('cancel')}
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isLoading || !latitude || !longitude}
              className="flex-1 bg-gradient-to-r from-primary to-accent text-primary-foreground"
            >
              <Check className="mr-2 h-4 w-4" />
              {isLoading ? t('confirming') : t('confirm')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmLocation;