import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as Haptics from 'expo-haptics'
import { useLocalSearchParams } from 'expo-router'
import { useMemo, useState } from 'react'
import { Alert, FlatList, View } from 'react-native'

import { createAdminResource, fetchAdminResource } from '@/api/endpoints'
import { AdminCreateForm } from '@/components/administration/AdminCreateForm'
import { AdminModuleHeader } from '@/components/administration/AdminModuleHeader'
import {
  AdminResourceCard,
  VisitorQueriesPlaceholder,
} from '@/components/administration/AdminResourceCard'
import {
  buildCreatePayload,
  presentAdminItem,
} from '@/components/administration/adminItemPresentation'
import { getAdminModuleConfig } from '@/components/administration/adminModuleConfig'
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/Card'

export default function AdminModuleScreen() {
  const { module } = useLocalSearchParams<{ module: string }>()
  const resource = module ?? ''
  const config = getAdminModuleConfig(resource)
  const qc = useQueryClient()
  const [composerOpen, setComposerOpen] = useState(false)
  const [values, setValues] = useState<Record<string, string>>({})

  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey: ['admin', resource],
    queryFn: () => fetchAdminResource(resource),
    enabled: !!resource && resource !== 'visitor-queries',
  })

  const categoriesQuery = useQuery({
    queryKey: ['admin', 'award-categories'],
    queryFn: () => fetchAdminResource('award-categories'),
    enabled: resource === 'awards' && composerOpen,
  })

  const create = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      createAdminResource(resource, payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['admin', resource] })
      setValues({})
      setComposerOpen(false)
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    },
  })

  const categoryOptions = useMemo(() => {
    const rows = (categoriesQuery.data?.data ?? []) as Array<Record<string, unknown>>
    return rows
      .map((row) => ({
        id: String(row.id ?? ''),
        name: String(row.name ?? 'Category'),
      }))
      .filter((row) => row.id)
  }, [categoriesQuery.data])

  if (resource === 'visitor-queries') return <VisitorQueriesPlaceholder />
  if (isLoading) return <LoadingState />
  if (isError) return <ErrorState message={error.message} />

  const rows = (data?.data ?? []) as Array<Record<string, unknown>>

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={rows}
        refreshing={isRefetching}
        onRefresh={refetch}
        keyExtractor={(item, index) => String(item.id ?? index)}
        contentContainerStyle={{ paddingBottom: 28 }}
        ListHeaderComponent={
          <View>
            <AdminModuleHeader
              config={config}
              count={rows.length}
              composerOpen={composerOpen}
              onToggleComposer={() => setComposerOpen((v) => !v)}
            />
            {composerOpen && config.canCreate ? (
              <View className="mt-4">
                <AdminCreateForm
                  fields={config.fields}
                  values={values}
                  categoryOptions={resource === 'awards' ? categoryOptions : undefined}
                  loading={create.isPending}
                  onChange={(key, value) =>
                    setValues((prev) => ({ ...prev, [key]: value }))
                  }
                  onCancel={() => {
                    setComposerOpen(false)
                    setValues({})
                  }}
                  onSubmit={() => {
                    try {
                      const payload = buildCreatePayload(config.fields, values)
                      create.mutate(payload, {
                        onError: (e) =>
                          Alert.alert(
                            'Could not save',
                            e instanceof Error ? e.message : 'Unknown error',
                          ),
                      })
                    } catch (e) {
                      Alert.alert(
                        'Check form',
                        e instanceof Error ? e.message : 'Missing fields',
                      )
                    }
                  }}
                />
              </View>
            ) : (
              <View className="h-3" />
            )}
          </View>
        }
        ListEmptyComponent={
          <EmptyState title="No items" description="Nothing in this module yet." />
        }
        renderItem={({ item }) => {
          const presentation = presentAdminItem(resource, item)
          return (
            <View className="px-4">
              <AdminResourceCard
                title={presentation.title}
                details={presentation.details}
              />
            </View>
          )
        }}
      />
    </View>
  )
}
