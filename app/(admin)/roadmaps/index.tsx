import { useRouter } from 'expo-router'
import { Pressable, ScrollView, Text } from 'react-native'

import { Card, MutedText, SectionLabel } from '@/components/ui/Card'
import { ROADMAP_CATALOG } from '@/data/roadmaps/catalog'

export default function RoadmapsScreen() {
  const router = useRouter()
  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="gap-3 p-4">
      <SectionLabel>Learning roadmaps</SectionLabel>
      <MutedText>Bundled catalog mirrored from the web app</MutedText>
      {ROADMAP_CATALOG.map((r) => (
        <Pressable key={r.slug} onPress={() => router.push(`/(admin)/roadmaps/${r.slug}`)}>
          <Card>
            <Text className="text-base font-semibold text-foreground">{r.title}</Text>
            <MutedText>{r.description}</MutedText>
          </Card>
        </Pressable>
      ))}
    </ScrollView>
  )
}
