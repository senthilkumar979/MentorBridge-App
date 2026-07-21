import { ExternalLink, MessageSquareText, Star } from 'lucide-react-native'
import { Linking, Pressable, Text, View } from 'react-native'

import { Card, MutedText, SectionLabel } from '@/components/ui/Card'
import { colors } from '@/theme/colors'

export interface SubmissionRow {
  id: string
  studentName?: string
  studentEmail?: string
  googleDocUrl?: string
  githubRepoUrl?: string
  submittedAt?: string
  rating?: number | null
  feedbackComment?: string | null
  reviewedBy?: string | null
  reviewedAt?: string | null
}

function openUrl(url?: string) {
  if (!url?.trim()) return
  void Linking.openURL(url.startsWith('http') ? url : `https://${url}`)
}

export const SubmissionCard = ({
  submission,
  compact = false,
}: {
  submission: SubmissionRow
  compact?: boolean
}) => {
  const name = submission.studentName || submission.studentEmail || 'Student'
  const when = submission.submittedAt
    ? new Date(submission.submittedAt).toLocaleString()
    : null

  return (
    <Card className={compact ? '' : 'mx-4'}>
      <View className="mb-3 flex-row items-center gap-3">
        <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/20">
          <Text className="text-base font-bold text-primary">
            {name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View className="min-w-0 flex-1">
          <Text className="font-semibold text-foreground" numberOfLines={1}>
            {name}
          </Text>
          {when ? <MutedText>{when}</MutedText> : null}
        </View>
        {typeof submission.rating === 'number' ? (
          <View className="flex-row items-center gap-1 rounded-full bg-warning/15 px-2 py-1">
            <Star size={12} color={colors.warning} fill={colors.warning} />
            <Text className="text-xs font-bold text-warning">
              {submission.rating}
            </Text>
          </View>
        ) : (
          <View className="rounded-full border border-border px-2 py-1">
            <Text className="text-[10px] font-semibold uppercase text-muted-foreground">
              Pending
            </Text>
          </View>
        )}
      </View>

      <View className="flex-row flex-wrap gap-2">
        {submission.googleDocUrl ? (
          <Pressable
            onPress={() => openUrl(submission.googleDocUrl)}
            className="flex-row items-center gap-1.5 rounded-xl border border-border bg-surface-elevated px-3 py-2"
          >
            <ExternalLink size={14} color={colors.primary} />
            <Text className="text-xs font-medium text-foreground">Google Doc</Text>
          </Pressable>
        ) : null}
        {submission.githubRepoUrl ? (
          <Pressable
            onPress={() => openUrl(submission.githubRepoUrl)}
            className="flex-row items-center gap-1.5 rounded-xl border border-border bg-surface-elevated px-3 py-2"
          >
            <ExternalLink size={14} color={colors.info} />
            <Text className="text-xs font-medium text-foreground">GitHub</Text>
          </Pressable>
        ) : null}
      </View>

      {submission.feedbackComment ? (
        <View className="mt-3 rounded-xl border border-primary/20 bg-primary/5 p-3">
          <View className="mb-1 flex-row items-center gap-1.5">
            <MessageSquareText size={14} color={colors.primary} />
            <Text className="text-xs font-semibold uppercase tracking-wider text-primary">
              Feedback
              {submission.reviewedBy ? ` · ${submission.reviewedBy}` : ''}
            </Text>
          </View>
          <Text className="text-sm leading-5 text-foreground">
            {submission.feedbackComment}
          </Text>
        </View>
      ) : null}
    </Card>
  )
}

export const SubmissionsList = ({
  submissions,
}: {
  submissions: SubmissionRow[]
}) => {
  if (!submissions.length) {
    return (
      <Card className="mx-4">
        <SectionLabel>Submissions</SectionLabel>
        <MutedText>No submissions yet for this assignment.</MutedText>
      </Card>
    )
  }

  return (
    <View className="gap-3">
      <View className="px-4">
        <SectionLabel>{`Submissions (${submissions.length})`}</SectionLabel>
      </View>
      {submissions.map((s) => (
        <View key={s.id} className="px-4">
          <SubmissionCard submission={s} compact />
        </View>
      ))}
    </View>
  )
}
