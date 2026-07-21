import * as Haptics from 'expo-haptics'
import { LinearGradient } from 'expo-linear-gradient'
import type { LucideIcon } from 'lucide-react-native'
import {
  ClipboardList,
  CalendarDays,
  Inbox,
  Users,
} from 'lucide-react-native'
import { Pressable, Text, View } from 'react-native'

import { colors } from '@/theme/colors'

export interface DashboardKpi {
  label: string
  value: number
  hint: string
  href: string
  icon: LucideIcon
  accent: string
}

export const buildDashboardKpis = (data: {
  studentCount: number
  meetingsTodayCount: number
  openAssignmentsCount: number
  pendingSubmissionsCount: number
}): DashboardKpi[] => [
  {
    label: 'Students',
    value: data.studentCount,
    hint: 'Active members',
    href: '/(admin)/(tabs)/students',
    icon: Users,
    accent: colors.primary,
  },
  {
    label: 'Meetings today',
    value: data.meetingsTodayCount,
    hint: 'On the calendar',
    href: '/(admin)/(tabs)/meetings',
    icon: CalendarDays,
    accent: colors.info,
  },
  {
    label: 'Assignments',
    value: data.openAssignmentsCount,
    hint: 'Published work',
    href: '/(admin)/(tabs)/assignments',
    icon: ClipboardList,
    accent: colors.success,
  },
  {
    label: 'Pending review',
    value: data.pendingSubmissionsCount,
    hint: 'Awaiting feedback',
    href: '/(admin)/(tabs)/assignments',
    icon: Inbox,
    accent: colors.warning,
  },
]

interface DashboardKpiGridProps {
  kpis: DashboardKpi[]
  onPress: (href: string) => void
}

export const DashboardKpiGrid = ({ kpis, onPress }: DashboardKpiGridProps) => (
  <View className="flex-row flex-wrap gap-3 px-4">
    {kpis.map((kpi) => {
      const Icon = kpi.icon
      return (
        <Pressable
          key={kpi.label}
          onPress={() => {
            void Haptics.selectionAsync()
            onPress(kpi.href)
          }}
          className="w-[47%] overflow-hidden rounded-2xl border border-border active:opacity-90"
          style={{ backgroundColor: colors.surface }}
        >
          <LinearGradient
            colors={[`${kpi.accent}22`, 'rgba(15,23,42,0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ padding: 14 }}
          >
            <View className="mb-3 flex-row items-center justify-between">
              <View
                className="h-9 w-9 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${kpi.accent}26` }}
              >
                <Icon size={18} color={kpi.accent} />
              </View>
              <Text className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Live
              </Text>
            </View>
            <Text className="text-3xl font-bold tracking-tight text-foreground">
              {kpi.value}
            </Text>
            <Text className="mt-1 text-sm font-semibold text-foreground">
              {kpi.label}
            </Text>
            <Text className="mt-0.5 text-xs text-muted-foreground">{kpi.hint}</Text>
          </LinearGradient>
        </Pressable>
      )
    })}
  </View>
)
