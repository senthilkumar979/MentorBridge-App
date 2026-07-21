import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { CalendarDays, Clock3, Users } from 'lucide-react-native'
import type { ReactNode } from 'react'
import { Text, View } from 'react-native'

import type { Meeting } from '@/api/endpoints'
import { resolveMeetingCoverUrl } from '@/components/meetings/meetingCardUtils'
import {
  formatMeetingWhen,
  isUpcomingMeeting,
} from '@/components/meetings/meetingDetailUtils'
import { Badge } from '@/components/ui/Card'
import { colors } from '@/theme/colors'

interface MeetingDetailHeroProps {
  meeting: Meeting
}

export const MeetingDetailHero = ({ meeting }: MeetingDetailHeroProps) => {
  const upcoming = isUpcomingMeeting(meeting.date)
  const { dateLabel, timeLabel } = formatMeetingWhen(meeting.date)
  const attendanceCount = meeting.attendance?.length ?? 0
  const cover = resolveMeetingCoverUrl(meeting.coverImageUrl)

  return (
    <View className="overflow-hidden">
      <View className="relative h-56 w-full bg-muted">
        <Image
          source={{ uri: cover }}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
          transition={200}
        />
        <LinearGradient
          colors={['transparent', 'rgba(15,23,42,0.72)']}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 120,
          }}
        />
        <View className="absolute bottom-0 left-0 right-0 px-5 pb-5">
          <Badge
            label={upcoming ? 'Upcoming' : 'Past'}
            tone={upcoming ? 'success' : 'muted'}
          />
          <Text
            className="mt-2 text-3xl font-bold tracking-tight text-white"
            numberOfLines={3}
          >
            {meeting.title || 'Untitled meeting'}
          </Text>
        </View>
      </View>

      <View className="flex-row gap-2 border-b border-border bg-background px-4 py-4">
        <MetaChip
          icon={<CalendarDays size={15} color={colors.primary} />}
          label="Date"
          value={dateLabel}
        />
        <MetaChip
          icon={<Clock3 size={15} color={colors.primary} />}
          label="Time"
          value={timeLabel || '—'}
        />
        <MetaChip
          icon={<Users size={15} color={colors.primary} />}
          label="Attendance"
          value={String(attendanceCount)}
        />
      </View>
    </View>
  )
}

const MetaChip = ({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) => (
  <View className="min-w-0 flex-1 rounded-2xl border border-border bg-surface px-3 py-3">
    <View className="mb-1.5 flex-row items-center gap-1.5">
      {icon}
      <Text className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </Text>
    </View>
    <Text className="text-sm font-semibold text-foreground" numberOfLines={2}>
      {value}
    </Text>
  </View>
)
