import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AddressService } from '@/services/address-service';
import { AddressDto } from '@/types/address';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import AddressForm from '@/components/Address/AddressForm';

const AddressEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [address, setAddress] = useState<AddressDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchAddress(parseInt(id));
    }
  }, [id]);

  const fetchAddress = async (addressId: number) => {
    try {
      const data = await AddressService.getAddressById(addressId);
      setAddress(data);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!address) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">{t('addressNotFound')}</p>
        </div>
      </div>
    );
  }

  return <AddressForm address={address} />;
};

export default AddressEditPage;