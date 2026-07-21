import { ActivityIndicator, Pressable, Text, type PressableProps } from 'react-native'

interface ButtonProps extends PressableProps {
  title: string
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  loading?: boolean
}

const variantClass: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  outline: 'border border-primary bg-transparent',
  ghost: 'bg-transparent',
  destructive: 'bg-error',
}

const textClass: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'text-primary-foreground',
  secondary: 'text-secondary-foreground',
  outline: 'text-primary',
  ghost: 'text-primary',
  destructive: 'text-error-foreground',
}

export const Button = ({
  title,
  variant = 'primary',
  loading = false,
  disabled,
  className,
  ...props
}: ButtonProps & { className?: string }) => {
  const isDisabled = disabled || loading
  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      className={`min-h-[44px] items-center justify-center rounded-lg px-4 py-3 ${variantClass[variant]} ${isDisabled ? 'opacity-50' : 'active:opacity-90'} ${className ?? ''}`}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? '#d53f8c' : '#fdf2f8'} />
      ) : (
        <Text className={`text-base font-semibold ${textClass[variant]}`}>
          {title}
        </Text>
      )}
    </Pressable>
  )
}
