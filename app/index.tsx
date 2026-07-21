import { useAuth } from '@clerk/clerk-expo'
import { Redirect } from 'expo-router'
import { ActivityIndicator, View } from 'react-native'

import { useApiAuthBridge, useIsAdminAccess } from '@/hooks/useAuthBridge'
import { useAppStore } from '@/stores/appStore'
import { colors } from '@/theme/colors'

export default function Index() {
  const { isLoaded, isSignedIn } = useAuth()
  useApiAuthBridge()
  const access = useIsAdminAccess()
  const studentModePreview = useAppStore((s) => s.studentModePreview)

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    )
  }

  if (!isSignedIn) return <Redirect href="/(auth)/login" />

  if (!access.isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    )
  }

  if (access.isAdmin && studentModePreview) {
    return <Redirect href="/(student)/(tabs)/home" />
  }

  if (access.isAdmin) {
    return <Redirect href="/(admin)/(tabs)/dashboard" />
  }

  if (access.hasLinkedStudent) {
    return <Redirect href="/(student)/(tabs)/home" />
  }

  return <Redirect href="/(auth)/access-denied" />
}
