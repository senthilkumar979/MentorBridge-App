import * as Haptics from 'expo-haptics'
import {
  Calendar,
  ClipboardList,
  Images,
  Megaphone,
  PlayCircle,
  Users,
} from 'lucide-react-native'
import { Pressable, Text, View } from 'react-native'

import { Card, SectionLabel } from '@/components/ui/Card'
import { colors } from '@/theme/colors'

const ACTIONS = [
  { label: 'Students', href: '/(admin)/(tabs)/students', icon: Users },
  { label: 'Meetings', href: '/(admin)/(tabs)/meetings', icon: Calendar },
  { label: 'Assignments', href: '/(admin)/(tabs)/assignments', icon: ClipboardList },
  { label: 'Videos', href: '/(admin)/videos', icon: PlayCircle },
  { label: 'Announcements', href: '/(admin)/administration/announcements', icon: Megaphone },
  { label: 'Gallery', href: '/(admin)/gallery', icon: Images },
] as const

interface DashboardQuickActionsProps {
  onPress: (href: string) => void
}

export const DashboardQuickActions = ({
  onPress,
}: DashboardQuickActionsProps) => (
  <View className="px-4">
    <SectionLabel>Quick actions</SectionLabel>
    <View className="flex-row flex-wrap gap-2">
      {ACTIONS.map((action) => {
        const Icon = action.icon
        return (
          <Pressable
            key={action.href}
            onPress={() => {
              void Haptics.selectionAsync()
              onPress(action.href)
            }}
            className="w-[31%] items-center gap-2 rounded-2xl border border-border bg-surface px-2 py-3 active:opacity-80"
          >
            <View className="h-9 w-9 items-center justify-center rounded-xl bg-primary/15">
              <Icon size={18} color={colors.primary} />
            </View>
            <Text className="text-center text-[11px] font-semibold text-foreground">
              {action.label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  </View>
)

interface AnnouncementPreview {
  id: string
  title: string
  description: string
  created_at?: string
}

export const DashboardAnnouncements = ({
  items,
  onManage,
}: {
  items: AnnouncementPreview[]
  onManage: () => void
}) => (
  <View className="px-4">
    <View className="mb-2 flex-row items-center justify-between">
      <SectionLabel>Recent announcements</SectionLabel>
      <Pressable onPress={onManage}>
        <Text className="text-xs font-semibold text-primary">Manage</Text>
      </Pressable>
    </View>
    {items.length === 0 ? (
      <Card>
        <Text className="text-foreground">No announcements yet</Text>
        <Text className="mt-1 text-sm text-muted-foreground">
          Publish an update for the community.
        </Text>
      </Card>
    ) : (
      items.map((item) => (
        <Card key={item.id} className="mb-2">
          <Text className="font-semibold text-foreground">{item.title}</Text>
          <Text className="mt-1 text-sm leading-5 text-muted-foreground" numberOfLines={2}>
            {item.description.replace(/<[^>]+>/g, ' ').trim()}
          </Text>
        </Card>
      ))
    )}
  </View>
)
