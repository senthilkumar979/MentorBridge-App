import { LinearGradient } from 'expo-linear-gradient'
import { Clock3, Layers3, Users } from 'lucide-react-native'
import { Text, View } from 'react-native'

import { Badge } from '@/components/ui/Card'
import { HtmlContent } from '@/components/ui/HtmlContent'
import { colors } from '@/theme/colors'

interface AssignmentHeroProps {
  title: string
  category?: string
  cohortName?: string
  dueDate?: string
  dueStatus?: 'upcoming' | 'due_soon' | 'past_due'
  description?: string
  stats?: {
    totalStudents?: number
    submittedCount?: number
    pendingCount?: number
    submissionPercentage?: number
  }
  studentMode?: boolean
  mySubmissionStatus?: 'submitted' | 'not_submitted'
}

function dueTone(status?: AssignmentHeroProps['dueStatus']) {
  if (status === 'past_due') return 'error' as const
  if (status === 'due_soon') return 'warning' as const
  return 'success' as const
}

function dueLabel(status?: AssignmentHeroProps['dueStatus'], dueDate?: string) {
  if (status === 'past_due') return 'Past due'
  if (status === 'due_soon') return 'Due soon'
  if (status === 'upcoming') return 'Upcoming'
  if (!dueDate) return 'No due date'
  return new Date(dueDate).toLocaleDateString()
}

export const AssignmentHero = ({
  title,
  category,
  cohortName,
  dueDate,
  dueStatus,
  description,
  stats,
  studentMode,
  mySubmissionStatus,
}: AssignmentHeroProps) => {
  const dueFormatted = dueDate
    ? new Date(dueDate).toLocaleString(undefined, {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null

  return (
    <View className="overflow-hidden rounded-b-3xl">
      <LinearGradient
        colors={['#fdf2f8', '#f8fafc', '#ffffff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 24 }}
      >
        <Text className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          Assignment
        </Text>
        <Text className="mt-2 text-3xl font-bold tracking-tight text-foreground">
          {title}
        </Text>

        <View className="mt-3 flex-row flex-wrap items-center gap-2">
          <Badge label={category ?? 'General'} tone="info" />
          <Badge label={dueLabel(dueStatus, dueDate)} tone={dueTone(dueStatus)} />
          {studentMode ? (
            <Badge
              label={
                mySubmissionStatus === 'submitted' ? 'Submitted' : 'Not submitted'
              }
              tone={mySubmissionStatus === 'submitted' ? 'success' : 'muted'}
            />
          ) : null}
        </View>

        <View className="mt-4 gap-2">
          {cohortName ? (
            <View className="flex-row items-center gap-2">
              <Layers3 size={14} color={colors.mutedForeground} />
              <Text className="text-sm text-muted-foreground">{cohortName}</Text>
            </View>
          ) : null}
          {dueFormatted ? (
            <View className="flex-row items-center gap-2">
              <Clock3 size={14} color={colors.primary} />
              <Text className="text-sm text-foreground">{dueFormatted}</Text>
            </View>
          ) : null}
          {!studentMode && stats ? (
            <View className="flex-row items-center gap-2">
              <Users size={14} color={colors.info} />
              <Text className="text-sm text-muted-foreground">
                {stats.submittedCount ?? 0}/{stats.totalStudents ?? 0} submitted
                {typeof stats.submissionPercentage === 'number'
                  ? ` · ${Math.round(stats.submissionPercentage)}%`
                  : ''}
              </Text>
            </View>
          ) : null}
        </View>

        {description ? (
          <View className="mt-5 rounded-2xl border border-border bg-surface/70 p-4">
            <Text className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Brief
            </Text>
            <HtmlContent html={description} />
          </View>
        ) : null}
      </LinearGradient>
    </View>
  )
}
