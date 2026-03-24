import { Box, Moon, Sun, Zap } from 'lucide-react-native';

export type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'hold-out';

export interface BreathingPattern {
  id: string;
  title: string;
  subtitle: string; // English/Secondary title
  description: string;
  icon: any;
  color: string; // For the icon background and theme
  timings: {
    inhale: number;
    hold: number;
    exhale: number;
    holdOut: number;
  };
  instructions: string; // e.g., "Inhale 4s • Hold 4s..."
}

export const patterns: BreathingPattern[] = [
  {
    id: 'box',
    title: 'تنفس الصندوق',
    subtitle: 'Box Breathing',
    description: 'تقنية فعالة للتهدئة السريعة',
    icon: Box,
    color: '#A855F7', // Purple
    timings: { inhale: 4000, hold: 4000, exhale: 4000, holdOut: 4000 },
    instructions: 'استنشق 4ث • احبس 4ث • أخرج 4ث • احبس 4ث',
  },
  {
    id: '4-7-8',
    title: 'تنفس 8-7-4',
    subtitle: 'Breathing 4-7-8',
    description: 'مثالي للنوم والاسترخاء العميق',
    icon: Moon,
    color: '#EC4899', // Pink
    timings: { inhale: 4000, hold: 7000, exhale: 8000, holdOut: 0 },
    instructions: 'استنشق 4ث • احبس 7ث • أخرج 8ث',
  },
  {
    id: 'calm',
    title: 'تنفس الهدوء',
    subtitle: 'Calming Breath',
    description: 'بسيط وفعال للتوتر اليومي',
    icon: Sun, // Using Sun as a placeholder for calm, maybe something else?
    color: '#14B8A6', // Teal
    timings: { inhale: 5000, hold: 0, exhale: 5000, holdOut: 0 },
    instructions: 'استنشق 5ث • أخرج 5ث',
  },
  {
    id: 'energy',
    title: 'تنفس الطاقة',
    subtitle: 'Energizing Breath',
    description: 'لتنشيط الجسم والعقل',
    icon: Zap,
    color: '#F97316', // Orange
    timings: { inhale: 2000, hold: 0, exhale: 2000, holdOut: 0 },
    instructions: 'استنشق 2ث • أخرج 2ث',
  },
];
