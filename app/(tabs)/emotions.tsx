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

export default function EmotionsPage() {
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
              <CardTitle>كيف تشعر الآن؟</CardTitle>
              <CardDescription>اكتب ما يجول في خاطرك وسنقوم بتحليل مشاعرك</CardDescription>
            </CardHeader>
            <CardContent className="gap-4">
              <TextInput
                className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-right text-foreground"
                placeholder="اكتب هنا..."
                multiline
                textAlignVertical="top"
                value={text}
                onChangeText={setText}
              />
              <Button onPress={handleAnalyze} disabled={!text.trim() || analyzeEmotion.isPending}>
                <View className="flex-row items-center gap-2">
                  {analyzeEmotion.isPending ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <>
                      <Text className="text-primary-foreground">تحليل المشاعر</Text>
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
                  <CardTitle>نتيجة التحليل</CardTitle>
                </CardHeader>
                <CardContent className="gap-6">
                  <View className="flex-row items-center justify-between p-4 bg-muted rounded-lg">
                    <View className="flex-row items-center gap-2">
                      <Text className={cn(
                        "font-bold text-lg",
                        sentiment === 'positive' ? "text-green-600" :
                        sentiment === 'negative' ? "text-red-600" : "text-gray-600"
                      )}>
                        {sentiment === 'positive' ? "إيجابي" : sentiment === 'negative' ? "سلبي" : "محايد"}
                      </Text>
                      {sentiment === 'positive' ? <TrendingUp size={20} color="#16a34a" /> :
                       sentiment === 'negative' ? <TrendingDown size={20} color="#dc2626" /> :
                       <Minus size={20} color="#6b7280" />}
                    </View>
                    <Text className="text-sm font-medium">الحالة العامة</Text>
                  </View>

                  {result.detected_emotions && result.detected_emotions.length > 0 && (
                    <View className="gap-3">
                      <Text className="text-right font-medium">المشاعر المكتشفة</Text>
                      <View className="flex-row flex-wrap justify-end gap-2">
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
