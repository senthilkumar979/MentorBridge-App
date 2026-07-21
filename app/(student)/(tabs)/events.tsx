import { useQuery } from '@tanstack/react-query'
import { FlashList } from '@shopify/flash-list'
import { useRouter } from 'expo-router'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { fetchMemberMeetings } from '@/api/endpoints'
import { MeetingListCard } from '@/components/meetings/MeetingListCard'
import { ModulePageHeader } from '@/components/ui/ModulePageHeader'
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/Card'

export default function StudentEventsTabScreen() {
  const router = useRouter()
  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey: ['member-meetings'],
    queryFn: () => fetchMemberMeetings(1, 50),
  })

  if (isLoading) return <LoadingState />
  if (isError) return <ErrorState message={error.message} />

  const meetings = [...(data?.data ?? [])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  return (
    <SafeAreaView edges={['left', 'right']} className="flex-1 bg-background">
      <FlashList
        data={meetings}
        refreshing={isRefetching}
        onRefresh={refetch}
        keyExtractor={(item, i) => String(item.id ?? i)}
        ListHeaderComponent={
          <ModulePageHeader
            eyebrow="Calendar"
            title="Events"
            subtitle={`${meetings.length} session${meetings.length === 1 ? '' : 's'} · tap to join`}
            safeTop
          />
        }
        ListEmptyComponent={
          <EmptyState
            title="No events yet"
            description="Upcoming sessions and meetups will show up here."
          />
        }
        contentContainerStyle={{ paddingBottom: 28, paddingTop: 8 }}
        renderItem={({ item }) => (
          <MeetingListCard
            meeting={item}
            onPress={() => router.push(`/(student)/events/${item.id}`)}
          />
        )}
      />
    </SafeAreaView>
  )
}
