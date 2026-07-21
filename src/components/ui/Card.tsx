import { Text, View, type ViewProps } from 'react-native'

import {
  SkeletonLoadingState,
  type LoadingVariant,
} from '@/components/ui/Skeleton'

interface CardProps extends ViewProps {
  children: React.ReactNode
  className?: string
}

export const Card = ({ children, className, ...props }: CardProps) => (
  <View
    className={`rounded-xl border border-border bg-surface/80 p-4 ${className ?? ''}`}
    {...props}
  >
    {children}
  </View>
)

export const SectionLabel = ({ children }: { children: string }) => (
  <Text className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
    {children}
  </Text>
)

export const ScreenTitle = ({ children }: { children: string }) => (
  <Text className="text-2xl font-bold text-foreground">{children}</Text>
)

export const MutedText = ({ children }: { children: React.ReactNode }) => (
  <Text className="text-sm text-muted-foreground">{children}</Text>
)

export const Badge = ({
  label,
  tone = 'primary',
}: {
  label: string
  tone?: 'primary' | 'success' | 'error' | 'warning' | 'info' | 'muted'
}) => {
  const tones = {
    primary: 'bg-primary/20 text-primary border-primary/40',
    success: 'bg-success/20 text-success border-success/40',
    error: 'bg-error/20 text-error border-error/40',
    warning: 'bg-warning/20 text-warning-foreground border-warning/40',
    info: 'bg-info/20 text-info border-info/40',
    muted: 'bg-muted text-muted-foreground border-border',
  }
  return (
    <View className={`self-start rounded-full border px-2.5 py-0.5 ${tones[tone]}`}>
      <Text className={`text-xs font-medium ${tones[tone].split(' ')[1]}`}>{label}</Text>
    </View>
  )
}

export const EmptyState = ({ title, description }: { title: string; description?: string }) => (
  <View className="items-center justify-center gap-2 px-6 py-12">
    <Text className="text-lg font-semibold text-foreground">{title}</Text>
    {description ? <MutedText>{description}</MutedText> : null}
  </View>
)

export const LoadingState = ({ variant = 'list' }: { variant?: LoadingVariant }) => (
  <SkeletonLoadingState variant={variant} />
)

export const ErrorState = ({ message }: { message: string }) => (
  <View className="items-center justify-center gap-2 px-6 py-12">
    <Text className="text-base font-semibold text-error">Something went wrong</Text>
    <MutedText>{message}</MutedText>
  </View>
)
