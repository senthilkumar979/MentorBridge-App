import * as Haptics from 'expo-haptics'
import {
  BookOpen,
  CalendarDays,
  ClipboardList,
  Images,
  Megaphone,
  PlayCircle,
  type LucideIcon,
} from 'lucide-react-native'
import { Pressable, Text, View } from 'react-native'

import { colors } from '@/theme/colors'

export interface StudentQuickLink {
  label: string
  href: string
  icon: LucideIcon
}

export const STUDENT_QUICK_LINKS: StudentQuickLink[] = [
  { label: 'Events', href: '/(student)/(tabs)/events', icon: CalendarDays },
  { label: 'Blogs', href: '/(student)/blogs', icon: BookOpen },
  { label: 'Gallery', href: '/(student)/gallery', icon: Images },
  {
    label: 'Assignments',
    href: '/(student)/(tabs)/assignments',
    icon: ClipboardList,
  },
  { label: 'Videos', href: '/(student)/(tabs)/videos', icon: PlayCircle },
  { label: 'News', href: '/(student)/(tabs)/announcements', icon: Megaphone },
]

interface StudentQuickLinksProps {
  onPress: (href: string) => void
}

/** Compact quick-actions grid (same pattern as admin dashboard). */
export const StudentQuickLinks = ({ onPress }: StudentQuickLinksProps) => (
  <View className="flex-row flex-wrap gap-2">
    {STUDENT_QUICK_LINKS.map((link) => {
      const Icon = link.icon
      return (
        <Pressable
          key={link.href}
          onPress={() => {
            void Haptics.selectionAsync()
            onPress(link.href)
          }}
          className="w-[31%] items-center gap-2 rounded-2xl border border-border bg-surface px-2 py-3 active:opacity-80"
        >
          <View className="h-9 w-9 items-center justify-center rounded-xl bg-primary/15">
            <Icon size={18} color={colors.primary} />
          </View>
          <Text className="text-center text-[11px] font-semibold text-foreground">
            {link.label}
          </Text>
        </Pressable>
      )
    })}
  </View>
)
