import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { AppHeader } from '@/components/app-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Plus, Trash2 } from 'lucide-react-native';
import { cn } from '@/lib/utils';

export default function GratitudePage() {
  const [items, setItems] = useState<string[]>([
    "أشكر الله على صحتي وعافيتي",
    "ممتن لوجود عائلتي بجانبي",
    "يوم جميل وهادئ",
  ]);
  const [newItem, setNewItem] = useState("");

  const handleAddItem = () => {
    if (newItem.trim()) {
      setItems([newItem, ...items]);
      setNewItem("");
    }
  };

  const handleDeleteItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  return (
    <View className="flex-1 bg-[#FDFDFD]">
      <View className="bg-white pb-2">
        <AppHeader />
      </View>

      {/* Organic Background Blobs */}
      <View className="absolute inset-0 overflow-hidden opacity-[0.05]">
        <View
          className="absolute -top-20 -left-20 h-[400px] w-[400px] rounded-full bg-emerald-100"
          style={{ transform: [{ scaleX: 1.5 }, { rotate: '45deg' }] }}
        />
        <View
          className="absolute top-1/3 -right-40 h-[350px] w-[350px] rounded-full bg-primary/10"
          style={{ transform: [{ scaleX: 1.2 }] }}
        />
        <View
          className="absolute -bottom-20 left-0 h-[300px] w-[300px] rounded-full bg-teal-100"
        />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-10 mb-8 items-center">
          <View
            className="mb-5 h-20 w-20 items-center justify-center rounded-[28px] bg-white shadow-xl shadow-emerald-900/10 border border-emerald-50/50"
          >
            <View className="h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10">
              <BookOpen size={32} color="#10b981" />
            </View>
          </View>
          <Text className="text-2xl font-bold text-slate-900 text-center">دفتر الامتنان</Text>
          <Text className="text-center text-slate-500 text-sm mt-2 font-medium leading-6 max-w-[80%]">
            دون النعم والأشياء الجميلة التي تشعر بالامتنان لوجودها في حياتك
          </Text>
        </View>

        {/* Glassy Input Section */}
        <View
          className="mb-10 bg-white/70 border border-white/60 rounded-[30px] p-4 flex-row-reverse items-center"
          style={{ shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 20, shadowOffset: { width: 0, height: 10 } }}
        >
          <TouchableOpacity
            onPress={handleAddItem}
            activeOpacity={0.8}
            className="h-12 w-12 items-center justify-center rounded-[20px] bg-emerald-500 shadow-lg shadow-emerald-500/30"
          >
            <Plus size={24} color="white" />
          </TouchableOpacity>
          <TextInput
            className="flex-1 h-12 px-4 text-right text-slate-700 font-bold text-sm"
            placeholder="أنا ممتن لـ..."
            placeholderTextColor="#94a3b8"
            value={newItem}
            onChangeText={setNewItem}
            onSubmitEditing={handleAddItem}
          />
        </View>

        <View className="gap-5">
          {items.map((item, index) => (
            <View
              key={index}
              className="w-full rounded-[25px] border border-white/60 bg-white/70 p-5 flex-row-reverse items-center justify-between"
              style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 15, shadowOffset: { width: 0, height: 6 } }}
            >
              {/* Decorative side accent */}
              <View className="absolute right-0 top-0 bottom-0 w-1.5 bg-emerald-500/40 rounded-r-full" />

              <Text className="flex-1 text-right text-[15px] font-bold text-slate-800 leading-6 mr-4">
                {item}
              </Text>

              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => handleDeleteItem(index)}
                className="h-10 w-10 items-center justify-center rounded-xl bg-slate-50 border border-slate-100/50"
              >
                <Trash2 size={18} color="#94a3b8" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
