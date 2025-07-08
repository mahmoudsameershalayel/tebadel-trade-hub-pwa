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

const RegisterForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const { register, state } = useAuth();
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ firstName, lastName, phone, password });
      toast.success(t('auth.registerSuccess'));
      navigate('/');
    } catch (error) {
      toast.error(t('auth.registerError'));
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
