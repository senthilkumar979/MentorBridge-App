import { useAuth } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { Pressable, ScrollView, Text, View } from 'react-native'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ModulePageHeader } from '@/components/ui/ModulePageHeader'

const LINKS = [
  { label: 'Videos', href: '/(admin)/videos', description: 'Session recordings' },
  {
    label: 'Administration',
    href: '/(admin)/administration',
    description: 'Program modules',
  },
  {
    label: 'Announcements',
    href: '/(admin)/administration/announcements',
    description: 'Publish updates',
  },
  { label: 'Roadmaps', href: '/(admin)/roadmaps', description: 'Learning paths' },
  { label: 'Blogs', href: '/(admin)/blogs', description: 'Community writing' },
  { label: 'Gallery', href: '/(admin)/gallery', description: 'Photos & moments' },
  { label: 'Profile', href: '/(admin)/profile', description: 'Your account' },
  { label: 'Account', href: '/(admin)/account', description: 'Settings' },
] as const

export default function MoreScreen() {
  const router = useRouter()
  const { signOut } = useAuth()

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingBottom: 36 }}
      showsVerticalScrollIndicator={false}
    >
      <ModulePageHeader
        eyebrow="MentorBridge"
        title="More"
        subtitle="Modules, content, and account"
        safeTop
      />

      <View className="gap-3 px-4">
        {LINKS.map((link) => (
          <Pressable
            key={link.href}
            onPress={() => router.push(link.href as never)}
            className="active:opacity-80"
          >
            <Card>
              <Text className="text-base font-semibold text-foreground">{link.label}</Text>
              <Text className="mt-0.5 text-sm text-muted-foreground">
                {link.description}
              </Text>
            </Card>
          </Pressable>
        ))}
        <Button
          title="Sign Out"
          variant="outline"
          className="mt-2"
          onPress={async () => {
            await signOut()
            router.replace('/(auth)/login')
          }}
        />
      </View>
    </ScrollView>
  )
}
