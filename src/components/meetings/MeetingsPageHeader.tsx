import { Plus } from 'lucide-react-native'
import { Pressable, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { colors } from '@/theme/colors'

interface MeetingsPageHeaderProps {
  weekCount: number
  listCount: number
  totalCount?: number
  onCreate: () => void
}

export const MeetingsPageHeader = ({
  weekCount,
  listCount,
  totalCount,
  onCreate,
}: MeetingsPageHeaderProps) => {
  const insets = useSafeAreaInsets()

  return (
    <View
      className="border-b border-border bg-background px-4 pb-4"
      style={{ paddingTop: Math.max(insets.top, 8) + 4 }}
    >
      <View className="flex-row items-start justify-between gap-3">
        <View className="min-w-0 flex-1">
          <Text className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Schedule
          </Text>
          <Text className="mt-1 text-3xl font-bold tracking-tight text-foreground">
            Meetings
          </Text>
          <Text className="mt-1 text-sm text-muted-foreground">
            {weekCount} this week
            {totalCount != null ? ` · ${totalCount} total` : ` · ${listCount} listed`}
          </Text>
          <View className="mt-3 h-0.5 w-16 bg-primary/40" />
        </View>
        <Pressable
          onPress={onCreate}
          accessibilityRole="button"
          accessibilityLabel="New meeting"
          className="h-11 flex-row items-center gap-1.5 rounded-full bg-primary px-4 active:opacity-90"
        >
          <Plus size={18} color={colors.primaryForeground} strokeWidth={2.5} />
          <Text className="text-sm font-semibold text-primary-foreground">New</Text>
        </Pressable>
      </View>

      <View className="mt-4 flex-row gap-2">
        <View className="flex-1 rounded-2xl border border-border bg-surface px-3 py-3">
          <Text className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            This week
          </Text>
          <Text className="mt-1 text-2xl font-bold text-foreground">{weekCount}</Text>
        </View>
        <View className="flex-1 rounded-2xl border border-primary/20 bg-primary/5 px-3 py-3">
          <Text className="text-[10px] font-semibold uppercase tracking-wider text-primary">
            In list
          </Text>
          <Text className="mt-1 text-2xl font-bold text-foreground">
            {totalCount ?? listCount}
          </Text>
        </View>
      </View>
    </View>
  )
}
