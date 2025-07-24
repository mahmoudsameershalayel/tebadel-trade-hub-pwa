import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Lock, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { fcmService } from '@/services/fcm-service';
import { ProfileService } from '@/services/profile-service';

const countryOptions = [
  { code: '+970', flag: '🇵🇸' },
  // Add more as needed
];

function stripLeadingZero(phone: string) {
  return phone.replace(/^0+/, '');
}

const LoginForm = () => {
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+970');
  const [password, setPassword] = useState('');
  const { login, state } = useAuth();
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(countryCode + stripLeadingZero(phone), password);
      // After login, check if FCM token exists, if not, subscribe
      let profile;
      try {
        profile = await ProfileService.getProfile();
      } catch (err) {
        toast.error('Failed to fetch user profile: ' + (err?.message || 'Unknown error'));
      }
      if (profile && !profile.fcmToken) {
        try {
          const subscribed = await fcmService.subscribe();
          if (!subscribed) {
            // This branch is now unreachable, but keep for safety
            toast.error('Failed to subscribe to notifications. Please check your browser settings or try again.');
          }
        } catch (err) {
          toast.error('Subscription error: ' + (err?.message || JSON.stringify(err) || 'Unknown error'));
        }
      }
      toast.success(t('auth.loginSuccess') || 'Login successful!');
      navigate('/');
    } catch (error) {
      toast.error(t('auth.loginError') || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <Card className="w-full max-w-md border-0 shadow-xl bg-white/95 backdrop-blur-sm">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="from-amber-500 to-orange-500 p-3 rounded-full">
            <img src="/img/logo.png" alt={t('app.mainTitle')} className="h-12 w-12" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900">{t('auth.welcome')}</CardTitle>
        <CardDescription className="text-gray-600">{t('auth.subtitle')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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

          <div className="space-y-2">
            <Label htmlFor="password">{t('auth.password')}</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-amber-500 rtl:left-auto rtl:right-3" />
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
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold shadow-md"
            disabled={state.isLoading}
          >
            {state.isLoading ? t('common.loading') : t('auth.loginButton')}
          </Button>
        </form>

        <div className="text-center space-y-2">
          <Link
            to="/forgot-password"
            className="text-sm text-amber-600 hover:text-orange-700 transition-colors font-medium block"
          >
            {t('auth.forgotPassword')}
          </Link>
          <Link
            to="/register"
            className="text-sm text-amber-600 hover:text-orange-700 transition-colors font-medium block"
          >
            {t('auth.switchToRegister')}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
