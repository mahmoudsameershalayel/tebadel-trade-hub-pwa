import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Plus, Edit, Trash2, Star, Navigation } from 'lucide-react';
import { AddressService } from '@/services/address-service';
import { Address } from '@/types/address';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const AddressListPage: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const data = await AddressService.getAllAddresses();
      setAddresses(data);
    } catch (error) {
      toast({
        title: t('error'),
        description: t('addressesFetchFailed'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
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

  const handleConfirmLocation = async (address: Address) => {
    if (address.latitude && address.longitude) {
      try {
        await AddressService.confirmLocation({
          addressId: address.id,
          latitude: address.latitude,
          longitude: address.longitude,
        });
        toast({
          title: t('success'),
          description: t('locationConfirmed'),
        });
      } catch (error) {
        toast({
          title: t('error'),
          description: t('locationConfirmFailed'),
          variant: 'destructive',
        });
      }
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
          <Button
            onClick={() => navigate('/addresses/new')}
            className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90"
          >
            <Plus className="mr-2 h-4 w-4" />
            {t('addAddress')}
          </Button>
        </div>

        {addresses.length === 0 ? (
          <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">{t('noAddresses')}</h3>
              <p className="text-muted-foreground mb-6">{t('noAddressesDescription')}</p>
              <Button
                onClick={() => navigate('/addresses/new')}
                className="bg-gradient-to-r from-primary to-accent text-primary-foreground"
              >
                <Plus className="mr-2 h-4 w-4" />
                {t('addFirstAddress')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {addresses.map((address) => (
              <Card key={address.id} className="border-primary/20 bg-card/80 backdrop-blur-sm hover:border-primary/40 transition-colors">
                <CardHeader className="border-b border-primary/10 bg-gradient-to-r from-primary/5 to-accent/5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-primary">
                      <MapPin className="h-5 w-5" />
                      {address.street}
                      {address.isDefault && (
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
                        onClick={() => navigate(`/addresses/edit/${address.id}`)}
                        className="border-primary/20 hover:bg-primary/10"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {address.latitude && address.longitude && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleConfirmLocation(address)}
                          className="border-accent/20 hover:bg-accent/10"
                        >
                          <Navigation className="h-4 w-4" />
                        </Button>
                      )}
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
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t('deleteAddress')}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {t('deleteAddressConfirmation')}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(address.id)}
                              disabled={deletingId === address.id}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              {deletingId === address.id ? t('deleting') : t('delete')}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-foreground">
                    <p className="font-medium">{address.city}, {address.state}</p>
                    <p className="text-muted-foreground">{address.zipCode}, {address.country}</p>
                    {address.latitude && address.longitude && (
                      <p className="text-sm text-accent mt-2">
                        📍 {address.latitude.toFixed(6)}, {address.longitude.toFixed(6)}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressListPage;