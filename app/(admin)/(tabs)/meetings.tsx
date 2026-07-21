import { FlashList } from '@shopify/flash-list'
import { useRouter } from 'expo-router'
import { useMemo, useState } from 'react'
import { ActivityIndicator, Pressable, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import type { Meeting } from '@/api/endpoints'
import { MeetingListCard } from '@/components/meetings/MeetingListCard'
import { MeetingsPageHeader } from '@/components/meetings/MeetingsPageHeader'
import { WeekMeetingCalendar } from '@/components/meetings/WeekMeetingCalendar'
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '@/components/ui/Card'
import { useEndReachedGate } from '@/hooks/useEndReachedGate'
import { useMeetingsForWeek, useMeetingsInfinite } from '@/hooks/useQueries'
import { colors } from '@/theme/colors'

type ListFilter = 'all' | 'upcoming'

export default function MeetingsScreen() {
  const router = useRouter()
  const [filter, setFilter] = useState<ListFilter>('all')
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMeetingsInfinite()
  const week = useMeetingsForWeek()
  const gate = useEndReachedGate({ minOffset: 120, cooldownMs: 800 })

  const meetings = useMemo(
    () => data?.pages.flatMap((p) => p.data) ?? [],
    [data?.pages],
  )
  const filtered = useMemo(() => {
    if (filter === 'all') return meetings
    const cutoff = Date.now() - 60 * 60 * 1000
    return meetings.filter((m) => {
      const t = new Date(m.date).getTime()
      return !Number.isNaN(t) && t >= cutoff
    })
  }, [filter, meetings])

  if (isLoading && !data) return <LoadingState />
  if (isError) return <ErrorState message={error.message} />

  const weekCount = week.data?.totalCount ?? 0
  const total = data?.pages[0]?.pagination.totalCount

  return (
    <SafeAreaView edges={['left', 'right']} className="flex-1 bg-background">
      <FlashList
        data={filtered}
        keyExtractor={(item) => item.id ?? `${item.title}-${item.date}`}
        refreshing={isRefetching && !isFetchingNextPage}
        onRefresh={() => void refetch()}
        drawDistance={280}
        ListHeaderComponent={
          <View className="pb-2">
            <MeetingsPageHeader
              weekCount={weekCount}
              listCount={meetings.length}
              totalCount={total}
              onCreate={() => router.push('/(admin)/meetings/form')}
            />
            <View className="mt-4">
              <WeekMeetingCalendar />
            </View>
            <View className="mt-5 flex-row items-center justify-between px-4 pb-2">
              <Text className="text-sm font-semibold text-foreground">All meetings</Text>
              <View className="flex-row rounded-full border border-border bg-surface p-0.5">
                {(['all', 'upcoming'] as const).map((key) => {
                  const active = filter === key
                  return (
                    <Pressable
                      key={key}
                      onPress={() => setFilter(key)}
                      className="rounded-full px-3 py-1.5"
                      style={{ backgroundColor: active ? colors.primary : 'transparent' }}
                    >
                      <Text
                        className="text-xs font-semibold capitalize"
                        style={{
                          color: active ? colors.primaryForeground : colors.mutedForeground,
                        }}
                      >
                        {key}
                      </Text>
                    </Pressable>
                  )
                })}
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title={filter === 'upcoming' ? 'Nothing upcoming' : 'No meetings yet'}
            description={
              filter === 'upcoming'
                ? 'Switch to All to browse past sessions.'
                : 'Schedule your first session for the cohort.'
            }
          />
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <View className="items-center py-4">
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : filter === 'all' && hasNextPage ? (
            <View className="items-center py-4">
              <Text className="text-sm text-muted-foreground">Scroll for more…</Text>
            </View>
          ) : filtered.length > 0 ? (
            <View className="items-center py-6">
              <Text className="text-xs text-muted-foreground">End of schedule</Text>
            </View>
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 32 }}
        renderItem={({ item }: { item: Meeting }) => (
          <MeetingListCard
            meeting={item}
            onPress={() => item.id && router.push(`/(admin)/meetings/${item.id}`)}
          />
        )}
        onScroll={gate.onScroll}
        scrollEventThrottle={16}
        onEndReached={() => {
          if (filter === 'all' && hasNextPage && !isFetchingNextPage) {
            gate.onEndReached(() => {
              void fetchNextPage()
            })
          }
        }}
        onEndReachedThreshold={0.15}
      />
    </SafeAreaView>
  )
}
