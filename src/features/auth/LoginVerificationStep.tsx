import { Text, View } from 'react-native'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { CodeStrategy } from '@/features/auth/startSecondFactor'

interface LoginVerificationStepProps {
  code: string
  codeStrategy: CodeStrategy
  error: string | null
  loading: boolean
  onChangeCode: (value: string) => void
  onVerify: () => void
  onResend: () => void
  onBack: () => void
}

export const LoginVerificationStep = ({
  code,
  codeStrategy,
  error,
  loading,
  onChangeCode,
  onVerify,
  onResend,
  onBack,
}: LoginVerificationStepProps) => (
  <View className="gap-4">
    <Input
      label="Verification code"
      autoCapitalize="none"
      keyboardType="number-pad"
      autoComplete="one-time-code"
      value={code}
      onChangeText={onChangeCode}
      placeholder="123456"
    />
    {error ? (
      <Text className="text-sm text-error" accessibilityLiveRegion="polite">
        {error}
      </Text>
    ) : null}
    <Button title="Verify" onPress={onVerify} loading={loading} />
    {codeStrategy === 'email_code' ? (
      <Button title="Resend code" variant="outline" onPress={onResend} loading={loading} />
    ) : null}
    <Button title="Back to sign in" variant="outline" onPress={onBack} />
  </View>
)
