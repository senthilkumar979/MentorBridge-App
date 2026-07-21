import { useLocalSearchParams } from 'expo-router'
import { Shield } from 'lucide-react-native'
import { ScrollView, Text, View } from 'react-native'

import { Card, ErrorState, LoadingState, MutedText, SectionLabel } from '@/components/ui/Card'
import { useStudent } from '@/hooks/useQueries'
import { colors } from '@/theme/colors'

export default function GuardianScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { data, isLoading, isError, error } = useStudent(id)

  if (isLoading) return <LoadingState />
  if (isError || !data)
    return <ErrorState message={error?.message ?? 'Not found'} />

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="gap-4 p-4"
    >
      <View className="flex-row items-center gap-2 rounded-xl border border-warning/40 bg-warning/10 px-3 py-3">
        <Shield size={18} color={colors.warning} />
        <MutedText>
          Admin-only. Never share these details with students or third parties.
        </MutedText>
      </View>

      <Card>
        <SectionLabel>Father / Guardian</SectionLabel>
        <Text className="text-[15px] leading-6 text-foreground">
          {data.fatherGuardianDetails?.trim() || 'No details on file'}
        </Text>
      </Card>

      <Card>
        <SectionLabel>Mother</SectionLabel>
        <Text className="text-[15px] leading-6 text-foreground">
          {data.motherDetails?.trim() || 'No details on file'}
        </Text>
      </Card>

      <Text className="text-center text-xs text-muted-foreground">
        {data.name} · {data.email}
      </Text>
    </ScrollView>
  )
}
