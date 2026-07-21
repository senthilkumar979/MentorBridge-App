import { useQuery } from '@tanstack/react-query'
import { useLocalSearchParams } from 'expo-router'
import { Linking, ScrollView, Text, View } from 'react-native'

import { fetchSessionVideo } from '@/api/endpoints'
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

function categoryLabel(category?: string) {
  if (!category) return 'General'
  return category.replace(/_/g, ' ')
}

export default function VideoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['videos', id],
    queryFn: () => fetchSessionVideo(id),
    enabled: !!id,
  })

  if (isLoading) return <LoadingState variant="detail" />
  if (isError || !data)
    return <ErrorState message={error?.message ?? 'Video not found'} />

  const title = String(data.title ?? 'Session video')
  const category = data.category ? String(data.category) : undefined
  const youtubeUrl = data.youtubeUrl ? String(data.youtubeUrl) : undefined
  const youtubeVideoId = data.youtubeVideoId
    ? String(data.youtubeVideoId)
    : undefined
  const isFeatured = Boolean(data.isFeatured)
  const viewCount =
    typeof data.viewCount === 'number' ? data.viewCount : undefined
  const videoId = extractYoutubeVideoId(youtubeUrl, youtubeVideoId)

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-4 px-4 pt-3">
        {videoId ? (
          <YoutubeEmbed videoId={videoId} />
        ) : (
          <Card>
            <Text className="text-foreground">
              This video is missing a valid YouTube id.
            </Text>
            {youtubeUrl ? (
              <Button
                title="Open on YouTube"
                variant="outline"
                className="mt-3"
                onPress={() => void Linking.openURL(youtubeUrl)}
              />
            ) : null}
          </Card>
        )}

        <View className="gap-2">
          <Text className="text-2xl font-bold tracking-tight text-foreground">
            {title}
          </Text>
          <View className="flex-row flex-wrap items-center gap-2">
            <Badge label={categoryLabel(category)} tone="info" />
            {isFeatured ? <Badge label="Featured" tone="primary" /> : null}
            {typeof viewCount === 'number' ? (
              <MutedText>{viewCount} views</MutedText>
            ) : null}
          </View>
        </View>

        <Card>
          <SectionLabel>Playback</SectionLabel>
          <MutedText>
            Video plays inside MentorBridge Admin. Use fullscreen on the player
            controls when you need a larger view.
          </MutedText>
          {youtubeUrl ? (
            <Button
              title="Open in YouTube app"
              variant="ghost"
              className="mt-3"
              onPress={() => void Linking.openURL(youtubeUrl)}
            />
          ) : null}
        </Card>
      </View>
    </ScrollView>
  )
}
