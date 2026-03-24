import { View, Text, ViewProps, TextProps } from 'react-native';
import { cn } from '@/lib/utils';

interface CardProps extends ViewProps {
  className?: string;
}

interface CardTextProps extends TextProps {
  className?: string;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <View className={cn("rounded-xl border border-border bg-card shadow-sm", className)} {...props}>
      {children}
    </View>
  );
}

export function CardContent({ className, children, ...props }: CardProps) {
  return (
    <View className={cn("p-6 pt-0", className)} {...props}>
      {children}
    </View>
  );
}

export function CardHeader({ className, children, ...props }: CardProps) {
  return (
    <View className={cn("flex flex-col space-y-1.5 p-6", className)} {...props}>
      {children}
    </View>
  );
}

export function CardTitle({ className, children, ...props }: CardTextProps & { children: React.ReactNode }) {
  return (
    <Text className={cn("font-semibold leading-none tracking-tight text-foreground", className)} {...props}>
      {children}
    </Text>
  );
}

export function CardDescription({ className, children, ...props }: CardTextProps & { children: React.ReactNode }) {
  return (
    <Text className={cn("text-sm text-muted-foreground", className)} {...props}>
      {children}
    </Text>
  );
}
