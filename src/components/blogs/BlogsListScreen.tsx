import { useInfiniteQuery } from '@tanstack/react-query'
import { FlashList } from '@shopify/flash-list'
import { ActivityIndicator, Text, View } from 'react-native'

import { fetchBlogs } from '@/api/endpoints'
import { BlogListCard, type BlogListItem } from '@/components/blogs/BlogListCard'
import { ModulePageHeader } from '@/components/ui/ModulePageHeader'
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/Card'
import { useEndReachedGate } from '@/hooks/useEndReachedGate'
import { colors } from '@/theme/colors'

interface BlogsListScreenProps {
  eyebrow: string
  emptyDescription: string
}

export const BlogsListScreen = ({
  eyebrow,
  emptyDescription,
}: BlogsListScreenProps) => {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['blogs'],
    queryFn: ({ pageParam }) => fetchBlogs(pageParam),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.pagination?.hasNextPage ? last.pagination.page + 1 : undefined,
  })

  const gate = useEndReachedGate({ minOffset: 120, cooldownMs: 800 })

  if (isLoading) return <LoadingState />
  if (isError) return <ErrorState message={error.message} />

  const blogs = (data?.pages.flatMap((p) => p.data ?? []) ?? []) as BlogListItem[]
  const total = data?.pages[0]?.pagination?.totalCount ?? blogs.length

  return (
    <View className="flex-1 bg-background">
      <FlashList
        data={blogs}
        refreshing={isRefetching && !isFetchingNextPage}
        onRefresh={() => void refetch()}
        keyExtractor={(item, i) => String(item.id ?? item.link ?? i)}
        drawDistance={280}
        ListHeaderComponent={
          <ModulePageHeader
            eyebrow={eyebrow}
            title="Blogs"
            subtitle={`${total} article${total === 1 ? '' : 's'} from MentorBridge`}
            showBack
            safeTop
          />
        }
        ListEmptyComponent={
          <EmptyState title="No blogs yet" description={emptyDescription} />
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <View className="items-center py-4">
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : hasNextPage ? (
            <View className="items-center py-4">
              <Text className="text-sm text-muted-foreground">Scroll for more…</Text>
            </View>
          ) : blogs.length > 0 ? (
            <View className="items-center py-6">
              <Text className="text-xs text-muted-foreground">You’re all caught up</Text>
            </View>
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 28, paddingTop: 8 }}
        renderItem={({ item }) => <BlogListCard blog={item} />}
        onScroll={gate.onScroll}
        scrollEventThrottle={16}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            gate.onEndReached(() => {
              void fetchNextPage()
            })
          }
        }}
        onEndReachedThreshold={0.15}
      />
    </View>
  )
}
