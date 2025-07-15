
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Globe, User, LogOut, Settings, Package } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { state, logout } = useAuth();
  const { language, setLanguage, t, isRTL } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const getUserDisplayName = () => {
    if (state.user?.firstName && state.user?.lastName) {
      return `${state.user.firstName} ${state.user.lastName}`;
    }
    return state.user?.phone || 'User';
  };

  const NavigationLinks = ({ mobile = false, onItemClick = () => {} }) => (
    <>
      <Link
        to="/"
        className="text-gray-700 hover:text-emerald-600 transition-colors"
        onClick={onItemClick}
      >
        {t('nav.home')}
      </Link>
      {state.isAuthenticated && (
        <>
        <Link
            to="/addresses"
            className="text-gray-700 hover:text-emerald-600 transition-colors"
            onClick={onItemClick}
          >
            {t('nav.myAddresses')}
          </Link>
          <Link
            to="/my-items"
            className="text-gray-700 hover:text-emerald-600 transition-colors"
            onClick={onItemClick}
          >
            {t('nav.myItems')}
          </Link>
          
          <Link
            to="/offers"
            className="text-gray-700 hover:text-emerald-600 transition-colors"
            onClick={onItemClick}
          >
            {t('nav.offers')}
          </Link>
          <Link
            to="/messages"
            className="text-gray-700 hover:text-emerald-600 transition-colors"
            onClick={onItemClick}
          >
            {t('nav.messages')}
          </Link>
          {state.user?.role === 'admin' && (
            <Link
              to="/admin"
              className="text-gray-700 hover:text-emerald-600 transition-colors"
              onClick={onItemClick}
            >
              {t('nav.admin')}
            </Link>
          )}
        </>
      )}
    </>
  );

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse">
            <Package className="h-8 w-8 text-emerald-600" />
            <span className="text-xl font-bold text-gray-900">Tebadel</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            <NavigationLinks />
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="hidden sm:flex"
            >
              <Globe className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
              {language.toUpperCase()}
            </Button>

            {/* Auth Actions */}
            {state.isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hidden sm:flex">
                    <User className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                    {getUserDisplayName()}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={isRTL ? 'start' : 'end'}>
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <Settings className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                    {t('nav.profile')}
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                    {t('nav.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center space-x-2 rtl:space-x-reverse">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">{t('nav.login')}</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/register">{t('nav.register')}</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <NavigationLinks mobile onItemClick={() => setIsMenuOpen(false)} />
              
              <div className="flex items-center justify-between pt-4 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleLanguage}
                  className="flex sm:hidden"
                >
                  <Globe className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                  {language.toUpperCase()}
                </Button>

                {state.isAuthenticated ? (
                  <div className="flex flex-col space-y-2">
                    <span className="text-sm text-gray-600">{getUserDisplayName()}</span>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Button variant="ghost" size="sm" onClick={() => {
                        navigate('/profile');
                        setIsMenuOpen(false);
                      }}>
                        {t('nav.profile')}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={handleLogout}>
                        {t('nav.logout')}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 rtl:space-x-reverse sm:hidden">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                        {t('nav.login')}
                      </Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                        {t('nav.register')}
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
