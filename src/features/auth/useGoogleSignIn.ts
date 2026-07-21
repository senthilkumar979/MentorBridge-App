import { useSSO } from '@clerk/clerk-expo'
import * as AuthSession from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'

import { getErrorMessage } from '@/api/errors'

WebBrowser.maybeCompleteAuthSession()

export function useWarmUpBrowser() {
  useEffect(() => {
    void WebBrowser.warmUpAsync()
    return () => {
      void WebBrowser.coolDownAsync()
    }
  }, [])
}

export const useGoogleSignIn = () => {
  const { startSSOFlow } = useSSO()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onGoogleSignIn = async () => {
    setLoading(true)
    setError(null)
    try {
      const redirectUrl = AuthSession.makeRedirectUri({ path: 'sso-callback' })
      const { createdSessionId, setActive, authSessionResult } = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl,
      })

      if (authSessionResult?.type === 'cancel' || authSessionResult?.type === 'dismiss') {
        return
      }

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId })
        router.replace('/')
        return
      }

      setError('Google sign-in did not complete. Try again or use email.')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return { onGoogleSignIn, loading, error, setError }
}
