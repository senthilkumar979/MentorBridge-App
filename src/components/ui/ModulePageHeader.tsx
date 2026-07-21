import { LinearGradient } from 'expo-linear-gradient'
import type { ReactNode } from 'react'
import { Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Button } from '@/components/ui/Button'
import { HeaderBackButton } from '@/components/ui/HeaderBackButton'

interface ModulePageHeaderProps {
  eyebrow: string
  title: string
  subtitle?: string
  actionLabel?: string
  onAction?: () => void
  trailing?: ReactNode
  showBack?: boolean
  /** Use when the native tab/stack header is hidden. */
  safeTop?: boolean
}

export const ModulePageHeader = ({
  eyebrow,
  title,
  subtitle,
  actionLabel,
  onAction,
  trailing,
  showBack = false,
  safeTop = false,
}: ModulePageHeaderProps) => {
  const insets = useSafeAreaInsets()
  const topPad = (safeTop || showBack ? Math.max(insets.top, 8) : 8) + 4

  return (
    <View className="mb-4 overflow-hidden border-b border-border">
      <LinearGradient
        colors={['rgba(213,63,140,0.12)', 'rgba(255,255,255,0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ paddingHorizontal: 16, paddingTop: topPad, paddingBottom: 16 }}
      >
        {showBack ? <HeaderBackButton className="mb-3" /> : null}

        <Text className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          {eyebrow}
        </Text>
        <View className="mt-1 flex-row items-end justify-between gap-3">
          <View className="min-w-0 flex-1">
            <Text className="text-2xl font-bold tracking-tight text-foreground">
              {title}
            </Text>
            {subtitle ? (
              <Text className="mt-1 text-sm text-muted-foreground">{subtitle}</Text>
            ) : null}
          </View>
          {trailing}
        </View>
        {actionLabel && onAction ? (
          <Button title={actionLabel} onPress={onAction} className="mt-4" />
        ) : null}
      </LinearGradient>
      <View className="h-px bg-border" />
      <View className="h-0.5 w-16 bg-primary/40" />
    </View>
  )
}
