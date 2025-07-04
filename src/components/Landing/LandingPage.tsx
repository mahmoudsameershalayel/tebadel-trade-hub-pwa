
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Package, Users, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const LandingPage = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Package,
      title: t('landing.feature1.title'),
      description: t('landing.feature1.description'),
    },
    {
      icon: Users,
      title: t('landing.feature2.title'),
      description: t('landing.feature2.description'),
    },
    {
      icon: Shield,
      title: t('landing.feature3.title'),
      description: t('landing.feature3.description'),
    },
    {
      icon: Zap,
      title: t('landing.feature4.title'),
      description: t('landing.feature4.description'),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium mb-8">
            <Package className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {t('landing.badge')}
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {t('landing.heroTitle')}
            <span className="text-emerald-600">{t('landing.heroTitleHighlight')}</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            {t('landing.heroSubtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" asChild className="text-lg px-8 py-4">
              <Link to="/register">
                {t('landing.getStarted')}
                <ArrowRight className="ml-2 h-5 w-5 rtl:ml-0 rtl:mr-2 rtl:rotate-180" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="text-lg px-8 py-4">
              <Link to="/login">{t('landing.signIn')}</Link>
            </Button>
          </div>
          
          {/* Hero Image */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border">
              <img
                src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=400&fit=crop"
                alt="Person using laptop for trading"
                className="w-full h-64 sm:h-80 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t('landing.featuresTitle')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('landing.featuresSubtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mb-4">
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-emerald-600">
        <div className="max-w-7xl mx-auto text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-emerald-100">{t('landing.stats.traders')}</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-emerald-100">{t('landing.stats.items')}</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-emerald-100">{t('landing.stats.success')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t('landing.ctaTitle')}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {t('landing.ctaSubtitle')}
          </p>
          <Button size="lg" asChild className="text-lg px-8 py-4">
            <Link to="/register">
              {t('landing.ctaButton')}
              <ArrowRight className="ml-2 h-5 w-5 rtl:ml-0 rtl:mr-2 rtl:rotate-180" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
