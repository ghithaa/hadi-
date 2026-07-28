import { apiClient } from '@/lib/api-client';
import { DrawingAnalysis, DrawingAnalysisResult, PaginationParams } from '@/types';

const colorTranslations: Record<string, string> = {
  red: 'الأحمر',
  blue: 'الأزرق',
  green: 'الأخضر',
  yellow: 'الأصفر',
  orange: 'البرتقالي',
  purple: 'البنفسجي',
  pink: 'الوردي',
  brown: 'البني',
  black: 'الأسود',
  white: 'الأبيض',
  gray: 'الرمادي',
  grey: 'الرمادي',
};

const themeTranslations: Record<string, string> = {
  nature: 'الطبيعة',
  'open space': 'المساحات المفتوحة',
  family: 'العائلة',
  home: 'المنزل',
  sun: 'الشمس',
  water: 'الماء',
  people: 'الأشخاص',
  animals: 'الحيوانات',
  isolation: 'العزلة',
  aggression: 'العدوانية',
  sadness: 'الحزن',
  joy: 'الفرح',
  fear: 'الخوف',
  anxiety: 'القلق',
};

function translateColor(color: string): string {
  const clean = color.toLowerCase().trim();
  return colorTranslations[clean] || color;
}

function translateTheme(theme: string): string {
  const clean = theme.toLowerCase().trim();
  return themeTranslations[clean] || theme;
}

export function mapBackendDrawingToFrontend(data: any): DrawingAnalysis {
  if (!data) return data;

  const backendResult = data.analysis_result !== undefined ? data.analysis_result : data.analysis;

  let mappedAnalysis: DrawingAnalysisResult | null = null;
  if (backendResult) {
    let observations = backendResult.observations || [];
    if (observations.length === 0) {
      const parts: string[] = [];
      if (backendResult.dominant_colors && backendResult.dominant_colors.length > 0) {
        const colorsStr = backendResult.dominant_colors.map(translateColor).join('، ');
        parts.push(`الألوان المهيمنة: ${colorsStr}`);
      }
      if (backendResult.themes && backendResult.themes.length > 0) {
        const themesStr = backendResult.themes.map(translateTheme).join('، ');
        parts.push(`السمات المكتشفة: ${themesStr}`);
      }
      observations = parts;
    }

    let emotionalTone = backendResult.interpretation || backendResult.emotional_tone || backendResult.emotionalTone || '';
    if (emotionalTone === 'calm') emotionalTone = 'الحالة العامة تدل على الهدوء والاسترخاء العاطفي.';
    else if (emotionalTone === 'happy' || emotionalTone === 'joy') emotionalTone = 'الرسمة تعكس مشاعر إيجابية وسعادة واستقراراً عاطفياً.';
    else if (emotionalTone === 'anxious' || emotionalTone === 'fear') emotionalTone = 'هناك مؤشرات طفيفة تدل على القلق أو التوتر العاطفي.';
    else if (emotionalTone === 'sad') emotionalTone = 'قد تشير الألوان والأنماط إلى مشاعر حزن أو انطواء.';

    mappedAnalysis = {
      themes: (backendResult.themes || []).map(translateTheme),
      emotionalTone: emotionalTone,
      observations: observations,
      insights: backendResult.insights || [],
    };
  }

  return {
    id: data.id,
    imagePath: data.image_url || data.imagePath || '',
    status: data.status,
    analysis: mappedAnalysis,
    createdAt: data.created_at || data.createdAt,
    analyzedAt: data.completed_at || data.analyzedAt,
    childName: data.childName || data.child_name || '',
    childAge: data.childAge || data.child_age || '',
  };
}

export const drawingService = {
  async analyzeDrawing(formData: FormData): Promise<DrawingAnalysis> {
    const raw = await apiClient.post<any>('/drawing/analyze', formData, { isMultipart: true });
    return mapBackendDrawingToFrontend(raw);
  },

  async getHistory(params?: PaginationParams): Promise<DrawingAnalysis[]> {
    const raw = await apiClient.get<any[]>('/drawing/history', params);
    return (raw || []).map(mapBackendDrawingToFrontend);
  },

  async getAnalysis(id: string): Promise<DrawingAnalysis> {
    const raw = await apiClient.get<any>(`/drawing/${id}`);
    return mapBackendDrawingToFrontend(raw);
  },
};
