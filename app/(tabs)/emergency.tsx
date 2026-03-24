import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { AppHeader } from '@/components/app-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, AlertTriangle } from 'lucide-react-native';

const emergencyContacts = [
  {
    title: "الهلال الأحمر السعودي",
    number: "997",
    description: "للحالات الطبية الطارئة",
  },
  {
    title: "مركز الاتصال الموحد للصحة النفسية",
    number: "937",
    description: "استشارات طبية ونفسية عاجلة",
  },
  {
    title: "لجنة تعزيز الصحة النفسية",
    number: "920033360",
    description: "استشارات نفسية متخصصة",
  },
];

export default function EmergencyPage() {
  const handleCall = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  return (
    <View className="flex-1 bg-background">
      <AppHeader />
      <ScrollView className="flex-1 px-4 pb-6">
        <View className="mt-6 mb-6 items-center">
          <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle size={32} className="text-destructive" color="#ef4444" />
          </View>
          <Text className="mb-2 text-2xl font-bold text-foreground">الدعم والمساعدة</Text>
          <Text className="text-center text-muted-foreground">
            إذا كنت تشعر أنك في خطر أو تحتاج إلى مساعدة عاجلة، يرجى الاتصال بأحد الأرقام التالية
          </Text>
        </View>

        <View className="gap-4">
          {emergencyContacts.map((contact, index) => (
            <Card key={index} className="border-destructive/20">
              <CardContent className="p-4 flex-row items-center justify-between">
                <TouchableOpacity 
                  onPress={() => handleCall(contact.number)}
                  className="h-10 w-10 items-center justify-center rounded-full bg-green-500"
                >
                  <Phone size={20} color="white" />
                </TouchableOpacity>
                <View className="flex-1 items-end mr-4">
                  <Text className="text-lg font-bold text-foreground">{contact.title}</Text>
                  <Text className="text-sm text-muted-foreground">{contact.description}</Text>
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
