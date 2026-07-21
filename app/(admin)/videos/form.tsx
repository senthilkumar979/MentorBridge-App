import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Alert, ScrollView } from 'react-native'

import { createSessionVideo } from '@/api/endpoints'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function VideoFormScreen() {
  const router = useRouter()
  const qc = useQueryClient()
  const [title, setTitle] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [category, setCategory] = useState('general_session')

  const create = useMutation({
    mutationFn: createSessionVideo,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['videos'] })
      router.back()
    },
  })

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="gap-4 p-4">
      <Input label="Title" value={title} onChangeText={setTitle} />
      <Input label="YouTube URL" value={youtubeUrl} onChangeText={setYoutubeUrl} autoCapitalize="none" />
      <Input label="Category" value={category} onChangeText={setCategory} />
      <Button
        title="Create video"
        loading={create.isPending}
        onPress={async () => {
          try {
            await create.mutateAsync({ title, youtubeUrl, category, isFeatured: false })
          } catch (e) {
            Alert.alert('Failed', e instanceof Error ? e.message : 'Error')
          }
        }}
      />
    </ScrollView>
  )
}
