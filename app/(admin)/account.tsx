import * as LocalAuthentication from 'expo-local-authentication'
import { useAuth } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { Alert, ScrollView, Switch, Text, View } from 'react-native'

import { Button } from '@/components/ui/Button'
import { Card, MutedText, SectionLabel } from '@/components/ui/Card'
import { useAppStore } from '@/stores/appStore'
import { flushOfflineQueue } from '@/lib/offlineQueue'
import { registerForPushNotifications } from '@/lib/push'

export default function AccountScreen() {
  const { signOut } = useAuth()
  const router = useRouter()
  const biometricEnabled = useAppStore((s) => s.biometricEnabled)
  const setBiometricEnabled = useAppStore((s) => s.setBiometricEnabled)
  const pending = useAppStore((s) => s.pendingOfflineWrites)

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="gap-4 p-4">
      <Card>
        <SectionLabel>Security</SectionLabel>
        <View className="flex-row items-center justify-between">
          <Text className="text-foreground">Biometric unlock</Text>
          <Switch
            value={biometricEnabled}
            onValueChange={async (enabled) => {
              if (enabled) {
                const ok = await LocalAuthentication.authenticateAsync({
                  promptMessage: 'Enable biometric unlock',
                })
                if (!ok.success) return
              }
              setBiometricEnabled(enabled)
            }}
            trackColor={{ true: '#d53f8c' }}
          />
        </View>
        <MutedText>Optional Phase 2 convenience for returning to the app</MutedText>
      </Card>

      <Card>
        <SectionLabel>Notifications</SectionLabel>
        <Button
          title="Enable push notifications"
          variant="outline"
          onPress={async () => {
            try {
              await registerForPushNotifications()
              Alert.alert('Registered', 'Push token registered with MentorBridge')
            } catch (e) {
              Alert.alert('Failed', e instanceof Error ? e.message : 'Error')
            }
          }}
        />
      </Card>

      <Card>
        <SectionLabel>Offline queue</SectionLabel>
        <Text className="text-foreground">{pending.length} pending write(s)</Text>
        <Button
          title="Flush offline queue"
          className="mt-3"
          variant="outline"
          onPress={async () => {
            const result = await flushOfflineQueue()
            Alert.alert('Flush complete', `${result.flushed} sent, ${result.failed} failed`)
          }}
        />
      </Card>

      <Button
        title="Sign Out"
        variant="destructive"
        onPress={async () => {
          await signOut()
          router.replace('/(auth)/login')
        }}
      />
    </ScrollView>
  )
}
