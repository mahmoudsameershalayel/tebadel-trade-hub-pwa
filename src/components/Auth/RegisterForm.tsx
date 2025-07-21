import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { RegisterPayload } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Lock, User, Phone } from 'lucide-react';
import { toast } from 'sonner';

const countryOptions = [
  { code: '+970', flag: '🇵🇸' },
  // Add more as needed
];

function stripLeadingZero(phone: string) {
  return phone.replace(/^0+/, '');
}

const RegisterForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+970');
  const [password, setPassword] = useState('');
  const { register, state } = useAuth();
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ firstName, lastName, phone: countryCode + stripLeadingZero(phone), password });
      toast.success(t('auth.registerSuccess'));
      console.log('Registration and auto-login succeeded, redirecting...');
      setTimeout(() => {
        console.log('Navigating to /');
        navigate('/');
      }, 1000);
    } catch (error) {
      console.error('Registration or auto-login failed:', error);
      toast.error(error.result?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 px-4">
      <Card className="w-full max-w-md border-0 shadow-xl bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-3 rounded-full">
              <Package className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">{t('auth.welcome')}</CardTitle>
          <CardDescription className="text-gray-600">{t('auth.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">{t('auth.firstName')}</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-amber-500 rtl:left-auto rtl:right-3" />
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="ltr:pl-10 rtl:pr-10 rtl:pl-3 ltr:pr-3"
                  placeholder={t('auth.firstNameHolder')}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">{t('auth.lastName')}</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-amber-500 rtl:left-auto rtl:right-3" />
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="ltr:pl-10 rtl:pr-10 rtl:pl-3 ltr:pr-3"
                  placeholder={t('auth.lastNameHolder')}
                  required
                />
              </div>
            </div>

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

            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-amber-500 rtl:left-auto rtl:right-3" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="ltr:pl-10 rtl:pr-10 rtl:pl-3 ltr:pr-3"
                  placeholder={t('auth.passwordHolder')}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold shadow-md"
              disabled={state.isLoading}
            >
              {state.isLoading ? t('common.loading') : t('auth.registerButton')}
            </Button>
          </form>

          <div className="text-center">
            <Link
              to="/login"
              className="text-sm text-amber-600 hover:text-orange-700 transition-colors font-medium"
            >
              {t('auth.switchToLogin')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterForm;
