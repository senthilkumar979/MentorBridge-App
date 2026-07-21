import type { ReactNode } from 'react'
import { ClipboardCheck, Pencil, Trash2 } from 'lucide-react-native'
import { Pressable, Text, View } from 'react-native'

import { colors } from '@/theme/colors'

interface MeetingDetailActionsProps {
  onAttendance: () => void
  onEdit: () => void
  onDelete: () => void
  deleting?: boolean
}

export const MeetingDetailActions = ({
  onAttendance,
  onEdit,
  onDelete,
  deleting,
}: MeetingDetailActionsProps) => (
  <View className="gap-2">
    <ActionRow
      icon={<ClipboardCheck size={18} color={colors.primary} />}
      title="Attendance"
      subtitle="Mark who joined"
      onPress={onAttendance}
    />
    <ActionRow
      icon={<Pencil size={18} color={colors.foreground} />}
      title="Edit meeting"
      subtitle="Update details or cover"
      onPress={onEdit}
    />
    <ActionRow
      icon={<Trash2 size={18} color={colors.error} />}
      title={deleting ? 'Deleting…' : 'Delete meeting'}
      subtitle="Remove permanently"
      onPress={onDelete}
      destructive
      disabled={deleting}
    />
  </View>
)

const ActionRow = ({
  icon,
  title,
  subtitle,
  onPress,
  destructive,
  disabled,
}: {
  icon: ReactNode
  title: string
  subtitle: string
  onPress: () => void
  destructive?: boolean
  disabled?: boolean
}) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    className={`flex-row items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3.5 active:opacity-90 ${
      disabled ? 'opacity-50' : ''
    }`}
  >
    <View
      className="h-10 w-10 items-center justify-center rounded-xl"
      style={{
        backgroundColor: destructive ? 'rgba(220,38,38,0.08)' : 'rgba(213,63,140,0.1)',
      }}
    >
      {icon}
    </View>
    <View className="min-w-0 flex-1">
      <Text
        className="text-base font-semibold"
        style={{ color: destructive ? colors.error : colors.foreground }}
      >
        {title}
      </Text>
      <Text className="mt-0.5 text-xs text-muted-foreground">{subtitle}</Text>
    </View>
  </Pressable>
)
