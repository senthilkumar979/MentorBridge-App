import {
  CheckCircle2,
  ChevronRight,
  CircleDashed,
  ClipboardList,
  Clock3,
  Users,
} from 'lucide-react-native'
import { Text, View } from 'react-native'

import { Badge } from '@/components/ui/Card'
import { colors } from '@/theme/colors'

export interface AssignmentListItem {
  id: string
  title: string
  description?: string
  category?: string
  dueDate?: string
  dueAt?: string
  cohortName?: string
  dueStatus?: 'upcoming' | 'due_soon' | 'past_due'
  mySubmissionStatus?: 'submitted' | 'not_submitted'
  stats?: {
    totalStudents?: number
    submittedCount?: number
    pendingCount?: number
    submissionPercentage?: number
  }
}

export function dueTone(status?: AssignmentListItem['dueStatus']) {
  if (status === 'past_due') return 'error' as const
  if (status === 'due_soon') return 'warning' as const
  return 'success' as const
}

export function dueLabel(item: AssignmentListItem) {
  if (item.dueStatus === 'past_due') return 'Past due'
  if (item.dueStatus === 'due_soon') return 'Due soon'
  if (item.dueStatus === 'upcoming') return 'Upcoming'
  const raw = item.dueDate ?? item.dueAt
  if (!raw) return 'No due date'
  const d = new Date(raw)
  if (Number.isNaN(d.getTime())) return 'No due date'
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatDueDate(item: AssignmentListItem) {
  const raw = item.dueDate ?? item.dueAt
  if (!raw) return null
  const d = new Date(raw)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function accentFor(status?: AssignmentListItem['dueStatus']) {
  if (status === 'past_due') return colors.error
  if (status === 'due_soon') return colors.warning
  return colors.primary
}

export const AssignmentCardMeta = ({
  assignment,
  studentMode,
}: {
  assignment: AssignmentListItem
  studentMode?: boolean
}) => {
  const submitted = assignment.mySubmissionStatus === 'submitted'
  const pct = assignment.stats?.submissionPercentage
  const submittedCount = assignment.stats?.submittedCount
  const total = assignment.stats?.totalStudents

  return (
    <>
      <View className="mb-2 flex-row flex-wrap items-center gap-2">
        <Badge label={assignment.category ?? 'General'} tone="info" />
        <Badge label={dueLabel(assignment)} tone={dueTone(assignment.dueStatus)} />
        {studentMode ? (
          <Badge
            label={submitted ? 'Submitted' : 'Not submitted'}
            tone={submitted ? 'success' : 'muted'}
          />
        ) : null}
      </View>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-1.5">
          <Clock3 size={13} color={colors.mutedForeground} />
          <Text className="text-xs text-muted-foreground">
            {formatDueDate(assignment) ?? 'No deadline'}
          </Text>
        </View>
        {studentMode ? (
          <View className="flex-row items-center gap-1.5">
            {submitted ? (
              <CheckCircle2 size={13} color={colors.success} />
            ) : (
              <CircleDashed size={13} color={colors.mutedForeground} />
            )}
            <Text className="text-xs text-muted-foreground">
              {submitted ? 'Done' : 'Action needed'}
            </Text>
          </View>
        ) : (
          <View className="flex-row items-center gap-1.5">
            <Users size={13} color={colors.mutedForeground} />
            <Text className="text-xs text-muted-foreground">
              {typeof submittedCount === 'number' && typeof total === 'number'
                ? `${submittedCount}/${total} submitted`
                : typeof pct === 'number'
                  ? `${Math.round(pct)}% submitted`
                  : 'No stats'}
            </Text>
          </View>
        )}
      </View>
    </>
  )
}

export const AssignmentCardTitle = ({
  title,
  cohortName,
}: {
  title: string
  cohortName?: string
}) => (
  <View className="mb-2 flex-row items-start gap-3">
    <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
      <ClipboardList size={18} color={colors.primary} />
    </View>
    <View className="min-w-0 flex-1">
      <Text className="text-base font-bold text-foreground" numberOfLines={2}>
        {title}
      </Text>
      {cohortName ? (
        <Text className="mt-0.5 text-xs text-muted-foreground">{cohortName}</Text>
      ) : null}
    </View>
    <ChevronRight size={16} color={colors.mutedForeground} />
  </View>
)
