import { useLocalSearchParams } from 'expo-router'
import { ScrollView, Text, View } from 'react-native'

import { Card, MutedText, SectionLabel } from '@/components/ui/Card'
import { ROADMAP_CATALOG } from '@/data/roadmaps/catalog'

export default function RoadmapDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>()
  const roadmap = ROADMAP_CATALOG.find((r) => r.slug === slug)

  if (!roadmap) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-6">
        <Text className="text-foreground">Roadmap not found</Text>
      </View>
    )
  }

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="gap-3 p-4">
      <Text className="text-2xl font-bold text-foreground">{roadmap.title}</Text>
      <MutedText>{roadmap.description}</MutedText>
      <SectionLabel>Nodes</SectionLabel>
      {roadmap.nodes.map((node) => (
        <Card key={node.id}>
          <Text className="font-semibold text-foreground">{node.title}</Text>
          <MutedText>{node.summary}</MutedText>
        </Card>
      ))}
    </ScrollView>
  )
}
