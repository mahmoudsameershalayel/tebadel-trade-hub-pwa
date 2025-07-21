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

const countryOptions = [
  { code: '+970', flag: '🇵🇸' },
  // Add more as needed
];

function stripLeadingZero(phone: string) {
  return phone.replace(/^0+/, '');
}

const ForgotPassword = () => {
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+970');
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
      const formattedPhone = countryCode + stripLeadingZero(phone);
      await sendVerificationCode({ phoneNumber: formattedPhone });
      toast.success(t('forgotPassword.codeSent') || 'Verification code sent successfully!');
      navigate('/verify-code', { state: { phoneNumber: formattedPhone } });
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
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className="relative">
                    <select
                      value={countryCode}
                      onChange={e => setCountryCode(e.target.value)}
                      className="h-12 rounded-md border border-gray-300 bg-gray-50 px-2 pr-6 text-lg focus:outline-none appearance-none"
                      style={{ minWidth: 80, fontFamily: 'inherit' }}
                      dir="ltr"
                    >
                      {countryOptions.map(opt => (
                      <option key="+972" value="+972">
                          {opt.flag} {opt.code}
                        </option>
                      ))}
                    </select>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</span>
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`flex-1 h-12 ${isRTL ? 'text-right' : 'text-left'}`}
                    placeholder={t('auth.phoneHolder')}
                    required
                    dir={isRTL ? 'rtl' : 'ltr'}
                    style={{ borderRadius: 8 }}
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