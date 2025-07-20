import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { resetPassword } from '@/services/forgot-password-service';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  
  const phoneNumber = location.state?.phoneNumber;
  const verificationCode = location.state?.verificationCode;

  React.useEffect(() => {
    if (!phoneNumber || !verificationCode) {
      navigate('/forgot-password');
    }
  }, [phoneNumber, verificationCode, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      toast.error(t('resetPassword.fillAllFields') || 'Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(t('resetPassword.passwordMismatch') || 'Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error(t('resetPassword.passwordTooShort') || 'Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword({ phoneNumber, newPassword });
      toast.success(t('resetPassword.resetSuccess') || 'Password reset successfully!');
      navigate('/login');
    } catch (error: any) {
      toast.error(error?.message || t('resetPassword.resetError') || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  if (!phoneNumber || !verificationCode) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-3 rounded-full">
                <Lock className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {t('resetPassword.title')}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {t('resetPassword.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">{t('resetPassword.newPassword')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-amber-500 rtl:left-auto rtl:right-3" />
                  <Input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10 pr-10 rtl:pl-10 rtl:pr-10"
                    placeholder={t('resetPassword.passwordPlaceholder')}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 rtl:right-auto rtl:left-2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('resetPassword.confirmPassword')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-amber-500 rtl:left-auto rtl:right-3" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 rtl:pl-10 rtl:pr-10"
                    placeholder={t('resetPassword.confirmPlaceholder')}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 rtl:right-auto rtl:left-2"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold shadow-md"
                disabled={isLoading}
              >
                {isLoading ? t('common.loading') : t('resetPassword.resetButton')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;