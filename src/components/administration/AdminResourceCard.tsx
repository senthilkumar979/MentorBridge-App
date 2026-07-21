import { MessageSquare } from 'lucide-react-native'
import { Text, View } from 'react-native'

import type { AdminDetailRow } from '@/components/administration/adminItemPresentation'
import { colors } from '@/theme/colors'

interface AdminResourceCardProps {
  title: string
  details: AdminDetailRow[]
}

export const AdminResourceCard = ({ title, details }: AdminResourceCardProps) => (
  <View className="mb-3 overflow-hidden rounded-2xl border border-border bg-surface">
    <View className="flex-row">
      <View className="w-1.5 bg-primary" />
      <View className="min-w-0 flex-1 px-3.5 py-3.5">
        <Text className="text-base font-bold text-foreground" numberOfLines={3}>
          {title}
        </Text>
        {details.length ? (
          <View className="mt-3 gap-2">
            {details.map((row) => (
              <View key={`${row.label}-${row.value}`} className="gap-0.5">
                <Text className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {row.label}
                </Text>
                <Text className="text-sm text-foreground" numberOfLines={4}>
                  {row.value}
                </Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </View>
  </View>
)

export const VisitorQueriesPlaceholder = () => (
  <View className="flex-1 bg-background px-4 py-6">
    <View className="overflow-hidden rounded-3xl border border-border bg-surface">
      <View className="border-b border-border px-5 py-5">
        <View className="mb-3 h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
          <MessageSquare size={22} color={colors.primary} />
        </View>
        <Text className="text-xl font-bold text-foreground">Visitor Queries</Text>
        <Text className="mt-2 text-sm leading-6 text-muted-foreground">
          Full visitor-chat tooling stays on the web admin for this release. Open
          Administration on mentorbridge.in to review and reply.
        </Text>
      </View>
      <View className="px-5 py-4">
        <Text className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Available on web
        </Text>
        <Text className="mt-1 text-sm text-foreground">mentorbridge.in · Admin</Text>
      </View>
    </View>
  </View>
)
