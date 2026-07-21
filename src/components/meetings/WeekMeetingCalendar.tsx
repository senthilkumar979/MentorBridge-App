import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Text, View } from 'react-native'

import {
  WeekCalendarShell,
  WeekDayPills,
} from '@/components/meetings/WeekCalendarParts'
import {
  WeekMeetingEmptyDay,
  WeekMeetingEventRow,
} from '@/components/meetings/WeekMeetingRows'
import { useMeetingsForWeek } from '@/hooks/useQueries'
import { getTodayKeyIst } from '@/lib/meetingWeek'
import { colors } from '@/theme/colors'

interface WeekMeetingCalendarProps {
  /** Compact mode for dashboard (slightly tighter spacing). */
  compact?: boolean
}

export const WeekMeetingCalendar = ({
  compact = false,
}: WeekMeetingCalendarProps) => {
  const router = useRouter()
  const { data, isLoading, isError, error } = useMeetingsForWeek()
  const todayKey = getTodayKeyIst()
  const [selectedKey, setSelectedKey] = useState(todayKey)

  useEffect(() => {
    if (!data?.weekDays.length) return
    const hasToday = data.weekDays.some((d) => d.key === todayKey)
    setSelectedKey(hasToday ? todayKey : data.weekDays[0]!.key)
  }, [data?.weekDays, todayKey])

  if (isLoading) {
    return (
      <View
        className="mx-4 gap-3 rounded-2xl border border-border px-4 py-4"
        style={{ backgroundColor: colors.surface }}
      >
        <View className="flex-row justify-between">
          {Array.from({ length: 7 }).map((_, i) => (
            <View
              key={i}
              className="h-12 w-9 rounded-xl"
              style={{ backgroundColor: colors.muted }}
            />
          ))}
        </View>
        <View className="h-16 rounded-xl" style={{ backgroundColor: colors.muted }} />
        <View className="h-16 rounded-xl" style={{ backgroundColor: colors.muted }} />
      </View>
    )
  }

  if (isError) {
    return (
      <View
        className="mx-4 rounded-2xl border border-error/40 px-4 py-6"
        style={{ backgroundColor: colors.surface }}
      >
        <Text className="text-center text-sm text-error">
          {error.message || 'Could not load this week’s meetings.'}
        </Text>
      </View>
    )
  }

  if (!data) return null

  const selectedDay =
    data.weekDays.find((d) => d.key === selectedKey) ?? data.weekDays[0]
  const events = selectedDay ? (data.meetingsByDay[selectedDay.key] ?? []) : []

  return (
    <WeekCalendarShell
      monthLabel={data.monthLabel}
      rangeLabel={data.rangeLabel}
      totalCount={data.totalCount}
    >
      <WeekDayPills
        weekDays={data.weekDays}
        selectedKey={selectedDay?.key ?? selectedKey}
        meetingsByDay={data.meetingsByDay}
        onSelect={setSelectedKey}
      />
      <View className={`px-3 ${compact ? 'pt-2' : 'pt-3'}`}>
        {events.length === 0 ? (
          <WeekMeetingEmptyDay label={selectedDay?.label ?? 'this day'} />
        ) : (
          events.map((meeting) => (
            <WeekMeetingEventRow
              key={meeting.id ?? `${meeting.title}-${meeting.date}`}
              meeting={meeting}
              onPress={() => {
                if (meeting.id) router.push(`/(admin)/meetings/${meeting.id}`)
              }}
            />
          ))
        )}
      </View>
    </WeekCalendarShell>
  )
}
