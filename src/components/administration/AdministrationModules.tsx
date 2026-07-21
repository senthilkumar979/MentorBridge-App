import {
  Award,
  ChevronRight,
  Handshake,
  MessageSquare,
  Mic,
  Megaphone,
  Star,
  Tags,
  UsersRound,
  type LucideIcon,
} from 'lucide-react-native'
import { Pressable, Text, View } from 'react-native'

import { colors } from '@/theme/colors'

export interface AdminModuleLink {
  label: string
  href: string
  description: string
  icon: LucideIcon
}

export const ADMIN_MODULES: AdminModuleLink[] = [
  {
    label: 'Announcements',
    href: '/(admin)/administration/announcements',
    description: 'Publish program updates',
    icon: Megaphone,
  },
  {
    label: 'Google Groups',
    href: '/(admin)/administration/google-groups',
    description: 'Cohort mailing lists',
    icon: UsersRound,
  },
  {
    label: 'Partners',
    href: '/(admin)/administration/partners',
    description: 'Company partners',
    icon: Handshake,
  },
  {
    label: 'Presenters',
    href: '/(admin)/administration/presenters',
    description: 'Guest speakers',
    icon: Mic,
  },
  {
    label: 'Awards',
    href: '/(admin)/administration/awards',
    description: 'Recognition records',
    icon: Award,
  },
  {
    label: 'Award Categories',
    href: '/(admin)/administration/award-categories',
    description: 'Award taxonomy',
    icon: Tags,
  },
  {
    label: 'Hall of Fame',
    href: '/(admin)/administration/hall-of-fame',
    description: 'Alumni highlights',
    icon: Star,
  },
  {
    label: 'Visitor Queries',
    href: '/(admin)/administration/visitor-queries',
    description: 'Inbound site questions',
    icon: MessageSquare,
  },
]

interface AdministrationModuleCardProps {
  module: AdminModuleLink
  onPress: () => void
}

export const AdministrationModuleCard = ({
  module,
  onPress,
}: AdministrationModuleCardProps) => {
  const Icon = module.icon
  return (
    <Pressable
      onPress={onPress}
      className="mb-3 w-[48%] overflow-hidden rounded-2xl border border-border bg-surface px-3.5 py-4 active:opacity-90"
    >
      <View className="mb-3 h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
        <Icon size={20} color={colors.primary} />
      </View>
      <Text className="text-base font-semibold text-foreground" numberOfLines={1}>
        {module.label}
      </Text>
      <Text className="mt-1 text-xs leading-4 text-muted-foreground" numberOfLines={2}>
        {module.description}
      </Text>
      <View className="mt-3 flex-row items-center gap-1">
        <Text className="text-xs font-semibold text-primary">Open</Text>
        <ChevronRight size={14} color={colors.primary} />
      </View>
    </Pressable>
  )
}
