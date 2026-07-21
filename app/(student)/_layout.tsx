import { useAuth } from '@clerk/clerk-expo'
import { Redirect, Stack } from 'expo-router'
import { ActivityIndicator, View } from 'react-native'

import { subpageScreenOptions } from '@/components/ui/SubpageHeader'
import { useApiAuthBridge, useIsAdminAccess } from '@/hooks/useAuthBridge'
import { useAppStore } from '@/stores/appStore'
import { colors } from '@/theme/colors'

export default function StudentLayout() {
  const { isLoaded, isSignedIn } = useAuth()
  useApiAuthBridge()
  const access = useIsAdminAccess()
  const studentModePreview = useAppStore((s) => s.studentModePreview)

  if (!isLoaded || (isSignedIn && !access.isLoaded)) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    )
  }

  if (!isSignedIn) return <Redirect href="/(auth)/login" />

  if (access.isAdmin && !studentModePreview) {
    return <Redirect href="/(admin)/(tabs)/dashboard" />
  }

  if (!access.isAdmin && !access.hasLinkedStudent) {
    return <Redirect href="/(auth)/access-denied" />
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.foreground,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
        gestureEnabled: true,
        fullScreenGestureEnabled: true,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="assignments/[id]"
        options={subpageScreenOptions({
          title: 'Assignment',
          eyebrow: 'Learning',
        })}
      />
      <Stack.Screen
        name="videos/[id]"
        options={subpageScreenOptions({
          title: 'Session video',
          eyebrow: 'Library',
        })}
      />
      <Stack.Screen name="events/index" options={{ headerShown: false }} />
      <Stack.Screen
        name="events/[id]"
        options={subpageScreenOptions({
          title: 'Event',
          eyebrow: 'Calendar',
        })}
      />
      <Stack.Screen name="blogs/index" options={{ headerShown: false }} />
      <Stack.Screen name="gallery/index" options={{ headerShown: false }} />
      <Stack.Screen name="gallery/[folder]" options={{ headerShown: false }} />
    </Stack>
  )
}
