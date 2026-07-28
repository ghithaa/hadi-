import { Brain, Moon, Heart } from 'lucide-react-native';

export interface Unit {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  moduleIndex?: number;
  lessonIndex?: number;
  isLocked: boolean;
  isCompleted: boolean;
}

export interface JourneyLessonSection {
  id: string;
  heading: string;
  headingEn?: string;
  body: string;
  bodyEn?: string;
  items?: string[];
  itemsEn?: string[];
}

export interface JourneyLessonAction {
  type: 'breathing' | 'chat';
  label: string;
  labelEn?: string;
  description?: string;
  descriptionEn?: string;
}

export interface JourneyLessonExerciseStep {
  id: string;
  title: string;
  titleEn?: string;
  prompt: string;
  promptEn?: string;
  placeholder?: string;
  placeholderEn?: string;
}

export interface JourneyLessonExercise {
  type: 'grounding_senses' | 'multi_step_reflection';
  title?: string;
  titleEn?: string;
  subtitle?: string;
  subtitleEn?: string;
  placeholders?: string[];
  placeholdersEn?: string[];
  steps?: JourneyLessonExerciseStep[];
}

export interface JourneyLesson {
  id: string;
  title: string;
  titleEn?: string;
  summary: string;
  summaryEn?: string;
  duration: string;
  durationEn?: string;
  sections: JourneyLessonSection[];
  takeaways: string[];
  takeawaysEn?: string[];
  reflectionPrompt?: string;
  reflectionPromptEn?: string;
  notePlaceholder?: string;
  notePlaceholderEn?: string;
  practice?: string;
  practiceEn?: string;
  action?: JourneyLessonAction;
  exercise?: JourneyLessonExercise;
}

export interface JourneyModule {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  lessons: JourneyLesson[];
}

export interface Journey {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  duration: string;
  durationEn?: string;
  units_count: number;
  progress: number;
  icon: any;
  color: string;
  image: string; // URL for the header image
  units: Unit[];
  modules?: JourneyModule[];
}

export interface PersistedJourneyProgress {
  progress: number;
  units: Pick<Unit, 'id' | 'isLocked' | 'isCompleted'>[];
}

export interface ActiveJourneyRouteState {
  journeyId?: string;
  moduleIndex?: number;
  lessonIndex?: number;
}

