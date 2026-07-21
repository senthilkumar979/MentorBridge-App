import { useQueries } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { ScrollView, Text, View } from 'react-native'

import { fetchGalleryImages } from '@/api/endpoints'
import { GalleryAlbumCard } from '@/components/gallery/GalleryAlbumCard'
import { ModulePageHeader } from '@/components/ui/ModulePageHeader'
import { CLOUDINARY_FOLDERS } from '@/constants/gallery'
import { colors } from '@/theme/colors'

export default function StudentGalleryScreen() {
  const router = useRouter()

  const albumQueries = useQueries({
    queries: CLOUDINARY_FOLDERS.map((folder) => ({
      queryKey: ['gallery', folder, 'preview'] as const,
      queryFn: () => fetchGalleryImages(folder, 8),
      staleTime: 5 * 60_000,
    })),
  })

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 36 }}
        showsVerticalScrollIndicator={false}
      >
        <ModulePageHeader
          eyebrow="Moments"
          title="Gallery"
          subtitle="Browse MentorBridge events, sessions, and campus life."
          showBack
        />

        <View className="mt-2 px-4">
          <View
            className="mb-4 flex-row items-center gap-2 rounded-2xl border border-border px-3 py-2.5"
            style={{ backgroundColor: colors.surfaceElevated }}
          >
            <View className="h-2 w-2 rounded-full bg-primary" />
            <Text className="flex-1 text-xs text-muted-foreground">
              {CLOUDINARY_FOLDERS.length} curated albums
            </Text>
          </View>

          {CLOUDINARY_FOLDERS.map((folder, index) => {
            const q = albumQueries[index]
            return (
              <GalleryAlbumCard
                key={folder}
                folder={folder}
                coverUri={q?.data?.images?.[0]?.src}
                isLoading={q?.isLoading}
                onPress={() =>
                  router.push(
                    `/(student)/gallery/${encodeURIComponent(folder)}` as never,
                  )
                }
              />
            )
          })}
        </View>
      </ScrollView>
    </View>
  )
}
