import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Mail, Lock, Phone } from 'lucide-react';
import { toast } from 'sonner';

const LoginForm = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const { login, state } = useAuth();
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(phone, password);
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-emerald-100 p-3 rounded-full">
              <Package className="h-8 w-8 text-emerald-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">{t('auth.welcome')}</CardTitle>
          <CardDescription>{t('auth.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">{t('auth.phone')}</Label>
              <div className="relative">
                <Phone className="absolute top-1/2 transform -translate-y-1/2 text-gray-400 rtl:right-3 ltr:left-3 h-5 w-5" />
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="ltr:pl-10 rtl:pr-10 rtl:pl-3 ltr:pr-3"
                  placeholder={t('auth.phoneHolder')}
                  required
                  dir={isRTL ? "rtl" : "ltr"}

                />
              </div>

            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 rtl:left-auto rtl:right-3" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 rtl:pl-3 rtl:pr-10"
                  placeholder={t('auth.passwordHandler')}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={state.isLoading}
            >
              {state.isLoading ? t('common.loading') : t('auth.loginButton')}
            </Button>
          </form>

          <div className="text-center">
            <Link
              to="/register"
              className="text-sm text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              {t('auth.switchToRegister')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
