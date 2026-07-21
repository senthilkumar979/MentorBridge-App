import { useRouter } from 'expo-router'
import { Pressable, Text, View } from 'react-native'

import type { Announcement } from '@/api/endpoints'
import type { AssignmentListItem } from '@/components/assignments/AssignmentListCard'
import { ActionItemCard } from '@/components/students/ActionItemCard'
import { Card, SectionLabel } from '@/components/ui/Card'

interface StudentHomeFeedProps {
  actionItems: AssignmentListItem[]
  news: Announcement[]
  /** When true, render only action items (news is placed elsewhere). */
  actionsOnly?: boolean
  /** When true, render only the news block. */
  newsOnly?: boolean
}

const ActionItemsBlock = ({
  actionItems,
}: {
  actionItems: AssignmentListItem[]
}) => {
  const router = useRouter()
  const pastDueCount = actionItems.filter((a) => a.dueStatus === 'past_due').length

  return (
    <View>
      <View className="mb-2 flex-row items-center justify-between">
        <SectionLabel>Action items</SectionLabel>
        {pastDueCount > 0 ? (
          <Text className="text-xs font-semibold text-error">
            {pastDueCount} past due
          </Text>
        ) : null}
      </View>
      {actionItems.length === 0 ? (
        <Card>
          <Text className="text-foreground">You’re all caught up.</Text>
          <Text className="mt-1 text-sm text-muted-foreground">
            No urgent assignments right now.
          </Text>
        </Card>
      ) : (
        actionItems.map((item) => (
          <ActionItemCard
            key={item.id}
            item={item}
            onPress={() => router.push(`/(student)/assignments/${item.id}`)}
          />
        ))
      )}
    </View>
  )
}

const NewsBlock = ({ news }: { news: Announcement[] }) => {
  const router = useRouter()
  const hasNews = news.length > 0

  return (
    <View>
      <View className="mb-2 flex-row items-center justify-between">
        <SectionLabel>Latest news</SectionLabel>
        {hasNews ? (
          <Pressable onPress={() => router.push('/(student)/(tabs)/announcements')}>
            <Text className="text-xs font-semibold text-primary">View all</Text>
          </Pressable>
        ) : null}
      </View>
      {hasNews ? (
        news.slice(0, 3).map((a) => (
          <Card key={a.id} className="mb-2">
            <Text className="font-semibold text-foreground">{a.title}</Text>
            <Text className="mt-1 text-sm text-muted-foreground" numberOfLines={2}>
              {a.description.replace(/<[^>]+>/g, ' ').trim()}
            </Text>
          </Card>
        ))
      ) : (
        <Card>
          <Text className="text-foreground">No announcements yet</Text>
        </Card>
      )}
    </View>
  )
}

export const StudentHomeFeed = ({
  actionItems,
  news,
  actionsOnly = false,
  newsOnly = false,
}: StudentHomeFeedProps) => {
  if (actionsOnly) {
    return (
      <View className="gap-5 px-4">
        <ActionItemsBlock actionItems={actionItems} />
      </View>
    )
  }
  if (newsOnly) {
    return (
      <View className="gap-5 px-4">
        <NewsBlock news={news} />
      </View>
    )
  }
  return (
    <View className="gap-5 px-4">
      <ActionItemsBlock actionItems={actionItems} />
      <NewsBlock news={news} />
    </View>
  )
}
