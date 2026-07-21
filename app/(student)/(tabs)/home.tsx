import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { RefreshControl, ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import {
  fetchAssignments,
  fetchAnnouncements,
  fetchMemberMeetings,
} from '@/api/endpoints'
import { StudentModeBanner } from '@/components/administration/StudentModeBanner'
import type { AssignmentListItem } from '@/components/assignments/AssignmentListCard'
import { StudentDashboardHero } from '@/components/students/StudentDashboardHero'
import { StudentHomeFeed } from '@/components/students/StudentHomeFeed'
import { StudentQuickLinks } from '@/components/students/StudentQuickLinks'
import { StudentTodayEvents } from '@/components/students/StudentTodayEvents'
import { ErrorState, LoadingState, SectionLabel } from '@/components/ui/Card'
import { useIsAdminAccess, useMe } from '@/hooks/useAuthBridge'
import { getDateKeyIst, getTodayKeyIst } from '@/lib/meetingWeek'
import { useAppStore } from '@/stores/appStore'

export default function StudentHomeScreen() {
  const router = useRouter()
  const me = useMe()
  const access = useIsAdminAccess()
  const studentModePreview = useAppStore((s) => s.studentModePreview)
  const setStudentModePreview = useAppStore((s) => s.setStudentModePreview)
  const showPreviewBanner = access.isAdmin && studentModePreview

  const assignments = useQuery({ queryKey: ['assignments'], queryFn: fetchAssignments })
  const announcements = useQuery({
    queryKey: ['announcements', { page: 1 }],
    queryFn: () => fetchAnnouncements(1, 5),
  })
  const meetings = useQuery({
    queryKey: ['member-meetings'],
    queryFn: () => fetchMemberMeetings(1, 50),
  })

  if (assignments.isLoading || announcements.isLoading) {
    return <LoadingState variant="dashboard" />
  }
  if (assignments.isError) return <ErrorState message={assignments.error.message} />

  const list = (assignments.data?.assignments ?? []) as AssignmentListItem[]
  const actionItems = list
    .filter(
      (a) =>
        a.mySubmissionStatus !== 'submitted' &&
        (a.dueStatus === 'due_soon' ||
          a.dueStatus === 'past_due' ||
          a.dueStatus === 'upcoming'),
    )
    .sort((a, b) => {
      const rank = (s?: AssignmentListItem['dueStatus']) =>
        s === 'past_due' ? 0 : s === 'due_soon' ? 1 : 2
      return rank(a.dueStatus) - rank(b.dueStatus)
    })
    .slice(0, 4)

  const news = announcements.data?.data ?? []
  const hasNews = news.length > 0

  const todayKey = getTodayKeyIst()
  const todaysMeetings = (meetings.data?.data ?? [])
    .filter((m) => getDateKeyIst(m.date) === todayKey)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const pendingCount = list.filter((a) => a.mySubmissionStatus !== 'submitted').length
  const firstName =
    me.data?.user.firstName ||
    me.data?.linkedStudent?.name?.split(' ')[0] ||
    'there'

  return (
    <SafeAreaView edges={['left', 'right']} className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 36 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={
              assignments.isRefetching ||
              announcements.isRefetching ||
              meetings.isRefetching
            }
            onRefresh={() => {
              void assignments.refetch()
              void announcements.refetch()
              void meetings.refetch()
            }}
            tintColor="#d53f8c"
          />
        }
      >
        {showPreviewBanner ? (
          <View className="pt-2">
            <StudentModeBanner
              onExit={() => {
                setStudentModePreview(false)
                router.replace('/(admin)/(tabs)/dashboard')
              }}
            />
          </View>
        ) : null}

        <StudentDashboardHero
          greetingName={firstName}
          batch={me.data?.linkedStudent?.batch}
          pendingCount={pendingCount}
        />

        <StudentTodayEvents
          meetings={todaysMeetings}
          isLoading={meetings.isLoading}
        />

        <View className="mt-2">
          <StudentHomeFeed actionItems={actionItems} news={news} actionsOnly />
        </View>

        {hasNews ? (
          <View className="mt-5">
            <StudentHomeFeed actionItems={[]} news={news} newsOnly />
          </View>
        ) : null}

        <View className="mt-5 px-4">
          <SectionLabel>Quick actions</SectionLabel>
          <StudentQuickLinks onPress={(href) => router.push(href as never)} />
        </View>

        {!hasNews ? (
          <View className="mt-5">
            <StudentHomeFeed actionItems={[]} news={news} newsOnly />
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  )
}
