import { FlashList } from '@shopify/flash-list'
import { useRouter } from 'expo-router'
import { useCallback, useMemo } from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { StudentListCard } from '@/components/students/StudentListCard'
import { StudentListHeader } from '@/components/students/StudentListHeader'
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '@/components/ui/Card'
import { useEndReachedGate } from '@/hooks/useEndReachedGate'
import { useStudentFilterOptions, useStudents } from '@/hooks/useQueries'
import { useAppStore } from '@/stores/appStore'
import type { ProfileData } from '@/types/student'
import { colors } from '@/theme/colors'

export default function StudentsScreen() {
  const router = useRouter()
  const filters = useAppStore((s) => s.studentFilters)
  const setFilters = useAppStore((s) => s.setStudentFilters)
  const resetFilters = useAppStore((s) => s.resetStudentFilters)
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
  } = useStudents()
  const filterOptions = useStudentFilterOptions()
  const gate = useEndReachedGate({ minOffset: 120, cooldownMs: 800 })

  const students = useMemo(
    () => data?.pages.flatMap((p) => p.data) ?? [],
    [data?.pages],
  )
  const totalCount = data?.pages[0]?.pagination.totalCount

  const cohorts = useMemo(
    () =>
      (filterOptions.data?.cohorts ?? []).map((c) => ({
        id: c.id,
        label: c.name,
      })),
    [filterOptions.data?.cohorts],
  )
  const companies = useMemo(
    () =>
      (filterOptions.data?.companies ?? []).map((c) => ({
        id: c,
        label: c,
      })),
    [filterOptions.data?.companies],
  )
  const roles = useMemo(
    () =>
      (filterOptions.data?.roles ?? []).map((r) => ({
        id: r,
        label: r,
      })),
    [filterOptions.data?.roles],
  )

  const onSearchChange = useCallback(
    (search: string) => setFilters({ search }),
    [setFilters],
  )

  const renderItem = useCallback(
    ({ item }: { item: ProfileData }) => (
      <StudentListCard
        student={item}
        onPress={() => router.push(`/(admin)/students/${item.id}`)}
      />
    ),
    [router],
  )

  if (isLoading && !data) return <LoadingState />
  if (isError) return <ErrorState message={error.message} />

  return (
    <SafeAreaView edges={['left', 'right']} className="flex-1 bg-background">
      <FlashList
        data={students}
        keyExtractor={(item) => item.id}
        refreshing={isRefetching && !isFetchingNextPage}
        onRefresh={refetch}
        ListHeaderComponent={
          <StudentListHeader
            search={filters.search}
            onSearchChange={onSearchChange}
            totalCount={totalCount}
            resultCount={students.length}
            cohorts={cohorts}
            companies={companies}
            roles={roles}
            selectedCohort={filters.cohort}
            selectedCompany={filters.company}
            selectedRole={filters.role}
            onSelectCohort={(cohort) => setFilters({ cohort })}
            onSelectCompany={(company) => setFilters({ company })}
            onSelectRole={(role) => setFilters({ role })}
            onClearFilters={resetFilters}
          />
        }
        ListEmptyComponent={
          <EmptyState
            title="No students found"
            description="Try a different name or clear filters."
          />
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
          ) : students.length > 0 ? (
            <View className="items-center py-6">
              <Text className="text-xs text-muted-foreground">End of directory</Text>
            </View>
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 24, paddingTop: 4 }}
        renderItem={renderItem}
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
    </SafeAreaView>
  )
}
