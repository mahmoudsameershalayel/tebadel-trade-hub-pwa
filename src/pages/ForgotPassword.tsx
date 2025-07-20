import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { sendVerificationCode } from '@/services/forgot-password-service';

const ForgotPassword = () => {
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      toast.error(t('forgotPassword.phoneRequired') || 'Phone number is required');
      return;
    }

    setIsLoading(true);
    try {
      await sendVerificationCode({ phoneNumber: phone });
      toast.success(t('forgotPassword.codeSent') || 'Verification code sent successfully!');
      navigate('/verify-code', { state: { phoneNumber: phone } });
    } catch (error: any) {
      toast.error(error?.message || t('forgotPassword.sendError') || 'Failed to send verification code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-3 rounded-full">
                <Phone className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {t('forgotPassword.title')}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {t('forgotPassword.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">{t('auth.phone')}</Label>
                <div className="relative">
                  <Phone className="absolute top-1/2 transform -translate-y-1/2 text-amber-500 rtl:right-3 ltr:left-3 h-5 w-5" />
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="ltr:pl-10 rtl:pr-10 rtl:pl-3 ltr:pr-3"
                    placeholder={t('auth.phoneHolder')}
                    required
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold shadow-md"
                disabled={isLoading}
              >
                {isLoading ? t('common.loading') : t('forgotPassword.sendCode')}
              </Button>
            </form>

            <div className="text-center">
              <Link
                to="/login"
                className="inline-flex items-center text-sm text-amber-600 hover:text-orange-700 transition-colors font-medium"
              >
                <ArrowLeft className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0 rtl:rotate-180" />
                {t('forgotPassword.backToLogin')}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;