export const journeysData: Journey[] = [
  {
    id: 'anxiety',
    title: 'إدارة القلق',
    titleEn: 'Managing Anxiety',
    description: 'تعلم كيف تتحكم في قلقك وتفهم مصادره للعيش بسلام وهدوء نفسي.',
    descriptionEn: 'Learn how to manage your anxiety and understand its triggers for calmer daily life.',
    duration: '4 أسابيع',
    durationEn: '4 Weeks',
    units_count: 11,
    progress: 0,
    icon: Brain,
    color: '#8b5cf6',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2070&auto=format&fit=crop',
    units: [
      {
        id: 'u1',
        title: 'فهم القلق',
        titleEn: 'Understanding Anxiety',
        description: 'ما هو القلق ولماذا نشعر به؟',
        descriptionEn: 'What is anxiety and why do we feel it?',
        moduleIndex: 0,
        lessonIndex: 0,
        isLocked: false,
        isCompleted: false,
      },
      {
        id: 'u2',
        title: 'تحديد المحفزات',
        titleEn: 'Identifying Triggers',
        description: 'اعرف ما الذي يثير قلقك',
        descriptionEn: 'Notice what tends to trigger your anxiety',
        moduleIndex: 0,
        lessonIndex: 1,
        isLocked: true,
        isCompleted: false,
      },
      {
        id: 'u3',
        title: 'تقنيات التهدئة',
        titleEn: 'Calming Techniques',
        description: 'أدوات عملية للتعامل مع نوبات القلق',
        descriptionEn: 'Practical tools for managing anxious moments',
        moduleIndex: 0,
        lessonIndex: 2,
        isLocked: true,
        isCompleted: false,
      },
      {
        id: 'u4',
        title: 'بناء المرونة',
        titleEn: 'Building Resilience',
        description: 'كيف تحافظ على هدوئك على المدى الطويل',
        descriptionEn: 'How to stay grounded over the long term',
        moduleIndex: 1,
        lessonIndex: 0,
        isLocked: true,
        isCompleted: false,
      },
      {
        id: 'u5',
        title: 'تطبيق التأريض',
        titleEn: 'Grounding Practice',
        description: 'طبّق تمرين التأريض عبر ملاحظة ما تراه وتسمعه وتحسه الآن.',
        descriptionEn: 'Practice grounding by noticing what you can sense right now.',
        moduleIndex: 1,
        lessonIndex: 1,
        isLocked: true,
        isCompleted: false,
      },
      {
        id: 'u6',
        title: 'تأمل مع هادي',
        titleEn: 'Reflect with Hadee',
        description: 'شارك ما تشعر به لتحصل على دعم هادئ ومباشر.',
        descriptionEn: 'Share how you feel to get calm and direct support.',
        moduleIndex: 1,
        lessonIndex: 2,
        isLocked: true,
        isCompleted: false,
      },
      {
        id: 'u7',
        title: 'التشوهات المعرفية',
        titleEn: 'Cognitive Distortions',
        description: 'تعرّف على أنماط التفكير التي تزيد القلق.',
        descriptionEn: 'Learn the thinking patterns that intensify anxiety.',
        moduleIndex: 2,
        lessonIndex: 0,
        isLocked: true,
        isCompleted: false,
      },
      {
        id: 'u8',
        title: 'تحدي أفكارك',
        titleEn: 'Challenge Your Thoughts',
        description: 'أعد تقييم الفكرة المقلقة خطوة بخطوة.',
        descriptionEn: 'Re-evaluate the anxious thought step by step.',
        moduleIndex: 2,
        lessonIndex: 1,
        isLocked: true,
        isCompleted: false,
      },
      {
        id: 'u9',
        title: 'خطة العمل الشخصية',
        titleEn: 'Personal Action Plan',
        description: 'ضع خطوات عملية تحمي هدوءك عند عودة القلق.',
        descriptionEn: 'Create practical steps that protect your calm when anxiety returns.',
        moduleIndex: 3,
        lessonIndex: 0,
        isLocked: true,
        isCompleted: false,
      },
      {
        id: 'u10',
        title: 'تحدياتك الشخصية',
        titleEn: 'Your Personal Challenges',
        description: 'حدّد المواقف الأصعب عليك وكيف ستتعامل معها.',
        descriptionEn: 'Identify your hardest situations and how you will face them.',
        moduleIndex: 3,
        lessonIndex: 1,
        isLocked: true,
        isCompleted: false,
      },
      {
        id: 'u11',
        title: 'مراجعة مع هادي',
        titleEn: 'Review with Hadee',
        description: 'راجع تقدمك وأفكارك مع هادي.',
        descriptionEn: 'Review your progress and thoughts with Hadee.',
        moduleIndex: 3,
        lessonIndex: 2,
        isLocked: true,
        isCompleted: false,
      },
    ],
    modules: [
      {
        id: 'm1',
        title: 'فهم القلق',
        titleEn: 'Understanding Anxiety',
        description: 'مقدمة عملية لفهم القلق وأعراضه ودور الجسم والأفكار في زيادته.',
        descriptionEn: 'A practical introduction to anxiety, its symptoms, and how body responses and thoughts intensify it.',
        lessons: [
          {
            id: 'l1',
            title: 'ما هو القلق؟',
            titleEn: 'What Is Anxiety?',
            summary: 'تعرّف على معنى القلق وأنواعه وأبرز الأعراض الجسدية المرتبطة به.',
            summaryEn: 'Learn what anxiety is, its common forms, and the main physical symptoms connected to it.',
            duration: '5 دقائق',
            durationEn: '5 min',
            sections: [
              {
                id: 's1',
                heading: 'ما هو القلق؟',
                headingEn: 'What Is Anxiety?',
                body: 'القلق شعور طبيعي يظهر عندما نتوقع خطراً أو نمر بموقف غير مؤكد. أحياناً يكون مفيداً لأنه يدفعنا للانتباه والاستعداد، لكنه يصبح مرهقاً عندما يستمر كثيراً أو يؤثر على الحياة اليومية.',
                bodyEn: 'Anxiety is a natural feeling that appears when we expect danger or face uncertainty. Sometimes it is helpful because it makes us alert and prepared, but it becomes exhausting when it lasts too long or starts affecting daily life.',
              },
              {
                id: 's2',
                heading: 'أنواع القلق:',
                headingEn: 'Types of Anxiety',
                body: '',
                bodyEn: '',
                items: [
                  'القلق العام: قلق مستمر بشأن أمور الحياة اليومية',
                  'القلق الاجتماعي: خوف من المواقف الاجتماعية',
                  'نوبات الهلع: نوبات مفاجئة من الخوف الشديد',
                ],
                itemsEn: [
                  'General anxiety: ongoing worry about everyday life',
                  'Social anxiety: fear of social situations',
                  'Panic attacks: sudden episodes of intense fear',
                ],
              },
              {
                id: 's3',
                heading: 'الأعراض الجسدية:',
                headingEn: 'Physical Symptoms',
                body: '',
                bodyEn: '',
                items: [
                  'تسارع ضربات القلب',
                  'التعرق',
                  'صعوبة التنفس',
                  'توتر العضلات',
                ],
                itemsEn: [
                  'Rapid heartbeat',
                  'Sweating',
                  'Breathing difficulty',
                  'Muscle tension',
                ],
              },
            ],
            takeaways: [
              'القلق طبيعي ويمكن إدارته بالمهارات الصحيحة.',
            ],
            takeawaysEn: [
              'Anxiety is natural and can be managed with the right skills.',
            ],
            practice: 'تذكر: القلق طبيعي ويمكن إدارته بالمهارات الصحيحة.',
            practiceEn: 'Remember: anxiety is natural and can be managed with the right skills.',
          },
          {
            id: 'l2',
            title: 'اكتشف محفزاتك',
            titleEn: 'Discover Your Triggers',
            summary: 'حدّد المواقف أو الأفكار التي ترفع مستوى القلق لديك حتى تبدأ ملاحظتها مبكراً.',
            summaryEn: 'Identify the situations or thoughts that raise your anxiety so you can notice them earlier.',
            duration: '10 دقائق',
            durationEn: '10 min',
            sections: [
              {
                id: 's1',
                heading: 'اكتشف محفزاتك',
                headingEn: 'Discover Your Triggers',
                body: 'ما هي المواقف أو الأفكار التي تثير قلقك عادة؟ حاول أن تكتب 3 محفزات رئيسية وكيف تشعر عندما تواجهها.',
                bodyEn: 'What situations or thoughts usually trigger your anxiety? Try to write 3 main triggers and how you feel when you face them.',
              },
            ],
            reflectionPrompt: 'ما هي المواقف أو الأفكار التي تثير قلقك عادة؟',
            reflectionPromptEn: 'What situations or thoughts usually trigger your anxiety?',
            notePlaceholder: 'اكتب أفكارك هنا...',
            notePlaceholderEn: 'Write your thoughts here...',
            takeaways: [
              'فهم المحفزات يساعدك على ملاحظة القلق مبكراً.',
            ],
            takeawaysEn: [
              'Understanding triggers helps you notice anxiety earlier.',
            ],
          },
          {
            id: 'l3',
            title: 'تمرين التنفس للقلق',
            titleEn: 'Breathing Exercise for Anxiety',
            summary: 'جرّب تقنية التنفس 4-7-8 لتهدئة جهازك العصبي عند الشعور بالتوتر.',
            summaryEn: 'Try the 4-7-8 breathing technique to calm your nervous system when you feel tense.',
            duration: '5 دقائق',
            durationEn: '5 min',
            sections: [
              {
                id: 's1',
                heading: 'تمرين التنفس للقلق',
                headingEn: 'Breathing Exercise for Anxiety',
                body: 'جرّب تقنية التنفس 4-7-8 لتهدئة جهازك العصبي.',
                bodyEn: 'Try the 4-7-8 breathing technique to calm your nervous system.',
              },
            ],
            action: {
              type: 'breathing',
              label: 'ابدأ تمرين التنفس',
              labelEn: 'Start Breathing Exercise',
              description: 'سيفتح صفحة تمارين التنفس داخل التطبيق.',
              descriptionEn: 'This opens the breathing exercises page in the app.',
            },
            takeaways: [
              'التنفس المنظّم يساعد الجسم على استعادة الهدوء.',
            ],
            takeawaysEn: [
              'Structured breathing helps the body regain calm.',
            ],
          },
        ],
      },
      {
        id: 'm2',
        title: 'تقنيات التهدئة',
        titleEn: 'Calming Techniques',
        description: 'مهارات سريعة تساعدك على العودة للحظة الحالية وطلب الدعم عند الحاجة.',
        descriptionEn: 'Quick skills that help you return to the present moment and seek support when needed.',
        lessons: [
          {
            id: 'l1',
            title: 'تقنية التأريض 1-2-3-4-5',
            titleEn: '5-4-3-2-1 Grounding Technique',
            summary: 'عندما تشعر بالقلق استخدم حواسك لتعود للحظة الحالية.',
            summaryEn: 'When anxiety rises, use your senses to return to the present moment.',
            duration: '5 دقائق',
            durationEn: '5 min',
            sections: [
              {
                id: 's1',
                heading: 'تقنية التأريض 1-2-3-4-5',
                headingEn: '5-4-3-2-1 Grounding Technique',
                body: 'عندما تشعر بالقلق، استخدم حواسك للعودة للحظة الحالية.',
                bodyEn: 'When you feel anxious, use your senses to return to the present moment.',
              },
              {
                id: 's2',
                heading: 'الخطوات:',
                headingEn: 'Steps',
                body: '',
                bodyEn: '',
                items: [
                  '5 أشياء يمكنك رؤيتها',
                  '4 أشياء يمكنك لمسها',
                  '3 أشياء يمكنك سماعها',
                  '2 أشياء يمكنك شمها',
                  'شيء واحد يمكنك تذوقه',
                ],
                itemsEn: [
                  '5 things you can see',
                  '4 things you can touch',
                  '3 things you can hear',
                  '2 things you can smell',
                  '1 thing you can taste',
                ],
              },
              {
                id: 's3',
                heading: 'لماذا تعمل؟',
                headingEn: 'Why It Works',
                body: 'هذه التقنية تحول انتباهك من الأفكار المقلقة إلى اللحظة الحالية.',
                bodyEn: 'This technique shifts your attention from anxious thoughts to the present moment.',
              },
            ],
            takeaways: [
              'استخدام الحواس يخفف اندفاع الأفكار المقلقة.',
            ],
            takeawaysEn: [
              'Using your senses reduces the rush of anxious thoughts.',
            ],
          },
          {
            id: 'l2',
            title: 'تطبيق التأريض',
            titleEn: 'Grounding Practice',
            summary: 'ركّز على حواسك الآن لتطبيق تقنية التأريض 5-4-3-2-1 بشكل عملي.',
            summaryEn: 'Focus on your senses now to practice the 5-4-3-2-1 grounding method.',
            duration: '5 دقائق',
            durationEn: '5 min',
            sections: [],
            exercise: {
              type: 'grounding_senses',
              title: '5 أشياء تراها',
              titleEn: '5 Things You See',
              subtitle: 'ركّز على حواسك الآن',
              subtitleEn: 'Focus on your senses right now',
              placeholders: [
                '1. شيء تراه...',
                '2. شيء تراه...',
                '3. شيء تراه...',
                '4. شيء تراه...',
                '5. شيء تراه...',
              ],
              placeholdersEn: [
                '1. Something you see...',
                '2. Something you see...',
                '3. Something you see...',
                '4. Something you see...',
                '5. Something you see...',
              ],
            },
            takeaways: [
              'إرجاع الانتباه إلى الحواس يساعد على تخفيف شدة القلق سريعاً.',
            ],
            takeawaysEn: [
              'Bringing attention back to your senses helps reduce anxiety quickly.',
            ],
          },
          {
            id: 'l3',
            title: 'تحدث مع هادي',
            titleEn: 'Talk to Hadee',
            summary: 'إذا أردت دعماً فورياً، يمكنك الانتقال إلى هادي والتحدث عما تشعر به الآن.',
            summaryEn: 'If you want immediate support, you can open Hadee and talk about what you are feeling right now.',
            duration: '3 دقائق',
            durationEn: '3 min',
            sections: [
              {
                id: 's1',
                heading: 'خذ مساحة للكلام',
                headingEn: 'Make Space to Talk',
                body: 'أحياناً يساعدك وصف ما تمر به الآن بصوت أو كتابة واضحة. تحدث مع هادي عن الفكرة أو الشعور أو الموقف الذي يزعجك.',
                bodyEn: 'Sometimes it helps to clearly describe what you are going through right now. Talk to Hadee about the thought, feeling, or situation that is bothering you.',
              },
            ],
            action: {
              type: 'chat',
              label: 'افتح المحادثة مع هادي',
              labelEn: 'Open Chat with Hadee',
              description: 'سينقلك مباشرة إلى صفحة المحادثة.',
              descriptionEn: 'This opens the chat page directly.',
            },
            takeaways: [
              'طلب الدعم المبكر يساعدك على تنظيم مشاعرك بشكل أفضل.',
            ],
            takeawaysEn: [
              'Seeking support early helps you regulate your emotions better.',
            ],
          },
        ],
      },
      {
        id: 'm3',
        title: 'إعادة هيكلة الأفكار',
        titleEn: 'Restructuring Thoughts',
        description: 'تعلّم كيف تلاحظ التفكير غير الواقعي وتستبدله بأفكار أكثر توازناً.',
        descriptionEn: 'Learn how to notice unrealistic thinking and replace it with more balanced thoughts.',
        lessons: [
          {
            id: 'l1',
            title: 'التشوهات المعرفية',
            titleEn: 'Cognitive Distortions',
            summary: 'هي أنماط تفكير غير واقعية تزيد من القلق وتدفعك لتفسير المواقف بطريقة متشددة أو سلبية.',
            summaryEn: 'These are unrealistic thinking patterns that increase anxiety and make situations feel harsher or more negative.',
            duration: '7 دقائق',
            durationEn: '7 min',
            sections: [
              {
                id: 's1',
                heading: 'التشوهات المعرفية',
                headingEn: 'Cognitive Distortions',
                body: 'هي أنماط تفكير غير واقعية تزيد من القلق.',
                bodyEn: 'They are unrealistic thinking patterns that increase anxiety.',
              },
              {
                id: 's2',
                heading: 'أمثلة شائعة:',
                headingEn: 'Common Examples',
                body: '',
                bodyEn: '',
                items: [
                  'التفكير الكارثي: توقع الأسوأ دائماً',
                  'قراءة الذهن: افتراض ما يفكر به الآخرون',
                  'التعميم المفرط: "هذا يحدث لي دائماً"',
                  'التفكير بالأبيض والأسود: لا يوجد وسط',
                ],
                itemsEn: [
                  'Catastrophizing: always expecting the worst',
                  'Mind reading: assuming what others think',
                  'Overgeneralization: "this always happens to me"',
                  'Black-and-white thinking: no middle ground',
                ],
              },
              {
                id: 's3',
                heading: 'كيف تتحداها؟',
                headingEn: 'How to Challenge Them',
                body: '',
                bodyEn: '',
                items: [
                  'حدد الفكرة',
                  'اسأل: ما الدليل؟',
                  'ابحث عن بدائل أكثر واقعية',
                ],
                itemsEn: [
                  'Identify the thought',
                  'Ask: what is the evidence?',
                  'Look for more realistic alternatives',
                ],
              },
            ],
            takeaways: [
              'ليست كل فكرة مقلقة حقيقة، وبعضها مجرد نمط تفكير يمكن ملاحظته وتعديله.',
            ],
            takeawaysEn: [
              'Not every anxious thought is a fact, and some are simply patterns you can notice and change.',
            ],
          },
          {
            id: 'l2',
            title: 'تحدي أفكارك',
            titleEn: 'Challenge Your Thoughts',
            summary: 'أعد النظر في الفكرة السلبية خطوة بخطوة حتى تصل إلى بديل أكثر توازناً وواقعية.',
            summaryEn: 'Review the negative thought step by step until you reach a more balanced and realistic alternative.',
            duration: '15 دقيقة',
            durationEn: '15 min',
            sections: [],
            exercise: {
              type: 'multi_step_reflection',
              steps: [
                {
                  id: 'step-1',
                  title: 'الفكرة السلبية',
                  titleEn: 'Negative Thought',
                  prompt: 'ما هي الفكرة السلبية التي تراودك؟',
                  promptEn: 'What is the negative thought that keeps coming to you?',
                  placeholder: 'اكتب الفكرة هنا...',
                  placeholderEn: 'Write the thought here...',
                },
                {
                  id: 'step-2',
                  title: 'المشاعر',
                  titleEn: 'Emotions',
                  prompt: 'ما المشاعر التي يثيرها هذا التفكير؟ (مثل: قلق، حزن، غضب)',
                  promptEn: 'What emotions does this thought trigger? (For example: anxiety, sadness, anger)',
                  placeholder: 'اكتب مشاعرك هنا...',
                  placeholderEn: 'Write your emotions here...',
                },
                {
                  id: 'step-3',
                  title: 'الدليل المؤيد',
                  titleEn: 'Evidence For',
                  prompt: 'ما الأدلة التي تدعم هذه الفكرة؟',
                  promptEn: 'What evidence supports this thought?',
                  placeholder: 'اكتب الأدلة المؤيدة هنا...',
                  placeholderEn: 'Write the supporting evidence here...',
                },
                {
                  id: 'step-4',
                  title: 'الدليل المعارض',
                  titleEn: 'Evidence Against',
                  prompt: 'ما الأدلة التي لا تدعم هذه الفكرة أو تضعفها؟',
                  promptEn: 'What evidence does not support this thought or weakens it?',
                  placeholder: 'اكتب الأدلة المعارضة هنا...',
                  placeholderEn: 'Write the opposing evidence here...',
                },
                {
                  id: 'step-5',
                  title: 'الفكرة البديلة',
                  titleEn: 'Balanced Alternative',
                  prompt: 'ما الفكرة الأكثر توازناً وواقعية التي يمكنك تبنيها الآن؟',
                  promptEn: 'What is a more balanced and realistic thought you can adopt now?',
                  placeholder: 'اكتب الفكرة البديلة هنا...',
                  placeholderEn: 'Write the balanced thought here...',
                },
              ],
            },
            takeaways: [
              'مراجعة الفكرة بالأدلة تساعدك على تقليل تأثيرها والانفتاح على بدائل أكثر هدوءاً.',
            ],
            takeawaysEn: [
              'Reviewing a thought through evidence helps reduce its power and opens the door to calmer alternatives.',
            ],
          },
        ],
      },
      {
        id: 'm4',
        title: 'بناء المرونة',
        titleEn: 'Building Resilience',
        description: 'استراتيجيات طويلة المدى للتعامل مع القلق والعودة للتوازن بسرعة أكبر.',
        descriptionEn: 'Long-term strategies for handling anxiety and returning to balance more quickly.',
        lessons: [
          {
            id: 'l1',
            title: 'خطة العمل الشخصية',
            titleEn: 'Personal Action Plan',
            summary: 'ضع خطة بسيطة لما ستفعله عندما تشعر بارتفاع القلق مرة أخرى.',
            summaryEn: 'Create a simple plan for what you will do when anxiety rises again.',
            duration: '5 دقائق',
            durationEn: '5 min',
            sections: [
              {
                id: 's1',
                heading: 'خطة العمل الشخصية',
                headingEn: 'Personal Action Plan',
                body: 'حدد 3 خطوات عملية ستقوم بها عندما يبدأ القلق بالتصاعد، مثل التنفس، طلب الدعم، أو المشي القصير.',
                bodyEn: 'Identify 3 practical steps you will take when anxiety starts rising, such as breathing, asking for support, or taking a short walk.',
              },
            ],
            takeaways: [
              'وجود خطة جاهزة يجعل التعامل مع القلق أسهل عند ظهوره.',
            ],
            takeawaysEn: [
              'Having a prepared plan makes anxiety easier to handle when it appears.',
            ],
          },
          {
            id: 'l2',
            title: 'تحدياتك الشخصية',
            titleEn: 'Your Personal Challenges',
            summary: 'حدد المواقف أو الأنماط التي لا تزال تحتاج منك انتباهاً ودعماً إضافياً.',
            summaryEn: 'Identify the situations or patterns that still need more attention and support from you.',
            duration: '10 دقائق',
            durationEn: '10 min',
            sections: [
              {
                id: 's1',
                heading: 'تحدياتك الشخصية',
                headingEn: 'Your Personal Challenges',
                body: 'فكّر في أكثر المواقف التي تعيد القلق بسرعة، وما المهارات التي تحتاج لتقويتها.',
                bodyEn: 'Think about the situations that bring anxiety back quickly and the skills you still need to strengthen.',
              },
            ],
            reflectionPrompt: 'ما التحديات الشخصية التي ما زالت ترفع قلقك؟ وما المهارة التي تريد تطويرها للتعامل معها؟',
            reflectionPromptEn: 'What personal challenges still increase your anxiety, and which skill do you want to strengthen to handle them?',
            notePlaceholder: 'اكتب تحدياتك هنا...',
            notePlaceholderEn: 'Write your challenges here...',
            takeaways: [
              'فهم التحديات المتبقية يساعدك على مواصلة التقدم بوعي أكبر.',
            ],
            takeawaysEn: [
              'Understanding your remaining challenges helps you continue progressing more intentionally.',
            ],
          },
          {
            id: 'l3',
            title: 'مراجعة مع هادي',
            titleEn: 'Review with Hadee',
            summary: 'استخدم المحادثة لمراجعة ما تعلمته وما تريد التركيز عليه لاحقاً.',
            summaryEn: 'Use the chat to review what you learned and what you want to focus on next.',
            duration: '10 دقائق',
            durationEn: '10 min',
            sections: [
              {
                id: 's1',
                heading: 'مراجعة مع هادي',
                headingEn: 'Review with Hadee',
                body: 'تحدث مع هادي عن تقدمك، وما المهارات التي ساعدتك أكثر، وما الذي تريد الاستمرار عليه.',
                bodyEn: 'Talk with Hadee about your progress, which skills helped most, and what you want to keep practicing.',
              },
            ],
            action: {
              type: 'chat',
              label: 'ابدأ المراجعة مع هادي',
              labelEn: 'Start Reviewing with Hadee',
              description: 'سينقلك إلى صفحة المحادثة لمراجعة رحلتك.',
              descriptionEn: 'This opens the chat page to review your journey.',
            },
            takeaways: [
              'مراجعة التقدم تعزز الإحساس بالقدرة والاستمرار.',
            ],
            takeawaysEn: [
              'Reviewing progress strengthens your sense of capability and continuation.',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'sleep',
    title: 'تحسين النوم',
    titleEn: 'Better Sleep',
    description: 'استراتيجيات مثبتة علمياً لتحسين جودة نومك والاستيقاظ بنشاط.',
    descriptionEn: 'Evidence-based strategies to improve sleep quality and wake up refreshed.',
    duration: '3 أسابيع',
    durationEn: '3 Weeks',
    units_count: 7,
    progress: 14,
    icon: Moon,
    color: '#3b82f6',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=2070&auto=format&fit=crop',
    units: [
      {
        id: 'u1',
        title: 'علم النوم',
        titleEn: 'Sleep Science',
        description: 'تعرّف لماذا النوم مهم وكيف تعمل مراحله الأساسية.',
        descriptionEn: 'Learn why sleep matters and how its main stages work.',
        moduleIndex: 0,
        lessonIndex: 0,
        isLocked: false,
        isCompleted: true,
      },
      {
        id: 'u2',
        title: 'تقييم نومك',
        titleEn: 'Assess Your Sleep',
        description: 'راجع روتين نومك الحالي وما الذي يؤثر على جودته.',
        descriptionEn: 'Review your current sleep routine and what affects its quality.',
        moduleIndex: 0,
        lessonIndex: 1,
        isLocked: false,
        isCompleted: false,
      },
      {
        id: 'u3',
        title: 'غرفة النوم المثالية',
        titleEn: 'The Ideal Bedroom',
        description: 'هيّئ البيئة المناسبة لنوم أكثر راحة وهدوءاً.',
        descriptionEn: 'Prepare the right environment for calmer, more restful sleep.',
        moduleIndex: 1,
        lessonIndex: 0,
        isLocked: true,
        isCompleted: false,
      },
      {
        id: 'u4',
        title: 'تمرين الاسترخاء للنوم',
        titleEn: 'Sleep Relaxation Exercise',
        description: 'استرخاء عضلي تدريجي يساعدك على تهدئة الجسم قبل النوم.',
        descriptionEn: 'A progressive relaxation exercise to calm the body before sleep.',
        moduleIndex: 1,
        lessonIndex: 1,
        isLocked: true,
        isCompleted: false,
      },
      {
        id: 'u5',
        title: 'روتين ما قبل النوم',
        titleEn: 'Pre-Sleep Routine',
        description: 'خطوات هادئة تساعدك على الاستعداد للنوم.',
        descriptionEn: 'Calm steps that help you prepare for sleep.',
        moduleIndex: 2,
        lessonIndex: 0,
        isLocked: true,
        isCompleted: false,
      },
      {
        id: 'u6',
        title: 'خطة روتينك',
        titleEn: 'Your Sleep Plan',
        description: 'صمم روتينك الخاص قبل النوم بالطريقة المناسبة لك.',
        descriptionEn: 'Design a bedtime routine that fits your needs.',
        moduleIndex: 2,
        lessonIndex: 1,
        isLocked: true,
        isCompleted: false,
      },
      {
        id: 'u7',
        title: 'تأمل النوم مع هادي',
        titleEn: 'Sleep Reflection with Hadee',
        description: 'تحدث مع هادي عن أفكارك وعوائقك قبل النوم.',
        descriptionEn: 'Talk with Hadee about your thoughts and bedtime obstacles.',
        moduleIndex: 2,
        lessonIndex: 2,
        isLocked: true,
        isCompleted: false,
      },
    ],
    modules: [
      {
        id: 'm1',
        title: 'أساسيات النوم الصحي',
        titleEn: 'Healthy Sleep Basics',
        description: 'فهم أهمية النوم وتقييم عاداتك الحالية لبناء بداية صحيحة.',
        descriptionEn: 'Understand the importance of sleep and assess your current habits to build a healthy starting point.',
        lessons: [
          {
            id: 'l1',
            title: 'علم النوم',
            titleEn: 'Sleep Science',
            summary: 'تعرّف لماذا النوم مهم، وما هي مراحله، وكيف تؤثر قلة النوم على يومك وصحتك.',
            summaryEn: 'Learn why sleep is important, what its stages are, and how poor sleep affects your day and health.',
            duration: '5 دقائق',
            durationEn: '5 min',
            sections: [
              {
                id: 's1',
                heading: 'لماذا النوم مهم؟',
                headingEn: 'Why Is Sleep Important?',
                body: 'النوم ليس رفاهية، بل ضرورة للصحة النفسية والجسدية.',
                bodyEn: 'Sleep is not a luxury. It is essential for both mental and physical health.',
              },
              {
                id: 's2',
                heading: 'مراحل النوم:',
                headingEn: 'Sleep Stages',
                body: '',
                bodyEn: '',
                items: [
                  'النوم الخفيف: الانتقال للنوم',
                  'النوم العميق: إصلاح الجسم',
                  'نوم REM: معالجة الذكريات والأحلام',
                ],
                itemsEn: [
                  'Light sleep: transition into sleep',
                  'Deep sleep: body restoration',
                  'REM sleep: processing memories and dreams',
                ],
              },
              {
                id: 's3',
                heading: 'تأثير قلة النوم:',
                headingEn: 'Effects of Poor Sleep',
                body: '',
                bodyEn: '',
                items: [
                  'ضعف التركيز',
                  'تقلب المزاج',
                  'زيادة القلق',
                  'ضعف المناعة',
                ],
                itemsEn: [
                  'Poor concentration',
                  'Mood changes',
                  'Increased anxiety',
                  'Weakened immunity',
                ],
              },
            ],
            takeaways: [
              'النوم الجيد أساس للتركيز والمزاج والصحة العامة.',
            ],
            takeawaysEn: [
              'Good sleep is a foundation for focus, mood, and overall health.',
            ],
          },
          {
            id: 'l2',
            title: 'تقييم نومك',
            titleEn: 'Assess Your Sleep',
            summary: 'صف روتين نومك الحالي لتتعرف على العادات والعوائق التي تؤثر على نومك.',
            summaryEn: 'Describe your current sleep routine to identify habits and barriers affecting your sleep.',
            duration: '10 دقائق',
            durationEn: '10 min',
            sections: [
              {
                id: 's1',
                heading: 'تقييم نومك',
                headingEn: 'Assess Your Sleep',
                body: 'لاحظ كيف يمر يومك قبل النوم، ومتى تنام، وكم ساعة تحصل عليها، وكيف تشعر عند الاستيقاظ.',
                bodyEn: 'Notice what your day looks like before sleep, when you go to bed, how many hours you get, and how you feel when you wake up.',
              },
            ],
            reflectionPrompt: 'صف روتين نومك الحالي: متى تنام؟ كم ساعة؟ كيف تشعر عند الاستيقاظ؟ ما الذي يمنعك من النوم الجيد؟',
            reflectionPromptEn: 'Describe your current sleep routine: When do you sleep? How many hours do you get? How do you feel on waking? What keeps you from sleeping well?',
            notePlaceholder: 'اكتب ملاحظاتك هنا...',
            notePlaceholderEn: 'Write your notes here...',
            takeaways: [
              'ملاحظة روتينك الحالي هي أول خطوة لبناء نوم أفضل.',
            ],
            takeawaysEn: [
              'Observing your current routine is the first step toward better sleep.',
            ],
          },
        ],
      },
      {
        id: 'm2',
        title: 'غرفة النوم المثالية',
        titleEn: 'The Ideal Sleep Space',
        description: 'تهيئة البيئة والهدوء الجسدي لتسهيل الاسترخاء والنوم.',
        descriptionEn: 'Prepare the environment and calm your body to make sleep easier.',
        lessons: [
          {
            id: 'l1',
            title: 'غرفة النوم المثالية',
            titleEn: 'The Ideal Bedroom',
            summary: 'عدّل عناصر غرفتك الأساسية لتجعلها أكثر ملاءمة للنوم الهادئ والمريح.',
            summaryEn: 'Adjust the key parts of your room to make it more suitable for calm and restful sleep.',
            duration: '5 دقائق',
            durationEn: '5 min',
            sections: [
              {
                id: 's1',
                heading: 'تهيئة بيئة النوم',
                headingEn: 'Preparing the Sleep Environment',
                body: '',
                bodyEn: '',
              },
              {
                id: 's2',
                heading: 'العوامل المهمة:',
                headingEn: 'Important Factors',
                body: '',
                bodyEn: '',
                items: [
                  'الظلام: استخدم ستائر معتمة',
                  'الهدوء: قلل الضوضاء',
                  'البرودة: 18-20 درجة مئوية',
                  'الراحة: فراش ووسائد مريحة',
                ],
                itemsEn: [
                  'Darkness: use blackout curtains',
                  'Quiet: reduce noise',
                  'Cool temperature: 18-20 C',
                  'Comfort: supportive mattress and pillows',
                ],
              },
              {
                id: 's3',
                heading: 'ابتعد عن:',
                headingEn: 'Avoid',
                body: '',
                bodyEn: '',
                items: [
                  'الشاشات قبل النوم بساعة',
                  'الكافيين بعد الظهر',
                  'الوجبات الثقيلة قبل النوم',
                ],
                itemsEn: [
                  'Screens during the hour before bed',
                  'Caffeine after noon',
                  'Heavy meals before sleep',
                ],
              },
            ],
            takeaways: [
              'بيئة النوم المناسبة تساعد جسمك على الاسترخاء بشكل أسرع.',
            ],
            takeawaysEn: [
              'The right sleep environment helps your body relax faster.',
            ],
          },
          {
            id: 'l2',
            title: 'تمرين الاسترخاء للنوم',
            titleEn: 'Sleep Relaxation Exercise',
            summary: 'استخدم الاسترخاء العضلي التدريجي لتهدئة الجسم وإرسال إشارة واضحة بأن وقت النوم قد حان.',
            summaryEn: 'Use progressive muscle relaxation to calm your body and signal that it is time for sleep.',
            duration: '10 دقائق',
            durationEn: '10 min',
            sections: [
              {
                id: 's1',
                heading: 'استرخاء عضلي تدريجي',
                headingEn: 'Progressive Muscle Relaxation',
                body: 'هذا التمرين يساعدك على إرخاء الجسم تدريجياً من الرأس إلى القدمين قبل النوم.',
                bodyEn: 'This exercise helps you relax the body gradually from head to toe before sleep.',
              },
            ],
            action: {
              type: 'breathing',
              label: 'ابدأ جلسة الاسترخاء',
              labelEn: 'Start Relaxation Session',
              description: 'سينقلك إلى صفحة التنفس والاسترخاء داخل التطبيق.',
              descriptionEn: 'This takes you to the in-app breathing and relaxation page.',
            },
            takeaways: [
              'تهدئة الجسم قبل النوم تقلل التوتر وتسهل الدخول في النوم.',
            ],
            takeawaysEn: [
              'Calming the body before bed reduces tension and makes it easier to fall asleep.',
            ],
          },
        ],
      },
      {
        id: 'm3',
        title: 'روتين النوم',
        titleEn: 'Sleep Routine',
        description: 'بناء عادات نوم صحية',
        descriptionEn: 'Build healthy sleep habits',
        lessons: [
          {
            id: 'l1',
            title: 'روتين ما قبل النوم',
            titleEn: 'Pre-Sleep Routine',
            summary: 'رتّب خطوات هادئة قبل النوم لتساعد جسمك وعقلك على الانتقال التدريجي إلى الراحة.',
            summaryEn: 'Create calm pre-sleep steps that help your body and mind shift gradually into rest.',
            duration: '5 دقائق',
            durationEn: '5 min',
            sections: [
              {
                id: 's1',
                heading: 'بناء روتين النوم',
                headingEn: 'Building a Sleep Routine',
                body: '',
                bodyEn: '',
              },
              {
                id: 's2',
                heading: 'ساعة قبل النوم:',
                headingEn: 'One Hour Before Sleep',
                body: '',
                bodyEn: '',
                items: [
                  'أغلق الشاشات',
                  'خفف الإضاءة',
                  'نشاط هادئ (قراءة، تأمل)',
                  'تنظيف وتحضير للنوم',
                ],
                itemsEn: [
                  'Turn off screens',
                  'Dim the lights',
                  'Do a calm activity like reading or reflection',
                  'Wash up and prepare for bed',
                ],
              },
              {
                id: 's3',
                heading: 'في السرير:',
                headingEn: 'In Bed',
                body: '',
                bodyEn: '',
                items: [
                  'تمارين التنفس',
                  'فحص الجسم',
                  'تصور مكان هادئ',
                ],
                itemsEn: [
                  'Breathing exercises',
                  'Body scan',
                  'Imagine a peaceful place',
                ],
              },
            ],
            takeaways: [
              'الروتين الثابت يعلّم الجسم أن هذا الوقت مخصص للهدوء والنوم.',
            ],
            takeawaysEn: [
              'A consistent routine teaches the body that this time is for calm and sleep.',
            ],
          },
          {
            id: 'l2',
            title: 'خطة روتينك',
            titleEn: 'Your Sleep Plan',
            summary: 'صمم روتين النوم الخاص بك: ماذا ستفعل في الساعة الأخيرة قبل النوم؟ كيف ستلتزم به؟',
            summaryEn: 'Design your own bedtime routine: What will you do in the final hour before sleep, and how will you stick to it?',
            duration: '10 دقائق',
            durationEn: '10 min',
            sections: [
              {
                id: 's1',
                heading: 'خطط لروتينك',
                headingEn: 'Plan Your Routine',
                body: 'أنشئ خطوات بسيطة وواضحة تساعدك على الانتقال من انشغال اليوم إلى هدوء الليل.',
                bodyEn: 'Create simple and clear steps that help you shift from the busyness of the day to the calm of the night.',
              },
            ],
            reflectionPrompt: 'صمم روتين النوم الخاص بك: ماذا ستفعل في الساعة الأخيرة قبل النوم؟ كيف ستلتزم به؟',
            reflectionPromptEn: 'Design your bedtime routine: What will you do in the last hour before sleep? How will you stick to it?',
            notePlaceholder: 'اكتب أفكارك هنا...',
            notePlaceholderEn: 'Write your ideas here...',
            takeaways: [
              'الخطة الواضحة تجعل الالتزام بروتين النوم أسهل مع الوقت.',
            ],
            takeawaysEn: [
              'A clear plan makes it easier to stay consistent with your bedtime routine over time.',
            ],
          },
          {
            id: 'l3',
            title: 'تأمل النوم مع هادي',
            titleEn: 'Sleep Reflection with Hadee',
            summary: 'إذا أردت دعماً إضافياً، تحدث مع هادي عن القلق أو الأفكار التي تمنعك من النوم.',
            summaryEn: 'If you want extra support, talk with Hadee about the worries or thoughts that keep you awake.',
            duration: '10 دقائق',
            durationEn: '10 min',
            sections: [
              {
                id: 's1',
                heading: 'تأمل النوم مع هادي',
                headingEn: 'Sleep Reflection with Hadee',
                body: 'يمكنك استخدام المحادثة للتعبير عن أفكارك قبل النوم وتنظيم ما يشغلك بشكل أهدأ.',
                bodyEn: 'You can use the chat to express your thoughts before sleep and organize what is on your mind more calmly.',
              },
            ],
            action: {
              type: 'chat',
              label: 'ابدأ الحديث مع هادي',
              labelEn: 'Start Talking with Hadee',
              description: 'سينقلك إلى صفحة المحادثة لمتابعة أفكارك قبل النوم.',
              descriptionEn: 'This opens the chat page to continue reflecting before sleep.',
            },
            takeaways: [
              'التعبير عما يشغلك قد يساعدك على النوم بهدوء أكبر.',
            ],
            takeawaysEn: [
              'Expressing what is on your mind can help you sleep more peacefully.',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'self-esteem',
    title: 'بناء تقدير الذات',
    titleEn: 'Building Self-Esteem',
    description: 'رحلة لاكتشاف قيمتك الحقيقية وتعزيز ثقتك بنفسك.',
    descriptionEn: 'A journey to discover your true value and build lasting confidence.',
    duration: '4 أسابيع',
    durationEn: '4 Weeks',
    units_count: 9,
    progress: 11,
    icon: Heart,
    color: '#f43f5e',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=2070&auto=format&fit=crop',
    units: [
      {
        id: 'u1',
        title: 'ما هو تقدير الذات؟',
        titleEn: 'What Is Self-Esteem?',
        description: 'فهم كيف ترى نفسك ولماذا يؤثر ذلك على حياتك.',
        descriptionEn: 'Understand how you see yourself and why it affects your life.',
        moduleIndex: 0,
        lessonIndex: 0,
        isLocked: false,
        isCompleted: true,
      },
      {
        id: 'u2',
        title: 'صوتك الداخلي',
        titleEn: 'Your Inner Voice',
        description: 'لاحظ كيف تتحدث مع نفسك في المواقف اليومية.',
        descriptionEn: 'Notice how you talk to yourself in daily situations.',
        moduleIndex: 0,
        lessonIndex: 1,
        isLocked: false,
        isCompleted: false,
      },
      {
        id: 'u3',
        title: 'الناقد الداخلي',
        titleEn: 'The Inner Critic',
        description: 'تعلّم كيف تحدد صوت النقد الداخلي وتخفف تأثيره.',
        descriptionEn: 'Learn how to identify the inner critic and reduce its impact.',
        moduleIndex: 1,
        lessonIndex: 0,
        isLocked: true,
        isCompleted: false,
      },
      {
        id: 'u4',
        title: 'إعادة صياغة',
        titleEn: 'Reframing',
        description: 'استبدل النقد الذاتي بلغة أكثر دعماً واتزاناً.',
        descriptionEn: 'Replace self-criticism with more supportive and balanced language.',
        moduleIndex: 1,
        lessonIndex: 1,
        isLocked: true,
        isCompleted: false,
      },
      {
        id: 'u5',
        title: 'نقاط قوتك',
        titleEn: 'Your Strengths',
        description: 'التعرّف على قيمتك الحقيقية.',
        descriptionEn: 'Recognize your true worth.',
        moduleIndex: 2,
        lessonIndex: 0,
        isLocked: true,
        isCompleted: false,
      },
      {
        id: 'u6',
        title: 'قائمة نقاط قوتك',
        titleEn: 'Your Strengths List',
        description: 'دوّن نقاط قوتك وإنجازاتك وصفاتك المميزة.',
        descriptionEn: 'Write down your strengths, achievements, and qualities.',
        moduleIndex: 2,
        lessonIndex: 1,
        isLocked: true,
        isCompleted: false,
      },
      {
        id: 'u7',
        title: 'حوار مع هادي',
        titleEn: 'Talk with Hadee',
        description: 'راجع نقاط قوتك مع هادي.',
        descriptionEn: 'Review your strengths with Hadee.',
        moduleIndex: 2,
        lessonIndex: 2,
        isLocked: true,
        isCompleted: false,
      },
      {
        id: 'u8',
        title: 'ما هو التعاطف مع الذات؟',
        titleEn: 'What Is Self-Compassion?',
        description: 'معاملة نفسك بلطف.',
        descriptionEn: 'Treat yourself with kindness.',
        moduleIndex: 3,
        lessonIndex: 0,
        isLocked: true,
        isCompleted: false,
      },
      {
        id: 'u9',
        title: 'رسالة لنفسك',
        titleEn: 'A Letter to Yourself',
        description: 'اكتب لنفسك رسالة دعم وتقدير.',
        descriptionEn: 'Write yourself a message of support and appreciation.',
        moduleIndex: 3,
        lessonIndex: 1,
        isLocked: true,
        isCompleted: false,
      },
    ],
    modules: [
      {
        id: 'm1',
        title: 'فهم تقدير الذات',
        titleEn: 'Understanding Self-Esteem',
        description: 'ما هو وكيف يتشكل',
        descriptionEn: 'What it is and how it forms',
        lessons: [
          {
            id: 'l1',
            title: 'ما هو تقدير الذات؟',
            titleEn: 'What Is Self-Esteem?',
            summary: 'تقدير الذات هو كيف ترى نفسك وقيمتك. يؤثر على قراراتك، علاقاتك، وثقتك في حياتك اليومية.',
            summaryEn: 'Self-esteem is how you see yourself and your worth. It affects your choices, relationships, and confidence in daily life.',
            duration: '5 دقائق',
            durationEn: '5 min',
            sections: [
              {
                id: 's1',
                heading: 'ما هو تقدير الذات؟',
                headingEn: 'What Is Self-Esteem?',
                body: 'هو الصورة التي تحملها عن نفسك، وما إذا كنت ترى أنك شخص ذو قيمة وقدرة.',
                bodyEn: 'It is the picture you hold about yourself and whether you see yourself as a person of worth and ability.',
              },
              {
                id: 's2',
                heading: 'كيف يتشكل؟',
                headingEn: 'How Does It Form?',
                body: '',
                bodyEn: '',
                items: [
                  'من التجارب السابقة',
                  'من طريقة كلام الآخرين معنا',
                  'من الطريقة التي نتحدث بها مع أنفسنا',
                ],
                itemsEn: [
                  'From past experiences',
                  'From how others speak to us',
                  'From how we speak to ourselves',
                ],
              },
            ],
            takeaways: [
              'تقدير الذات ليس ثابتاً ويمكن بناؤه مع الوقت.',
            ],
            takeawaysEn: [
              'Self-esteem is not fixed and can be built over time.',
            ],
          },
          {
            id: 'l2',
            title: 'صوتك الداخلي',
            titleEn: 'Your Inner Voice',
            summary: 'كيف تتحدث مع نفسك؟ اكتب بعض الجمل التي تقولها لنفسك عادة. هل ستقول نفس الكلام لصديق؟',
            summaryEn: 'How do you talk to yourself? Write some of the phrases you usually say to yourself. Would you say the same thing to a friend?',
            duration: '10 دقائق',
            durationEn: '10 min',
            sections: [
              {
                id: 's1',
                heading: 'صوتك الداخلي',
                headingEn: 'Your Inner Voice',
                body: 'راقب العبارات التي تكررها لنفسك عندما تخطئ أو تشعر بالضعف.',
                bodyEn: 'Notice the phrases you repeat to yourself when you make a mistake or feel vulnerable.',
              },
            ],
            reflectionPrompt: 'كيف تتحدث مع نفسك؟ اكتب بعض الجمل التي تقولها لنفسك عادة. هل ستقول نفس الكلام لصديق؟',
            reflectionPromptEn: 'How do you talk to yourself? Write some phrases you often say to yourself. Would you say the same thing to a friend?',
            notePlaceholder: 'اكتب أفكارك هنا...',
            notePlaceholderEn: 'Write your thoughts here...',
            takeaways: [
              'ملاحظة صوتك الداخلي هي بداية تغييره.',
            ],
            takeawaysEn: [
              'Noticing your inner voice is the first step to changing it.',
            ],
          },
        ],
      },
      {
        id: 'm2',
        title: 'تحدي الناقد الداخلي',
        titleEn: 'Challenge the Inner Critic',
        description: 'تغيير الحوار الداخلي السلبي',
        descriptionEn: 'Change negative self-talk',
        lessons: [
          {
            id: 'l1',
            title: 'الناقد الداخلي',
            titleEn: 'The Inner Critic',
            summary: 'صوت في رأسك يحكم عليك بقسوة. تعلّم ملاحظته وفهم طريقته.',
            summaryEn: 'A voice in your head that judges you harshly. Learn to notice it and understand how it works.',
            duration: '7 دقائق',
            durationEn: '7 min',
            sections: [
              {
                id: 's1',
                heading: 'ترويض الناقد الداخلي',
                headingEn: 'Taming the Inner Critic',
                body: 'صوت داخلي يحكم عليك بقسوة.',
                bodyEn: 'An inner voice that judges you harshly.',
              },
              {
                id: 's2',
                heading: 'كيف تتعامل معه؟',
                headingEn: 'How to Deal with It',
                body: '',
                bodyEn: '',
                items: [
                  'لاحظه: انتبه متى يظهر',
                  'سمّه: "هذا ناقدي الداخلي"',
                  'تحداه: هل هذا حقيقي؟',
                  'استبدله: ماذا سأقول لصديق؟',
                ],
                itemsEn: [
                  'Notice it: pay attention to when it appears',
                  'Name it: "this is my inner critic"',
                  'Challenge it: is this really true?',
                  'Replace it: what would I say to a friend?',
                ],
              },
            ],
            practice: 'حول "أنا فاشل" إلى "أنا أتعلم وأنمو".',
            practiceEn: 'Turn "I am a failure" into "I am learning and growing."',
            takeaways: [
              'الناقد الداخلي ليس حقيقة مطلقة، بل نمط يمكن تعديله.',
            ],
            takeawaysEn: [
              'The inner critic is not absolute truth. It is a pattern that can be changed.',
            ],
          },
          {
            id: 'l2',
            title: 'إعادة صياغة',
            titleEn: 'Reframing',
            summary: 'أعد كتابة الجمل القاسية بطريقة أكثر اتزاناً ولطفاً مع نفسك.',
            summaryEn: 'Rewrite harsh self-talk in a more balanced and compassionate way.',
            duration: '15 دقيقة',
            durationEn: '15 min',
            sections: [],
            exercise: {
              type: 'multi_step_reflection',
              steps: [
                {
                  id: 'step-1',
                  title: 'الفكرة السلبية',
                  titleEn: 'Negative Thought',
                  prompt: 'ما هي الفكرة السلبية التي تراودك؟',
                  promptEn: 'What is the negative thought that keeps coming to you?',
                  placeholder: 'اكتب إجابتك هنا...',
                  placeholderEn: 'Write your answer here...',
                },
                {
                  id: 'step-2',
                  title: 'المشاعر',
                  titleEn: 'Emotions',
                  prompt: 'ما المشاعر التي تثيرها هذه الفكرة؟ (مثل: قلق، حزن، غضب)',
                  promptEn: 'What emotions does this thought trigger? (For example: anxiety, sadness, anger)',
                  placeholder: 'اكتب إجابتك هنا...',
                  placeholderEn: 'Write your answer here...',
                },
                {
                  id: 'step-3',
                  title: 'الدليل المؤيد',
                  titleEn: 'Evidence For',
                  prompt: 'ما الأدلة التي تدعم هذه الفكرة؟',
                  promptEn: 'What evidence supports this thought?',
                  placeholder: 'اكتب إجابتك هنا...',
                  placeholderEn: 'Write your answer here...',
                },
                {
                  id: 'step-4',
                  title: 'الدليل المعارض',
                  titleEn: 'Evidence Against',
                  prompt: 'ما الأدلة التي تعارض هذه الفكرة؟',
                  promptEn: 'What evidence challenges this thought?',
                  placeholder: 'اكتب إجابتك هنا...',
                  placeholderEn: 'Write your answer here...',
                },
                {
                  id: 'step-5',
                  title: 'البديل المتوازن',
                  titleEn: 'Balanced Alternative',
                  prompt: 'ما الفكرة البديلة الأكثر توازناً وواقعية؟',
                  promptEn: 'What is the more balanced and realistic alternative thought?',
                  placeholder: 'اكتب إجابتك هنا...',
                  placeholderEn: 'Write your answer here...',
                },
              ],
            },
            takeaways: [
              'اللغة التي تستخدمها مع نفسك تؤثر مباشرة على إحساسك بقيمتك.',
            ],
            takeawaysEn: [
              'The language you use with yourself directly shapes your sense of worth.',
            ],
          },
        ],
      },
      {
        id: 'm3',
        title: 'اكتشاف نقاط القوة',
        titleEn: 'Discover Your Strengths',
        description: 'التعرّف على قيمتك الحقيقية',
        descriptionEn: 'Recognize your true worth',
        lessons: [
          {
            id: 'l1',
            title: 'نقاط قوتك',
            titleEn: 'Your Strengths',
            summary: 'اكتشف نقاط قوتك',
            summaryEn: 'Discover your strengths',
            duration: '5 دقائق',
            durationEn: '5 min',
            sections: [
              {
                id: 's1',
                heading: 'اكتشف نقاط قوتك',
                headingEn: 'Discover Your Strengths',
                body: '',
                bodyEn: '',
                items: [
                  'شخصية: طيبة، صديق، شجاعة',
                  'مهارات: الإبداع، تنظيم، تواصل',
                  'إنجازات: نجاحات حققتها في حياتك',
                ],
                itemsEn: [
                  'Personal: kind, loyal, brave',
                  'Skills: creativity, organization, communication',
                  'Achievements: successes you reached in your life',
                ],
              },
              {
                id: 's2',
                heading: 'لماذا ننسى نقاط قوتنا؟',
                headingEn: 'Why Do We Forget Our Strengths?',
                body: '',
                bodyEn: '',
                items: [
                  'نركز على السلبيات',
                  'نقارن أنفسنا بالآخرين',
                  'نقلل من إنجازاتنا',
                ],
                itemsEn: [
                  'We focus on negatives',
                  'We compare ourselves to others',
                  'We downplay our achievements',
                ],
              },
            ],
            notePlaceholder: 'اكتب نقاط قوتك هنا...',
            notePlaceholderEn: 'Write your strengths here...',
            takeaways: [
              'ملاحظة نقاط قوتك تساعدك على رؤية نفسك بصورة أكثر توازناً.',
            ],
            takeawaysEn: [
              'Noticing your strengths helps you see yourself in a more balanced way.',
            ],
          },
          {
            id: 'l2',
            title: 'قائمة نقاط قوتك',
            titleEn: 'Your Strengths List',
            summary: 'اكتب 10 نقاط قوة لديك. فكر في ما يقوله الآخرون عنك، إنجازاتك، صفاتك الشخصية. لا تتواضع!',
            summaryEn: 'Write 10 strengths you have. Think about what others say about you, your achievements, and your personal qualities. Do not downplay them.',
            duration: '15 دقيقة',
            durationEn: '15 min',
            sections: [
              {
                id: 's1',
                heading: 'قائمة نقاط قوتك',
                headingEn: 'Your Strengths List',
                body: 'اكتب 10 نقاط قوة لديك. فكر في ما يقوله الآخرون عنك، إنجازاتك، صفاتك الشخصية. لا تتواضع!',
                bodyEn: 'Write 10 strengths you have. Think about what others say about you, your achievements, and your personal qualities. Do not downplay them.',
              },
            ],
            reflectionPrompt: 'اكتب 10 نقاط قوة لديك. فكر في ما يقوله الآخرون عنك، إنجازاتك، صفاتك الشخصية. لا تتواضع!',
            reflectionPromptEn: 'Write 10 strengths you have. Think about what others say about you, your achievements, and your personal qualities. Do not downplay them.',
            notePlaceholder: 'اكتب أفكارك هنا...',
            notePlaceholderEn: 'Write your thoughts here...',
            takeaways: [
              'كتابة نقاط قوتك بصوت واضح تساعدك على تذكّر قيمتك الحقيقية.',
            ],
            takeawaysEn: [
              'Writing your strengths clearly helps you remember your true worth.',
            ],
          },
          {
            id: 'l3',
            title: 'حوار مع هادي',
            titleEn: 'Talk with Hadee',
            summary: 'تحدث مع هادي عن نقاط قوتك وما الذي ترغب في تنميته أكثر.',
            summaryEn: 'Talk with Hadee about your strengths and what you want to grow even more.',
            duration: '10 دقائق',
            durationEn: '10 min',
            sections: [
              {
                id: 's1',
                heading: 'حوار مع هادي',
                headingEn: 'Talk with Hadee',
                body: 'يمكنك الآن مشاركة ما اكتشفته عن نقاط قوتك والصفات التي تريد استخدامها أكثر في حياتك اليومية.',
                bodyEn: 'You can now share what you discovered about your strengths and the qualities you want to use more in daily life.',
              },
            ],
            action: {
              type: 'chat',
              label: 'ابدأ الحوار مع هادي',
              labelEn: 'Start Chatting with Hadee',
              description: 'سينقلك إلى صفحة المحادثة للحديث عن نقاط قوتك.',
              descriptionEn: 'This opens the chat page to talk about your strengths.',
            },
            takeaways: [
              'مشاركة نقاط قوتك مع شخص داعم يساعدك على ترسيخها داخلياً.',
            ],
            takeawaysEn: [
              'Sharing your strengths with supportive guidance helps anchor them internally.',
            ],
          },
        ],
      },
      {
        id: 'm4',
        title: 'التعاطف مع الذات',
        titleEn: 'Self-Compassion',
        description: 'معاملة نفسك بلطف',
        descriptionEn: 'Treat yourself kindly',
        lessons: [
          {
            id: 'l1',
            title: 'ما هو التعاطف مع الذات؟',
            titleEn: 'What Is Self-Compassion?',
            summary: 'ما هو التعاطف مع الذات',
            summaryEn: 'What is self-compassion',
            duration: '5 دقائق',
            durationEn: '5 min',
            sections: [
              {
                id: 's1',
                heading: 'ما هو التعاطف مع الذات؟',
                headingEn: 'What Is Self-Compassion?',
                body: 'هو أن تعامل نفسك بلطف، خاصة عندما تخطئ أو تمر بوقت صعب، بدل أن تقسو عليها.',
                bodyEn: 'It means treating yourself kindly, especially when you make a mistake or go through a hard time, instead of being harsh on yourself.',
              },
            ],
            takeaways: [
              'اللطف مع النفس يعزز الاستمرار والنمو أكثر من القسوة.',
            ],
            takeawaysEn: [
              'Kindness toward yourself supports growth and consistency more than harshness.',
            ],
          },
          {
            id: 'l2',
            title: 'رسالة لنفسك',
            titleEn: 'A Letter to Yourself',
            summary: 'اكتب لنفسك رسالة من منظور شخص داعم ومحب، واذكر فيها ما تحتاج أن تسمعه اليوم.',
            summaryEn: 'Write yourself a letter from the perspective of someone supportive and caring, including what you need to hear today.',
            duration: '10 دقائق',
            durationEn: '10 min',
            sections: [
              {
                id: 's1',
                heading: 'رسالة لنفسك',
                headingEn: 'A Letter to Yourself',
                body: 'اكتب بلغة لطيفة ومشجعة تذكرك بقيمتك وإنسانيتك.',
                bodyEn: 'Write in a kind and encouraging voice that reminds you of your worth and humanity.',
              },
            ],
            reflectionPrompt: 'اكتب رسالة قصيرة لنفسك كما لو أنك تواسي صديقاً عزيزاً يمر بوقت صعب.',
            reflectionPromptEn: 'Write yourself a short letter as if you were comforting a dear friend going through a hard time.',
            notePlaceholder: 'اكتب رسالتك هنا...',
            notePlaceholderEn: 'Write your letter here...',
            takeaways: [
              'الرسائل الداعمة تساعدك على بناء علاقة أهدأ وأكثر قبولاً مع نفسك.',
            ],
            takeawaysEn: [
              'Supportive letters help you build a calmer and more accepting relationship with yourself.',
            ],
          },
        ],
      },
    ],
  },
];

let activeJourneyRouteState: ActiveJourneyRouteState = {};

export function setActiveJourneyRoute(journeyId?: string) {
  activeJourneyRouteState = {
    journeyId,
    moduleIndex: undefined,
    lessonIndex: undefined,
  };
}

export function setActiveJourneyLessonRoute(journeyId?: string, moduleIndex = 0, lessonIndex = 0) {
  activeJourneyRouteState = {
    journeyId,
    moduleIndex,
    lessonIndex,
  };
}

export function getActiveJourneyRoute() {
  return activeJourneyRouteState;
}

export function mergeJourneysWithProgress(progressMap?: Record<string, PersistedJourneyProgress> | null): Journey[] {
  return journeysData.map((journey) => {
    const saved = progressMap?.[journey.id];
    if (!saved) return journey;
    const savedUnits = Array.isArray(saved.units) ? saved.units : [];

    const units = journey.units.map((unit) => {
      const savedUnit = savedUnits.find((item) => item && item.id === unit.id);
      return savedUnit
        ? { ...unit, isLocked: savedUnit.isLocked, isCompleted: savedUnit.isCompleted }
        : unit;
    });

    return {
      ...journey,
      progress: typeof saved.progress === 'number' ? saved.progress : journey.progress,
      units,
    };
  });
}

export function findJourneyById(journeyId?: string) {
  return journeysData.find((journey) => journey.id === journeyId);
}

export function getJourneyLesson(journeyId?: string, moduleIndex = 0, lessonIndex = 0) {
  const journey = findJourneyById(journeyId);
  const module = journey?.modules?.[moduleIndex];
  const lesson = module?.lessons?.[lessonIndex];

  return { journey, module, lesson };
}

export function getUnitIndexForLesson(journey: Journey, moduleIndex: number, lessonIndex: number) {
  return journey.units.findIndex((unit) => unit.moduleIndex === moduleIndex && unit.lessonIndex === lessonIndex);
}

export function getNextLessonIndices(journey: Journey, moduleIndex: number, lessonIndex: number) {
  const currentModule = journey.modules?.[moduleIndex];
  if (!currentModule) return null;

  if (lessonIndex + 1 < currentModule.lessons.length) {
    return { moduleIndex, lessonIndex: lessonIndex + 1 };
  }

  const nextModule = journey.modules?.[moduleIndex + 1];
  if (!nextModule || nextModule.lessons.length === 0) return null;

  return { moduleIndex: moduleIndex + 1, lessonIndex: 0 };
}
