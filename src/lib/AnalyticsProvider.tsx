import { PostHogProvider } from 'posthog-react-native'
import type { ReactNode } from 'react'

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const key = process.env.EXPO_PUBLIC_POSTHOG_KEY
  const host = process.env.EXPO_PUBLIC_POSTHOG_HOST ?? 'https://eu.posthog.com'

  if (!key) return <>{children}</>

  return (
    <PostHogProvider
      apiKey={key}
      options={{ host, enableSessionReplay: false }}
      autocapture
    >
      {children}
    </PostHogProvider>
  )
}
