import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Save, ArrowLeft } from 'lucide-react';
import { AddressService } from '@/services/address-service';
import { Address, AddressForCreateUpdateDto } from '@/types/address';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'Zip code is required'),
  country: z.string().min(1, 'Country is required'),
  isDefault: z.boolean(),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface AddressFormProps {
  address?: Address;
  onSave?: () => void;
}

const AddressForm: React.FC<AddressFormProps> = ({ address, onSave }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: address?.street || '',
      city: address?.city || '',
      state: address?.state || '',
      zipCode: address?.zipCode || '',
      country: address?.country || '',
      isDefault: address?.isDefault || false,
    },
  });

  const onSubmit = async (data: AddressFormData) => {
    setIsLoading(true);
    try {
      const addressData: AddressForCreateUpdateDto = {
        street: data.street,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country,
        isDefault: data.isDefault,
        ...(address && { id: address.id }),
      };

      if (address) {
        await AddressService.updateAddress(addressData);
        toast({
          title: t('success'),
          description: t('addressUpdated'),
        });
      } else {
        await AddressService.createAddress(addressData);
        toast({
          title: t('success'),
          description: t('addressCreated'),
        });
      }

      onSave?.();
      navigate('/addresses');
    } catch (error) {
      toast({
        title: t('error'),
        description: address ? t('addressUpdateFailed') : t('addressCreateFailed'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/addresses')}
            className="text-primary hover:text-primary/80"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('back')}
          </Button>
          <h1 className="text-2xl font-bold text-foreground">
            {address ? t('editAddress') : t('addAddress')}
          </h1>
        </div>

        <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
          <CardHeader className="border-b border-primary/10 bg-gradient-to-r from-primary/5 to-accent/5">
            <CardTitle className="flex items-center gap-2 text-primary">
              <MapPin className="h-5 w-5" />
              {t('addressDetails')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('street')}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={t('streetPlaceholder')} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('city')}</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder={t('cityPlaceholder')} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('state')}</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder={t('statePlaceholder')} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('zipCode')}</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder={t('zipCodePlaceholder')} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('country')}</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder={t('countryPlaceholder')} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="isDefault"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border border-primary/20 p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">{t('defaultAddress')}</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          {t('defaultAddressDescription')}
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/addresses')}
                    className="flex-1"
                  >
                    {t('cancel')}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-primary to-accent text-primary-foreground"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading ? t('saving') : t('save')}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddressForm;