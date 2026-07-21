import * as Haptics from 'expo-haptics'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/Button'
import { Card, SectionLabel } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'

const schema = z
  .object({
    googleDocUrl: z.string().trim(),
    githubRepoUrl: z.string().trim(),
  })
  .superRefine((values, ctx) => {
    const doc = values.googleDocUrl
    const repo = values.githubRepoUrl
    if (!doc && !repo) {
      ctx.addIssue({
        code: 'custom',
        message: 'Add a Google Doc and/or GitHub link',
        path: ['googleDocUrl'],
      })
    }
    if (doc && !/^https?:\/\//i.test(doc)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Use a full URL starting with https://',
        path: ['googleDocUrl'],
      })
    }
    if (repo && !/^https?:\/\//i.test(repo)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Use a full URL starting with https://',
        path: ['githubRepoUrl'],
      })
    }
  })

export type AssignmentSubmitValues = z.infer<typeof schema>

interface AssignmentSubmitFormProps {
  initialGoogleDocUrl?: string
  initialGithubRepoUrl?: string
  isUpdate?: boolean
  loading?: boolean
  onCancel?: () => void
  onSubmit: (values: AssignmentSubmitValues) => Promise<void> | void
}

export const AssignmentSubmitForm = ({
  initialGoogleDocUrl = '',
  initialGithubRepoUrl = '',
  isUpdate = false,
  loading = false,
  onCancel,
  onSubmit,
}: AssignmentSubmitFormProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<AssignmentSubmitValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      googleDocUrl: initialGoogleDocUrl,
      githubRepoUrl: initialGithubRepoUrl,
    },
  })

  useEffect(() => {
    reset({
      googleDocUrl: initialGoogleDocUrl,
      githubRepoUrl: initialGithubRepoUrl,
    })
  }, [initialGithubRepoUrl, initialGoogleDocUrl, reset])

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={88}
    >
      <Card>
        <SectionLabel>{isUpdate ? 'Update submission' : 'Submit your work'}</SectionLabel>
        <Text className="mb-3 -mt-1 text-sm text-muted-foreground">
          Paste at least one link. Edit anytime before the deadline.
        </Text>

        <View className="gap-3">
          <Controller
            control={control}
            name="googleDocUrl"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Google Doc"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
                textContentType="URL"
                returnKeyType="next"
                placeholder="https://docs.google.com/…"
                error={errors.googleDocUrl?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="githubRepoUrl"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="GitHub repo"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
                textContentType="URL"
                returnKeyType="done"
                placeholder="https://github.com/you/repo"
                error={errors.githubRepoUrl?.message}
              />
            )}
          />
          <Button
            title={isUpdate ? 'Save changes' : 'Submit assignment'}
            loading={loading}
            disabled={!isValid || (isUpdate && !isDirty)}
            onPress={handleSubmit(async (values) => {
              await onSubmit(values)
              void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
            })}
          />
          {onCancel ? (
            <Button title="Cancel" variant="ghost" onPress={onCancel} disabled={loading} />
          ) : null}
        </View>
      </Card>
    </KeyboardAvoidingView>
  )
}
