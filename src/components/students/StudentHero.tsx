import { LinearGradient } from 'expo-linear-gradient'
import { Mail } from 'lucide-react-native'
import { Linking, Pressable, Text, View } from 'react-native'

import { StudentAvatar } from '@/components/students/StudentAvatar'
import { StudentSocialCard } from '@/components/students/StudentDetailCards'
import { Badge } from '@/components/ui/Card'
import { colors } from '@/theme/colors'
import type { ProfileData } from '@/types/student'

interface StudentHeroProps {
  student: ProfileData
}

export const StudentHero = ({ student }: StudentHeroProps) => {
  return (
    <View className="overflow-hidden rounded-b-3xl">
      <LinearGradient
        colors={['#fdf2f8', '#f8fafc', '#ffffff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24 }}
      >
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: -40,
            right: -30,
            width: 180,
            height: 180,
            borderRadius: 90,
            backgroundColor: 'rgba(213,63,140,0.12)',
          }}
        />

        <View className="items-center gap-4">
          <View className="rounded-full border-2 border-primary/40 p-1">
            <StudentAvatar
              name={student.name}
              picture={student.picture}
              size={112}
            />
          </View>

          <View className="items-center gap-2">
            <Text className="text-center text-3xl font-bold tracking-tight text-foreground">
              {student.name}
            </Text>
            <Text className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              {student.role || 'Member'}
            </Text>
            <View className="mt-1 flex-row flex-wrap items-center justify-center gap-2">
              {student.company ? (
                <Badge label={student.company} tone="info" />
              ) : null}
              {student.batch ? (
                <Badge label={student.batch} tone="success" />
              ) : null}
            </View>
          </View>

          <Pressable
            onPress={() => void Linking.openURL(`mailto:${student.email}`)}
            className="mt-1 flex-row items-center gap-2 rounded-full border border-border bg-surface/80 px-3 py-1.5"
          >
            <Mail size={14} color={colors.mutedForeground} />
            <Text className="text-sm text-muted-foreground">{student.email}</Text>
          </Pressable>

          <View className="mt-2 w-full">
            <StudentSocialCard
              socialLinks={student.socialLinks}
              resumeLink={student.resumeLink}
              mediumUsername={student.mediumUsername}
              compact
            />
          </View>
        </View>
      </LinearGradient>
    </View>
  )
}
