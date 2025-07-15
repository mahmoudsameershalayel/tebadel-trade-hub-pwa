import React, { useState } from 'react';
import { MapPin, Check, X } from 'lucide-react';
import { AddressService } from '@/services/address-service';
import { AddressDto, ConfirmLocationDto } from '@/types/address';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { LatLngExpression } from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

interface ConfirmLocationProps {
  address: AddressDto;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (addressId: number) => void;
}

const ConfirmLocation: React.FC<ConfirmLocationProps> = ({ 
  address, 
  isOpen, 
  onClose, 
  onConfirm 
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [locationLat, setLocationLat] = useState(address.locationLat || '');
  const [locationLong, setLocationLong] = useState(address.locationLong || '');
  const [isLoading, setIsLoading] = useState(false);

  // Fix default marker icon for leaflet
  React.useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: markerIcon2x,
      iconUrl: markerIcon,
      shadowUrl: markerShadow,
    });
  }, []);

  // Gaza default coordinates
  const DEFAULT_CENTER: [number, number] = [31.5018, 34.4668];

  // Map click handler component
  function LocationMarker() {
    useMapEvents({
      click(e) {
        setLocationLat(e.latlng.lat.toString());
        setLocationLong(e.latlng.lng.toString());
      },
    });
    return null;
  }

  // InvalidateSizeOnOpen component to fix map interactivity in dialog
  const InvalidateSizeOnOpen = ({ isOpen }: { isOpen: boolean }) => {
    const map = useMap();
    useEffect(() => {
      if (isOpen) {
        setTimeout(() => {
          map.invalidateSize();
        }, 200);
      }
    }, [isOpen, map]);
    return null;
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationLat(position.coords.latitude.toString());
          setLocationLong(position.coords.longitude.toString());
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
    if (!locationLat || !locationLong) {
      toast({
        title: t('error'),
        description: t('coordinatesRequired'),
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const confirmData: ConfirmLocationDto = {
        addressId: address.id!,
        locationLat: locationLat,
        locationLong: locationLong,
      };

      await AddressService.confirmLocation(confirmData);

      toast({
        title: t('success'),
        description: t('locationConfirmed'),
      });
      
      onConfirm(address.id!);
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
            <p className="font-medium">{address.addressName}</p>
            <p>{address.street}</p>
            <p>{address.cityName}</p>
          </div>

          <div className="space-y-4">
            {/* Map Picker */}
            <div className="h-64 w-full rounded overflow-hidden mb-4 pointer-events-auto">
              <MapContainer
                center={[
                  locationLat ? parseFloat(locationLat) : DEFAULT_CENTER[0],
                  locationLong ? parseFloat(locationLong) : DEFAULT_CENTER[1]
                ] as [number, number]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <InvalidateSizeOnOpen isOpen={isOpen} />
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {/* Attribution workaround for type error */}
                <div className="leaflet-control-attribution leaflet-control">
                  &copy; OpenStreetMap contributors
                </div>
                {(locationLat && locationLong) ? (
                  <Marker
                    position={[
                      parseFloat(locationLat),
                      parseFloat(locationLong)
                    ] as [number, number]}
                    draggable={true}
                    eventHandlers={{
                      dragend: (e) => {
                        const marker = e.target;
                        const position = marker.getLatLng();
                        setLocationLat(position.lat.toString());
                        setLocationLong(position.lng.toString());
                      },
                    }}
                  />
                ) : null}
                <LocationMarker />
              </MapContainer>
            </div>
            {/* End Map Picker */}

            <div>
              <Input
                id="locationLat"
                type="hidden"
                value={locationLat}
                onChange={(e) => setLocationLat(e.target.value)}
                placeholder={t('latitudePlaceholder')}
              />
            </div>

            <div>
              <Input
                id="locationLong"
                type="hidden"
                value={locationLong}
                onChange={(e) => setLocationLong(e.target.value)}
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
              disabled={isLoading || !locationLat || !locationLong}
              className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
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