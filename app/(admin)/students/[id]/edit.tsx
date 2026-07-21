import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert, ScrollView, View } from 'react-native'

import { Button } from '@/components/ui/Button'
import { ErrorState, LoadingState } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { useStudent, useUpdateStudent } from '@/hooks/useQueries'

export default function EditStudentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const { data, isLoading, isError, error } = useStudent(id)
  const update = useUpdateStudent(id)
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [cohortId, setCohortId] = useState('')

  useEffect(() => {
    if (!data) return
    setName(data.name)
    setRole(data.role)
    setCompany(data.company ?? '')
    setEmail(data.email)
    setCohortId(data.cohortId ?? '')
  }, [data])

  if (isLoading) return <LoadingState />
  if (isError || !data) return <ErrorState message={error?.message ?? 'Not found'} />

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="gap-4 p-4">
      <Input label="Name" value={name} onChangeText={setName} />
      <Input label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <Input label="Role" value={role} onChangeText={setRole} />
      <Input label="Company" value={company} onChangeText={setCompany} />
      <Input label="Cohort ID" value={cohortId} onChangeText={setCohortId} />
      <Button
        title="Save"
        loading={update.isPending}
        onPress={async () => {
          try {
            await update.mutateAsync({ name, email, role, company, cohortId })
            router.back()
          } catch (e) {
            Alert.alert('Update failed', e instanceof Error ? e.message : 'Unknown error')
          }
        }}
      />
    </ScrollView>
  )
}
