import { Megaphone, Trash2 } from 'lucide-react-native'
import { Pressable, Text, View } from 'react-native'

import type { Announcement } from '@/api/endpoints'
import { HtmlContent } from '@/components/ui/HtmlContent'
import { colors } from '@/theme/colors'

function formatWhen(value?: string) {
  if (!value) return null
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

interface AnnouncementCardProps {
  item: Announcement
  onDelete?: () => void
  readOnly?: boolean
}

export const AnnouncementCard = ({
  item,
  onDelete,
  readOnly,
}: AnnouncementCardProps) => (
  <View className="mx-4 mb-3 overflow-hidden rounded-2xl border border-border bg-surface">
    <View className="flex-row">
      <View className="w-1.5 bg-primary" />
      <View className="min-w-0 flex-1 px-3.5 py-3.5">
        <View className="mb-2 flex-row items-start gap-3">
          <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Megaphone size={18} color={colors.primary} />
          </View>
          <View className="min-w-0 flex-1">
            <Text className="text-base font-bold text-foreground">{item.title}</Text>
            {formatWhen(item.created_at) ? (
              <Text className="mt-1 text-xs text-muted-foreground">
                {formatWhen(item.created_at)}
              </Text>
            ) : null}
          </View>
          {!readOnly && onDelete ? (
            <Pressable onPress={onDelete} hitSlop={8} accessibilityLabel="Delete announcement">
              <Trash2 size={18} color={colors.error} />
            </Pressable>
          ) : null}
        </View>
        <HtmlContent html={item.description} />
      </View>
    </View>
  </View>
)
