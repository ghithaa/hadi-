import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Play, CheckCircle, Lock } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { journeysData } from '@/constants/journeys-data';

export default function JourneyDetailsPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const journey = journeysData.find(j => j.id === id);

  if (!journey) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text>الرحلة غير موجودة</Text>
      </View>
    );
  }

  const Icon = journey.icon;

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header Image */}
        <View className="relative h-64 w-full">
          <Image
            source={{ uri: journey.image }}
            className="h-full w-full"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-black/40" />
          
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute top-12 left-4 h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md"
          >
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>

          <View className="absolute bottom-6 right-4 left-4">
            <View className={cn("self-end mb-3 h-12 w-12 items-center justify-center rounded-xl", journey.color)}>
              <Icon size={24} color="white" />
            </View>
            <Text className="text-3xl font-bold text-white text-right mb-2 shadow-sm">
              {journey.title}
            </Text>
            <Text className="text-white/90 text-right text-sm leading-5 shadow-sm">
              {journey.description}
            </Text>
          </View>
        </View>

        {/* Content */}
        <View className="px-4 py-6">
          {/* Stats */}
          <View className="flex-row justify-between mb-8 bg-card p-4 rounded-xl border border-border shadow-sm">
            <View className="items-center flex-1 border-r border-border">
              <Text className="text-lg font-bold text-primary">{journey.progress}%</Text>
              <Text className="text-xs text-muted-foreground">التقدم</Text>
            </View>
            <View className="items-center flex-1 border-r border-border">
              <Text className="text-lg font-bold text-primary">{journey.units_count}</Text>
              <Text className="text-xs text-muted-foreground">وحدات</Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-lg font-bold text-primary">{journey.duration}</Text>
              <Text className="text-xs text-muted-foreground">المدة</Text>
            </View>
          </View>

          <Text className="text-xl font-bold text-foreground text-right mb-4">مسار الرحلة</Text>

          <View className="gap-4">
            {journey.units.map((unit, index) => (
              <TouchableOpacity
                key={unit.id}
                disabled={unit.isLocked}
                className={cn(
                  "flex-row items-center justify-between p-4 rounded-xl border",
                  unit.isLocked ? "bg-secondary/30 border-border opacity-70" : "bg-card border-border shadow-sm"
                )}
              >
                <View className="items-center justify-center w-10">
                  {unit.isCompleted ? (
                    <CheckCircle size={24} className="text-green-500" color="#22c55e" />
                  ) : unit.isLocked ? (
                    <Lock size={20} className="text-muted-foreground" color="#9ca3af" />
                  ) : (
                    <View className={cn("h-8 w-8 rounded-full items-center justify-center bg-primary/10")}>
                      <Play size={14} className="text-primary ml-0.5" color="#0284c7" fill="#0284c7" />
                    </View>
                  )}
                </View>

                <View className="flex-1 mr-4">
                  <Text className={cn(
                    "text-base font-semibold text-right mb-1",
                    unit.isLocked ? "text-muted-foreground" : "text-foreground"
                  )}>
                    {unit.title}
                  </Text>
                  <Text className="text-xs text-muted-foreground text-right">
                    {unit.description}
                  </Text>
                </View>
                
                <Text className="text-lg font-bold text-muted-foreground/20 ml-2">
                  {(index + 1).toString().padStart(2, '0')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
      
      {/* Bottom Action Button (Sticky) */}
      <View className="p-4 bg-background border-t border-border">
        <TouchableOpacity 
            className="w-full bg-primary h-14 rounded-xl items-center justify-center shadow-md"
            onPress={() => {}}
        >
            <Text className="text-primary-foreground font-bold text-lg">تابع الرحلة</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
