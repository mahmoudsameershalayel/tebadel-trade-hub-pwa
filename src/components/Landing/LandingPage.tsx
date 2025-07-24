
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Package, Users, Shield, Zap, Star, Phone, Mail, MessageSquare, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import LandingSubscriptionSection from './LandingSubscriptionSection';

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

  const services = [
    {
      title: t('landing.services.direct.title'),
      description: t('landing.services.direct.description'),
      icon: '🔄'
    },
    {
      title: t('landing.services.money.title'),
      description: t('landing.services.money.description'),
      icon: '💰'
    },
    {
      title: t('landing.services.secure.title'),
      description: t('landing.services.secure.description'),
      icon: '🛡️'
    },
    {
      title: t('landing.services.community.title'),
      description: t('landing.services.community.description'),
      icon: '👥'
    }
  ];

  const testimonials = [
    {
      name: t('landing.testimonials.user1.name'),
      text: t('landing.testimonials.user1.text'),
      rating: 5
    },
    {
      name: t('landing.testimonials.user2.name'),
      text: t('landing.testimonials.user2.text'),
      rating: 5
    },
    {
      name: t('landing.testimonials.user3.name'),
      text: t('landing.testimonials.user3.text'),
      rating: 5
    }
  ];

  const faqs = [
    {
      question: t('landing.faq.q1.question'),
      answer: t('landing.faq.q1.answer')
    },
    {
      question: t('landing.faq.q2.question'),
      answer: t('landing.faq.q2.answer')
    },
    {
      question: t('landing.faq.q3.question'),
      answer: t('landing.faq.q3.answer')
    },
    {
      question: t('landing.faq.q4.question'),
      answer: t('landing.faq.q4.answer')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 rounded-full text-sm font-medium mb-8 border border-amber-200">
            <Package className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {t('landing.badge')}
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {t('landing.heroTitle')}
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">{t('landing.heroTitleHighlight')}</span>
          </h1>
          
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            {t('landing.heroSubtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" asChild className="text-lg px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
              <Link to="/register">
                {t('landing.getStarted')}
                <ArrowRight className="ml-2 h-5 w-5 rtl:ml-0 rtl:mr-2 rtl:rotate-180" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="text-lg px-8 py-4 border-amber-300 text-amber-800 hover:bg-amber-50">
              <Link to="/login">{t('landing.signIn')}</Link>
            </Button>
          </div>
          
          {/* Hero Image - Arabic Cultural Theme */}
          <div className="relative max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-6 border border-amber-100 overflow-hidden">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1466442929976-97f336a657be?w=1000&h=500&fit=crop"
                  alt="Traditional marketplace representing trade and exchange"
                  className="w-full h-72 sm:h-96 object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="text-lg font-semibold mb-2">{t('landing.message')}</p>
                </div>
              </div>
            </div>
            {/* Decorative Arabic Pattern */}
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full opacity-20 -z-10"></div>
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-br from-orange-200 to-red-200 rounded-full opacity-20 -z-10"></div>
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
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-amber-50">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 text-amber-700 rounded-full mb-4">
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

      {/* Services Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t('landing.servicesTitle')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('landing.servicesSubtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4 rtl:space-x-reverse">
                    <div className="text-4xl mb-4">{service.icon}</div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-r from-amber-600 to-orange-600">
        <div className="max-w-7xl mx-auto text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-white">
              <div className="text-5xl font-bold mb-2">10K+</div>
              <div className="text-amber-100 text-lg">{t('landing.stats.traders')}</div>
            </div>
            <div className="text-white">
              <div className="text-5xl font-bold mb-2">50K+</div>
              <div className="text-amber-100 text-lg">{t('landing.stats.items')}</div>
            </div>
            <div className="text-white">
              <div className="text-5xl font-bold mb-2">98%</div>
              <div className="text-amber-100 text-lg">{t('landing.stats.success')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t('landing.testimonialsTitle')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('landing.testimonialsSubtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg bg-gradient-to-br from-white to-amber-50">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-amber-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t('landing.faqTitle')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('landing.faqSubtitle')}
            </p>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="bg-white border-0 shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <CheckCircle className="h-5 w-5 text-amber-600 mr-3 rtl:ml-3 rtl:mr-0" />
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mr-8 rtl:ml-8 rtl:mr-0">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Plans Section */}
      <LandingSubscriptionSection />

      {/* Contact Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t('landing.contactTitle')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('landing.contactSubtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="flex-shrink-0">
                      <Phone className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('landing.contact.phone')}</h3>
                      <p className="text-gray-600 text-right">+970594857483</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="flex-shrink-0">
                      <Mail className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('landing.contact.email')}</h3>
                      <p className="text-gray-600">info@tebadel.com</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="flex-shrink-0">
                      <MessageSquare className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('landing.contact.support')}</h3>
                      <p className="text-gray-600">{t('landing.contact.supportHours')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Contact Form */}
            <Card className="border-0 shadow-xl">
              <CardContent className="p-8">
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('landing.contact.form.name')}
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder={t('landing.contact.form.namePlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('landing.contact.form.email')}
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder={t('landing.contact.form.emailPlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('landing.contact.form.message')}
                    </label>
                    <textarea
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                      placeholder={t('landing.contact.form.messagePlaceholder')}
                    ></textarea>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-3"
                  >
                    {t('landing.contact.form.send')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-r from-amber-600 to-orange-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {t('landing.ctaTitle')}
          </h2>
          <p className="text-xl text-amber-100 mb-8">
            {t('landing.ctaSubtitle')}
          </p>
          <Button size="lg" asChild className="text-lg px-8 py-4 bg-white text-amber-700 hover:bg-amber-50">
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
