import { Brain, Moon, Heart } from 'lucide-react-native';

export interface Unit {
  id: string;
  title: string;
  description: string;
  isLocked: boolean;
  isCompleted: boolean;
}

export interface Journey {
  id: string;
  title: string;
  description: string;
  duration: string;
  units_count: number;
  progress: number;
  icon: any;
  color: string;
  image: string; // URL for the header image
  units: Unit[];
}

export const journeysData: Journey[] = [
  {
    id: 'anxiety',
    title: 'إدارة القلق',
    description: 'تعلم كيف تتحكم في قلقك وتفهم مصادره للعيش بسلام وهدوء نفسي.',
    duration: '4 أسابيع',
    units_count: 4,
    progress: 0,
    icon: Brain,
    color: 'bg-purple-500',
    image: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=2070&auto=format&fit=crop',
    units: [
      {
        id: 'u1',
        title: 'فهم القلق',
        description: 'ما هو القلق ولماذا نشعر به؟',
        isLocked: false,
        isCompleted: false,
      },
      {
        id: 'u2',
        title: 'تحديد المحفزات',
        description: 'اعرف ما الذي يثير قلقك',
        isLocked: true,
        isCompleted: false,
      },
      {
        id: 'u3',
        title: 'تقنيات التهدئة',
        description: 'أدوات عملية للتعامل مع نوبات القلق',
        isLocked: true,
        isCompleted: false,
      },
      {
        id: 'u4',
        title: 'بناء المرونة',
        description: 'كيف تحافظ على هدوئك على المدى الطويل',
        isLocked: true,
        isCompleted: false,
      },
    ],
  },
  {
    id: 'sleep',
    title: 'تحسين النوم',
    description: 'استراتيجيات مثبتة علمياً لتحسين جودة نومك والاستيقاظ بنشاط.',
    duration: '3 أسابيع',
    units_count: 3,
    progress: 14,
    icon: Moon,
    color: 'bg-blue-500',
    image: 'https://images.unsplash.com/photo-1511295742362-92c96b504843?q=80&w=2071&auto=format&fit=crop',
    units: [
      {
        id: 'u1',
        title: 'أساسيات النوم',
        description: 'كيف تعمل دورة النوم؟',
        isLocked: false,
        isCompleted: true,
      },
      {
        id: 'u2',
        title: 'بيئة النوم',
        description: 'تجهيز غرفتك لنوم هادئ',
        isLocked: false,
        isCompleted: false,
      },
      {
        id: 'u3',
        title: 'روتين ما قبل النوم',
        description: 'عادات تساعدك على الاسترخاء',
        isLocked: true,
        isCompleted: false,
      },
    ],
  },
  {
    id: 'self-esteem',
    title: 'بناء تقدير الذات',
    description: 'رحلة لاكتشاف قيمتك الحقيقية وتعزيز ثقتك بنفسك.',
    duration: '4 أسابيع',
    units_count: 4,
    progress: 22,
    icon: Heart,
    color: 'bg-rose-500',
    image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=2000&auto=format&fit=crop',
    units: [
      {
        id: 'u1',
        title: 'من أنا؟',
        description: 'استكشاف الهوية والقيم',
        isLocked: false,
        isCompleted: true,
      },
      {
        id: 'u2',
        title: 'تحدي الناقد الداخلي',
        description: 'كيف تتعامل مع الأفكار السلبية',
        isLocked: false,
        isCompleted: false,
      },
      {
        id: 'u3',
        title: 'التعاطف مع الذات',
        description: 'كن صديقاً لنفسك',
        isLocked: true,
        isCompleted: false,
      },
      {
        id: 'u4',
        title: 'الاحتفال بالإنجازات',
        description: 'تقدير نجاحاتك الصغيرة والكبيرة',
        isLocked: true,
        isCompleted: false,
      },
    ],
  },
];
