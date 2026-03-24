import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { AppHeader } from '@/components/app-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Send, TrendingUp, TrendingDown, Minus } from 'lucide-react-native';
import { cn } from '@/lib/utils';

interface DetectedEmotion {
  name: string;
  intensity: number;
  color: string;
}

interface EmotionEntry {
  text: string;
  emotions: DetectedEmotion[];
  sentiment: "positive" | "negative" | "neutral";
  insight: string;
}

const emotionKeywords: Record<string, { emotions: string[]; sentiment: "positive" | "negative" | "neutral"; weight: number }> = {
  "سعيد": { emotions: ["فرح"], sentiment: "positive", weight: 8 },
  "سعادة": { emotions: ["فرح"], sentiment: "positive", weight: 9 },
  "فرح": { emotions: ["فرح"], sentiment: "positive", weight: 8 },
  "مبسوط": { emotions: ["فرح"], sentiment: "positive", weight: 7 },
  "حب": { emotions: ["حب"], sentiment: "positive", weight: 8 },
  "احب": { emotions: ["حب"], sentiment: "positive", weight: 7 },
  "شكر": { emotions: ["امتنان"], sentiment: "positive", weight: 7 },
  "الحمد": { emotions: ["امتنان"], sentiment: "positive", weight: 8 },
  "حزن": { emotions: ["حزن"], sentiment: "negative", weight: 7 },
  "حزين": { emotions: ["حزن"], sentiment: "negative", weight: 8 },
  "اكتئاب": { emotions: ["حزن"], sentiment: "negative", weight: 9 },
  "ضيق": { emotions: ["حزن", "قلق"], sentiment: "negative", weight: 7 },
  "قلق": { emotions: ["قلق"], sentiment: "negative", weight: 8 },
  "خوف": { emotions: ["خوف"], sentiment: "negative", weight: 8 },
  "غضب": { emotions: ["غضب"], sentiment: "negative", weight: 8 },
  "غاضب": { emotions: ["غضب"], sentiment: "negative", weight: 8 },
};

export default function EmotionsPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<EmotionEntry | null>(null);

  const analyzeEmotions = () => {
    if (!text.trim()) return;

    const words = text.split(/\s+/);
    const foundEmotions: Record<string, number> = {};
    let sentimentScore = 0;

    words.forEach(word => {
      // Simple exact match for now, could be improved with stemming
      const key = Object.keys(emotionKeywords).find(k => word.includes(k));
      if (key) {
        const data = emotionKeywords[key];
        data.emotions.forEach(e => {
          foundEmotions[e] = (foundEmotions[e] || 0) + data.weight;
        });
        sentimentScore += data.sentiment === 'positive' ? 1 : data.sentiment === 'negative' ? -1 : 0;
      }
    });

    const emotionsList: DetectedEmotion[] = Object.entries(foundEmotions).map(([name, intensity]) => ({
      name,
      intensity: Math.min(intensity, 10),
      color: intensity > 5 ? "bg-primary" : "bg-muted-foreground"
    })).sort((a, b) => b.intensity - a.intensity);

    const sentiment = sentimentScore > 0 ? "positive" : sentimentScore < 0 ? "negative" : "neutral";

    setResult({
      text,
      emotions: emotionsList.length > 0 ? emotionsList : [{ name: "حيادي", intensity: 5, color: "bg-muted" }],
      sentiment,
      insight: sentiment === 'positive' ? "مشاعرك تبدو إيجابية، حافظ على هذا التفاؤل!" : 
               sentiment === 'negative' ? "يبدو أنك تمر بوقت صعب، لا بأس من طلب المساعدة." : 
               "مشاعرك تبدو متزنة وهادئة."
    });
  };

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
              <Button onPress={analyzeEmotions} disabled={!text.trim()}>
                <View className="flex-row items-center gap-2">
                  <Text>تحليل المشاعر</Text>
                  <Sparkles size={16} className="text-primary-foreground" />
                </View>
              </Button>
            </CardContent>
          </Card>

          {result && (
            <View className="gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card>
                <CardHeader>
                  <CardTitle>نتيجة التحليل</CardTitle>
                </CardHeader>
                <CardContent className="gap-6">
                  <View className="flex-row items-center justify-between p-4 bg-muted rounded-lg">
                    <View className="flex-row items-center gap-2">
                      <Text className={cn(
                        "font-bold text-lg",
                        result.sentiment === 'positive' ? "text-green-600" :
                        result.sentiment === 'negative' ? "text-red-600" : "text-gray-600"
                      )}>
                        {result.sentiment === 'positive' ? "إيجابي" :
                         result.sentiment === 'negative' ? "سلبي" : "محايد"}
                      </Text>
                      {result.sentiment === 'positive' ? <TrendingUp size={20} className="text-green-600" /> :
                       result.sentiment === 'negative' ? <TrendingDown size={20} className="text-red-600" /> :
                       <Minus size={20} className="text-gray-600" />}
                    </View>
                    <Text className="text-sm font-medium">الحالة العامة</Text>
                  </View>

                  <View className="gap-3">
                    <Text className="text-right font-medium">المشاعر المكتشفة</Text>
                    <View className="flex-row flex-wrap justify-end gap-2">
                      {result.emotions.map((emotion, i) => (
                        <Badge key={i} variant="secondary" className="px-3 py-1">
                          <Text>{emotion.name} ({emotion.intensity}/10)</Text>
                        </Badge>
                      ))}
                    </View>
                  </View>

                  <View className="p-4 bg-primary/5 border border-primary/10 rounded-lg">
                    <Text className="text-right text-sm text-foreground leading-relaxed">
                      {result.insight}
                    </Text>
                  </View>
                </CardContent>
              </Card>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
