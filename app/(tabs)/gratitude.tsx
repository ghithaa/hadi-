import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AppHeader } from '@/components/app-header';
import { BookOpen, Plus } from 'lucide-react-native';
import { useGratitudeEntries, useLogGratitude } from '@/hooks/use-gratitude';
import { EmptyState } from '@/components/ui/empty-state';
import { cn } from '@/lib/utils';
import { useLocalization } from '@/context/LocalizationContext';

export default function GratitudePage() {
  const { isRTL, flexDir, textAlign, alignItems } = useLocalization();
  const [newItem, setNewItem] = useState('');

  const { data: entries, isLoading } = useGratitudeEntries({ limit: 20 });
  const logGratitude = useLogGratitude();

  // Flatten all items from all entries for display
  const allItems = Array.isArray(entries)
    ? entries.flatMap((entry) =>
        entry.items.map((item, i) => ({ id: `${entry.id}-${i}`, text: item, date: entry.date }))
      )
    : [];

  const handleAddItem = async () => {
    const trimmed = newItem.trim();
    if (!trimmed) return;
    try {
      await logGratitude.mutateAsync({ items: [trimmed] });
      setNewItem('');
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <View className="flex-1 bg-[#FDFDFD]">
      <View className="bg-white pb-2">
        <AppHeader />
      </View>

      <View pointerEvents="none" className="absolute inset-0 overflow-hidden opacity-[0.05]">
        <View className="absolute -top-20 -left-20 h-[400px] w-[400px] rounded-full bg-emerald-100" style={{ transform: [{ scaleX: 1.5 }, { rotate: '45deg' }] }} />
        <View className="absolute top-1/3 -right-40 h-[350px] w-[350px] rounded-full bg-primary/10" style={{ transform: [{ scaleX: 1.2 }] }} />
        <View className="absolute -bottom-20 left-0 h-[300px] w-[300px] rounded-full bg-teal-100" />
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <View className="mt-10 mb-8 items-center">
          <View className="mb-5 h-20 w-20 items-center justify-center rounded-[28px] bg-white shadow-xl shadow-emerald-900/10 border border-emerald-50/50">
            <View className="h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10">
              <BookOpen size={32} color="#10b981" />
            </View>
          </View>
          <Text className="text-2xl font-bold text-slate-900 text-center">{isRTL ? 'دفتر الامتنان' : 'Gratitude Journal'}</Text>
          <Text className="text-center text-slate-500 text-sm mt-2 font-medium leading-6 max-w-[80%]">
            {isRTL ? 'دون النعم والأشياء الجميلة التي تشعر بالامتنان لوجودها في حياتك' : 'Write down the blessings and beautiful things you are grateful for in your life'}
          </Text>
        </View>

        <View className={cn("mb-10 bg-white/70 border border-white/60 rounded-[30px] p-4 items-center", flexDir())} style={{ shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 20, shadowOffset: { width: 0, height: 10 } }}>
          <TouchableOpacity
            onPress={handleAddItem}
            disabled={!newItem.trim() || logGratitude.isPending}
            activeOpacity={0.8}
            className="h-12 w-12 items-center justify-center rounded-[20px] bg-emerald-500 shadow-lg shadow-emerald-500/30"
          >
            {logGratitude.isPending ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Plus size={24} color="white" />
            )}
          </TouchableOpacity>
          <TextInput
            className={cn("flex-1 h-12 px-4 text-slate-700 font-bold text-sm", textAlign())}
            placeholder={isRTL ? "أنا ممتن لـ..." : "I am grateful for..."}
            placeholderTextColor="#94a3b8"
            value={newItem}
            onChangeText={setNewItem}
            onSubmitEditing={handleAddItem}
          />
        </View>

        {isLoading ? (
          <View className="items-center py-8">
            <ActivityIndicator color="#10b981" />
          </View>
        ) : allItems.length === 0 ? (
          <EmptyState
            title={isRTL ? "لا توجد مدخلات بعد" : "No entries yet"}
            message={isRTL ? "ابدأ بكتابة شيء تشعر بالامتنان له" : "Start by writing something you're grateful for"}
            icon={BookOpen}
          />
        ) : (
          <View className="gap-5">
            {allItems.map((item) => (
              <View
                key={item.id}
                className={cn("w-full rounded-[25px] border border-white/60 bg-white/70 p-5 items-center justify-between", flexDir())}
                style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 15, shadowOffset: { width: 0, height: 6 } }}
              >
                <View className={cn("absolute top-0 bottom-0 w-1.5 bg-emerald-500/40", isRTL ? "right-0 rounded-r-full" : "left-0 rounded-l-full")} />
                <Text className={cn("flex-1 text-[15px] font-bold text-slate-800 leading-6", textAlign(), isRTL ? "mr-4" : "ml-4")}>
                  {item.text}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
