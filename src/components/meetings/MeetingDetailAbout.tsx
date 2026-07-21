import * as Haptics from 'expo-haptics'
import { ExternalLink, Video } from 'lucide-react-native'
import { Pressable, Text, View } from 'react-native'

import { openExternalUrl } from '@/components/meetings/meetingDetailUtils'
import { HtmlContent } from '@/components/ui/HtmlContent'
import { colors } from '@/theme/colors'

interface MeetingJoinButtonProps {
  meetingLink?: string | null
}

export const MeetingJoinButton = ({ meetingLink }: MeetingJoinButtonProps) => {
  const link = meetingLink?.trim()
  if (!link) return null

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Join meeting in browser"
      onPress={() => {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        openExternalUrl(link)
      }}
      className="flex-row items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 active:opacity-90"
    >
      <Video size={20} color={colors.primaryForeground} strokeWidth={2.25} />
      <Text className="text-base font-semibold text-primary-foreground">
        Join meeting
      </Text>
      <ExternalLink size={16} color={colors.primaryForeground} />
    </Pressable>
  )
}

interface MeetingDetailAboutProps {
  description?: string | null
  googleGroupId?: string | null
  meetingLink?: string | null
}

export const MeetingDetailAbout = ({
  description,
  googleGroupId,
  meetingLink,
}: MeetingDetailAboutProps) => {
  const blurb = description?.trim()
  const group = googleGroupId?.trim()
  const link = meetingLink?.trim()

  return (
    <View className="gap-3">
      <View className="overflow-hidden rounded-2xl border border-border bg-surface">
        <View className="border-b border-border px-4 py-3">
          <Text className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            About
          </Text>
        </View>
        <View className="px-4 py-4">
          {blurb ? (
            <HtmlContent html={blurb} />
          ) : (
            <Text className="text-sm text-muted-foreground">No description provided.</Text>
          )}
        </View>
      </View>

      {(group || link) && (
        <View className="overflow-hidden rounded-2xl border border-border bg-surface px-4 py-4">
          {group ? (
            <DetailRow label="Google group" value={group} />
          ) : null}
          {link ? (
            <View className={group ? 'mt-3' : undefined}>
              <Text className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Meeting URL
              </Text>
              <Text className="mt-1 text-sm text-foreground" numberOfLines={2}>
                {link}
              </Text>
            </View>
          ) : null}
        </View>
      )}
    </View>
  )
}

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <View>
    <Text className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
      {label}
    </Text>
    <Text className="mt-1 text-sm text-foreground" numberOfLines={2}>
      {value}
    </Text>
  </View>
)
