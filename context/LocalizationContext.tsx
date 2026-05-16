import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { I18nManager, NativeModules } from 'react-native';

type Language = 'ar' | 'en';

type Translations = Record<string, string>;

const translationTable: Record<Language, Translations> = {
  ar: {
    'auth.login.title': 'مرحباً بك في هادي',
    'auth.login.subtitle': 'سجّل الدخول للمتابعة',
    'auth.login.emailLabel': 'البريد الإلكتروني',
    'auth.login.emailPlaceholder': 'you@example.com',
    'auth.login.passwordLabel': 'كلمة المرور',
    'auth.login.passwordPlaceholder': '••••••••',
    'auth.login.button': 'تسجيل الدخول',
    'auth.login.google': 'المتابعة باستخدام جوجل',
    'auth.login.apple': 'المتابعة باستخدام أبل',
    'auth.login.noAccount': 'ليس لديك حساب؟',
    'auth.login.signupLink': 'إنشاء حساب',

    'intro.title': 'مرحباً بك في هادي',
    'intro.subtitle': 'رفيقك الذكي لتعزيز صحتك النفسية',
    'intro.button': 'ابدأ الآن',

    'auth.signup.title': 'مرحباً بك في هادي',
    'auth.signup.subtitle': 'أنشئ حسابك الجديد',
    'auth.signup.emailLabel': 'البريد الإلكتروني',
    'auth.signup.emailPlaceholder': 'you@example.com',
    'auth.signup.passwordLabel': 'كلمة المرور',
    'auth.signup.passwordPlaceholder': '٨ أحرف على الأقل',
    'auth.signup.confirmPasswordLabel': 'تأكيد كلمة المرور',
    'auth.signup.confirmPasswordPlaceholder': 'أعد إدخال كلمة المرور',
    'auth.signup.fullNameLabel': 'الاسم الكامل',
    'auth.signup.fullNamePlaceholder': 'أدخل اسمك الكامل',
    'auth.signup.button': 'إنشاء الحساب',
    'auth.signup.backToLogin': 'العودة لتسجيل الدخول',

    'tabs.home': 'الرئيسية',
    'tabs.chat': 'هادي',
    'tabs.mood': 'المزاج',
    'tabs.insights': 'التقارير',
    'tabs.assessments': 'الاختبارات',
    'tabs.society': 'المجتمع',
    'tabs.profile': 'الملف الشخصي',

    'header.app.title': 'هادي',
    'header.app.subtitle': 'Hadee',

    'home.section.title': 'ماذا تريد أن تفعل؟',
    'home.card.journeys': 'الرحلات العلاجية',
    'home.card.journeys.desc': 'برامج موجهة',
    'home.card.plan': 'خطتي المخصصة',
    'home.card.plan.desc': 'خطة ذكية لك',
    'home.card.chat': 'تحدث مع هادي',
    'home.card.chat.desc': 'المعالج الذكي',
    'home.card.breathing': 'تمارين التنفس',
    'home.card.breathing.desc': 'استرخاء فوري',
    'home.card.assessments': 'الاختبارات النفسية',
    'home.card.assessments.desc': 'اعرف حالتك',
    'home.card.cbt': 'تمارين CBT',
    'home.card.cbt.desc': 'تغيير الأفكار',
    'home.card.drawing': 'تحليل رسم طفلك',
    'home.card.drawing.desc': 'افهم مشاعر طفلك من خلال مايرسم',
    'home.card.parental': 'المراقبة الأبوية النفسية للطفل',
    'home.card.parental.desc': 'قريباً',
    'home.card.mood': 'تتبع المزاج',
    'home.card.mood.desc': 'سجل مشاعرك اليومية',
    'home.card.gratitude': 'دفتر الامتنان',
    'home.card.gratitude.desc': 'سجّل ما تشكر الله عليه',
    'home.card.sleep': 'متابعة النوم',
    'home.card.sleep.desc': 'تتبع جودة نومك',
    'home.card.emergency': 'الدعم والمساعدة',
    'home.card.emergency.desc': 'ارقام الطوارئ النفسية',
    'home.card.reports.desc': 'تقارير مفصلة عن حالتك',
    'home.hero.badge': 'اول تطبيق سعودي بالذكاء الاصطناعي',
    'home.hero.button': 'ابدأ محادثة مع هادي',
    'home.services.main': 'الخدمات الرئيسية',
    'home.services.more': 'خدمات اضافية',

    'chat.welcome': 'أهلاً وسهلاً! أنا هادي، معالجك الافتراضي الذكي ❤️\n\nأنا هنا لأستمع إليك وأساعدك في فهم مشاعرك. كل ما نشاركه يبقى سرياً وآمناً.\n\nكيف حالك اليوم؟ وما الذي تريد أن نتحدث عنه؟',
    'chat.placeholder': 'اكتب رسالتك هنا...',
    'chat.voiceSession': 'جلسة صوتية',
    'chat.reply.standard': 'أنا أتفهم ما تمر به. هل يمكنك إخباري المزيد عن ذلك؟',
    'chat.prompt.mood': 'كيف حالي اليوم؟',
    'chat.prompt.mood.full': 'أشعر أنني بحاجة للتحدث عن مشاعري اليوم',
    'chat.prompt.breathing': 'تمارين تنفس',
    'chat.prompt.breathing.full': 'هل يمكنك مساعدتي بتمارين تنفس للاسترخاء؟',
    'chat.prompt.thoughts': 'تحدي الأفكار',
    'chat.prompt.thoughts.full': 'لدي أفكار سلبية أريد مناقشتها',
    'chat.prompt.sleep': 'تحسين النوم',
    'chat.prompt.sleep.full': 'أواجه صعوبة في النوم، هل من نصائح؟',
    'chat.suggested.anxiety': 'أشعر بالقلق اليوم 😰',
    'chat.suggested.sleep': 'لا أستطيع النوم جيداً 😴',
    'chat.suggested.stress': 'أحتاج نصيحة للتعامل مع الضغوط 🧘',
    'chat.suggested.relax': 'أريد تمارين استرخاء 🕯️',
    'chat.history': 'سجل المحادثات',
    'chat.newChat': 'محادثة جديدة',
    'chat.noHistory': 'لا توجد محادثات سابقة',

    'insights.title': 'تقاريرك',
    'insights.subtitle': 'نظرة شاملة ومفصلة على رحلتك النفسية',
    'insights.stat.mood': 'متوسط المزاج',
    'insights.stat.breathing': 'تمارين التنفس',
    'insights.stat.assessments': 'الاختبارات',
    'insights.stat.days': 'أيام التسجيل',
    'insights.stat.minutes': 'دقيقة',
    'insights.stat.tests': 'اختبار',
    'insights.stat.daySuffix': 'يوم',
    'insights.chart.title': 'مزاجك هذا الأسبوع',
    'insights.chart.desc': 'تتبع تقلبات حالتك النفسية خلال الـ 7 أيام الماضية',
    'insights.chart.sleep.title': 'جودة النوم',
    'insights.chart.sleep.desc': 'معدل ساعات وجودة نومك الأسبوعي',
    'insights.empty.title': 'لا توجد بيانات كافية',
    'insights.empty.desc': 'سجل حالتك اليومية لنتمكن من تزويدك برسم بياني دقيق',
    'insights.premium.title': 'فعل التقارير المتقدمة',
    'insights.premium.desc': 'احصل على تحليلات عميقة وتوصيات مخصصة من هادي بناءً على نمط حياتك',
    'insights.footer.info': 'يتم تحديث هذه البيانات بشكل فوري',

    'society.title': 'المجتمع',
    'society.subtitle': 'مساحة آمنة حيث ندعم بعضنا البعض',
    'society.guidelines': 'الإرشادات',
    'society.safety.title': 'بيئة آمنة وإيجابية',
    'society.safety.desc': 'جميع ما يدور هنا يخضع لإشراف لضمان بقاء مجتمعنا مكاناً داعماً للجميع.',
    'society.groups.title': 'المجموعات',
    'society.groups.viewAll': 'عرض الكل',
    'society.groups.active': 'نشط',
    'society.groups.members': 'عضو',
    'society.groups.online': 'متصل الآن',
    'society.groups.join': 'انضمام',
    'society.groups.enter': 'دخول المجموعة',
    'society.group.anxiety.title': 'دعم القلق',
    'society.group.anxiety.desc': 'مساحة آمنة لمشاركة تجاربكم مع القلق',
    'society.group.parenting.title': 'الأبوة والأمومة',
    'society.group.parenting.desc': 'للآباء والأمهات لتبادل الخبرات',
    'society.group.work.title': 'ضغوط العمل',
    'society.group.work.desc': 'التعامل مع ضغوط العمل اليومية',
    'assessments.category.functional': 'اختبارات وظيفية',
    'assessments.category.personal': 'اختبارات شخصية',
    'assessments.category.self': 'اختبارات الذات',
    'assessments.category.social': 'اختبارات اجتماعية',

    'profile.subscription.title': 'إدارة الاشتراك',
    'profile.subscription.currentPlan': 'الخطة الحالية',
    'profile.subscription.premium': 'عضوية بريميوم',
    'profile.subscription.activeUntil': 'نشط حتى',
    'profile.subscription.renew': 'تجديد الاشتراك',
    'profile.subscription.manage': 'إدارة تفاصيل الاشتراك',
    'profile.subscription.features': 'مميزات خطتك',
    'profile.subscription.feature1': 'وصول غير محدود لجميع التمارين',
    'profile.subscription.feature2': 'تحليلات متقدمة للمزاج',
    'profile.subscription.feature3': 'جلسات استشارية مع هادي بلا حدود',

    'profile.settings.title': 'إعدادات الحساب',
    'profile.settings.editProfile': 'تعديل الملف الشخصي',
    'profile.settings.changePassword': 'تغيير كلمة المرور',
    'profile.settings.language': 'اللغة',
    'profile.settings.appearance': 'المظهر',
    'profile.settings.languageValue': 'العربية',
    'profile.settings.appearanceValue': 'تلقائي',
    'profile.settings.deleteAccount': 'حذف الحساب',
    'profile.settings.deleteDesc': 'سيتم حذف جميع بياناتك نهائياً',

    'profile.notifications.title': 'الإشعارات',
    'profile.notifications.daily': 'تذكير يومي',
    'profile.notifications.dailyDesc': 'تذكير لتسجيل حالتك المزاجية',
    'profile.notifications.updates': 'تحديثات التطبيق',
    'profile.notifications.updatesDesc': 'ميزات جديدة وتحسينات',
    'profile.notifications.tips': 'نصائح صحية',
    'profile.notifications.tipsDesc': 'نصائح يومية لتحسين صحتك النفسية',
    'profile.notifications.reminders': 'تذكير التمارين',
    'profile.notifications.remindersDesc': 'تنبيهات لممارسة تمارين التنفس',

    'profile.privacy.title': 'الخصوصية والأمان',
    'profile.privacy.protected': 'بياناتك محمية ومشفرة',
    'profile.privacy.protectedDesc': 'نحن نستخدم أحدث تقنيات التشفير لحماية بياناتك الشخصية ومحادثاتك. لا يتم مشاركة بياناتك مع أي طرف ثالث دون موافقتك الصريحة.',
    'profile.privacy.activity': 'سجل النشاطات',
    'profile.privacy.devices': 'الأجهزة المتصلة',
    'profile.privacy.policy': 'سياسة الخصوصية',

    'profile.help.title': 'المساعدة والدعم',
    'profile.help.question': 'كيف يمكننا مساعدتك؟',
    'profile.help.start': 'كيف أبدأ؟',
    'profile.help.payment': 'مشكلة في الدفع',
    'profile.help.plan': 'تغيير الخطة',
    'profile.help.forgot': 'نسيت كلمة المرور',
    'profile.help.delete': 'حذف البيانات',
    'profile.help.contact': 'تواصل معنا',
    'profile.help.noResults': 'لم تجد ما تبحث عنه؟',
    'profile.help.supportDesc': 'فريق الدعم لدينا جاهز لمساعدتك على مدار الساعة',
    'profile.help.talkButton': 'تحدث مع الدعم',

    'profile.terms.title': 'الشروط والأحكام',
    'profile.terms.header': 'شروط الاستخدام',
    'profile.terms.intro': 'مرحباً بك في تطبيق هادي. باستخداك لهذا التطبيق، فإنك توافق على الالتزام بالشروط والأحكام التالية...',
    'profile.terms.section1': '1. الاستخدام المقبول',
    'profile.terms.desc1': 'يجب استخدام التطبيق للأغراض الشخصية فقط. يمنع استخدام التطبيق لأي أغراض تجارية أو غير قانونية...',
    'profile.terms.section2': '2. الملكية الفكرية',
    'profile.terms.desc2': 'جميع الحقوق محفوظة لشركة هادي. لا يجوز نسخ أو توزيع أي جزء من التطبيق دون إذن كتابي...',

    'profile.about.title': 'عن هادي',
    'profile.about.subtitle': 'رفيقك الذكي للصحة النفسية',
    'profile.about.version': 'الإصدار',
    'profile.about.desc': 'هادي هو تطبيق سعودي يهدف إلى تعزيز الصحة النفسية وجودة الحياة من خلال توفير أدوات ذكية ومحتوى موثوق يساعدك على فهم مشاعرك وتحسين نمط حياتك.',
    'profile.details.notFound': 'القسم غير موجود',
    'profile.details.back': 'عودة',

    'profile.main.guestName': 'ضيف هادي',
    'profile.main.groupAccount': 'الحساب والاشتراكات',
    'profile.main.groupPrefs': 'التفضيلات',
    'profile.main.groupSupport': 'الدعم والمعلومات',
    'profile.main.bannerBadge': 'عرض محدود',
    'profile.main.bannerTitle': 'ترقية إلى هادي بلس',
    'profile.main.bannerDesc': 'احصل على وصول غير محدود لجميع المميزات والخدمات الحصرية',
    'profile.main.logout': 'تسجيل الخروج',
    'profile.main.version': 'الإصدار',
    'profile.main.copyright': 'جميع الحقوق محفوظة © هادي 2024',

    'common.soon': 'قريباً',
    'common.error': 'خطأ',
    'auth.signup.error.fullName': 'يرجى إدخال الاسم الكامل',
    'auth.signup.error.email': 'يرجى إدخال البريد الإلكتروني',
    'auth.signup.error.passwordLength': 'كلمة المرور يجب أن تكون ٨ أحرف على الأقل',
    'auth.signup.error.passwordMismatch': 'كلمة المرور غير متطابقة',
    'auth.login.googleSoon': 'تسجيل الدخول عبر Google سيكون متاحاً قريباً',
    'auth.login.appleSoon': 'تسجيل الدخول عبر Apple سيكون متاحاً قريباً',
    'chat.voiceSessionSoon': 'الجلسات الصوتية ستكون متاحة قريباً في نسخة هادي بلس',
    'society.groups.joinSoon': 'الانضمام للمجموعات سيكون متاحاً قريباً',
    'society.groups.enterSoon': 'دخول المجموعات متاح حالياً للأعضاء المسجلين فقط',
    'profile.subscription.manageSoon': 'إدارة الاشتراكات ستكون متاحة قريباً عبر متجر التطبيقات',
  },
  en: {
    'auth.login.title': 'Welcome to Hadee',
    'auth.login.subtitle': 'Sign in to continue',
    'auth.login.emailLabel': 'Email',
    'auth.login.emailPlaceholder': 'you@example.com',
    'auth.login.passwordLabel': 'Password',
    'auth.login.passwordPlaceholder': '••••••••',
    'auth.login.button': 'Sign in',
    'auth.login.google': 'Continue with Google',
    'auth.login.apple': 'Continue with Apple',
    'auth.login.noAccount': "Don't have an account?",
    'auth.login.signupLink': 'Sign up',

    'intro.title': 'Welcome to Hadee',
    'intro.subtitle': 'Your mental health companion',
    'intro.button': 'Get Started',

    'auth.signup.title': 'Welcome to Hadee',
    'auth.signup.subtitle': 'Create your account',
    'auth.signup.emailLabel': 'Email',
    'auth.signup.emailPlaceholder': 'you@example.com',
    'auth.signup.passwordLabel': 'Password',
    'auth.signup.passwordPlaceholder': 'Min. 8 characters',
    'auth.signup.confirmPasswordLabel': 'Confirm Password',
    'auth.signup.confirmPasswordPlaceholder': 'Re-enter password',
    'auth.signup.fullNameLabel': 'Full Name',
    'auth.signup.fullNamePlaceholder': 'Enter your full name',
    'auth.signup.button': 'Create account',
    'auth.signup.backToLogin': 'Back to sign in',

    'tabs.home': 'Home',
    'tabs.chat': 'Hadee',
    'tabs.mood': 'Mood',
    'tabs.insights': 'Insights',
    'tabs.assessments': 'Assessments',
    'tabs.society': 'Society',
    'tabs.profile': 'Profile',

    'header.app.title': 'Hadee',
    'header.app.subtitle': 'Hadee',

    'home.section.title': 'What do you want to do?',
    'home.card.journeys': 'Therapeutic Journeys',
    'home.card.journeys.desc': 'Guided programs',
    'home.card.plan': 'My Personalized Plan',
    'home.card.plan.desc': 'Smart plan for you',
    'home.card.chat': 'Talk with Hadee',
    'home.card.chat.desc': 'The smart therapist',
    'home.card.breathing': 'Breathing Exercises',
    'home.card.breathing.desc': 'Instant relaxation',
    'home.card.assessments': 'Psychological Tests',
    'home.card.assessments.desc': 'Know your status',
    'home.card.cbt': 'CBT Exercises',
    'home.card.cbt.desc': 'Changing thoughts',
    'home.card.drawing': 'Child Drawing Analysis',
    'home.card.drawing.desc': 'Understand their feelings',
    'home.card.parental': 'Parental Monitoring',
    'home.card.parental.desc': 'Coming Soon',
    'home.card.mood': 'Mood Tracking',
    'home.card.mood.desc': 'Record your daily feelings',
    'home.card.gratitude': 'Gratitude Journal',
    'home.card.gratitude.desc': 'Record what you thank God for',
    'home.card.sleep': 'Sleep Tracking',
    'home.card.sleep.desc': 'Track your sleep quality',
    'home.card.emergency': 'Support & Help',
    'home.card.emergency.desc': 'Mental health emergency numbers',
    'home.card.reports.desc': 'Detailed reports about your condition',
    'home.hero.badge': 'First Saudi AI Mental Health App',
    'home.hero.button': 'Start conversation with Hadee',
    'home.services.main': 'Main Services',
    'home.services.more': 'Additional Services',

    'chat.welcome': 'Welcome! I am Hadee, your smart virtual therapist ❤️\n\nI am here to listen to you and help you understand your feelings. Everything we share stays confidential and secure.\n\nHow are you today? And what would you like to talk about?',
    'chat.placeholder': 'Type your message here...',
    'chat.voiceSession': 'Voice Session',
    'chat.reply.standard': 'I understand what you are going through. Can you tell me more about it?',
    'chat.prompt.mood': 'How am I today?',
    'chat.prompt.mood.full': 'I feel like I need to talk about my feelings today',
    'chat.prompt.breathing': 'Breathing exercises',
    'chat.prompt.breathing.full': 'Can you help me with breathing exercises for relaxation?',
    'chat.prompt.thoughts': 'Thought challenge',
    'chat.prompt.thoughts.full': 'I have negative thoughts I want to discuss',
    'chat.prompt.sleep': 'Improve sleep',
    'chat.prompt.sleep.full': 'I am having trouble sleeping, any tips?',
    'chat.suggested.anxiety': 'I feel anxious today 😰',
    'chat.suggested.sleep': "I can't sleep well 😴",
    'chat.suggested.stress': 'I need advice for dealing with stress 🧘',
    'chat.suggested.relax': 'I want relaxation exercises 🕯️',
    'chat.history': 'Chat History',
    'chat.newChat': 'New Chat',
    'chat.noHistory': 'No past sessions found.',

    'insights.title': 'Your Reports',
    'insights.subtitle': 'Comprehensive and detailed look at your psychological journey',
    'insights.stat.mood': 'Average Mood',
    'insights.stat.breathing': 'Breathing Exercises',
    'insights.stat.assessments': 'Assessments',
    'insights.stat.days': 'Log Days',
    'insights.stat.minutes': 'min',
    'insights.stat.tests': 'tests',
    'insights.stat.daySuffix': 'days',
    'insights.chart.title': 'Your Mood This Week',
    'insights.chart.desc': 'Track your mood fluctuations over the past 7 days',
    'insights.chart.sleep.title': 'Sleep Quality',
    'insights.chart.sleep.desc': 'Your weekly sleep hours and quality average',
    'insights.empty.title': 'Not enough data',
    'insights.empty.desc': 'Log your daily status so we can provide you with an accurate chart',
    'insights.premium.title': 'Enable Advanced Reports',
    'insights.premium.desc': 'Get deep analytics and personalized recommendations from Hadee based on your lifestyle',
    'insights.footer.info': 'This data is updated in real-time',

    'society.title': 'Society',
    'society.subtitle': 'A safe space where we support each other',
    'society.guidelines': 'Guidelines',
    'society.safety.title': 'Safe & Positive Environment',
    'society.safety.desc': 'Everything here is moderated to ensure our community remains a supportive place for everyone.',
    'society.groups.title': 'Groups',
    'society.groups.viewAll': 'View All',
    'society.groups.active': 'Active',
    'society.groups.members': 'members',
    'society.groups.online': 'online now',
    'society.groups.join': 'Join',
    'society.groups.enter': 'Enter Group',
    'society.group.anxiety.title': 'Anxiety Support',
    'society.group.anxiety.desc': 'A safe space to share your experiences with anxiety',
    'society.group.parenting.title': 'Parenting',
    'society.group.parenting.desc': 'For fathers and mothers to exchange experiences',
    'society.group.work.title': 'Work Stress',
    'society.group.work.desc': 'Dealing with daily work pressures',
    'assessments.category.functional': 'Functional Tests',
    'assessments.category.personal': 'Personality Tests',
    'assessments.category.self': 'Self Tests',
    'assessments.category.social': 'Social Tests',

    'profile.subscription.title': 'Subscription Management',
    'profile.subscription.currentPlan': 'Current Plan',
    'profile.subscription.premium': 'Premium Membership',
    'profile.subscription.activeUntil': 'Active until',
    'profile.subscription.renew': 'Renew Subscription',
    'profile.subscription.manage': 'Manage Subscription Details',
    'profile.subscription.features': 'Your Plan Features',
    'profile.subscription.feature1': 'Unlimited access to all exercises',
    'profile.subscription.feature2': 'Advanced mood analytics',
    'profile.subscription.feature3': 'Unlimited counseling sessions with Hadee',

    'profile.settings.title': 'Account Settings',
    'profile.settings.editProfile': 'Edit Profile',
    'profile.settings.changePassword': 'Change Password',
    'profile.settings.language': 'Language',
    'profile.settings.appearance': 'Appearance',
    'profile.settings.languageValue': 'English',
    'profile.settings.appearanceValue': 'Auto',
    'profile.settings.deleteAccount': 'Delete Account',
    'profile.settings.deleteDesc': 'All your data will be permanently deleted',

    'profile.notifications.title': 'Notifications',
    'profile.notifications.daily': 'Daily Reminder',
    'profile.notifications.dailyDesc': 'Reminder to log your mood',
    'profile.notifications.updates': 'App Updates',
    'profile.notifications.updatesDesc': 'New features and improvements',
    'profile.notifications.tips': 'Health Tips',
    'profile.notifications.tipsDesc': 'Daily tips to improve your mental health',
    'profile.notifications.reminders': 'Exercise Reminders',
    'profile.notifications.remindersDesc': 'Alerts for breathing exercises',

    'profile.privacy.title': 'Privacy & Security',
    'profile.privacy.protected': 'Your data is protected and encrypted',
    'profile.privacy.protectedDesc': 'We use the latest encryption technologies to protect your personal data and conversations. Your data is not shared with any third party without your explicit consent.',
    'profile.privacy.activity': 'Activity Log',
    'profile.privacy.devices': 'Connected Devices',
    'profile.privacy.policy': 'Privacy Policy',

    'profile.help.title': 'Help & Support',
    'profile.help.question': 'How can we help you?',
    'profile.help.start': 'How do I start?',
    'profile.help.payment': 'Payment issue',
    'profile.help.plan': 'Change plan',
    'profile.help.forgot': 'Forgot password',
    'profile.help.delete': 'Delete data',
    'profile.help.contact': 'Contact us',
    'profile.help.noResults': 'Didn\'t find what you\'re looking for?',
    'profile.help.supportDesc': 'Our support team is ready to help you around the clock',
    'profile.help.talkButton': 'Talk to Support',

    'profile.terms.title': 'Terms & Conditions',
    'profile.terms.header': 'Terms of Use',
    'profile.terms.intro': 'Welcome to Hadee. By using this application, you agree to abide by the following terms and conditions...',
    'profile.terms.section1': '1. Acceptable Use',
    'profile.terms.desc1': 'The application must be used for personal purposes only. It is prohibited to use the application for any commercial or illegal purposes...',
    'profile.terms.section2': '2. Intellectual Property',
    'profile.terms.desc2': 'All rights reserved to Hadee. No part of the application may be copied or distributed without written permission...',

    'profile.about.title': 'About Hadee',
    'profile.about.subtitle': 'Your smart mental health companion',
    'profile.about.version': 'Version',
    'profile.about.desc': 'Hadee is a Saudi application aimed at promoting mental health and quality of life by providing smart tools and reliable content that helps you understand your feelings and improve your lifestyle.',
    'profile.details.notFound': 'Section not found',
    'profile.details.back': 'Back',

    'profile.main.guestName': 'Hadee Guest',
    'profile.main.groupAccount': 'Account & Subscriptions',
    'profile.main.groupPrefs': 'Preferences',
    'profile.main.groupSupport': 'Support & Info',
    'profile.main.bannerBadge': 'Limited Offer',
    'profile.main.bannerTitle': 'Upgrade to Hadee Plus',
    'profile.main.bannerDesc': 'Get unlimited access to all features and exclusive services',
    'profile.main.logout': 'Log Out',
    'profile.main.version': 'Version',
    'profile.main.copyright': 'All rights reserved © Hadee 2024',

    'common.soon': 'Coming Soon',
    'common.error': 'Error',
    'auth.signup.error.fullName': 'Please enter full name',
    'auth.signup.error.email': 'Please enter email',
    'auth.signup.error.passwordLength': 'Password must be at least 8 characters',
    'auth.signup.error.passwordMismatch': 'Passwords do not match',
    'auth.login.googleSoon': 'Login via Google will be available soon',
    'auth.login.appleSoon': 'Login via Apple will be available soon',
    'chat.voiceSessionSoon': 'Voice sessions will be available soon in Hadee Plus',
    'society.groups.joinSoon': 'Joining groups will be available soon',
    'society.groups.enterSoon': 'Entering groups is currently available for registered members only',
    'profile.subscription.manageSoon': 'Subscription management will be available soon via the App Store',
  },
};

