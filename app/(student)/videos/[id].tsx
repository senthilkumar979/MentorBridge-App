import { useQuery } from '@tanstack/react-query'
import { useLocalSearchParams } from 'expo-router'
import { useEffect } from 'react'
import { Linking, ScrollView, Text, View } from 'react-native'

import { fetchSessionVideo, recordVideoView } from '@/api/endpoints'
import { Button } from '@/components/ui/Button'
import {
  Badge,
  Card,
  ErrorState,
  LoadingState,
  MutedText,
  SectionLabel,
} from '@/components/ui/Card'
import { YoutubeEmbed } from '@/components/videos/YoutubeEmbed'
import { extractYoutubeVideoId } from '@/utils/youtube'

export default function StudentVideoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['videos', id],
    queryFn: () => fetchSessionVideo(id),
    enabled: !!id,
  })

  useEffect(() => {
    if (id) void recordVideoView(id).catch(() => undefined)
  }, [id])

  if (isLoading) return <LoadingState variant="detail" />
  if (isError || !data)
    return <ErrorState message={error?.message ?? 'Video not found'} />

  const title = String(data.title ?? 'Session video')
  const category = data.category ? String(data.category) : undefined
  const youtubeUrl = data.youtubeUrl ? String(data.youtubeUrl) : undefined
  const youtubeVideoId = data.youtubeVideoId
    ? String(data.youtubeVideoId)
    : undefined
  const videoId = extractYoutubeVideoId(youtubeUrl, youtubeVideoId)

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 16, paddingTop: 12 }}
    >
      {videoId ? (
        <YoutubeEmbed videoId={videoId} />
      ) : (
        <Card>
          <Text className="text-foreground">Missing YouTube id.</Text>
        </Card>
      )}
      <View className="mt-4 gap-2">
        <Text className="text-2xl font-bold text-foreground">{title}</Text>
        <Badge label={(category ?? 'general').replace(/_/g, ' ')} tone="info" />
      </View>
      <Card className="mt-4">
        <SectionLabel>Watch</SectionLabel>
        <MutedText>Plays inside the MentorBridge app.</MutedText>
        {youtubeUrl ? (
          <Button
            title="Open in YouTube"
            variant="ghost"
            className="mt-2"
            onPress={() => void Linking.openURL(youtubeUrl)}
          />
        ) : null}
      </Card>
    </ScrollView>
  )
}
