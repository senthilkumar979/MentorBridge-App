import { useAuth } from '@clerk/clerk-expo'
import { Redirect, Stack } from 'expo-router'
import { ActivityIndicator, View } from 'react-native'

import { subpageScreenOptions } from '@/components/ui/SubpageHeader'
import { useApiAuthBridge, useIsAdminAccess } from '@/hooks/useAuthBridge'
import { colors } from '@/theme/colors'

export default function AdminLayout() {
  const { isLoaded, isSignedIn } = useAuth()
  useApiAuthBridge()
  const access = useIsAdminAccess()

  if (!isLoaded || (isSignedIn && !access.isLoaded)) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    )
  }

  if (!isSignedIn) return <Redirect href="/(auth)/login" />
  if (!access.isAdmin) return <Redirect href="/(auth)/access-denied" />

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
        name="students/[id]/index"
        options={subpageScreenOptions({
          title: 'Student profile',
          eyebrow: 'Directory',
        })}
      />
      <Stack.Screen
        name="students/[id]/edit"
        options={subpageScreenOptions({
          title: 'Edit student',
          eyebrow: 'Directory',
        })}
      />
      <Stack.Screen
        name="students/[id]/guardian"
        options={subpageScreenOptions({
          title: 'Guardian details',
          eyebrow: 'Directory',
          subtitle: 'Admin only · keep confidential',
        })}
      />
      <Stack.Screen
        name="meetings/[id]/index"
        options={subpageScreenOptions({
          title: 'Meeting',
          eyebrow: 'Schedule',
        })}
      />
      <Stack.Screen
        name="meetings/[id]/attendance"
        options={subpageScreenOptions({
          title: 'Attendance',
          eyebrow: 'Schedule',
        })}
      />
      <Stack.Screen
        name="meetings/form"
        options={subpageScreenOptions({
          title: 'Meeting form',
          eyebrow: 'Schedule',
        })}
      />
      <Stack.Screen name="videos/index" options={{ headerShown: false }} />
      <Stack.Screen
        name="videos/[id]"
        options={subpageScreenOptions({
          title: 'Session video',
          eyebrow: 'Library',
        })}
      />
      <Stack.Screen
        name="videos/form"
        options={subpageScreenOptions({
          title: 'Video form',
          eyebrow: 'Library',
        })}
      />
      <Stack.Screen name="assignments/index" options={{ headerShown: false }} />
      <Stack.Screen
        name="assignments/[id]/index"
        options={subpageScreenOptions({
          title: 'Assignment',
          eyebrow: 'Learning',
        })}
      />
      <Stack.Screen name="administration/index" options={{ headerShown: false }} />
      <Stack.Screen name="administration/announcements" options={{ headerShown: false }} />
      <Stack.Screen name="administration/[module]" options={{ headerShown: false }} />
      <Stack.Screen
        name="roadmaps/index"
        options={subpageScreenOptions({
          title: 'Roadmaps',
          eyebrow: 'Learning',
        })}
      />
      <Stack.Screen
        name="roadmaps/[slug]"
        options={subpageScreenOptions({
          title: 'Roadmap',
          eyebrow: 'Learning',
        })}
      />
      <Stack.Screen name="blogs/index" options={{ headerShown: false }} />
      <Stack.Screen name="gallery/index" options={{ headerShown: false }} />
      <Stack.Screen name="gallery/[folder]" options={{ headerShown: false }} />
      <Stack.Screen
        name="profile"
        options={subpageScreenOptions({
          title: 'Profile',
          eyebrow: 'Account',
        })}
      />
      <Stack.Screen
        name="account"
        options={subpageScreenOptions({
          title: 'Account',
          eyebrow: 'Settings',
        })}
      />
    </Stack>
  )
}
