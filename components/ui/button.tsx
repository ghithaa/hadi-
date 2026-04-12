import { Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-semibold transition-all active:scale-95 disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm shadow-primary/20",
        destructive: "bg-destructive text-destructive-foreground shadow-sm shadow-destructive/20",
        outline: "border border-input bg-background text-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        ghost: "text-muted-foreground",
        link: "text-primary underline-offset-4",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 rounded-xl px-4",
        lg: "h-14 rounded-2xl px-10",
        icon: "h-11 w-11 rounded-full bg-secondary/50",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps extends TouchableOpacityProps, VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  className?: string;
}

export function Button({ className, variant, size, children, ...props }: ButtonProps) {
  return (
    <TouchableOpacity className={cn(buttonVariants({ variant, size, className }))} {...props}>
      {typeof children === 'string' ? (
        <Text className={cn(
          variant === 'default' ? 'text-primary-foreground' :
            variant === 'destructive' ? 'text-destructive-foreground' :
              'text-foreground'
        )}>
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}
