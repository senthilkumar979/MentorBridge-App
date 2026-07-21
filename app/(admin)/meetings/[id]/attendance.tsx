import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert, ScrollView, Text } from 'react-native'

import { Button } from '@/components/ui/Button'
import { ErrorState, LoadingState, MutedText } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { useMeeting, useMeetingMutations } from '@/hooks/useQueries'

export default function AttendanceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { data, isLoading, isError, error } = useMeeting(id)
  const { attendance } = useMeetingMutations()
  const [value, setValue] = useState('')

  useEffect(() => {
    if (data?.attendance?.length) setValue(data.attendance.join(', '))
  }, [data])

  if (isLoading) return <LoadingState variant="detail" />
  if (isError || !data) return <ErrorState message={error?.message ?? 'Not found'} />

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="gap-4 p-4">
      <Text className="text-xl font-bold text-foreground">{data.title}</Text>
      <MutedText>Enter serial numbers separated by commas</MutedText>
      <Input
        label="Attendance"
        value={value}
        onChangeText={setValue}
        placeholder="1, 2, 5, 12"
      />
      <Button
        title="Save attendance"
        loading={attendance.isPending}
        onPress={async () => {
          const nums = value
            .split(',')
            .map((s) => Number(s.trim()))
            .filter((n) => !Number.isNaN(n) && n > 0)
          try {
            await attendance.mutateAsync({ id, attendance: nums })
            Alert.alert('Saved', `${nums.length} students marked present`)
          } catch (e) {
            Alert.alert('Failed', e instanceof Error ? e.message : 'Error')
          }
        }}
      />
    </ScrollView>
  )
}
