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

  const contacts = (helplines && helplines.length > 0) ? helplines : fallbackContacts;

  const handleCall = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  return (
    <View className="flex-1 bg-background">
      <AppHeader />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}>
        <View className="mt-6 mb-6 items-center">
          <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle size={32} color="#ef4444" />
          </View>
          <Text className="mb-2 text-2xl font-bold text-foreground">{isRTL ? 'الدعم والمساعدة' : 'Support & Help'}</Text>
          <Text className="text-center text-muted-foreground">
            {isRTL
              ? 'إذا كنت تشعر أنك في خطر أو تحتاج إلى مساعدة عاجلة، يرجى الاتصال بأحد الأرقام التالية'
              : 'If you feel you are in danger or need urgent help, please call one of the following numbers'}
          </Text>
        </View>

        <View className="gap-4">
          {contacts.map((contact: any, index: number) => (
            <Card key={index} className="border-destructive/20">
              <CardContent className={cn("p-4 items-center justify-between", flexDir())}>
                <TouchableOpacity
                  onPress={() => handleCall(contact.number)}
                  className="h-10 w-10 items-center justify-center rounded-full bg-green-500"
                >
                  <Phone size={20} color="white" />
                </TouchableOpacity>
                <View className={cn("flex-1", alignItems('start'), isRTL ? "mr-4" : "ml-4")}>
                  <Text className={cn("text-lg font-bold text-foreground", textAlign())}>{isRTL ? contact.title : (contact.titleEn || contact.title)}</Text>
                  <Text className={cn("text-sm text-muted-foreground", textAlign())}>{isRTL ? contact.description : (contact.descriptionEn || contact.description)}</Text>
                  <Text className="text-xl font-bold text-destructive mt-1">{contact.number}</Text>
                </View>
              </CardContent>
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
