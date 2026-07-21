import * as Haptics from 'expo-haptics'
import { LinearGradient } from 'expo-linear-gradient'
import { Building2, ChevronRight } from 'lucide-react-native'
import { Pressable, Text, View } from 'react-native'

import { StudentAvatar } from '@/components/students/StudentAvatar'
import { Badge } from '@/components/ui/Card'
import { colors } from '@/theme/colors'
import type { ProfileData } from '@/types/student'

interface StudentListCardProps {
  student: ProfileData
  onPress: () => void
}

export const StudentListCard = ({ student, onPress }: StudentListCardProps) => {
  const company = student.company?.trim() || 'MentorBridge'

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open profile for ${student.name}`}
      onPress={() => {
        void Haptics.selectionAsync()
        onPress()
      }}
      className="mx-4 mb-3 overflow-hidden rounded-2xl border border-border active:opacity-90"
      style={{ backgroundColor: colors.surface }}
    >
      <LinearGradient
        colors={['rgba(213,63,140,0.12)', 'rgba(15,23,42,0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ padding: 14 }}
      >
        <View className="flex-row items-center gap-3.5">
          <View className="rounded-full border border-primary/30 p-0.5">
            <StudentAvatar
              name={student.name}
              picture={student.picture}
              size={58}
            />
          </View>

          <View className="min-w-0 flex-1 gap-1.5">
            <Text
              className="text-[17px] font-bold tracking-tight text-foreground"
              numberOfLines={1}
            >
              {student.name}
            </Text>

            <Text
              className="text-[13px] font-medium uppercase tracking-[0.14em] text-primary"
              numberOfLines={1}
            >
              {student.role || 'Member'}
            </Text>

            <View className="mt-0.5 flex-row flex-wrap items-center gap-2">
              <View className="flex-row items-center gap-1 rounded-full border border-border bg-surface-elevated px-2 py-0.5">
                <Building2 size={12} color={colors.mutedForeground} />
                <Text className="max-w-[140px] text-xs text-muted-foreground" numberOfLines={1}>
                  {company}
                </Text>
              </View>
              {student.batch ? <Badge label={student.batch} tone="success" /> : null}
            </View>
          </View>

          <ChevronRight size={18} color={colors.mutedForeground} />
        </View>
      </LinearGradient>
    </Pressable>
  )
}