type LocalizationContextValue = {
  language: Language;
  isRTL: boolean;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  flexDir: (base?: 'row' | 'col') => string;
  textAlign: (base?: 'left' | 'right') => string;
  alignItems: (base?: 'start' | 'end' | 'center') => string;
  alignSelf: (base?: 'start' | 'end' | 'center' | 'auto') => string;
  justifyContent: (base?: 'start' | 'end' | 'center' | 'between') => string;
  isSystemRTL: boolean;
  l: string; // 'left' or 'right' based on app RTL
  r: string; // 'right' or 'left' based on app RTL
  s: string; // 'start' or 'end' based on system/app mismatch
  e: string; // 'end' or 'start' based on system/app mismatch
};

const LocalizationContext = createContext<LocalizationContextValue | undefined>(undefined);

type Props = {
  children: React.ReactNode;
};

export function LocalizationProvider({ children }: Props) {
  const [language, setLanguage] = useState<Language>('ar');
  const isSystemRTL = I18nManager.isRTL;
  const isAppRTL = language === 'ar';

  const toggleLanguage = async (newLang: Language) => {
    setLanguage(newLang);
  };

  const value = useMemo(
    () => {
      // If app wants RTL but system is LTR OR app wants LTR but system is RTL -> we need to manually flip
      const shouldFlip = isAppRTL !== isSystemRTL;

      return {
        language,
        isRTL: isAppRTL,
        isSystemRTL,
        setLanguage: toggleLanguage,
        t: (key: string) => {
          const table = translationTable[language];
          return table[key] ?? key;
        },
        // Physical sides based on App RTL
        l: isAppRTL ? 'right' : 'left',
        r: isAppRTL ? 'left' : 'right',
        // Logical sides based on System/App mismatch
        // Use these for items-*, self-*, justify-*
        s: shouldFlip ? 'end' : 'start',
        e: shouldFlip ? 'start' : 'end',

        flexDir: (base: 'row' | 'col' = 'row') => {
          if (base === 'col') return 'flex-col';
          return shouldFlip ? 'flex-row-reverse' : 'flex-row';
        },
        textAlign: (base: 'left' | 'right' = 'left') => {
          if (base === 'left') {
            return isAppRTL ? 'text-right' : 'text-left';
          }
          return isAppRTL ? 'text-left' : 'text-right';
        },
        alignItems: (base: 'start' | 'end' | 'center' = 'start') => {
           if (base === 'center') return 'items-center';
           if (base === 'start') return shouldFlip ? 'items-end' : 'items-start';
           return shouldFlip ? 'items-start' : 'items-end';
         },
         alignSelf: (base: 'start' | 'end' | 'center' | 'auto' = 'auto') => {
           if (base === 'center') return 'self-center';
           if (base === 'auto') return 'self-auto';
           if (base === 'start') return shouldFlip ? 'self-end' : 'self-start';
           return shouldFlip ? 'self-start' : 'self-end';
         },
         justifyContent: (base: 'start' | 'end' | 'center' | 'between' = 'start') => {
          if (base === 'center') return 'justify-center';
          if (base === 'between') return 'justify-between';
          if (base === 'start') return shouldFlip ? 'justify-end' : 'justify-start';
          return shouldFlip ? 'justify-start' : 'justify-end';
        },
      };
    },
    [language, isAppRTL, isSystemRTL]
  );

  return <LocalizationContext.Provider value={value}>{children}</LocalizationContext.Provider>;
}

export function useLocalization() {
  const ctx = useContext(LocalizationContext);
  if (!ctx) {
    throw new Error('useLocalization must be used within LocalizationProvider');
  }
  return ctx;
}
