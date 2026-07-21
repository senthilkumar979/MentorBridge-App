import * as Haptics from 'expo-haptics'
import { AlertTriangle, ChevronRight, Clock3 } from 'lucide-react-native'
import { Pressable, Text, View } from 'react-native'

import type { AssignmentListItem } from '@/components/assignments/AssignmentListCard'
import { colors } from '@/theme/colors'

function dueLabel(status?: AssignmentListItem['dueStatus']) {
  if (status === 'past_due') return 'Past due'
  if (status === 'due_soon') return 'Due soon'
  if (status === 'upcoming') return 'Upcoming'
  return 'Assigned'
}

interface ActionItemCardProps {
  item: AssignmentListItem
  onPress: () => void
}

export const ActionItemCard = ({ item, onPress }: ActionItemCardProps) => {
  const isPastDue = item.dueStatus === 'past_due'
  const isDueSoon = item.dueStatus === 'due_soon'
  const accent = isPastDue
    ? colors.error
    : isDueSoon
      ? colors.warning
      : colors.primary

  return (
    <Pressable
      onPress={() => {
        void Haptics.selectionAsync()
        onPress()
      }}
      className="mb-2 flex-row overflow-hidden rounded-2xl border bg-surface active:opacity-90"
      style={{
        borderColor: isPastDue ? 'rgba(220,38,38,0.35)' : colors.border,
        backgroundColor: isPastDue ? 'rgba(220,38,38,0.04)' : colors.surface,
      }}
    >
      <View className="w-1.5" style={{ backgroundColor: accent }} />
      <View className="min-w-0 flex-1 px-3.5 py-3.5">
        <View className="mb-2 flex-row items-start justify-between gap-2">
          <Text
            className="min-w-0 flex-1 text-base font-bold text-foreground"
            numberOfLines={2}
          >
            {item.title}
          </Text>
          <View
            className="flex-row items-center gap-1 rounded-full px-2 py-0.5"
            style={{
              backgroundColor: isPastDue
                ? 'rgba(220,38,38,0.12)'
                : isDueSoon
                  ? 'rgba(206,165,0,0.15)'
                  : 'rgba(213,63,140,0.1)',
            }}
          >
            {isPastDue ? (
              <AlertTriangle size={11} color={colors.error} />
            ) : (
              <Clock3 size={11} color={accent} />
            )}
            <Text className="text-[10px] font-semibold" style={{ color: accent }}>
              {dueLabel(item.dueStatus)}
            </Text>
          </View>
        </View>

        {isPastDue ? (
          <Text className="mb-2 text-sm font-medium text-error">
            Submit now — this assignment is overdue
          </Text>
        ) : null}

        <View className="flex-row items-center justify-between">
          <Text className="text-xs text-muted-foreground">
            {item.mySubmissionStatus === 'submitted' ? 'Submitted' : 'Not submitted'}
            {item.category ? ` · ${item.category}` : ''}
          </Text>
          <ChevronRight size={16} color={colors.mutedForeground} />
        </View>
      </View>
    </Pressable>
  )
}
