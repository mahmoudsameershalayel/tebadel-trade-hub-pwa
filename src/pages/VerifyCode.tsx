import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { verifyCode, sendVerificationCode } from '@/services/forgot-password-service';

const VerifyCode = () => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  
  const phoneNumber = location.state?.phoneNumber;

  React.useEffect(() => {
    if (!phoneNumber) {
      navigate('/forgot-password');
    }
  }, [phoneNumber, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error(t('verifyCode.codeRequired') || 'Verification code is required');
      return;
    }

    setIsLoading(true);
    try {
      await verifyCode({ phoneNumber, code });
      toast.success(t('verifyCode.codeVerified') || 'Code verified successfully!');
      navigate('/reset-password', { state: { phoneNumber, verificationCode: code } });
    } catch (error: any) {
      toast.error(error?.message || t('verifyCode.verifyError') || 'Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      await sendVerificationCode({ phoneNumber });
      toast.success(t('verifyCode.codeResent') || 'Verification code resent successfully!');
    } catch (error: any) {
      toast.error(error?.message || t('verifyCode.resendError') || 'Failed to resend verification code');
    } finally {
      setIsResending(false);
    }
  };

  if (!phoneNumber) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-3 rounded-full">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {t('verifyCode.title')}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {t('verifyCode.subtitle').replace('{phone}', phoneNumber)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">{t('verifyCode.codeLabel')}</Label>
                <Input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="text-center text-lg tracking-widest"
                  placeholder="123456"
                  maxLength={6}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold shadow-md"
                disabled={isLoading || code.length !== 6}
              >
                {isLoading ? t('common.loading') : t('verifyCode.verifyButton')}
              </Button>
            </form>

            <div className="text-center space-y-2">
              <Button
                variant="ghost"
                onClick={handleResendCode}
                disabled={isResending}
                className="text-amber-600 hover:text-orange-700"
              >
                {isResending ? t('common.loading') : t('verifyCode.resendCode')}
              </Button>
              
              <div>
                <Link
                  to="/forgot-password"
                  className="inline-flex items-center text-sm text-amber-600 hover:text-orange-700 transition-colors font-medium"
                >
                  <ArrowLeft className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0 rtl:rotate-180" />
                  {t('verifyCode.backToPhone')}
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyCode;