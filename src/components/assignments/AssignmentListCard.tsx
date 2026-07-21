import * as Haptics from 'expo-haptics'
import { Pressable, Text, View } from 'react-native'

import {
  AssignmentCardMeta,
  AssignmentCardTitle,
  accentFor,
  type AssignmentListItem,
} from '@/components/assignments/assignmentCardParts'

export type { AssignmentListItem }

interface AssignmentListCardProps {
  assignment: AssignmentListItem
  onPress: () => void
  studentMode?: boolean
}

export const AssignmentListCard = ({
  assignment,
  onPress,
  studentMode = false,
}: AssignmentListCardProps) => {
  const accent = accentFor(assignment.dueStatus)
  const blurb = assignment.description
    ?.replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  return (
    <Pressable
      onPress={() => {
        void Haptics.selectionAsync()
        onPress()
      }}
      className="mx-4 mb-3 flex-row overflow-hidden rounded-2xl border border-border bg-surface active:opacity-90"
    >
      <View className="w-1.5" style={{ backgroundColor: accent }} />
      <View className="min-w-0 flex-1 px-3.5 py-3.5">
        <AssignmentCardTitle
          title={assignment.title}
          cohortName={assignment.cohortName}
        />
        {blurb ? (
          <Text className="mb-2 text-sm leading-5 text-muted-foreground" numberOfLines={2}>
            {blurb}
          </Text>
        ) : null}
        <AssignmentCardMeta assignment={assignment} studentMode={studentMode} />
      </View>
    </Pressable>
  )
}
