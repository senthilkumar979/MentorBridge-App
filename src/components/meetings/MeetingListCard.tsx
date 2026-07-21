import { Image } from 'expo-image'
import * as Haptics from 'expo-haptics'
import { ChevronRight, Clock3, Link2, Users } from 'lucide-react-native'
import { Pressable, Text, View } from 'react-native'

import type { Meeting } from '@/api/endpoints'
import {
  isMeetingToday,
  isUpcomingMeeting,
  meetingDateParts,
  resolveMeetingCoverUrl,
  stripHtmlBlurb,
} from '@/components/meetings/meetingCardUtils'
import { colors } from '@/theme/colors'

interface MeetingListCardProps {
  meeting: Meeting
  onPress: () => void
  compact?: boolean
}

export const MeetingListCard = ({
  meeting,
  onPress,
  compact = false,
}: MeetingListCardProps) => {
  const upcoming = isUpcomingMeeting(meeting.date)
  const today = isMeetingToday(meeting.date)
  const attendanceCount = meeting.attendance?.length ?? 0
  const { weekday, day, month, time } = meetingDateParts(meeting.date)
  const cover = resolveMeetingCoverUrl(meeting.coverImageUrl)
  const blurb = stripHtmlBlurb(meeting.description)
  const statusLabel = today ? 'Today' : upcoming ? 'Upcoming' : 'Past'
  const statusColor = today || upcoming ? colors.primary : colors.mutedForeground
  const accentBg = today || upcoming ? 'rgba(213,63,140,0.08)' : colors.muted

  return (
    <Pressable
      onPress={() => {
        void Haptics.selectionAsync()
        onPress()
      }}
      className="mx-4 mb-3 overflow-hidden rounded-2xl border border-border bg-surface active:opacity-90"
    >
      <View className="relative w-full bg-muted" style={{ height: compact ? 96 : 144 }}>
        <Image
          source={{ uri: cover }}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
          transition={180}
        />
        <View className="absolute left-3 top-3 rounded-full bg-black/45 px-2.5 py-1">
          <Text className="text-[10px] font-semibold text-white">{statusLabel}</Text>
        </View>
      </View>

      <View className="flex-row">
        <View
          className="w-[72px] items-center justify-center border-r border-border py-4"
          style={{ backgroundColor: accentBg }}
        >
          <Text
            className="text-[10px] font-semibold uppercase tracking-wider"
            style={{ color: statusColor }}
          >
            {weekday}
          </Text>
          <Text
            className="mt-0.5 text-2xl font-bold"
            style={{ color: today || upcoming ? colors.primary : colors.foreground }}
          >
            {day}
          </Text>
          <Text className="text-[10px] font-medium text-muted-foreground">{month}</Text>
        </View>

        <View className="min-w-0 flex-1 px-3.5 py-3.5">
          <Text
            className="mb-1.5 text-base font-bold text-foreground"
            numberOfLines={2}
          >
            {meeting.title || 'Untitled meeting'}
          </Text>

          <View className="mb-2 flex-row items-center gap-1.5">
            <Clock3 size={13} color={colors.mutedForeground} />
            <Text className="text-sm text-muted-foreground">{time} IST</Text>
          </View>

          {blurb && !compact ? (
            <Text className="mb-2 text-sm leading-5 text-muted-foreground" numberOfLines={2}>
              {blurb}
            </Text>
          ) : null}

          <View className="flex-row items-center justify-between">
            <View className="flex-row flex-wrap items-center gap-3">
              <View className="flex-row items-center gap-1">
                <Users size={13} color={colors.mutedForeground} />
                <Text className="text-xs text-muted-foreground">
                  {attendanceCount} attended
                </Text>
              </View>
              {meeting.meetingLink ? (
                <View className="flex-row items-center gap-1">
                  <Link2 size={13} color={colors.info} />
                  <Text className="text-xs font-medium text-info">Join link</Text>
                </View>
              ) : null}
            </View>
            <ChevronRight size={16} color={colors.mutedForeground} />
          </View>
        </View>
      </View>
    </Pressable>
  )
}
