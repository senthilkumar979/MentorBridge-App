import * as Haptics from 'expo-haptics'
import { Plus } from 'lucide-react-native'
import { Pressable, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import type { AdminModuleConfig } from '@/components/administration/adminModuleConfig'
import { HeaderBackButton } from '@/components/ui/HeaderBackButton'
import { colors } from '@/theme/colors'

interface AdminModuleHeaderProps {
  config: AdminModuleConfig
  count: number
  composerOpen: boolean
  onToggleComposer: () => void
  showBack?: boolean
}

export const AdminModuleHeader = ({
  config,
  count,
  composerOpen,
  onToggleComposer,
  showBack = true,
}: AdminModuleHeaderProps) => {
  const insets = useSafeAreaInsets()

  return (
    <View
      className="border-b border-border bg-surface px-4 pb-4"
      style={{ paddingTop: Math.max(insets.top, 8) }}
    >
      {showBack ? <HeaderBackButton className="mb-3" /> : null}

      <View className="flex-row items-start justify-between gap-3">
        <View className="min-w-0 flex-1">
          <Text className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            {config.eyebrow}
          </Text>
          <Text className="mt-1 text-3xl font-bold tracking-tight text-foreground">
            {config.title}
          </Text>
          <Text className="mt-1 text-sm text-muted-foreground">
            {count} item{count === 1 ? '' : 's'}
          </Text>
        </View>
        {config.canCreate ? (
          <Pressable
            onPress={() => {
              void Haptics.selectionAsync()
              onToggleComposer()
            }}
            className="h-11 flex-row items-center gap-1.5 rounded-full bg-primary px-4 active:opacity-90"
          >
            <Plus size={18} color={colors.primaryForeground} strokeWidth={2.5} />
            <Text className="text-sm font-semibold text-primary-foreground">
              {composerOpen ? 'Close' : 'Add'}
            </Text>
          </Pressable>
        ) : null}
      </View>
      <View className="mt-3 h-0.5 w-16 bg-primary/40" />
    </View>
  )
}
