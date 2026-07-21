import { useQuery } from '@tanstack/react-query'
import { FlashList } from '@shopify/flash-list'
import { useRouter } from 'expo-router'
import { useMemo } from 'react'
import { View } from 'react-native'

import { fetchAssignments } from '@/api/endpoints'
import {
  AssignmentListCard,
  type AssignmentListItem,
} from '@/components/assignments/AssignmentListCard'
import { ModulePageHeader } from '@/components/ui/ModulePageHeader'
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/Card'

export default function StudentAssignmentsScreen() {
  const router = useRouter()
  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey: ['assignments'],
    queryFn: fetchAssignments,
  })

  const assignments = (data?.assignments ?? []) as AssignmentListItem[]
  const pending = useMemo(
    () => assignments.filter((a) => a.mySubmissionStatus !== 'submitted').length,
    [assignments],
  )

  if (isLoading) return <LoadingState />
  if (isError) return <ErrorState message={error.message} />

  return (
    <View className="flex-1 bg-background">
      <FlashList
        data={assignments}
        refreshing={isRefetching}
        onRefresh={refetch}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <ModulePageHeader
            eyebrow="Your cohort"
            title="Assignments"
            subtitle={`${assignments.length} assigned · ${pending} pending`}
            safeTop
          />
        }
        ListEmptyComponent={
          <EmptyState
            title="No assignments yet"
            description="When your mentors publish work, it will show up here."
          />
        }
        contentContainerStyle={{ paddingBottom: 28, paddingTop: 8 }}
        renderItem={({ item }) => (
          <AssignmentListCard
            assignment={item}
            studentMode
            onPress={() => router.push(`/(student)/assignments/${item.id}`)}
          />
        )}
      />
    </View>
  )
}
