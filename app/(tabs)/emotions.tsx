import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AppHeader } from '@/components/app-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, TrendingDown, Minus } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { useAnalyzeEmotion } from '@/hooks/use-emotions';
import { EmotionEntry } from '@/types';
import { useLocalization } from '@/context/LocalizationContext';

export default function EmotionsPage() {
  const { isRTL, flexDir, textAlign, alignItems } = useLocalization();
  const [text, setText] = useState('');
  const [result, setResult] = useState<EmotionEntry | null>(null);
  const analyzeEmotion = useAnalyzeEmotion();

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    try {
      const entry = await analyzeEmotion.mutateAsync({ text: text.trim() });
      setResult(entry);
    } catch {
      // Error handled by mutation
    }
  };

  const getSentiment = () => {
    if (!result?.detected_emotions?.length) return 'neutral';
    const topEmotion = result.detected_emotions[0];
    const positive = ['joy', 'love', 'gratitude', 'فرح', 'حب', 'امتنان'];
    const negative = ['sadness', 'anger', 'fear', 'anxiety', 'حزن', 'غضب', 'خوف', 'قلق'];
    if (positive.some(e => topEmotion.emotion_name.toLowerCase().includes(e))) return 'positive';
    if (negative.some(e => topEmotion.emotion_name.toLowerCase().includes(e))) return 'negative';
    return 'neutral';
  };

  const sentiment = result ? getSentiment() : null;

  return (
    <View className="flex-1 bg-background">
      <AppHeader />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="p-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className={textAlign()}>{isRTL ? 'كيف تشعر الآن؟' : 'How are you feeling now?'}</CardTitle>
              <CardDescription className={textAlign()}>{isRTL ? 'اكتب ما يجول في خاطرك وسنقوم بتحليل مشاعرك' : 'Write what\'s on your mind and we\'ll analyze your emotions'}</CardDescription>
            </CardHeader>
            <CardContent className="gap-4">
              <TextInput
                className={cn("min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground", textAlign())}
                placeholder={isRTL ? "اكتب هنا..." : "Write here..."}
                multiline
                textAlignVertical="top"
                value={text}
                onChangeText={setText}
              />
              <Button onPress={handleAnalyze} disabled={!text.trim() || analyzeEmotion.isPending}>
                <View className={cn("items-center gap-2", flexDir())}>
                  {analyzeEmotion.isPending ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <>
                      <Text className="text-primary-foreground">{isRTL ? 'تحليل المشاعر' : 'Analyze Emotions'}</Text>
                      <Sparkles size={16} color="white" />
                    </>
                  )}
                </View>
              </Button>
            </CardContent>
          </Card>

          {result && (
            <View className="gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className={textAlign()}>{isRTL ? 'نتيجة التحليل' : 'Analysis Result'}</CardTitle>
                </CardHeader>
                <CardContent className="gap-6">
                  <View className={cn("items-center justify-between p-4 bg-muted rounded-lg", flexDir())}>
                    <View className={cn("items-center gap-2", flexDir())}>
                      <Text className={cn(
                        "font-bold text-lg",
                        sentiment === 'positive' ? "text-green-600" :
                        sentiment === 'negative' ? "text-red-600" : "text-gray-600"
                      )}>
                        {sentiment === 'positive' ? (isRTL ? "إيجابي" : "Positive") :
                         sentiment === 'negative' ? (isRTL ? "سلبي" : "Negative") :
                         (isRTL ? "محايد" : "Neutral")}
                      </Text>
                      {sentiment === 'positive' ? <TrendingUp size={20} color="#16a34a" /> :
                       sentiment === 'negative' ? <TrendingDown size={20} color="#dc2626" /> :
                       <Minus size={20} color="#6b7280" />}
                    </View>
                    <Text className="text-sm font-medium">{isRTL ? 'الحالة العامة' : 'Overall State'}</Text>
                  </View>

                  {result.detected_emotions && result.detected_emotions.length > 0 && (
                    <View className="gap-3">
                      <Text className={cn("font-medium", textAlign())}>{isRTL ? 'المشاعر المكتشفة' : 'Detected Emotions'}</Text>
                      <View className={cn("flex-wrap gap-2", flexDir())}>
                        {result.detected_emotions.map((emotion, i) => (
                          <Badge key={i} variant="secondary" className="px-3 py-1">
                            <Text>{emotion.emotion_name} ({Math.round(emotion.score * 10)}/10)</Text>
                          </Badge>
                        ))}
                      </View>
                    </View>
                  )}
                </CardContent>
              </Card>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
