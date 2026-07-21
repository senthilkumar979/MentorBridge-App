import { useSignIn } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { useState } from 'react'

import { getErrorMessage } from '@/api/errors'
import {
  needsAdditionalVerification,
  startSecondFactor,
  type CodeStrategy,
} from '@/features/auth/startSecondFactor'

export const useLoginFlow = () => {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [codeStrategy, setCodeStrategy] = useState<CodeStrategy>('email_code')
  const [needsCode, setNeedsCode] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const finishSignIn = async (sessionId: string | null) => {
    if (!sessionId || !setActive) return
    await setActive({ session: sessionId })
    router.replace('/')
  }

  const onSignIn = async () => {
    if (!isLoaded || !signIn) return
    setLoading(true)
    setError(null)
    try {
      const result = await signIn.create({
        identifier: email.trim(),
        password,
      })
      if (result.status === 'complete') {
        await finishSignIn(result.createdSessionId)
        return
      }
      if (needsAdditionalVerification(result.status)) {
        const strategy = await startSecondFactor(signIn)
        if (strategy) {
          setCodeStrategy(strategy)
          setNeedsCode(true)
          return
        }
      }
      setError(
        `Additional verification required (${result.status || 'unknown'}). Complete sign-in on the web app if this continues.`,
      )
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const onVerifyCode = async () => {
    if (!isLoaded || !signIn) return
    setLoading(true)
    setError(null)
    try {
      const result = await signIn.attemptSecondFactor({
        strategy: codeStrategy,
        code: code.trim(),
      })
      if (result.status === 'complete') {
        await finishSignIn(result.createdSessionId)
        return
      }
      setError('Verification incomplete. Try again or use the web app.')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const onResendCode = async () => {
    if (!isLoaded || !signIn || codeStrategy !== 'email_code') return
    setLoading(true)
    setError(null)
    try {
      const strategy = await startSecondFactor(signIn)
      if (strategy) setCodeStrategy(strategy)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const onBackToCredentials = () => {
    setNeedsCode(false)
    setCode('')
    setError(null)
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    code,
    setCode,
    codeStrategy,
    needsCode,
    error,
    loading,
    onSignIn,
    onVerifyCode,
    onResendCode,
    onBackToCredentials,
  }
}
