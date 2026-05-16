import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, TextInput } from 'react-native';
import { AppHeader } from '@/components/app-header';
import * as ImagePicker from 'expo-image-picker';
import { Upload, RefreshCw, Palette, Shapes, Lightbulb, ArrowRight, ArrowLeft, Loader2, Sparkles } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { useAnalyzeDrawing, useDrawingById } from '@/hooks/use-drawing';
import { useLocalization } from '@/context/LocalizationContext';

export default function DrawingPage() {
  const { isRTL, flexDir, textAlign, alignItems } = useLocalization();
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [step, setStep] = useState(1);
  const [image, setImage] = useState<string | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [drawingId, setDrawingId] = useState<string | null>(null);

  const analyzeDrawing = useAnalyzeDrawing();
  const { data: pollingData } = useDrawingById(drawingId);

  const result = pollingData?.status === 'completed' ? pollingData : null;
  const isAnalyzing = analyzeDrawing.isPending || (!!drawingId && pollingData?.status === 'processing');

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!res.canceled) {
      setImage(res.assets[0].uri);
      setImageUri(res.assets[0].uri);
      setDrawingId(null);
    }
  };

  const handleAnalyze = async () => {
    if (!imageUri) return;
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'drawing.jpg',
      } as any);
      if (childName) formData.append('childName', childName);
      if (childAge) formData.append('childAge', childAge);

      const initial = await analyzeDrawing.mutateAsync(formData);
      setDrawingId(initial.id);
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <View className="flex-1 bg-background">
      <View className="bg-background pb-2">
        <AppHeader />
      </View>

      <View className="absolute inset-0 overflow-hidden opacity-[0.1]">
        <View className="absolute -top-20 -left-20 h-[400px] w-[400px] rounded-full bg-orange-200/20" style={{ transform: [{ scaleX: 1.5 }, { rotate: '45deg' }] }} />
        <View className="absolute top-1/4 -right-40 h-[350px] w-[350px] rounded-full bg-primary/10" style={{ transform: [{ scaleX: 1.2 }] }} />
        <View className="absolute -bottom-20 left-0 h-[300px] w-[300px] rounded-full bg-rose-200/20" />
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <View className="mt-8 gap-8">
          {step === 1 && (
            <View className="gap-8">
              <View className={cn("bg-card border border-border/50 rounded-[35px] p-6 items-start", flexDir())} style={{ shadowColor: 'hsl(var(--primary))', shadowOpacity: 0.05, shadowRadius: 20 }}>
                <View className="h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20">
                  <Palette color="white" size={26} />
                </View>
                <View className={cn("flex-1", alignItems('start'), isRTL ? "mr-4" : "ml-4")}>
                  <Text className={cn("text-xl font-bold text-foreground mb-2 tracking-tight", textAlign())}>{isRTL ? 'كيف يعمل التحليل؟' : 'How does the analysis work?'}</Text>
                  <Text className={cn("text-sm text-slate-600 leading-6 font-medium mb-4", textAlign())}>
                    {isRTL
                      ? 'يستخدم الذكاء الاصطناعي لتحليل الألوان والأشكال والأنماط في رسم طفلك'
                      : 'AI is used to analyze colors, shapes, and patterns in your child\'s drawing'}
                  </Text>
                </View>
              </View>

              <View className="gap-6 px-1">
                <View className="gap-3">
                  <Text className={cn("text-sm font-bold text-foreground", textAlign())}>{isRTL ? 'اسم الطفل' : 'Child\'s Name'}</Text>
                  <TextInput className={cn("h-14 w-full rounded-2xl border border-border/40 bg-card px-5 text-foreground font-bold shadow-sm", textAlign())} placeholder={isRTL ? "أدخل اسم طفلك" : "Enter child's name"} placeholderTextColor="#94a3b8" value={childName} onChangeText={setChildName} />
                </View>
                <View className="gap-3">
                  <Text className={cn("text-sm font-bold text-foreground", textAlign())}>{isRTL ? 'العمر (بالسنوات)' : 'Age (years)'}</Text>
                  <TextInput className={cn("h-14 w-full rounded-2xl border border-border/40 bg-card px-5 text-foreground font-bold shadow-sm", textAlign())} placeholder={isRTL ? "مثال: 7" : "e.g. 7"} placeholderTextColor="#94a3b8" value={childAge} onChangeText={setChildAge} keyboardType="numeric" />
                </View>
                <TouchableOpacity activeOpacity={0.9} onPress={() => setStep(2)} className="mt-4 w-full h-16 rounded-[22px] overflow-hidden bg-primary shadow-xl shadow-primary/30">
                  <View className="flex-1 items-center justify-center">
                    <Text className="text-primary-foreground font-bold text-lg">{isRTL ? 'التالي: رفع الرسمة' : 'Next: Upload Drawing'}</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View className={cn("items-start gap-3 p-4 rounded-2xl bg-secondary/30 border border-border/50", flexDir())}>
                <View className="h-8 w-8 items-center justify-center rounded-full bg-secondary">
                  <Loader2 color="#0f766e" size={18} />
                </View>
                <Text className={cn("text-[11px] text-muted-foreground flex-1 font-medium leading-5", textAlign())}>
                  {isRTL
                    ? 'هذا التحليل أولي ولا يُعد تشخيصاً طبياً أو نفسياً رسمياً. إذا كانت لديك مخاوف جدية، يُرجى استشارة متخصص.'
                    : 'This analysis is preliminary and does not constitute an official medical or psychological diagnosis. If you have serious concerns, please consult a specialist.'}
                </Text>
              </View>
            </View>
          )}

          {step === 2 && (
            <View className="gap-6">
              <TouchableOpacity activeOpacity={0.7} className={cn("items-center gap-2 bg-card px-4 py-2.5 rounded-2xl border border-border/50", flexDir(), isRTL ? "self-end" : "self-start")} onPress={() => setStep(1)}>
                {isRTL ? null : <ArrowLeft size={18} color="#64748B" />}
                <Text className="text-slate-600 font-bold text-sm">{isRTL ? 'رجوع' : 'Back'}</Text>
                {isRTL ? <ArrowRight size={18} color="#64748B" /> : null}
              </TouchableOpacity>

              <View className="bg-card border border-border/50 rounded-[35px] overflow-hidden" style={{ shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 30, shadowOffset: { width: 0, height: 12 } }}>
                {image ? (
                  <View className="relative">
                    <Image source={{ uri: image }} className="w-full h-72 bg-slate-100" resizeMode="cover" />
                    <TouchableOpacity className={cn("absolute top-4 bg-black/40 h-10 w-10 items-center justify-center rounded-full", isRTL ? "right-4" : "left-4")} onPress={() => setImage(null)}>
                      <RefreshCw color="white" size={18} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity onPress={pickImage} activeOpacity={0.8} className="flex flex-col items-center justify-center gap-6 py-20 bg-slate-50/30">
                    <View className="h-20 w-20 items-center justify-center rounded-[28px] bg-primary shadow-xl shadow-primary/30">
                      <Upload color="white" size={32} />
                    </View>
                    <View className="items-center gap-2">
                      <Text className="text-xl font-bold text-slate-900">{isRTL ? 'اضغط لرفع صورة الرسم' : 'Tap to upload drawing'}</Text>
                      <Text className="text-sm text-slate-500 font-medium">{isRTL ? `او التقط صورة جديدة لرسمة ${childName}` : `Or take a new photo of ${childName}'s drawing`}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>

              {image && (
                <TouchableOpacity
                  onPress={handleAnalyze}
                  disabled={isAnalyzing}
                  activeOpacity={0.9}
                  className={cn("w-full h-16 rounded-[22px] items-center justify-center", isAnalyzing ? "bg-slate-200" : "bg-primary shadow-xl shadow-primary/20")}
                >
                  {isAnalyzing ? (
                    <View className={cn("items-center gap-2", flexDir())}>
                      <ActivityIndicator color="#94a3b8" />
                      <Text className="text-slate-400 font-bold">{isRTL ? 'جاري التحليل...' : 'Analyzing...'}</Text>
                    </View>
                  ) : (
                    <View className={cn("items-center gap-2", flexDir())}>
                      <Sparkles color="white" size={20} />
                      <Text className="text-white font-bold text-lg">{isRTL ? 'بدء التحليل' : 'Start Analysis'}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              )}
            </View>
          )}

          {result && (
            <View className="gap-6">
              <View className="bg-card border border-border/50 rounded-[35px] p-6 overflow-hidden" style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 20, shadowOffset: { width: 0, height: 12 } }}>
                <Text className={cn("text-2xl font-bold text-slate-900 mb-4", textAlign())}>
                  {isRTL ? `نتيجة تحليل ${childName || 'الرسمة'}` : `Analysis result for ${childName || 'the drawing'}`}
                </Text>

                {result.analysis && (
                  <View className="gap-4">
                    {result.analysis.emotionalTone && (
                      <View className="gap-2">
                        <View className={cn("items-center gap-3", flexDir())}>
                          <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                            <Lightbulb color="#0f766e" size={20} />
                          </View>
                          <Text className="text-lg font-bold text-foreground">{isRTL ? 'النبرة العاطفية' : 'Emotional Tone'}</Text>
                        </View>
                        <View className="bg-slate-50/50 p-5 rounded-[25px] border border-slate-100">
                          <Text className={cn("text-sm text-slate-600 leading-7 font-medium", textAlign())}>
                            {result.analysis.emotionalTone}
                          </Text>
                        </View>
                      </View>
                    )}

                    {result.analysis.observations && result.analysis.observations.length > 0 && (
                      <View className="gap-2">
                        <View className={cn("items-center gap-3", flexDir())}>
                          <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                            <Shapes color="#0f766e" size={20} />
                          </View>
                          <Text className="text-lg font-bold text-foreground">{isRTL ? 'الملاحظات' : 'Observations'}</Text>
                        </View>
                        <View className="bg-slate-50/50 p-5 rounded-[25px] border border-slate-100 gap-2">
                          {result.analysis.observations.map((obs: string, i: number) => (
                            <Text key={i} className={cn("text-sm text-slate-600 leading-7 font-medium", textAlign())}>• {obs}</Text>
                          ))}
                        </View>
                      </View>
                    )}
                  </View>
                )}
              </View>

              <TouchableOpacity
                onPress={() => { setDrawingId(null); setImage(null); setStep(1); }}
                className="w-full h-14 rounded-2xl bg-slate-900 items-center justify-center shadow-lg"
              >
                <Text className="text-white font-bold">{isRTL ? 'تحليل رسمة جديدة' : 'Analyze New Drawing'}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
