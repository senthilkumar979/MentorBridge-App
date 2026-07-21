import { Image } from 'expo-image'
import { X } from 'lucide-react-native'
import { Modal, Pressable, Text, useWindowDimensions, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import type { GalleryImageItem } from '@/components/gallery/GalleryMasonry'
import { colors } from '@/theme/colors'

interface GalleryLightboxProps {
  images: GalleryImageItem[]
  index: number | null
  onClose: () => void
  onChangeIndex: (index: number) => void
}

export const GalleryLightbox = ({
  images,
  index,
  onClose,
  onChangeIndex,
}: GalleryLightboxProps) => {
  const insets = useSafeAreaInsets()
  const { width, height } = useWindowDimensions()
  const image = index != null ? images[index] : null
  const isOpen = image != null

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-black/95">
        <View
          className="absolute left-0 right-0 z-10 flex-row items-center justify-between px-4"
          style={{ paddingTop: insets.top + 8 }}
        >
          <Text className="text-sm font-medium text-white/70">
            {index != null ? `${index + 1} / ${images.length}` : ''}
          </Text>
          <Pressable
            onPress={onClose}
            className="h-10 w-10 items-center justify-center rounded-full bg-white/10"
          >
            <X size={20} color={colors.foreground} />
          </Pressable>
        </View>

        {image ? (
          <View className="flex-1 items-center justify-center px-2">
            <Image
              source={{ uri: image.src }}
              style={{ width: width - 16, height: height * 0.7 }}
              contentFit="contain"
              transition={150}
            />
            {image.alt ? (
              <Text className="mt-4 px-6 text-center text-sm text-white/60" numberOfLines={2}>
                {image.alt}
              </Text>
            ) : null}
          </View>
        ) : null}

        <View
          className="absolute bottom-0 left-0 right-0 flex-row justify-between px-6"
          style={{ paddingBottom: insets.bottom + 20 }}
        >
          <Pressable
            disabled={index == null || index <= 0}
            onPress={() => index != null && onChangeIndex(index - 1)}
            className="rounded-full border border-white/20 px-5 py-2.5 active:opacity-80"
            style={{ opacity: index == null || index <= 0 ? 0.35 : 1 }}
          >
            <Text className="font-semibold text-white">Previous</Text>
          </Pressable>
          <Pressable
            disabled={index == null || index >= images.length - 1}
            onPress={() => index != null && onChangeIndex(index + 1)}
            className="rounded-full border border-white/20 px-5 py-2.5 active:opacity-80"
            style={{
              opacity: index == null || index >= images.length - 1 ? 0.35 : 1,
            }}
          >
            <Text className="font-semibold text-white">Next</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}
