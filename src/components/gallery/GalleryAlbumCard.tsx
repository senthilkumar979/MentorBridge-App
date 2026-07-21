import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { Pressable, Text, View } from 'react-native'

import { getFolderTagline, getFolderTitle } from '@/constants/gallery'
import { colors } from '@/theme/colors'

interface GalleryAlbumCardProps {
  folder: string
  coverUri?: string | null
  imageCount?: number
  isLoading?: boolean
  onPress: () => void
}

export const GalleryAlbumCard = ({
  folder,
  coverUri,
  imageCount,
  isLoading,
  onPress,
}: GalleryAlbumCardProps) => (
  <Pressable
    onPress={onPress}
    className="mb-4 overflow-hidden rounded-2xl border border-border active:opacity-90"
    style={{ backgroundColor: colors.surface }}
  >
    <View className="relative h-44 w-full overflow-hidden bg-muted">
      {coverUri ? (
        <Image
          source={{ uri: coverUri }}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <LinearGradient
          colors={['rgba(213,63,140,0.25)', '#f8fafc']}
          style={{ flex: 1 }}
        />
      )}
      <LinearGradient
        colors={['transparent', 'rgba(15,23,42,0.72)']}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 110,
          justifyContent: 'flex-end',
          padding: 14,
        }}
      >
        <Text className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
          Album
        </Text>
        <Text className="mt-1 text-lg font-bold text-foreground" numberOfLines={1}>
          {getFolderTitle(folder)}
        </Text>
        <Text className="mt-0.5 text-xs text-muted-foreground" numberOfLines={1}>
          {isLoading
            ? 'Loading…'
            : imageCount != null
              ? `${imageCount} photo${imageCount === 1 ? '' : 's'} · ${getFolderTagline(folder)}`
              : getFolderTagline(folder)}
        </Text>
      </LinearGradient>
    </View>
  </Pressable>
)
