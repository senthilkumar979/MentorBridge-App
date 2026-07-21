import { Eye } from 'lucide-react-native'
import { Pressable, Text, View } from 'react-native'

import { colors } from '@/theme/colors'

interface StudentModeBannerProps {
  onExit: () => void
}

export const StudentModeBanner = ({ onExit }: StudentModeBannerProps) => (
  <View className="mx-4 mb-2 flex-row items-center gap-3 rounded-2xl border border-primary/25 bg-primary/5 px-3.5 py-3">
    <Eye size={16} color={colors.primary} />
    <View className="min-w-0 flex-1">
      <Text className="text-sm font-semibold text-foreground">Student mode preview</Text>
      <Text className="text-xs text-muted-foreground">You are viewing the student experience</Text>
    </View>
    <Pressable
      onPress={onExit}
      accessibilityRole="button"
      accessibilityLabel="Exit student mode"
      className="rounded-full bg-primary px-3 py-1.5 active:opacity-90"
    >
      <Text className="text-xs font-semibold text-primary-foreground">Exit</Text>
    </Pressable>
  </View>
)
