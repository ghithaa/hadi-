import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { AppHeader } from '@/components/app-header';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, AlertTriangle } from 'lucide-react-native';
import { useHelplines } from '@/hooks/use-emergency';
import { cn } from '@/lib/utils';
import { useLocalization } from '@/context/LocalizationContext';

// Fallback data — emergency info must always be accessible
const fallbackContacts = [
  { title: 'الهلال الأحمر السعودي', titleEn: 'Saudi Red Crescent', number: '997', description: 'للحالات الطبية الطارئة', descriptionEn: 'For medical emergencies' },
  { title: 'مركز الاتصال الموحد للصحة النفسية', titleEn: 'Mental Health Hotline', number: '937', description: 'استشارات طبية ونفسية عاجلة', descriptionEn: 'Urgent medical and psychological consultations' },
  { title: 'لجنة تعزيز الصحة النفسية', titleEn: 'Mental Health Commission', number: '920033360', description: 'استشارات نفسية متخصصة', descriptionEn: 'Specialized psychological consultations' },
];

export default function EmergencyPage() {
  const { data: helplines } = useHelplines();
  const { isRTL, flexDir, textAlign, alignItems } = useLocalization();

  // Normalize contacts array to handle both backend API (phone, name, name_ar) and fallback configurations
  const contacts = ((helplines && helplines.length > 0) ? helplines : fallbackContacts).map((contact: any) => {
    return {
      title: contact.name_ar || contact.title || contact.name,
      titleEn: contact.name || contact.titleEn || contact.title,
      number: contact.phone || contact.number,
      description: contact.description_ar || contact.description,
      descriptionEn: contact.description || contact.descriptionEn,
      availability: isRTL ? (contact.available_ar || 'متاح دائماً') : (contact.available || '24/7'),
    };
  });

  const handleCall = (number: string) => {
    if (!number) return;
    Linking.openURL(`tel:${number}`);
  };

  return (
    <View className="flex-1 bg-[#FDFDFD]">
      {/* App Header */}
      <View className="bg-white pb-2">
        <AppHeader />
      </View>

      {/* Organic Background Blobs */}
      <View pointerEvents="none" className="absolute inset-0 overflow-hidden opacity-[0.05]">
        <View className="absolute -top-20 -left-20 h-[400px] w-[400px] rounded-full bg-rose-200" style={{ transform: [{ scaleX: 1.5 }, { rotate: '45deg' }] }} />
        <View className="absolute top-1/3 -right-40 h-[350px] w-[350px] rounded-full bg-amber-100" style={{ transform: [{ scaleX: 1.2 }] }} />
        <View className="absolute -bottom-20 left-0 h-[300px] w-[300px] rounded-full bg-rose-100" />
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={true}>
        
        {/* Top Warning Alert Card */}
        <View className="mt-8 mb-8 bg-rose-50/50 border border-rose-100/60 rounded-[30px] p-6 items-center">
          <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-rose-100/85 shadow-sm shadow-rose-200/50">
            <AlertTriangle size={32} color="#f43f5e" />
          </View>
          <Text className="mb-2 text-2xl font-bold text-slate-800 text-center">{isRTL ? 'الدعم والمساعدة' : 'Support & Help'}</Text>
          <Text className="text-center text-slate-500 font-medium text-xs leading-5 max-w-[90%]">
            {isRTL
              ? 'إذا كنت تشعر أنك في خطر أو تحتاج إلى مساعدة عاجلة، يرجى الاتصال بأحد الأرقام التالية'
              : 'If you feel you are in danger or need urgent help, please call one of the following numbers'}
          </Text>
        </View>

        {/* Contacts Cards List */}
        <View className="gap-4">
          {contacts.map((contact: any, index: number) => (
            <Card key={index} className="border-slate-100 bg-white rounded-[28px] overflow-hidden shadow-sm shadow-slate-100/50">
              <CardContent className={cn("p-5 items-center justify-between", flexDir())}>
                
                {/* Content Block (Aligns to leading text direction) */}
                <View className={cn("flex-1", alignItems('start'), isRTL ? "ml-4" : "mr-4")}>
                  {/* Title */}
                  <Text className={cn("text-base font-bold text-slate-800 mb-1", textAlign())}>
                    {isRTL ? contact.title : contact.titleEn}
                  </Text>
                  
                  {/* Description */}
                  <Text className={cn("text-xs text-slate-500 font-medium leading-5 mb-3.5", textAlign())}>
                    {isRTL ? contact.description : contact.descriptionEn}
                  </Text>
                  
                  {/* Badges Row */}
                  <View className={cn("flex-row items-center gap-2", flexDir())}>
                    {/* Number Badge */}
                    <View className="flex-row items-center gap-1.5 bg-rose-50 border border-rose-100/50 px-3 py-1.5 rounded-full">
                      <Phone size={11} color="#f43f5e" />
                      <Text className="text-xs font-bold text-rose-600">{contact.number}</Text>
                    </View>
                    
                    {/* Availability Badge */}
                    <View className="bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full">
                      <Text className="text-[10px] font-bold text-slate-400">
                        {contact.availability}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Call Action Button (Positioned at trailing end) */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleCall(contact.number)}
                  className="h-12 w-12 items-center justify-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20 active:scale-95"
                >
                  <Phone size={22} color="white" />
                </TouchableOpacity>

              </CardContent>
            </Card>
          ))}
        </View>

      </ScrollView>
    </View>
  );
}
