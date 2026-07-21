import { useQuery } from '@tanstack/react-query'
import { FlashList } from '@shopify/flash-list'
import { useRouter } from 'expo-router'
import { useMemo, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { fetchAssignments } from '@/api/endpoints'
import {
  AssignmentListCard,
  type AssignmentListItem,
} from '@/components/assignments/AssignmentListCard'
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/Card'
import { colors } from '@/theme/colors'

type Filter = 'all' | 'due_soon' | 'past_due'

export default function AssignmentsTabScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const [filter, setFilter] = useState<Filter>('all')
  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey: ['assignments'],
    queryFn: fetchAssignments,
  })

  const assignments = (data?.assignments ?? []) as AssignmentListItem[]
  const summary = useMemo(() => {
    const dueSoon = assignments.filter((a) => a.dueStatus === 'due_soon').length
    const pastDue = assignments.filter((a) => a.dueStatus === 'past_due').length
    return { dueSoon, pastDue }
  }, [assignments])

  const filtered = useMemo(() => {
    if (filter === 'all') return assignments
    return assignments.filter((a) => a.dueStatus === filter)
  }, [assignments, filter])

  if (isLoading) return <LoadingState />
  if (isError) return <ErrorState message={error.message} />

  return (
    <View className="flex-1 bg-background">
      <FlashList
        data={filtered}
        refreshing={isRefetching}
        onRefresh={refetch}
        keyExtractor={(item) => item.id}
        drawDistance={280}
        ListHeaderComponent={
          <View
            className="border-b border-border bg-background px-4 pb-4"
            style={{ paddingTop: Math.max(insets.top, 8) + 4 }}
          >
            <Text className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Learning
            </Text>
            <Text className="mt-1 text-3xl font-bold tracking-tight text-foreground">
              Assignments
            </Text>
            <Text className="mt-1 text-sm text-muted-foreground">
              {assignments.length} total
              {summary.dueSoon ? ` · ${summary.dueSoon} due soon` : ''}
              {summary.pastDue ? ` · ${summary.pastDue} past due` : ''}
            </Text>
            <View className="mt-3 h-0.5 w-16 bg-primary/40" />

            <View className="mt-4 flex-row gap-2">
              {(
                [
                  { key: 'all', label: 'All' },
                  { key: 'due_soon', label: 'Due soon' },
                  { key: 'past_due', label: 'Past due' },
                ] as const
              ).map((chip) => {
                const active = filter === chip.key
                return (
                  <Pressable
                    key={chip.key}
                    onPress={() => setFilter(chip.key)}
                    className="rounded-full border px-3 py-1.5"
                    style={{
                      backgroundColor: active ? colors.primary : colors.surface,
                      borderColor: active ? colors.primary : colors.border,
                    }}
                  >
                    <Text
                      className="text-xs font-semibold"
                      style={{
                        color: active
                          ? colors.primaryForeground
                          : colors.mutedForeground,
                      }}
                    >
                      {chip.label}
                    </Text>
                  </Pressable>
                )
              })}
            </View>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title={filter === 'all' ? 'No assignments' : 'Nothing in this filter'}
            description={
              filter === 'all'
                ? 'Create assignments from web or wait for the next cohort cycle.'
                : 'Try All to see the full list.'
            }
          />
        }
        contentContainerStyle={{ paddingBottom: 28 }}
        renderItem={({ item }) => (
          <AssignmentListCard
            assignment={item}
            onPress={() => router.push(`/(admin)/assignments/${item.id}`)}
          />
        )}
      />
    </View>
  )
}
