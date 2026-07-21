import { useQuery } from '@tanstack/react-query'
import { useLocalSearchParams } from 'expo-router'
import { ScrollView, View } from 'react-native'

import { fetchAssignment } from '@/api/endpoints'
import { AssignmentHero } from '@/components/assignments/AssignmentHero'
import {
  SubmissionCard,
  SubmissionsList,
  type SubmissionRow,
} from '@/components/assignments/SubmissionCard'
import { ErrorState, LoadingState } from '@/components/ui/Card'

export default function AssignmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['assignments', id],
    queryFn: () => fetchAssignment(id),
    enabled: !!id,
  })

  if (isLoading) return <LoadingState variant="detail" />
  if (isError) return <ErrorState message={error.message} />

  const payload = data as {
    assignment?: Record<string, unknown>
    submissions?: SubmissionRow[]
    mySubmission?: SubmissionRow | null
    isAdmin?: boolean
  }

  const assignment = payload.assignment ?? {}
  const submissions = payload.submissions ?? []
  const isAdmin = Boolean(payload.isAdmin)
  const stats = assignment.stats as
    | {
        totalStudents?: number
        submittedCount?: number
        pendingCount?: number
        submissionPercentage?: number
      }
    | undefined

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <AssignmentHero
        title={String(assignment.title ?? 'Assignment')}
        category={assignment.category ? String(assignment.category) : undefined}
        cohortName={
          assignment.cohortName ? String(assignment.cohortName) : undefined
        }
        dueDate={
          assignment.dueDate
            ? String(assignment.dueDate)
            : assignment.dueAt
              ? String(assignment.dueAt)
              : undefined
        }
        dueStatus={
          assignment.dueStatus as 'upcoming' | 'due_soon' | 'past_due' | undefined
        }
        description={
          assignment.description ? String(assignment.description) : undefined
        }
        stats={stats}
      />

      <View className="mt-5 gap-4">
        {isAdmin ? (
          <SubmissionsList submissions={submissions} />
        ) : payload.mySubmission ? (
          <View className="px-4">
            <SubmissionCard submission={payload.mySubmission} compact />
          </View>
        ) : null}
      </View>
    </ScrollView>
  )
}
