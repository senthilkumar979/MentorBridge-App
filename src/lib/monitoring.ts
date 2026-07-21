import * as Sentry from '@sentry/react-native'

let sentryInitialized = false

export function initMonitoring() {
  const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN
  if (dsn && !sentryInitialized) {
    Sentry.init({
      dsn,
      tracesSampleRate: 0.2,
      enableAutoSessionTracking: true,
      beforeBreadcrumb(breadcrumb) {
        if (breadcrumb.category === 'console') return null
        return breadcrumb
      },
    })
    sentryInitialized = true
  }
}

export { Sentry }
