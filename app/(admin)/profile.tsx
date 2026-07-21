import { useAuth, useUser } from '@clerk/clerk-expo'
import { Image } from 'expo-image'
import { ScrollView, Text, View } from 'react-native'

import { Card, MutedText, SectionLabel } from '@/components/ui/Card'
import { useMe } from '@/hooks/useAuthBridge'
import { colors } from '@/theme/colors'

export default function ProfileScreen() {
  const { user } = useUser()
  const me = useMe()

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="gap-4 p-4">
      <View className="items-center gap-3">
        <Image
          source={{ uri: user?.imageUrl }}
          style={{ width: 88, height: 88, borderRadius: 44, backgroundColor: colors.muted }}
        />
        <Text className="text-xl font-bold text-foreground">
          {user?.fullName ?? 'Admin'}
        </Text>
        <MutedText>{user?.primaryEmailAddress?.emailAddress}</MutedText>
      </View>
      <Card>
        <SectionLabel>Admin status</SectionLabel>
        <Text className="text-foreground">
          {me.data?.isAdmin ? 'Administrator' : 'Not admin'}
        </Text>
      </Card>
      {me.data?.linkedStudent ? (
        <Card>
          <SectionLabel>Linked student record</SectionLabel>
          <Text className="text-foreground">{me.data.linkedStudent.name}</Text>
          <MutedText>{me.data.linkedStudent.email}</MutedText>
        </Card>
      ) : null}
    </ScrollView>
  )
}
