import { View, Text } from 'react-native';
import { Inbox } from 'lucide-react-native';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ComponentType<{ size: number; color: string }>;
}

export function EmptyState({
  title = 'لا توجد بيانات',
  message = 'لم يتم تسجيل أي بيانات بعد.',
  icon: Icon = Inbox,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center py-16 px-6">
      <View className="h-16 w-16 rounded-2xl bg-secondary items-center justify-center mb-4">
        <Icon size={32} color="#94a3b8" />
      </View>
      <Text className="text-base font-bold text-foreground text-center mb-2">{title}</Text>
      <Text className="text-sm text-muted-foreground text-center">{message}</Text>
    </View>
  );
}
