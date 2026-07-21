import '@/../global.css'

import { ClerkProvider } from '@clerk/clerk-expo'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { colors } from '@/theme/colors'
import { tokenCache } from '@/lib/tokenCache'
import { initMonitoring } from '@/lib/monitoring'
import { AnalyticsProvider } from '@/lib/AnalyticsProvider'

initMonitoring()

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? ''

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
      gcTime: 1000 * 60 * 60 * 24,
    },
  },
})

const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'mentorbridge-query-cache',
})

export default function RootLayout() {
  if (!publishableKey) {
    console.warn(
      'Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY — auth will not work until configured.',
    )
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaProvider>
        <ClerkProvider publishableKey={publishableKey || 'pk_placeholder'} tokenCache={tokenCache}>
          <AnalyticsProvider>
          <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{
              persister,
              maxAge: 1000 * 60 * 60 * 24,
              dehydrateOptions: {
                shouldDehydrateQuery: (query) =>
                  query.state.status === 'success' &&
                  !String(query.queryKey[0]).includes('me'),
              },
            }}
          >
            <StatusBar style="dark" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.background },
                animation: 'fade',
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="sso-callback" options={{ animation: 'none' }} />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(admin)" />
              <Stack.Screen name="(student)" />
            </Stack>
          </PersistQueryClientProvider>
          </AnalyticsProvider>
        </ClerkProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
