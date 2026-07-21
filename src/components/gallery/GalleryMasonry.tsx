import { Image } from 'expo-image'
import { Pressable, useWindowDimensions, View } from 'react-native'

import { colors } from '@/theme/colors'

export interface GalleryImageItem {
  id: string
  src: string
  alt: string
  width: number
  height: number
}

interface GalleryImageTileProps {
  image: GalleryImageItem
  onPress: () => void
}

export const GalleryImageTile = ({ image, onPress }: GalleryImageTileProps) => {
  const { width } = useWindowDimensions()
  const gap = 10
  const pad = 16
  const tile = (width - pad * 2 - gap) / 2
  const ratio =
    image.width > 0 && image.height > 0 ? image.height / image.width : 1
  const height = Math.min(Math.max(tile * ratio, 120), 220)

  return (
    <Pressable
      onPress={onPress}
      className="overflow-hidden rounded-xl border border-border active:opacity-90"
      style={{
        width: tile,
        height,
        backgroundColor: colors.surface,
        marginBottom: gap,
      }}
    >
      <Image
        source={{ uri: image.src }}
        style={{ width: '100%', height: '100%' }}
        contentFit="cover"
        transition={180}
      />
    </Pressable>
  )
}

export const GalleryMasonryColumns = ({
  images,
  onSelect,
}: {
  images: GalleryImageItem[]
  onSelect: (index: number) => void
}) => {
  const left = images.filter((_, i) => i % 2 === 0)
  const right = images.filter((_, i) => i % 2 === 1)
  const leftIndexes = images.map((_, i) => i).filter((i) => i % 2 === 0)
  const rightIndexes = images.map((_, i) => i).filter((i) => i % 2 === 1)

  return (
    <View className="flex-row gap-2.5 px-4">
      <View className="flex-1">
        {left.map((img, i) => (
          <GalleryImageTile
            key={img.id}
            image={img}
            onPress={() => onSelect(leftIndexes[i]!)}
          />
        ))}
      </View>
      <View className="flex-1">
        {right.map((img, i) => (
          <GalleryImageTile
            key={img.id}
            image={img}
            onPress={() => onSelect(rightIndexes[i]!)}
          />
        ))}
      </View>
    </View>
  )
}
