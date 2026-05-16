import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { X, ClipboardList, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { useLocalization } from '@/context/LocalizationContext';

interface Question {
  id: string;
  text_en: string;
  text_ar: string;
  options?: { text_en: string; text_ar: string; value: number }[];
}

interface TestData {
  test_id: string;
  full_name_en: string;
  full_name_ar: string;
  purpose_en: string;
  purpose_ar: string;
  questions: Question[];
  options?: { text_en: string; text_ar: string; value: number }[]; // Fallback options for the whole test
}

interface TestModalProps {
  visible: boolean;
  onClose: () => void;
  testData: TestData;
  onSubmit: (answers: { questionIndex: number; score: number; selectedOption: string }[]) => Promise<void>;
}

export function TestModal({ visible, onClose, testData, onSubmit }: TestModalProps) {
  const { isRTL, textAlign, flexDir, alignItems } = useLocalization();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ questionIndex: number; score: number; selectedOption: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedValue, setSelectedValue] = useState<number | null>(null);

  const currentQuestion = testData.questions[currentIndex];
  const currentOptions = currentQuestion.options || testData.options || [];
  const progress = ((currentIndex + 1) / testData.questions.length) * 100;

  const handleAnswer = async (value: number, label: string) => {
    setSelectedValue(value);

    // Brief highlight delay before advancing
    setTimeout(async () => {
      const newAnswer = {
        questionIndex: currentIndex,
        score: value,
        selectedOption: label,
      };
      const newAnswers = [...answers, newAnswer];
      setAnswers(newAnswers);
      setSelectedValue(null);

      if (currentIndex < testData.questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setIsSubmitting(true);
        try {
          await onSubmit(newAnswers);
          onClose();
        } catch (error) {
          console.error('Failed to submit test:', error);
        } finally {
          setIsSubmitting(false);
        }
      }
    }, 200);
  };

  const reset = () => {
    setCurrentIndex(0);
    setAnswers([]);
    setIsSubmitting(false);
    setSelectedValue(null);
  };

  const title = isRTL ? testData.full_name_ar : testData.full_name_en;
  const description = isRTL ? testData.purpose_ar : testData.purpose_en;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/60 justify-end">
        <View className="bg-background h-[92%] rounded-t-[32px] overflow-hidden shadow-xl">

          {/* ── Header ── */}
          <View className={cn("px-6 pt-6 pb-4 border-b border-border/30 items-start gap-3", flexDir())}>
            {/* Close button */}
            <TouchableOpacity
              onPress={() => {
                reset();
                onClose();
              }}
              className="h-10 w-10 items-center justify-center rounded-full bg-secondary/80 border border-border/30"
            >
              <X size={18} color="#94a3b8" />
            </TouchableOpacity>

            {/* Title & description */}
            <View className={cn("flex-1", alignItems('start'))}>
              <View className={cn("items-center gap-2 mb-1", flexDir())}>
                <View className="h-7 w-7 rounded-lg bg-primary/10 items-center justify-center">
                  <ClipboardList size={14} color="#0f766e" />
                </View>
                <Text className={cn("text-lg font-bold text-foreground leading-6", textAlign())} numberOfLines={2}>
                  {title}
                </Text>
              </View>
              <Text className={cn("text-xs text-muted-foreground font-medium leading-4", textAlign())}>
                {description}
              </Text>
            </View>
          </View>

          {isSubmitting ? (
            /* ── Submitting State ── */
            <View className="flex-1 items-center justify-center p-10">
              <View className="h-20 w-20 rounded-[24px] bg-primary/10 items-center justify-center mb-6">
                <ActivityIndicator size="large" color="#0f766e" />
              </View>
              <Text className="text-lg font-bold text-foreground mb-2">
                {isRTL ? 'جاري تحليل النتائج' : 'Analyzing Results'}
              </Text>
              <Text className="text-sm text-muted-foreground font-medium text-center">
                {isRTL ? 'يرجى الانتظار لحظة...' : 'Please wait a moment...'}
              </Text>
            </View>
          ) : (
            /* ── Question Content ── */
            <ScrollView
              className="flex-1"
              contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40, paddingTop: 20 }}
              showsVerticalScrollIndicator={false}
            >
              {/* Progress Section */}
              <View className="mb-6">
                <View className={cn("items-center justify-between mb-3", flexDir())}>
                  <Text className="text-sm font-bold text-foreground">
                    {isRTL
                      ? `سؤال ${currentIndex + 1} من ${testData.questions.length}`
                      : `Question ${currentIndex + 1} of ${testData.questions.length}`}
                  </Text>
                  <View className="bg-primary/10 px-3 py-1 rounded-full">
                    <Text className="text-xs font-bold text-primary">
                      {Math.round(progress)}%
                    </Text>
                  </View>
                </View>
                <View className="h-2.5 w-full overflow-hidden rounded-full bg-secondary/60">
                  <View
                    className="h-full bg-primary rounded-full"
                    style={{
                      width: `${progress}%`,
                      alignSelf: isRTL ? 'flex-end' : 'flex-start',
                    }}
                  />
                </View>
              </View>

              {/* Question Card */}
              <View className="mb-8 rounded-[24px] bg-primary/5 border border-primary/10 p-6">
                <Text className={cn("text-[18px] font-bold text-foreground leading-8", textAlign())}>
                  {isRTL ? currentQuestion.text_ar : currentQuestion.text_en}
                </Text>
              </View>

              {/* Answer Options — centered */}
              <View className="gap-3">
                {currentOptions.map((option, idx) => {
                  const label = isRTL ? option.text_ar : option.text_en;
                  const isSelected = selectedValue === option.value;
                  return (
                    <TouchableOpacity
                      key={`${option.value}-${idx}`}
                      onPress={() => handleAnswer(option.value, label)}
                      activeOpacity={0.7}
                      className={cn(
                        "w-full rounded-[20px] border-2 p-4 px-5 items-center justify-center",
                        isSelected
                          ? "bg-primary/10 border-primary"
                          : "bg-card border-border/60"
                      )}
                    >
                      <Text
                        className={cn(
                          "text-center text-[16px] font-bold leading-6",
                          isSelected ? "text-primary" : "text-foreground"
                        )}
                      >
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}
