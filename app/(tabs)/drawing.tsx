import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, TextInput, Dimensions } from 'react-native';
import { AppHeader } from '@/components/app-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import * as ImagePicker from 'expo-image-picker';
import { Upload, Image as ImageIcon, AlertTriangle, Loader2, RefreshCw, Palette, Shapes, Maximize2, Lightbulb, ArrowRight } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AnalysisResult {
  colors: { name: string; meaning: string; percent: number }[];
  symbols: { name: string; interpretation: string }[];
  sizeAnalysis: string;
  overallReport: string;
  tips: string[];
  confidenceLevel: number;
}

const sampleResult: AnalysisResult = {
  colors: [
    { name: "الأزرق", meaning: "يشير إلى الهدوء والاستقرار العاطفي", percent: 35 },
    { name: "الأخضر", meaning: "يعكس النمو والتفاؤل والارتباط بالطبيعة", percent: 25 },
    { name: "الأصفر", meaning: "يدل على السعادة والطاقة الإيجابية", percent: 20 },
    { name: "الأحمر", meaning: "قد يشير إلى الحماس أو بعض المشاعر القوية", percent: 20 },
  ],
  symbols: [
    { name: "المنزل", interpretation: "يرمز إلى الأمان والانتماء العائلي" },
    { name: "الشمس", interpretation: "تعبير عن التفاؤل والدفء العاطفي" },
    { name: "الأشجار", interpretation: "ترمز إلى النمو والاستقرار النفسي" },
  ],
  sizeAnalysis: "الرسم يشغل معظم الصفحة مما يدل على ثقة الطفل بنفسه وشعوره بالأمان. العناصر موزعة بشكل متوازن.",
  overallReport: "بشكل عام، يُظهر الرسم مؤشرات إيجابية على الصحة النفسية للطفل. الألوان المستخدمة متنوعة ومبهجة، والرموز تشير إلى شعور بالأمان والانتماء. الطفل يبدو مستقراً عاطفياً مع مستوى جيد من الثقة بالنفس.",
  tips: [
    "شجّع طفلك على الاستمرار في الرسم والتعبير عن مشاعره",
    "تحدث مع طفلك عن رسمه واسأله عن القصة وراءه",
    "وفّر بيئة آمنة ومحفزة للإبداع",
    "لاحظ أي تغييرات مفاجئة في أسلوب الرسم أو الألوان المستخدمة",
  ],
  confidenceLevel: 72,
};

