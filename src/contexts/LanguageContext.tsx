import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  language: 'en' | 'ar';
  setLanguage: (lang: 'en' | 'ar') => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.myItems': 'My Items',
    'nav.offers': 'Trade Offers',
    'nav.messages': 'Messages',
    'nav.profile': 'Profile',
    'nav.admin': 'Admin',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.logout': 'Logout',

    // Auth
    'auth.welcome': 'Welcome to Tebadel',
    'auth.subtitle': 'Trade items with or without money',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.phone': 'Phone Number',
    'auth.phoneHolder': 'Enter phone number',
    'auth.passwordHandler': 'Enter password',
    'auth.name': 'Full Name',
    'auth.firstName': 'First Name',
    'auth.lastName': 'Last Name',
    'auth.loginButton': 'Sign In',
    'auth.registerButton': 'Create Account',
    'auth.switchToRegister': "Don't have an account? Sign up",
    'auth.switchToLogin': 'Already have an account? Sign in',
    'auth.firstNameHolder': 'Enter your first name',
    'auth.lastNameHolder': 'Enter your last name',
    'auth.passwordHolder': 'Enter your password',
    'auth.registerSuccess': 'Account created successfully!',
    'auth.registerError': 'Registration failed. Please try again.',

    // Landing Page
    'landing.badge': 'The Future of Exchange',
    'landing.heroTitle': 'Trade Items,',
    'landing.heroTitleHighlight': ' with Optional Money Difference',
    'landing.heroSubtitle': 'The modern barter platform: trade what you don not need for what you want — with the option to add or receive a money difference.',
    'landing.getStarted': 'Get Started Free',
    'landing.signIn': 'Sign In',
    'landing.featuresTitle': 'Why Choose Tebadel?',
    'landing.featuresSubtitle': 'Experience the easiest and safest way to trade items — with optional cash difference when needed.',
    'landing.feature1.title': 'Trade Anything',
    'landing.feature1.description': 'Exchange items without direct selling — and add or receive a money difference if necessary.',
    'landing.feature2.title': 'Safe Community',
    'landing.feature2.description': 'Join a trusted community of traders with verified profiles and ratings.',
    'landing.feature3.title': 'Secure Trading',
    'landing.feature3.description': 'Protected transactions with built-in dispute resolution and support.',
    'landing.feature4.title': 'Instant Matching',
    'landing.feature4.description': 'Smart algorithm matches you with traders who want what you have.',
    'landing.stats.traders': 'Active Traders',
    'landing.stats.items': 'Items Traded',
    'landing.stats.success': 'Success Rate',
    'landing.ctaTitle': 'Ready to Start Trading?',
    'landing.ctaSubtitle': 'Join our community today and discover the joy of sustainable trading.',
    'landing.ctaButton': 'Create Your Account',
    'landing.message': 'With Tabaadl, money is optional — only when you need it.',

    // Items
    'items.title': 'Available Items',
    'items.search': 'Search items...',
    'items.category': 'Category',
    'items.allCategories': 'All Categories',
    'items.postNew': 'Post New Item',
    'items.myItems': 'My Items',
    'items.noItems': 'No items found',

    // Trading & Money Difference
    'trade.makeOffer': 'Make Offer',
    'trade.moneyDifference': 'Money Difference',
    'trade.addMoney': 'Add Money',
    'trade.receiveMoney': 'Receive Money',
    'trade.amount': 'Amount',
    'trade.currency': 'Currency',
    'trade.offerDetails': 'Offer Details',
    'trade.yourItem': 'Your Item',
    'trade.theirItem': 'Their Item',
    'trade.moneyFromYou': 'Money from you',
    'trade.moneyToYou': 'Money to you',
    'trade.sendOffer': 'Send Offer',
    'trade.acceptOffer': 'Accept Offer',
    'trade.rejectOffer': 'Reject Offer',
    'trade.counterOffer': 'Counter Offer',
    'trade.negotiate': 'Negotiate',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Something went wrong',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.send': 'Send',
    'common.accept': 'Accept',
    'common.reject': 'Reject',
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.myItems': 'عناصري',
    'nav.offers': 'عروض التبادل',
    'nav.messages': 'الرسائل',
    'nav.profile': 'الملف الشخصي',
    'nav.admin': 'إدارة',
    'nav.login': 'تسجيل الدخول',
    'nav.register': 'إنشاء حساب',
    'nav.logout': 'تسجيل خروج',

    // Auth
    'auth.welcome': 'مرحباً بك في تبادل',
    'auth.subtitle': 'تبادل الأشياء مع أو بدون نقود',
    'auth.email': 'البريد الإلكتروني',
    'auth.phone': 'رقم الجوال',
    'auth.phoneHolder': 'ادخل رقم الجوال',
    'auth.password': 'كلمة المرور',
    'auth.passwordHandler': 'ادخل كلمة المرور',
    'auth.name': 'الاسم الكامل',
    'auth.firstName': 'الإسم الأول',
    'auth.lastName': 'إسم العائلة',
    'auth.registerButton': 'إنشاء حساب',
    'auth.switchToRegister': 'ليس لديك حساب؟ سجل الآن',
    'auth.switchToLogin': 'لديك حساب؟ سجل دخولك',
    'auth.firstNameHolder': 'ادخل الاسم الأول',
    'auth.lastNameHolder': 'ادخل اسم العائلة',
    'auth.passwordHolder': 'ادخل كلمة المرور',
    'auth.loginButton': 'تسجيل الدخول',
    'auth.registerSuccess': 'تم إنشاء الحساب بنجاح!',
    'auth.registerError': 'فشل في إنشاء الحساب. حاول مرة أخرى.',

    // Landing Page
    'landing.badge': 'مستقبل التبادل',
    'landing.heroTitle': 'تبادل الأشياء،',
    'landing.heroTitleHighlight': ' مع دفع فارق عند الحاجة',
    'landing.heroSubtitle': 'منصة المقايضة الحديثة: بدّل ما لا تحتاجه، واحصل على ما تحب — مع إمكانية دفع أو استلام فرق نقدي.',
    'landing.getStarted': 'ابدأ مجاناً',
    'landing.signIn': 'تسجيل الدخول',
    'landing.featuresTitle': 'لماذا تختار تبادل؟',
    'landing.featuresSubtitle': 'اختبر أسهل وأأمن طريقة لتبادل الأشياء مع إمكانية دفع أو استلام فرق نقدي حسب الاتفاق.',
    'landing.feature1.title': 'تبادل أي شيء',
    'landing.feature1.description': 'تبادل الأشياء بدون بيع مباشر — ويمكنك دفع أو استلام فرق نقدي حسب رغبتك.',
    'landing.feature2.title': 'مجتمع آمن',
    'landing.feature2.description': 'انضم إلى مجتمع موثوق من التجار مع ملفات شخصية وتقييمات محققة.',
    'landing.feature3.title': 'تداول آمن',
    'landing.feature3.description': 'معاملات محمية مع حل النزاعات المدمج والدعم.',
    'landing.feature4.title': 'مطابقة فورية',
    'landing.feature4.description': 'خوارزمية ذكية تربطك بالتجار الذين يريدون ما لديك.',
    'landing.stats.traders': 'تاجر نشط',
    'landing.stats.items': 'عنصر متبادل',
    'landing.stats.success': 'معدل النجاح',
    'landing.ctaTitle': 'مستعد لبدء التداول؟',
    'landing.ctaSubtitle': 'انضم إلى مجتمعنا اليوم واكتشف متعة التداول المستدام.',
    'landing.ctaButton': 'أنشئ حسابك',
    'landing.message': 'في تبادل، لا حاجة للمال دائمًا — فقط عندما تحتاجه.',

    // Items
    'items.title': 'العناصر المتاحة',
    'items.search': 'البحث عن عناصر...',
    'items.category': 'الفئة',
    'items.allCategories': 'جميع الفئات',
    'items.postNew': 'نشر عنصر جديد',
    'items.myItems': 'عناصري',
    'items.noItems': 'لم يتم العثور على عناصر',

    // Trading & Money Difference
    'trade.makeOffer': 'تقديم عرض',
    'trade.moneyDifference': 'فرق المال',
    'trade.addMoney': 'إضافة مال',
    'trade.receiveMoney': 'استلام مال',
    'trade.amount': 'المبلغ',
    'trade.currency': 'العملة',
    'trade.offerDetails': 'تفاصيل العرض',
    'trade.yourItem': 'عنصرك',
    'trade.theirItem': 'عنصرهم',
    'trade.moneyFromYou': 'مال منك',
    'trade.moneyToYou': 'مال إليك',
    'trade.sendOffer': 'إرسال العرض',
    'trade.acceptOffer': 'قبول العرض',
    'trade.rejectOffer': 'رفض العرض',
    'trade.counterOffer': 'عرض مضاد',
    'trade.negotiate': 'تفاوض',

    // Common
    'common.loading': 'جاري التحميل...',
    'common.error': 'حدث خطأ ما',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.view': 'عرض',
    'common.send': 'إرسال',
    'common.accept': 'قبول',
    'common.reject': 'رفض',
  },
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<'en' | 'ar'>(() => {
    const saved = localStorage.getItem('language');
    return (saved as 'en' | 'ar') || 'ar'; // Changed default to Arabic
  });

  const setLanguage = (lang: 'en' | 'ar') => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      t,
      isRTL: language === 'ar',
    }}>
      {children}
    </LanguageContext.Provider>
  );
};
