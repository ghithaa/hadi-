import * as React from 'react';
import { TextInput, TextInputProps, View, Text } from 'react-native';
import { cn } from '@/lib/utils';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<TextInput, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <View className="space-y-2">
        {label && (
          <Text className="text-sm font-semibold text-foreground ml-1 mb-1">
            {label}
          </Text>
        )}
        <View className="relative flex-row items-center">
          {icon && (
            <View className="absolute left-4 z-10 text-muted-foreground">
              {icon}
            </View>
          )}
          <TextInput
            ref={ref}
            className={cn(
              'flex h-14 w-full rounded-2xl border border-border/50 bg-secondary px-4 text-base text-foreground',
              'focus:border-primary focus:bg-background transition-all duration-200',
              icon ? 'pl-12' : '',
              error ? 'border-destructive bg-destructive/5' : '',
              className
            )}
            placeholderTextColor="#9ca3af"
            {...props}
          />
        </View>
        {error && (
          <Text className="text-xs font-medium text-destructive ml-1">{error}</Text>
        )}
      </View>
    );
  }
);
Input.displayName = 'Input';

export { Input };
