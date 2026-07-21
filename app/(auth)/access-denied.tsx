import { useAuth } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { BrandLogo } from '@/components/ui/BrandLogo'
import { Button } from '@/components/ui/Button'
import { useIsAdminAccess, useMe } from '@/hooks/useAuthBridge'

export default function AccessDeniedScreen() {
  const { signOut } = useAuth()
  const router = useRouter()
  const me = useMe()
  const access = useIsAdminAccess()

  const onSignOut = async () => {
    await signOut()
    router.replace('/(auth)/login')
  }

  const isVerifyError = me.isError && !access.isAdmin

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center gap-6 px-8">
        <BrandLogo height={40} />
        <Text className="text-center text-2xl font-bold text-foreground">
          {isVerifyError ? 'Could not verify your account' : 'Access unavailable'}
        </Text>
        <Text className="text-center text-base text-muted-foreground">
          {isVerifyError
            ? 'The app could not load your MentorBridge account. Check your connection and try again.'
            : 'Sign in with a MentorBridge admin account (Clerk role admin), or a student account linked in MentorBridge. Admins do not need a student profile.'}
        </Text>
        <Button title="Sign Out" variant="outline" onPress={onSignOut} className="w-full" />
        <Button
          title="Try again"
          className="w-full"
          onPress={() => router.replace('/')}
        />
      </View>
    </SafeAreaView>
  )
}
