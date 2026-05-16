import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ClipboardList, CheckCircle2 } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { useLocalization } from '@/context/LocalizationContext';

interface TestRequestCardProps {
  title: string;
  description: string;
  isCompleted?: boolean;
  onPress: () => void;
}

export function TestRequestCard({ title, description, isCompleted, onPress }: TestRequestCardProps) {
  const { flexDir, textAlign, alignItems, isRTL } = useLocalization();

  return (
    <View className="my-2 bg-card border border-border rounded-[24px] overflow-hidden shadow-sm">
      <View className="p-5">
        <View className={cn("items-center mb-3", flexDir())}>
          <View className={cn("h-10 w-10 rounded-xl bg-primary/10 items-center justify-center", isRTL ? 'ml-3' : 'mr-3')}>
            <ClipboardList size={20} color="#0f766e" />
          </View>
          <Text className="text-lg font-bold text-foreground flex-1">{title}</Text>
        </View>
        
        <Text className={cn("text-sm text-muted-foreground leading-5 mb-5", textAlign())}>
          {description}
        </Text>

        <TouchableOpacity
          onPress={onPress}
          disabled={isCompleted}
          className={cn(
            "h-12 rounded-xl items-center justify-center flex-row gap-2",
            isCompleted ? "bg-emerald-500/20 border border-emerald-500/30" : "bg-primary shadow-sm"
          )}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 size={18} color="#10b981" />
              <Text className="text-emerald-600 font-bold">{isRTL ? 'تم الإكمال' : 'Completed'}</Text>
            </>
          ) : (
            <>
              <Text className="text-white font-bold">{isRTL ? 'بدء التقييم' : 'Start Assessment'}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
