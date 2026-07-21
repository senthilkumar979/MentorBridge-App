import * as Haptics from 'expo-haptics'
import { GraduationCap } from 'lucide-react-native'
import { Switch, Text, View } from 'react-native'

import { colors } from '@/theme/colors'

interface StudentModeToggleProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
}

export const StudentModeToggle = ({ enabled, onChange }: StudentModeToggleProps) => (
  <View className="overflow-hidden rounded-2xl border border-border bg-surface">
    <View className="flex-row items-center gap-3 px-4 py-4">
      <View className="h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
        <GraduationCap size={20} color={colors.primary} />
      </View>
      <View className="min-w-0 flex-1">
        <Text className="text-base font-semibold text-foreground">Student mode</Text>
        <Text className="mt-0.5 text-sm text-muted-foreground">
          Preview the app as a student sees it
        </Text>
      </View>
      <Switch
        value={enabled}
        onValueChange={(value) => {
          void Haptics.selectionAsync()
          onChange(value)
        }}
        trackColor={{ false: colors.border, true: 'rgba(213,63,140,0.45)' }}
        thumbColor={enabled ? colors.primary : colors.mutedForeground}
        accessibilityLabel="Toggle student mode preview"
      />
    </View>
  </View>
)
