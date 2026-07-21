import { Text, TextInput, View, type TextInputProps } from 'react-native'

interface InputProps extends TextInputProps {
  label?: string
  error?: string
}

export const Input = ({ label, error, className, ...props }: InputProps & { className?: string }) => {
  return (
    <View className="gap-1.5">
      {label ? (
        <Text className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          {label}
        </Text>
      ) : null}
      <TextInput
        placeholderTextColor="#9ca3af"
        className={`min-h-[44px] rounded-lg border border-border bg-surface-elevated px-3 py-2.5 text-base text-foreground ${error ? 'border-error' : ''} ${className ?? ''}`}
        {...props}
      />
      {error ? <Text className="text-sm text-error">{error}</Text> : null}
    </View>
  )
}
