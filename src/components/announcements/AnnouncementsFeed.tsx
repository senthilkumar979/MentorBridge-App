import * as Haptics from 'expo-haptics'
import { Plus } from 'lucide-react-native'
import { useState } from 'react'
import { Alert, FlatList, Pressable, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { AnnouncementCard } from '@/components/announcements/AnnouncementCard'
import { Button } from '@/components/ui/Button'
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/Card'
import { HeaderBackButton } from '@/components/ui/HeaderBackButton'
import { Input } from '@/components/ui/Input'
import { useAnnouncementMutations, useAnnouncements } from '@/hooks/useQueries'
import { colors } from '@/theme/colors'

interface AnnouncementsFeedProps {
  readOnly?: boolean
  showBack?: boolean
}

export const AnnouncementsFeed = ({
  readOnly = false,
  showBack = false,
}: AnnouncementsFeedProps) => {
  const insets = useSafeAreaInsets()
  const { data, isLoading, isError, error, refetch, isRefetching } = useAnnouncements()
  const { create, remove } = useAnnouncementMutations()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [composerOpen, setComposerOpen] = useState(false)

  if (isLoading) return <LoadingState />
  if (isError) return <ErrorState message={error.message} />

  const items = data?.data ?? []

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        refreshing={isRefetching}
        onRefresh={refetch}
        ListHeaderComponent={
          <View>
            <View
              className="border-b border-border px-4 pb-4"
              style={{ paddingTop: Math.max(insets.top, 8) + 4 }}
            >
              {showBack ? <HeaderBackButton className="mb-3" /> : null}
              <View className="flex-row items-start justify-between gap-3">
                <View className="min-w-0 flex-1">
                  <Text className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                    Communications
                  </Text>
                  <Text className="mt-1 text-3xl font-bold tracking-tight text-foreground">
                    Announcements
                  </Text>
                  <Text className="mt-1 text-sm text-muted-foreground">
                    {items.length} published update{items.length === 1 ? '' : 's'}
                  </Text>
                  <View className="mt-3 h-0.5 w-16 bg-primary/40" />
                </View>
                {!readOnly ? (
                  <Pressable
                    onPress={() => {
                      void Haptics.selectionAsync()
                      setComposerOpen((v) => !v)
                    }}
                    className="h-11 flex-row items-center gap-1.5 rounded-full bg-primary px-4 active:opacity-90"
                  >
                    <Plus size={18} color={colors.primaryForeground} strokeWidth={2.5} />
                    <Text className="text-sm font-semibold text-primary-foreground">New</Text>
                  </Pressable>
                ) : null}
              </View>
            </View>

            {!readOnly && composerOpen ? (
              <View className="mx-4 my-4 gap-3 rounded-2xl border border-border bg-surface p-4">
                <Text className="text-sm font-semibold text-foreground">Publish update</Text>
                <Input label="Title" value={title} onChangeText={setTitle} placeholder="What’s new?" />
                <Input
                  label="Message"
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Details for members…"
                  multiline
                  style={{ minHeight: 96, textAlignVertical: 'top' }}
                />
                <View className="flex-row gap-2">
                  <Button
                    title="Cancel"
                    variant="ghost"
                    className="flex-1"
                    onPress={() => setComposerOpen(false)}
                  />
                  <Button
                    title="Publish"
                    className="flex-1"
                    loading={create.isPending}
                    onPress={async () => {
                      try {
                        await create.mutateAsync({ title, description })
                        setTitle('')
                        setDescription('')
                        setComposerOpen(false)
                        void Haptics.notificationAsync(
                          Haptics.NotificationFeedbackType.Success,
                        )
                      } catch (e) {
                        Alert.alert('Failed', e instanceof Error ? e.message : 'Error')
                      }
                    }}
                  />
                </View>
              </View>
            ) : (
              <View className="h-3" />
            )}
          </View>
        }
        ListEmptyComponent={
          <EmptyState title="No announcements" description="Program updates will appear here." />
        }
        contentContainerStyle={{ paddingBottom: 28 }}
        renderItem={({ item }) => (
          <AnnouncementCard
            item={item}
            readOnly={readOnly}
            onDelete={
              readOnly
                ? undefined
                : () =>
                    Alert.alert('Delete announcement?', item.title, [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: () => remove.mutate(item.id),
                      },
                    ])
            }
          />
        )}
      />
    </View>
  )
}
