import * as Haptics from 'expo-haptics'
import { ChevronRight, Coffee } from 'lucide-react-native'
import { Pressable, Text, View } from 'react-native'

import type { Meeting } from '@/api/endpoints'
import { formatMeetingTimeIst } from '@/lib/meetingWeek'
import { colors } from '@/theme/colors'

interface WeekMeetingEventRowProps {
  meeting: Meeting
  onPress: () => void
}

export const WeekMeetingEventRow = ({
  meeting,
  onPress,
}: WeekMeetingEventRowProps) => (
  <Pressable
    onPress={() => {
      void Haptics.selectionAsync()
      onPress()
    }}
    className="mb-2 flex-row items-stretch overflow-hidden rounded-2xl border border-border bg-surface active:opacity-90"
  >
    <View className="w-1.5 bg-primary" />
    <View className="w-[64px] items-center justify-center border-r border-border bg-muted/80 px-1 py-3">
      <Text className="text-xs font-bold text-primary">
        {formatMeetingTimeIst(meeting.date)}
      </Text>
    </View>
    <View className="min-w-0 flex-1 flex-row items-center gap-2 px-3 py-3">
      <View className="min-w-0 flex-1">
        <Text className="font-semibold text-foreground" numberOfLines={1}>
          {meeting.title || 'Untitled meeting'}
        </Text>
        <Text className="mt-0.5 text-xs text-muted-foreground">IST · tap for details</Text>
      </View>
      <ChevronRight size={16} color={colors.mutedForeground} />
    </View>
  </Pressable>
)

export const WeekMeetingEmptyDay = ({ label }: { label: string }) => (
  <View className="items-center rounded-2xl border border-dashed border-border bg-muted/50 px-4 py-7">
    <Coffee size={22} color={colors.mutedForeground} />
    <Text className="mt-3 text-sm font-semibold text-foreground">
      Clear on {label}
    </Text>
    <Text className="mt-1 text-center text-xs text-muted-foreground">
      No sessions booked — plan ahead or take a breather.
    </Text>
  </View>
)
