import { useAuth, useUser } from '@clerk/clerk-expo'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { ScrollView, Text, View } from 'react-native'

import { StudentModeBanner } from '@/components/administration/StudentModeBanner'
import { Button } from '@/components/ui/Button'
import { Card, MutedText, SectionLabel } from '@/components/ui/Card'
import { ModulePageHeader } from '@/components/ui/ModulePageHeader'
import { useIsAdminAccess, useMe } from '@/hooks/useAuthBridge'
import { useAppStore } from '@/stores/appStore'
import { colors } from '@/theme/colors'

export default function StudentProfileScreen() {
  const { signOut } = useAuth()
  const { user } = useUser()
  const me = useMe()
  const router = useRouter()
  const access = useIsAdminAccess()
  const studentModePreview = useAppStore((s) => s.studentModePreview)
  const setStudentModePreview = useAppStore((s) => s.setStudentModePreview)
  const linked = me.data?.linkedStudent
  const showPreview = access.isAdmin && studentModePreview

  const exitPreview = () => {
    setStudentModePreview(false)
    router.replace('/(admin)/(tabs)/dashboard')
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingBottom: 36 }}
      showsVerticalScrollIndicator={false}
    >
      <ModulePageHeader
        eyebrow="Account"
        title="Profile"
        subtitle={me.data?.user.email ?? 'Your MentorBridge membership'}
        safeTop
      />

      <View className="gap-4 px-4">
        {showPreview ? <StudentModeBanner onExit={exitPreview} /> : null}

        <View className="items-center gap-3 py-2">
          <Image
            source={{ uri: user?.imageUrl }}
            style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              backgroundColor: colors.muted,
            }}
          />
          <Text className="text-2xl font-bold text-foreground">
            {linked?.name || user?.fullName || 'Student'}
          </Text>
          <MutedText>{me.data?.user.email}</MutedText>
        </View>

        <Card>
          <SectionLabel>Membership</SectionLabel>
          <Text className="text-foreground">
            Cohort / batch: {linked?.batch || '—'}
          </Text>
          <MutedText>
            Profile editing stays on the web for now. Use mentorbridge.in to update
            your bio, resume, and social links.
          </MutedText>
        </Card>

        {showPreview ? (
          <Button title="Back to admin" onPress={exitPreview} />
        ) : null}

        <Button
          title="Sign out"
          variant="outline"
          onPress={async () => {
            setStudentModePreview(false)
            await signOut()
            router.replace('/(auth)/login')
          }}
        />
      </View>
    </ScrollView>
  )
}
