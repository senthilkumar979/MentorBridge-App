import { useQuery } from '@tanstack/react-query'
import { useLocalSearchParams } from 'expo-router'
import { ScrollView, View } from 'react-native'

import { fetchMemberMeeting } from '@/api/endpoints'
import { MeetingDetailAbout, MeetingJoinButton } from '@/components/meetings/MeetingDetailAbout'
import { MeetingDetailHero } from '@/components/meetings/MeetingDetailHero'
import { ErrorState, LoadingState } from '@/components/ui/Card'

export default function StudentEventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['member-meetings', id],
    queryFn: () => fetchMemberMeeting(id),
    enabled: !!id,
  })

  if (isLoading) return <LoadingState variant="detail" />
  if (isError || !data) return <ErrorState message={error?.message ?? 'Not found'} />

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="pb-10"
      showsVerticalScrollIndicator={false}
    >
      <MeetingDetailHero meeting={data} />
      <View className="gap-4 px-4 pt-4">
        <MeetingJoinButton meetingLink={data.meetingLink} />
        <MeetingDetailAbout
          description={data.description}
          googleGroupId={data.googleGroupId}
          meetingLink={data.meetingLink}
        />
      </View>
    </ScrollView>
  )
}
