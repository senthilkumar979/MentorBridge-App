import { useRouter } from 'expo-router'
import { Pressable, Text, View } from 'react-native'

import type { Meeting } from '@/api/endpoints'
import { MeetingListCard } from '@/components/meetings/MeetingListCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { SectionLabel } from '@/components/ui/Card'

interface StudentTodayEventsProps {
  meetings: Meeting[]
  isLoading?: boolean
}

export const StudentTodayEvents = ({
  meetings,
  isLoading,
}: StudentTodayEventsProps) => {
  const router = useRouter()

  return (
    <View className="mt-2">
      <View className="mb-2 flex-row items-center justify-between px-4">
        <SectionLabel>Today’s events</SectionLabel>
        <Pressable onPress={() => router.push('/(student)/(tabs)/events')}>
          <Text className="text-xs font-semibold text-primary">All events</Text>
        </Pressable>
      </View>

      {isLoading ? (
        <View className="mx-4 overflow-hidden rounded-2xl border border-border bg-surface">
          <Skeleton height={96} rounded={0} />
          <View className="flex-row">
            <View className="w-[72px] items-center gap-2 border-r border-border py-4">
              <Skeleton height={10} width={36} />
              <Skeleton height={22} width={28} />
            </View>
            <View className="flex-1 gap-2 px-3.5 py-3.5">
              <Skeleton height={16} width="75%" />
              <Skeleton height={12} width="40%" />
            </View>
          </View>
        </View>
      ) : meetings.length === 0 ? (
        <View className="mx-4 rounded-2xl border border-border bg-surface px-4 py-4">
          <Text className="text-base font-semibold text-foreground">No events today</Text>
          <Text className="mt-1 text-sm text-muted-foreground">
            You’re free — check upcoming sessions in Events.
          </Text>
        </View>
      ) : (
        meetings.map((meeting) => (
          <MeetingListCard
            key={meeting.id ?? `${meeting.title}-${meeting.date}`}
            meeting={meeting}
            compact
            onPress={() => router.push(`/(student)/events/${meeting.id}`)}
          />
        ))
      )}
    </View>
  )
}
