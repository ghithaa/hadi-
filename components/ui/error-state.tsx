import { View, Text, TouchableOpacity } from 'react-native';
import { AlertCircle } from 'lucide-react-native';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = 'حدث خطأ. يرجى المحاولة مجدداً.',
  onRetry,
}: ErrorStateProps) {
  return (
    <View className="flex-1 items-center justify-center py-16 px-6">
      <View className="h-16 w-16 rounded-full bg-destructive/10 items-center justify-center mb-4">
        <AlertCircle size={32} color="#ef4444" />
      </View>
      <Text className="text-base font-bold text-foreground text-center mb-2">
        حدث خطأ
      </Text>
      <Text className="text-sm text-muted-foreground text-center mb-6">{message}</Text>
      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          className="bg-primary px-6 py-3 rounded-2xl"
        >
          <Text className="text-primary-foreground font-bold">إعادة المحاولة</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
