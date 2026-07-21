import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native'

import { fetchAssignment, submitMyAssignment } from '@/api/endpoints'
import { AssignmentHero } from '@/components/assignments/AssignmentHero'
import { AssignmentSubmitForm } from '@/components/assignments/AssignmentSubmitForm'
import {
  SubmissionCard,
  type SubmissionRow,
} from '@/components/assignments/SubmissionCard'
import { Button } from '@/components/ui/Button'
import { Card, ErrorState, LoadingState, SectionLabel } from '@/components/ui/Card'

export default function StudentAssignmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const qc = useQueryClient()
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['assignments', id],
    queryFn: () => fetchAssignment(id),
    enabled: !!id,
  })

  const [editing, setEditing] = useState(false)

  const submit = useMutation({
    mutationFn: (payload: { googleDocUrl: string; githubRepoUrl: string }) =>
      submitMyAssignment(id, payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['assignments'] })
      setEditing(false)
      Alert.alert('Submitted', 'Your work was saved successfully.')
    },
    onError: (e: Error) => Alert.alert('Submit failed', e.message),
  })

  const payload = data as {
    assignment?: Record<string, unknown>
    mySubmission?: SubmissionRow | null
    canSubmit?: boolean
  }

  if (isLoading) return <LoadingState variant="detail" />
  if (isError) return <ErrorState message={error.message} />

  const assignment = payload.assignment ?? {}
  const canSubmit = Boolean(payload.canSubmit)
  const pastDue = assignment.dueStatus === 'past_due'
  const mySubmission = payload.mySubmission

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={64}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 48 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AssignmentHero
          title={String(assignment.title ?? 'Assignment')}
          category={assignment.category ? String(assignment.category) : undefined}
          cohortName={
            assignment.cohortName ? String(assignment.cohortName) : undefined
          }
          dueDate={
            assignment.dueDate ? String(assignment.dueDate) : undefined
          }
          dueStatus={
            assignment.dueStatus as 'upcoming' | 'due_soon' | 'past_due' | undefined
          }
          description={
            assignment.description ? String(assignment.description) : undefined
          }
          studentMode
          mySubmissionStatus={mySubmission ? 'submitted' : 'not_submitted'}
        />

        <View className="mt-5 gap-4 px-4">
          {mySubmission && !editing ? (
            <>
              <SubmissionCard submission={mySubmission} compact />
              {canSubmit && !pastDue ? (
                <Button
                  title="Edit submission"
                  variant="outline"
                  onPress={() => setEditing(true)}
                />
              ) : null}
            </>
          ) : null}

          {canSubmit && (!mySubmission || editing) ? (
            <AssignmentSubmitForm
              isUpdate={Boolean(mySubmission)}
              loading={submit.isPending}
              initialGoogleDocUrl={mySubmission?.googleDocUrl ?? ''}
              initialGithubRepoUrl={mySubmission?.githubRepoUrl ?? ''}
              onCancel={editing ? () => setEditing(false) : undefined}
              onSubmit={(values) => submit.mutateAsync(values)}
            />
          ) : null}

          {!canSubmit && !mySubmission ? (
            <Card>
              <SectionLabel>Submission</SectionLabel>
              <Text className="text-sm text-muted-foreground">
                You can’t submit this assignment from your account right now.
              </Text>
            </Card>
          ) : null}

          {pastDue && !mySubmission ? (
            <Card className="border-error/30">
              <SectionLabel>Deadline passed</SectionLabel>
              <Text className="text-sm text-muted-foreground">
                Submissions are closed for this assignment.
              </Text>
            </Card>
          ) : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
