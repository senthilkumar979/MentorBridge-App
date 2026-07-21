import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert, ScrollView } from 'react-native'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useMeeting, useMeetingMutations } from '@/hooks/useQueries'
import { useAppStore } from '@/stores/appStore'
import { LoadingState } from '@/components/ui/Card'

export default function MeetingFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>()
  const router = useRouter()
  const existing = useMeeting(id ?? '')
  const { create, update } = useMeetingMutations()
  const enqueue = useAppStore((s) => s.enqueueOfflineWrite)

  const [title, setTitle] = useState('')
  const [date, setDate] = useState(new Date().toISOString())
  const [description, setDescription] = useState('')
  const [meetingLink, setMeetingLink] = useState('')
  const [googleGroupId, setGoogleGroupId] = useState('')
  const [coverImageUrl, setCoverImageUrl] = useState('')

  useEffect(() => {
    if (!existing.data) return
    setTitle(existing.data.title)
    setDate(existing.data.date)
    setDescription(existing.data.description)
    setMeetingLink(existing.data.meetingLink)
    setGoogleGroupId(existing.data.googleGroupId)
    setCoverImageUrl(existing.data.coverImageUrl)
  }, [existing.data])

  if (id && existing.isLoading) return <LoadingState />

  const payload = {
    title,
    date,
    description,
    meetingLink,
    googleGroupId,
    coverImageUrl,
  }

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="gap-4 p-4">
      <Input label="Title" value={title} onChangeText={setTitle} />
      <Input label="Date (ISO)" value={date} onChangeText={setDate} />
      <Input label="Description" value={description} onChangeText={setDescription} multiline />
      <Input label="Meeting link" value={meetingLink} onChangeText={setMeetingLink} />
      <Input label="Google group ID" value={googleGroupId} onChangeText={setGoogleGroupId} />
      <Input label="Cover image URL" value={coverImageUrl} onChangeText={setCoverImageUrl} />
      <Button
        title={id ? 'Update meeting' : 'Create meeting'}
        loading={create.isPending || update.isPending}
        onPress={async () => {
          try {
            if (id) await update.mutateAsync({ id, payload })
            else await create.mutateAsync(payload)
            router.back()
          } catch (e) {
            enqueue({
              id: `${Date.now()}`,
              type: 'meeting',
              method: id ? 'PATCH' : 'POST',
              path: id
                ? `/api/mobile/v1/admin/meetings/${id}`
                : '/api/mobile/v1/admin/meetings',
              body: payload,
              createdAt: new Date().toISOString(),
            })
            Alert.alert(
              'Queued offline',
              e instanceof Error
                ? `${e.message}. Saved to offline queue.`
                : 'Saved to offline queue.',
            )
          }
        }}
      />
    </ScrollView>
  )
}
