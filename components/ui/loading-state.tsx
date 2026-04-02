import { View, Text, ActivityIndicator } from 'react-native';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'جاري التحميل...' }: LoadingStateProps) {
  return (
    <View className="flex-1 items-center justify-center py-16">
      <ActivityIndicator size="large" color="#0f766e" />
      <Text className="mt-4 text-sm text-muted-foreground font-medium">{message}</Text>
    </View>
  );
}
