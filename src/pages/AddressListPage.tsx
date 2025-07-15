import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Plus, Edit, Trash2, Star, Navigation, Map } from 'lucide-react';
import { AddressService } from '@/services/address-service';
import { AddressDto } from '@/types/address';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import ConfirmLocation from '@/components/Address/ConfirmLocation';
import AddressMap from '@/components/Address/AddressMap';

const AddressListPage: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<AddressDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<AddressDto | null>(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await AddressService.getAllAddresses();
      const data = Array.isArray(response) ? response : (response as any)?.data || [];
      setAddresses(data);
      console.log('Fetched addresses:', data);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast({
        title: t('error'),
        description: t('addressesFetchFailed'),
        variant: 'destructive',
      });
      setAddresses([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!id) {
      console.warn('Tried to delete address with missing id:', id);
      return;
    }
    setDeletingId(id);
    try {
      await AddressService.deleteAddress(id);
      setAddresses(addresses.filter(addr => addr.id !== id));
      toast({
        title: t('success'),
        description: t('addressDeleted'),
      });
    } catch (error) {
      toast({
        title: t('error'),
        description: t('addressDeleteFailed'),
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{t('myAddresses')}</h1>
            <p className="text-muted-foreground">{t('manageAddresses')}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowMap(!showMap)}
              className="border-primary/20 hover:bg-primary/10"
            >
              <Map className="mr-2 h-4 w-4" />
              {showMap ? t('hideMap') : t('showMap')}
            </Button>
            <Button
              onClick={() => navigate('/addresses/new')}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              {t('addAddress')}
            </Button>
          </div>
        </div>

        {/* Map Display */}
        {showMap && addresses.length > 0 && (
          <Card className="mb-6 border-primary/20 bg-card/80 backdrop-blur-sm">
            <CardHeader className="border-b border-primary/10 bg-gradient-to-r from-primary/5 to-accent/5">
              <CardTitle className="flex items-center gap-2 text-primary">
                <Map className="h-5 w-5" />
                {t('addressesOnMap')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <AddressMap 
                addresses={addresses} 
                height="400px"
                className="rounded-b-lg"
              />
            </CardContent>
          </Card>
        )}

        {(addresses || []).length === 0 ? (
          <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">{t('noAddresses')}</h3>
              <p className="text-muted-foreground mb-6">{t('noAddressesDescription')}</p>
              <Button
                onClick={() => navigate('/addresses/new')}
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                >
                <Plus className="mr-2 h-4 w-4" />
                {t('addFirstAddress')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {(addresses || []).map((address) => (
              <Card key={address.id} className="border-primary/20 bg-card/80 backdrop-blur-sm hover:border-primary/40 transition-colors">
                <CardHeader className="border-b border-primary/10 bg-gradient-to-r from-primary/5 to-accent/5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-primary">
                      <MapPin className="h-5 w-5" />
                      {address.addressName || address.street}
                      {address.isForMe && (
                        <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">
                          <Star className="mr-1 h-3 w-3" />
                          {t('default')}
                        </Badge>
                      )}
                    </CardTitle>
                    <div className="flex gap-2">
                    <Button
                          variant="outline"
                          size="sm"
                        className="border-primary/20 hover:bg-primary/10"
                        onClick={() => {
                            if (!address.id) {
                              console.warn('Tried to open ConfirmLocation for address with missing id:', address);
                              return;
                            }
                            setSelectedAddress(address);
                            setConfirmDialogOpen(true);
                          }}
                        >
                          <Navigation className="h-4 w-4" />
                        </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/addresses/edit/${address.id}`)}
                        className="border-primary/20 hover:bg-primary/10"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                       
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-destructive/20 hover:bg-destructive/10 text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent dir={isRTL ? 'rtl' : 'ltr'}>
                          <AlertDialogHeader className={isRTL ? 'text-right' : 'text-left'}>
                            <AlertDialogTitle className={isRTL ? 'text-right' : 'text-left'}>{t('deleteAddress')}</AlertDialogTitle>
                            <AlertDialogDescription className={isRTL ? 'text-right' : 'text-left'}>
                              {t('deleteAddressConfirmation')}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                          <AlertDialogAction
                              onClick={() => handleDelete(address.id!)}
                              disabled={deletingId === address.id}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              {deletingId === address.id ? t('deleting') : t('delete')}
                            </AlertDialogAction>
                            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-foreground space-y-3">
                    {/* Address Marker with City, Street, and Famous Sign */}
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        {/* City Name */}
                        {address.city &&  (
                          <p className="font-semibold text-primary text-sm mb-1">
                            {address.city.name}
                          </p>
                        )}
                        {/* Street Name */}
                        {address.street && (
                          <p className="font-medium text-foreground">
                            {address.street}
                          </p>
                        )}
                        {/* Famous Sign */}
                        {address.famousSign && (
                          <p className="text-sm text-muted-foreground mt-1">
                            🏷️ {address.famousSign}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Building Details */}
                    {(address.buildingNo || address.floorNo || address.flatNo) && (
                      <div className="text-sm text-muted-foreground space-y-1">
                        {address.buildingNo && (
                          <p>{t('building')}: {address.buildingNo}</p>
                        )}
                        {address.floorNo && (
                          <p>{t('floor')}: {address.floorNo}</p>
                        )}
                        {address.flatNo && (
                          <p>{t('flat')}: {address.flatNo}</p>
                        )}
                      </div>
                    )}
                   
                    {/* Notes */}
                    {address.notes && (
                      <div className="text-sm text-muted-foreground mt-3 p-3 bg-muted/50 rounded-lg">
                        <p className="flex items-start gap-2">
                          <span className="text-lg">📝</span>
                          <span>{address.notes}</span>
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      {/* Confirm Location Dialog */}
      {selectedAddress && (
        <ConfirmLocation
          address={selectedAddress}
          isOpen={confirmDialogOpen}
          onClose={() => setConfirmDialogOpen(false)}
          onConfirm={(addressId) => {
            setConfirmDialogOpen(false);
            fetchAddresses();
          }}
        />
      )}
    </div>
  );
};

export default AddressListPage;