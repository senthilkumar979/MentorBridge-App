import * as Haptics from 'expo-haptics'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { Eye, Play, Star } from 'lucide-react-native'
import { Pressable, Text, View } from 'react-native'

import { Badge } from '@/components/ui/Card'
import { colors } from '@/theme/colors'
import {
  extractYoutubeVideoId,
  youtubeThumbnailUrl,
} from '@/utils/youtube'

export interface VideoListItem {
  id: string
  title: string
  category?: string
  youtubeUrl?: string
  youtubeVideoId?: string
  isFeatured?: boolean
  viewCount?: number
}

function categoryLabel(category?: string) {
  if (!category) return 'General'
  return category.replace(/_/g, ' ')
}

interface VideoListCardProps {
  video: VideoListItem
  onPress: () => void
}

export const VideoListCard = ({ video, onPress }: VideoListCardProps) => {
  const videoId = extractYoutubeVideoId(video.youtubeUrl, video.youtubeVideoId)
  const thumb = videoId ? youtubeThumbnailUrl(videoId) : null

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Play ${video.title}`}
      onPress={() => {
        void Haptics.selectionAsync()
        onPress()
      }}
      className="mx-4 mb-3 overflow-hidden rounded-2xl border border-border active:opacity-90"
      style={{ backgroundColor: colors.surface }}
    >
      <View className="relative h-44 w-full bg-muted">
        {thumb ? (
          <Image
            source={{ uri: thumb }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <LinearGradient
            colors={['#fce7f3', '#f8fafc']}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <Play size={36} color={colors.primary} />
          </LinearGradient>
        )}
        <View className="absolute inset-0 items-center justify-center bg-black/25">
          <View className="h-12 w-12 items-center justify-center rounded-full bg-primary/90">
            <Play
              size={22}
              color={colors.primaryForeground}
              fill={colors.primaryForeground}
            />
          </View>
        </View>
        {video.isFeatured ? (
          <View className="absolute left-3 top-3 flex-row items-center gap-1 rounded-full bg-primary px-2.5 py-1">
            <Star
              size={12}
              color={colors.primaryForeground}
              fill={colors.primaryForeground}
            />
            <Text className="text-[10px] font-bold uppercase text-primary-foreground">
              Featured
            </Text>
          </View>
        ) : null}
      </View>

      <View className="gap-2 p-4">
        <Text
          className="text-base font-bold tracking-tight text-foreground"
          numberOfLines={2}
        >
          {video.title}
        </Text>
        <View className="flex-row flex-wrap items-center gap-2">
          <Badge label={categoryLabel(video.category)} tone="info" />
          {typeof video.viewCount === 'number' ? (
            <View className="flex-row items-center gap-1">
              <Eye size={12} color={colors.mutedForeground} />
              <Text className="text-xs text-muted-foreground">
                {video.viewCount} views
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </Pressable>
  )
}
