import { useQuery } from '@tanstack/react-query'
import { useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { RefreshControl, ScrollView, View } from 'react-native'

import { fetchGalleryImages } from '@/api/endpoints'
import { GalleryLightbox } from '@/components/gallery/GalleryLightbox'
import { GalleryMasonryColumns } from '@/components/gallery/GalleryMasonry'
import { ModulePageHeader } from '@/components/ui/ModulePageHeader'
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '@/components/ui/Card'
import { getFolderTagline, getFolderTitle } from '@/constants/gallery'

export default function GalleryAlbumScreen() {
  const { folder: rawFolder } = useLocalSearchParams<{ folder: string }>()
  const folder = decodeURIComponent(rawFolder ?? '')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey: ['gallery', folder],
    queryFn: () => fetchGalleryImages(folder, 50),
    enabled: !!folder,
    staleTime: 5 * 60_000,
  })

  if (isLoading) return <LoadingState />
  if (isError) return <ErrorState message={error.message} />

  const images = data?.images ?? []

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="#d53f8c"
          />
        }
      >
        <ModulePageHeader
          eyebrow="Album"
          title={getFolderTitle(folder)}
          subtitle={`${images.length} photo${images.length === 1 ? '' : 's'} · ${getFolderTagline(folder)}`}
          showBack
        />

        {images.length === 0 ? (
          <EmptyState
            title="No photos yet"
            description="This album is empty in Cloudinary."
          />
        ) : (
          <View className="mt-3">
            <GalleryMasonryColumns
              images={images}
              onSelect={setLightboxIndex}
            />
          </View>
        )}
      </ScrollView>

      <GalleryLightbox
        images={images}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onChangeIndex={setLightboxIndex}
      />
    </View>
  )
}
