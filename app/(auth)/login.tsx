import { Link } from 'expo-router'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { BrandLogo } from '@/components/ui/BrandLogo'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoginVerificationStep } from '@/features/auth/LoginVerificationStep'
import { useLoginFlow } from '@/features/auth/useLoginFlow'

export default function LoginScreen() {
  const {
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
  } = useLoginFlow()

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-grow justify-center px-6 py-10"
          keyboardShouldPersistTaps="handled"
        >
          <View className="mb-10 items-center">
            <BrandLogo height={48} showSubtitle />
          </View>

          <Text className="mb-6 text-center text-base text-muted-foreground">
            {needsCode
              ? codeStrategy === 'totp'
                ? 'Enter the code from your authenticator app'
                : 'Enter the verification code sent to your email'
              : 'Sign in with your MentorBridge account'}
          </Text>

          {!needsCode ? (
            <View className="gap-4">
              <Input
                label="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                value={email}
                onChangeText={setEmail}
                placeholder="admin@mentorbridge.in"
              />
              <Input
                label="Password"
                secureTextEntry
                autoComplete="password"
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
              />
              {error ? (
                <Text className="text-sm text-error" accessibilityLiveRegion="polite">
                  {error}
                </Text>
              ) : null}
              <Button title="Sign In" onPress={onSignIn} loading={loading} />
            </View>
          ) : (
            <LoginVerificationStep
              code={code}
              codeStrategy={codeStrategy}
              error={error}
              loading={loading}
              onChangeCode={setCode}
              onVerify={onVerifyCode}
              onResend={onResendCode}
              onBack={onBackToCredentials}
            />
          )}

          <Text className="mt-8 text-center text-xs text-muted-foreground">
            Admins and students with a linked MentorBridge profile can sign in.
          </Text>
          <Link href="/" className="mt-2 text-center text-sm text-primary">
            Refresh session
          </Link>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
