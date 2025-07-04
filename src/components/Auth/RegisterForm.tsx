<<<<<<< HEAD
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { RegisterPayload } from '@/contexts/AuthContext';
=======

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
>>>>>>> 6b4ebf695d15464c4e1cdd6c4f7f175b7a56f4c5
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
<<<<<<< HEAD
import { Package, Mail, Lock, User, Phone } from 'lucide-react';
import { toast } from 'sonner';

const RegisterForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const { register, state } = useAuth();
  const { t, isRTL } = useLanguage();
=======
import { Package, Mail, Lock, User } from 'lucide-react';
import { toast } from 'sonner';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, state } = useAuth();
  const { t } = useLanguage();
>>>>>>> 6b4ebf695d15464c4e1cdd6c4f7f175b7a56f4c5
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
<<<<<<< HEAD
      await register({ firstName, lastName, phone, password });
      toast.success(t('auth.registerSuccess'));
      navigate('/');
    } catch (error) {
      toast.error(t('auth.registerError'));
=======
      await register(name, email, password);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
>>>>>>> 6b4ebf695d15464c4e1cdd6c4f7f175b7a56f4c5
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
<<<<<<< HEAD
              <Label htmlFor="firstName">{t('auth.firstName')}</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400 rtl:left-auto rtl:right-3" />
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="ltr:pl-10 rtl:pr-10 rtl:pl-3 ltr:pr-3"
                  placeholder={t('auth.firstNameHolder')}
=======
              <Label htmlFor="name">{t('auth.name')}</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400 rtl:left-auto rtl:right-3" />
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 rtl:pl-3 rtl:pr-10"
                  placeholder="Enter your full name"
>>>>>>> 6b4ebf695d15464c4e1cdd6c4f7f175b7a56f4c5
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
<<<<<<< HEAD
              <Label htmlFor="lastName">{t('auth.lastName')}</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400 rtl:left-auto rtl:right-3" />
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="ltr:pl-10 rtl:pr-10 rtl:pl-3 ltr:pr-3"
                  placeholder={t('auth.lastNameHolder')}
=======
              <Label htmlFor="email">{t('auth.email')}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400 rtl:left-auto rtl:right-3" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 rtl:pl-3 rtl:pr-10"
                  placeholder="Enter your email"
>>>>>>> 6b4ebf695d15464c4e1cdd6c4f7f175b7a56f4c5
                  required
                />
              </div>
            </div>
<<<<<<< HEAD

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

=======
            
>>>>>>> 6b4ebf695d15464c4e1cdd6c4f7f175b7a56f4c5
            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 rtl:left-auto rtl:right-3" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
<<<<<<< HEAD
                  className="ltr:pl-10 rtl:pr-10 rtl:pl-3 ltr:pr-3"
                  placeholder={t('auth.passwordHolder')}
=======
                  className="pl-10 rtl:pl-3 rtl:pr-10"
                  placeholder="Enter your password"
>>>>>>> 6b4ebf695d15464c4e1cdd6c4f7f175b7a56f4c5
                  required
                />
              </div>
            </div>

<<<<<<< HEAD
            <Button
              type="submit"
=======
            <Button 
              type="submit" 
>>>>>>> 6b4ebf695d15464c4e1cdd6c4f7f175b7a56f4c5
              className="w-full"
              disabled={state.isLoading}
            >
              {state.isLoading ? t('common.loading') : t('auth.registerButton')}
            </Button>
          </form>

          <div className="text-center">
<<<<<<< HEAD
            <Link
              to="/login"
=======
            <Link 
              to="/login" 
>>>>>>> 6b4ebf695d15464c4e1cdd6c4f7f175b7a56f4c5
              className="text-sm text-emerald-600 hover:text-emerald-700 transition-colors"
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
