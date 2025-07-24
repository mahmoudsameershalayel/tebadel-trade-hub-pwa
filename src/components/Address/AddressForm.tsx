import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Save, ArrowLeft } from 'lucide-react';
import { AddressService } from '@/services/address-service';
import { AddressDto, AddressForCreateUpdateDto } from '@/types/address';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface City {
  id: number;
  name: string;
}

interface AddressFormProps {
  address?: AddressDto;
  onSave?: () => void;
  onCancel?: () => void;
}

const AddressForm: React.FC<AddressFormProps> = ({ address, onSave, onCancel }) => {
  const { t, isRTL } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    AddressService.getAllCities()
      .then(cityList => setCities(cityList))
      .catch(() => setCities([]));
  }, []);

  // Create schema with localized error messages
  const addressSchema = z.object({
    addressName: z.string().min(1, t('addressName') + ' ' + t('common.required')),
    cityId: z.number({ required_error: t('city') + ' ' + t('common.required') }),
    street: z.string().optional(),
    famousSign: z.string().optional(),
  });

    const form = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      addressName: address?.addressName || '',
      cityId: address?.cityId || undefined,
      street: address?.street || '',
      famousSign: address?.famousSign || '',
    },
  });

  // Reset form values when address changes (for edit mode and add mode)
  useEffect(() => {
    form.reset({
      addressName: address?.addressName || '',
      cityId: (address?.city?.id ?? address?.cityId) || undefined,
      street: address?.street || '',
      famousSign: address?.famousSign || '',
    });
  }, [address]);

  const onSubmit = async (data: z.infer<typeof addressSchema>) => {
    setIsLoading(true);
    try {
      const addressData: AddressForCreateUpdateDto = {
        addressName: data.addressName,
        cityId: data.cityId,
        street: data.street,
        famousSign: data.famousSign,
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

      if (onSave) {
        onSave();
      } else {
        navigate('/addresses');
      }
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
        <div className={`mb-6 flex justify-between items-center gap-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/addresses')}
            className={`text-primary hover:text-primary/80 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t('back')}
          </Button>
          <h1 className={`text-2xl font-bold text-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
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
                  name="addressName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('addressName')}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={t('addressNamePlaceholder')} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* City select dropdown */}
                <FormField
                  control={form.control}
                  name="cityId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('city')}</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value ? String(field.value) : ''}
                          onValueChange={val => field.onChange(val ? Number(val) : undefined)}
                          disabled={isLoading || cities.length === 0}
                        >
                          <SelectTrigger className={isRTL ? 'rtl' : ''} dir={isRTL ? 'rtl' : 'ltr'}>
                            <SelectValue placeholder={t('selectCity')} />
                          </SelectTrigger>
                          <SelectContent className={isRTL ? 'rtl' : ''} dir={isRTL ? 'rtl' : 'ltr'}>
                            {cities.map(city => (
                              <SelectItem key={city.id} value={String(city.id)}>{city.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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

                <FormField
                  control={form.control}
                  name="famousSign"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('famousSign')}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={t('famousSignPlaceholder')} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel ? onCancel : () => navigate('/addresses')}
                    className="flex-1"
                  >
                    {t('cancel')}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
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