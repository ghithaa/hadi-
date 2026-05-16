import * as React from 'react';
import { TextInput, TextInputProps, View, Text } from 'react-native';
import { cn } from '@/lib/utils';
import { useLocalization } from '@/context/LocalizationContext';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<TextInput, InputProps>(
  ({ className, label, error, icon, rightIcon, ...props }, ref) => {
    const { isRTL, textAlign, flexDir } = useLocalization();

    return (
      <View className="space-y-2">
        {label && (
          <Text className={cn("text-sm font-semibold text-foreground mb-1", textAlign(), isRTL ? "mr-1" : "ml-1")}>
            {label}
          </Text>
        )}
        <View className={cn("relative items-center", flexDir())}>
          {icon && (
            <View className={cn("absolute z-10 text-muted-foreground", isRTL ? "right-4" : "left-4")}>
              {icon}
            </View>
          )}
          <TextInput
            ref={ref}
            className={cn(
              'flex h-14 w-full rounded-2xl border border-border/50 bg-secondary px-4 text-base text-foreground',
              'focus:border-primary focus:bg-background transition-all duration-200',
              textAlign(),
              icon ? (isRTL ? 'pr-12' : 'pl-12') : '',
              rightIcon ? (isRTL ? 'pl-12' : 'pr-12') : '',
              error ? 'border-destructive bg-destructive/5' : '',
              className
            )}
            placeholderTextColor="#9ca3af"
            {...props}
          />
          {rightIcon && (
            <View className={cn("absolute z-10 text-muted-foreground", isRTL ? "left-4" : "right-4")}>
              {rightIcon}
            </View>
          )}
        </View>
        {error && (
          <Text className={cn("text-xs font-medium text-destructive", textAlign(), isRTL ? "mr-1" : "ml-1")}>{error}</Text>
        )}
      </View>
    );
  }
);
Input.displayName = 'Input';

export { Input };