export default function DrawingPage() {
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("");
  const [step, setStep] = useState(1); // 1: Info/Form, 2: Upload/Analyze, 3: Result
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setResult(null);
    }
  };

  const handleAnalyze = () => {
    if (!image) return;
    setAnalyzing(true);
    setTimeout(() => {
      setResult(sampleResult);
      setAnalyzing(false);
    }, 3000);
  };

  return (
    <View className="flex-1 bg-background">
      <View className="bg-background pb-2">
        <AppHeader />
      </View>

      {/* Organic Background Blobs */}
      <View className="absolute inset-0 overflow-hidden opacity-[0.1]">
        <View
          className="absolute -top-20 -left-20 h-[400px] w-[400px] rounded-full bg-orange-200/20"
          style={{ transform: [{ scaleX: 1.5 }, { rotate: '45deg' }] }}
        />
        <View
          className="absolute top-1/4 -right-40 h-[350px] w-[350px] rounded-full bg-primary/10"
          style={{ transform: [{ scaleX: 1.2 }] }}
        />
        <View
          className="absolute -bottom-20 left-0 h-[300px] w-[300px] rounded-full bg-rose-200/20"
        />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-8 gap-8">

          {step === 1 && (
            <View className="gap-8">
              {/* How it works section */}
              <View
                className="bg-card border border-border/50 rounded-[35px] p-6 flex-row-reverse items-start"
                style={{ shadowColor: 'hsl(var(--primary))', shadowOpacity: 0.05, shadowRadius: 20 }}
              >
                <View className="h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20">
                  <Palette color="white" size={26} />
                </View>
                <View className="flex-1 items-end mr-4">
                  <Text className="text-xl font-bold text-foreground text-right mb-2 tracking-tight">كيف يعمل التحليل؟</Text>
                  <Text className="text-sm text-slate-600 text-right leading-6 font-medium mb-4">
                    يستخدم الذكاء الاصطناعي لتحليل الألوان والأشكال والأنماط في رسم طفلك
                  </Text>

                  <View className="gap-3">
                    <View className="flex-row-reverse items-center gap-2">
                      <View className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <Text className="text-xs text-muted-foreground font-bold">تحليل الألوان المستخدمة</Text>
                    </View>
                    <View className="flex-row-reverse items-center gap-2">
                      <View className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <Text className="text-xs text-muted-foreground font-bold">فهم الرموز والأشكال</Text>
                    </View>
                    <View className="flex-row-reverse items-center gap-2">
                      <View className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <Text className="text-xs text-muted-foreground font-bold">تقديم توصيات للوالدين</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Form Section */}
              <View className="gap-6 px-1">
                <View className="gap-3">
                  <Text className="text-sm font-bold text-foreground text-right">اسم الطفل</Text>
                  <TextInput
                    className="h-14 w-full rounded-2xl border border-border/40 bg-card px-5 text-right text-foreground font-bold shadow-sm"
                    placeholder="أدخل اسم طفلك"
                    placeholderTextColor="#94a3b8"
                    value={childName}
                    onChangeText={setChildName}
                  />
                </View>

                <View className="gap-3">
                  <Text className="text-sm font-bold text-slate-800 text-right">العمر (بالسنوات)</Text>
                  <TextInput
                    className="h-14 w-full rounded-2xl border border-border/40 bg-card px-5 text-right text-foreground font-bold shadow-sm"
                    placeholder="مثال: 7"
                    placeholderTextColor="#94a3b8"
                    value={childAge}
                    onChangeText={setChildAge}
                    keyboardType="numeric"
                  />
                </View>

                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => setStep(2)}
                  className="mt-4 w-full h-16 rounded-[22px] overflow-hidden bg-primary shadow-xl shadow-primary/30"
                >
                  <View className="flex-1 items-center justify-center">
                    <Text className="text-primary-foreground font-bold text-lg">التالي: رفع الرسمة</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View className="flex-row-reverse items-start gap-3 p-4 rounded-2xl bg-secondary/30 border border-border/50">
                <View className="h-8 w-8 items-center justify-center rounded-full bg-secondary">
                  <Loader2 color="#0f766e" size={18} />
                </View>
                <Text className="text-[11px] text-muted-foreground flex-1 text-right font-medium leading-5">
                  هذا التحليل أولي ولا يُعد تشخيصاً طبياً أو نفسياً رسمياً. إذا كانت لديك مخاوف جدية، يُرجى استشارة متخصص.
                </Text>
              </View>
            </View>
          )}

          {step === 2 && (
            <View className="gap-6">
              <TouchableOpacity
                activeOpacity={0.7}
                className="self-end flex-row items-center gap-2 bg-card px-4 py-2.5 rounded-2xl border border-border/50"
                style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } }}
                onPress={() => setStep(1)}
              >
                <Text className="text-slate-600 font-bold text-sm">رجوع</Text>
                <ArrowRight size={18} color="#64748B" />
              </TouchableOpacity>

              <View
                className="bg-card border border-border/50 rounded-[35px] overflow-hidden"
                style={{ shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 30, shadowOffset: { width: 0, height: 12 } }}
              >
                {image ? (
                  <View className="relative">
                    <Image source={{ uri: image }} className="w-full h-72 bg-slate-100" resizeMode="cover" />
                    <TouchableOpacity
                      className="absolute top-4 right-4 bg-black/40 h-10 w-10 items-center justify-center rounded-full"
                      onPress={() => setImage(null)}
                    >
                      <RefreshCw color="white" size={18} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={pickImage}
                    activeOpacity={0.8}
                    className="flex flex-col items-center justify-center gap-6 py-20 bg-slate-50/30"
                  >
                    <View className="h-20 w-20 items-center justify-center rounded-[28px] bg-primary shadow-xl shadow-primary/30">
                      <Upload color="white" size={32} />
                    </View>
                    <View className="items-center gap-2">
                      <Text className="text-xl font-bold text-slate-900">اضغط لرفع صورة الرسم</Text>
                      <Text className="text-sm text-slate-500 font-medium">او التقط صورة جديدة لرسمة {childName}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>

              {image && (
                <TouchableOpacity
                  onPress={handleAnalyze}
                  disabled={analyzing}
                  activeOpacity={0.9}
                  className={cn(
                    "w-full h-16 rounded-[22px] items-center justify-center",
                    analyzing ? "bg-slate-200" : "bg-primary shadow-xl shadow-primary/20"
                  )}
                >
                  {analyzing ? (
                    <View className="flex-row items-center gap-2">
                      <ActivityIndicator color="#94a3b8" />
                      <Text className="text-slate-400 font-bold">جاري التحليل...</Text>
                    </View>
                  ) : (
                    <View className="flex-row items-center gap-2">
                      <Sparkles color="white" size={20} />
                      <Text className="text-white font-bold text-lg">بدء التحليل</Text>
                    </View>
                  )}
                </TouchableOpacity>
              )}
            </View>
          )}

          {result && (
            <View className="gap-6">
              <View
                className="bg-card border border-border/50 rounded-[35px] p-6 overflow-hidden"
                style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 20, shadowOffset: { width: 0, height: 12 } }}
              >
                <View className="flex-row-reverse items-center justify-between mb-6">
                  <View className="items-end">
                    <Text className="text-2xl font-bold text-slate-900 text-right">نتيجة تحليل {childName}</Text>
                    <Text className="text-sm text-slate-500 text-right mt-0.5 font-bold">بناءً على عمر {childAge} سنوات</Text>
                  </View>
                </View>

                <View className="gap-8">
                  <View className="gap-4">
                    <View className="flex-row-reverse items-center gap-3">
                      <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                        <Palette color="#0f766e" size={20} />
                      </View>
                      <Text className="text-lg font-bold text-foreground">تحليل الألوان</Text>
                    </View>
                    <View className="gap-5">
                      {result.colors.map((color, i) => (
                        <View key={i} className="gap-2">
                          <View className="flex-row-reverse justify-between items-center mb-1">
                            <Text className="text-sm font-bold text-foreground">{color.name}</Text>
                            <Text className="text-xs font-bold text-primary">{color.percent}%</Text>
                          </View>
                          <View className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                            <View
                              className="h-full rounded-full bg-primary"
                              style={{ width: `${color.percent}%` }}
                            />
                          </View>
                          <Text className="text-[11px] text-muted-foreground text-right font-medium leading-5">{color.meaning}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <View className="gap-4 pt-6 border-t border-slate-50">
                    <View className="flex-row-reverse items-center gap-3">
                      <View className="h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                        <Shapes color="#3b82f6" size={20} />
                      </View>
                      <Text className="text-lg font-bold text-foreground">الرموز والعناصر</Text>
                    </View>
                    <View className="flex-row-reverse flex-wrap gap-2">
                      {result.symbols.map((symbol, i) => (
                        <View key={i} className="bg-white border border-slate-100 px-4 py-2 rounded-xl shadow-sm">
                          <Text className="text-xs font-bold text-slate-600 text-right">{symbol.name}: {symbol.interpretation}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <View className="gap-4 pt-6 border-t border-slate-50">
                    <Text className="text-lg font-bold text-slate-800 text-right">التقرير العام</Text>
                    <View className="bg-slate-50/50 p-5 rounded-[25px] border border-slate-100">
                      <Text className="text-sm text-slate-600 text-right leading-7 font-medium">
                        {result.overallReport}
                      </Text>
                    </View>
                  </View>

                  <View className="bg-primary/5 rounded-[30px] p-6 border border-primary/20">
                    <View className="flex-row-reverse items-center gap-3 mb-4">
                      <Lightbulb color="#0f766e" size={20} />
                      <Text className="text-lg font-bold text-foreground">توصيات لهادي</Text>
                    </View>
                    <View className="gap-4">
                      {result.tips.map((tip, i) => (
                        <View key={i} className="flex-row-reverse gap-3 items-start">
                          <View className="h-1.5 w-1.5 mt-2 rounded-full bg-primary shrink-0" />
                          <Text className="text-xs text-muted-foreground font-bold leading-6 text-right flex-1">{tip}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => {
                  setResult(null);
                  setImage(null);
                  setStep(1);
                }}
                className="w-full h-14 rounded-2xl bg-slate-900 items-center justify-center shadow-lg"
              >
                <Text className="text-white font-bold">تحليل رسمة جديدة</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

// Icon component helper if needed, but we import from lucide-react-native
function Sparkles({ color, size }: { color?: string, size?: number }) {
  const { Sparkles: Icon } = require('lucide-react-native');
  return <Icon color={color} size={size} />;
}
