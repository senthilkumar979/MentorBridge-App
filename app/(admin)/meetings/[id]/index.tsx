import { useLocalSearchParams, useRouter } from 'expo-router'
import { Alert, ScrollView, View } from 'react-native'

import { MeetingDetailAbout, MeetingJoinButton } from '@/components/meetings/MeetingDetailAbout'
import { MeetingDetailActions } from '@/components/meetings/MeetingDetailActions'
import { MeetingDetailHero } from '@/components/meetings/MeetingDetailHero'
import { ErrorState, LoadingState } from '@/components/ui/Card'
import { useMeeting, useMeetingMutations } from '@/hooks/useQueries'

export default function MeetingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const { data, isLoading, isError, error } = useMeeting(id)
  const { remove } = useMeetingMutations()

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
        <MeetingDetailActions
          deleting={remove.isPending}
          onAttendance={() => router.push(`/(admin)/meetings/${id}/attendance`)}
          onEdit={() =>
            router.push({ pathname: '/(admin)/meetings/form', params: { id } })
          }
          onDelete={() => {
            Alert.alert('Delete meeting?', 'This cannot be undone.', [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                  await remove.mutateAsync(id)
                  router.back()
                },
              },
            ])
          }}
        />
      </View>
    </ScrollView>
  )
}
