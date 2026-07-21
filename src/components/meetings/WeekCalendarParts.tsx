import type { ReactNode } from 'react'
import * as Haptics from 'expo-haptics'
import { Calendar } from 'lucide-react-native'
import { Pressable, ScrollView, Text, View } from 'react-native'

import type { Meeting } from '@/api/endpoints'
import { getTodayKeyIst, type WeekDay } from '@/lib/meetingWeek'
import { colors } from '@/theme/colors'

interface WeekDayPillsProps {
  weekDays: WeekDay[]
  selectedKey: string
  meetingsByDay: Record<string, Meeting[]>
  onSelect: (key: string) => void
}

export const WeekDayPills = ({
  weekDays,
  selectedKey,
  meetingsByDay,
  onSelect,
}: WeekDayPillsProps) => {
  const todayKey = getTodayKeyIst()

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 6, paddingHorizontal: 12, paddingBottom: 2 }}
    >
      {weekDays.map((day) => {
        const isSelected = day.key === selectedKey
        const isToday = day.key === todayKey
        const count = meetingsByDay[day.key]?.length ?? 0
        return (
          <Pressable
            key={day.key}
            onPress={() => {
              void Haptics.selectionAsync()
              onSelect(day.key)
            }}
            className="w-12 items-center rounded-2xl py-2.5"
            style={{
              backgroundColor: isSelected ? colors.primary : colors.surface,
              borderWidth: 1,
              borderColor: isSelected
                ? colors.primary
                : isToday
                  ? colors.primary
                  : colors.border,
            }}
          >
            <Text
              className="text-[10px] font-semibold uppercase"
              style={{
                color: isSelected ? colors.primaryForeground : colors.mutedForeground,
              }}
            >
              {day.dayName}
            </Text>
            <Text
              className="mt-0.5 text-lg font-bold"
              style={{ color: isSelected ? colors.primaryForeground : colors.foreground }}
            >
              {Number(day.day)}
            </Text>
            <View
              className="mt-1 h-1 w-1 rounded-full"
              style={{
                backgroundColor:
                  count > 0
                    ? isSelected
                      ? colors.primaryForeground
                      : colors.primary
                    : 'transparent',
              }}
            />
          </Pressable>
        )
      })}
    </ScrollView>
  )
}

export const WeekCalendarShell = ({
  monthLabel,
  rangeLabel,
  totalCount,
  children,
}: {
  monthLabel: string
  rangeLabel: string
  totalCount: number
  children: ReactNode
}) => (
  <View className="mx-4 overflow-hidden rounded-3xl border border-border bg-surface">
    <View className="flex-row items-end justify-between border-b border-border px-4 pb-3 pt-4">
      <View className="min-w-0 flex-1">
        <View className="mb-1 flex-row items-center gap-1.5">
          <Calendar size={12} color={colors.primary} />
          <Text className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
            This week
          </Text>
        </View>
        <Text className="text-xl font-bold text-foreground">{monthLabel}</Text>
        <Text className="text-xs text-muted-foreground">{rangeLabel}</Text>
      </View>
      <View className="rounded-full bg-primary/10 px-2.5 py-1">
        <Text className="text-xs font-semibold text-primary">
          {totalCount} session{totalCount === 1 ? '' : 's'}
        </Text>
      </View>
    </View>
    <View className="pb-3 pt-3">{children}</View>
  </View>
)
