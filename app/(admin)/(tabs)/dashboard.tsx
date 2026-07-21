import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { RefreshControl, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { DashboardHero } from '@/components/dashboard/DashboardHero'
import {
  buildDashboardKpis,
  DashboardKpiGrid,
} from '@/components/dashboard/DashboardKpiGrid'
import {
  DashboardQuickActions,
} from '@/components/dashboard/DashboardSections'
import { WeekMeetingCalendar } from '@/components/meetings/WeekMeetingCalendar'
import { Button } from '@/components/ui/Button'
import { ErrorState, LoadingState, SectionLabel } from '@/components/ui/Card'
import { useMe } from '@/hooks/useAuthBridge'
import { useDashboard } from '@/hooks/useQueries'

export default function DashboardScreen() {
  const router = useRouter()
  const me = useMe()
  const queryClient = useQueryClient()
  const { data, isLoading, isError, error, refetch, isRefetching } =
    useDashboard()

  if (isLoading) return <LoadingState variant="dashboard" />
  if (isError) {
    return (
      <SafeAreaView edges={['left', 'right']} className="flex-1 bg-background">
        <ErrorState message={error.message} />
        <View className="px-6">
          <Button title="Retry" onPress={() => void refetch()} />
          <Text className="mt-3 text-center text-xs text-muted-foreground">
            If this keeps failing, redeploy the web API with the latest dashboard
            fix.
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  const kpis = buildDashboardKpis({
    studentCount: data?.studentCount ?? 0,
    meetingsTodayCount: data?.meetingsTodayCount ?? 0,
    openAssignmentsCount: data?.openAssignmentsCount ?? 0,
    pendingSubmissionsCount: data?.pendingSubmissionsCount ?? 0,
  })

  const go = (href: string) => router.push(href as never)

  const onRefresh = () => {
    void refetch()
    void queryClient.invalidateQueries({ queryKey: ['meetings', 'week'] })
  }

  return (
    <SafeAreaView edges={['left', 'right']} className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 36 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={onRefresh}
            tintColor="#d53f8c"
          />
        }
      >
        <DashboardHero greetingName={me.data?.user.firstName} />
        <View className="mt-2 gap-6">
          <DashboardKpiGrid kpis={kpis} onPress={go} />
          <View>
            <View className="px-4">
              <SectionLabel>Week at a glance</SectionLabel>
            </View>
            <WeekMeetingCalendar compact />
          </View>
          <DashboardQuickActions onPress={go} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
