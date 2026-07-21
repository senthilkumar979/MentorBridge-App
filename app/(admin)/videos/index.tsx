import { useQuery } from '@tanstack/react-query'
import { FlashList } from '@shopify/flash-list'
import { useRouter } from 'expo-router'
import { View } from 'react-native'

import { fetchSessionVideos } from '@/api/endpoints'
import { ModulePageHeader } from '@/components/ui/ModulePageHeader'
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/Card'
import {
  VideoListCard,
  type VideoListItem,
} from '@/components/videos/VideoListCard'

export default function VideosScreen() {
  const router = useRouter()
  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey: ['videos'],
    queryFn: fetchSessionVideos,
  })

  if (isLoading) return <LoadingState />
  if (isError) return <ErrorState message={error.message} />

  const videos = (data?.videos ?? []) as VideoListItem[]
  const featured = videos.filter((v) => v.isFeatured).length

  return (
    <View className="flex-1 bg-background">
      <FlashList
        data={videos}
        refreshing={isRefetching}
        onRefresh={refetch}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <ModulePageHeader
            eyebrow="Content"
            title="Session videos"
            subtitle={`${videos.length} videos${featured ? ` · ${featured} featured` : ''}`}
            actionLabel="Add video"
            onAction={() => router.push('/(admin)/videos/form')}
            showBack
          />
        }
        ListEmptyComponent={
          <EmptyState
            title="No videos yet"
            description="Add a YouTube session recording to get started."
          />
        }
        contentContainerStyle={{ paddingBottom: 28, paddingTop: 8 }}
        renderItem={({ item }) => (
          <VideoListCard
            video={item}
            onPress={() => router.push(`/(admin)/videos/${item.id}`)}
          />
        )}
      />
    </View>
  )
}
