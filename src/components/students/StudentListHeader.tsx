import { Search, X } from 'lucide-react-native'
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { colors } from '@/theme/colors'

interface FilterChip {
  id: string
  label: string
}

interface StudentListHeaderProps {
  search: string
  onSearchChange: (value: string) => void
  totalCount?: number
  resultCount: number
  cohorts: FilterChip[]
  companies: FilterChip[]
  roles: FilterChip[]
  selectedCohort: string
  selectedCompany: string
  selectedRole: string
  onSelectCohort: (id: string) => void
  onSelectCompany: (id: string) => void
  onSelectRole: (id: string) => void
  onClearFilters: () => void
}

const Chip = ({
  label,
  active,
  onPress,
}: {
  label: string
  active: boolean
  onPress: () => void
}) => (
  <Pressable
    onPress={onPress}
    className={`mr-2 rounded-full border px-3 py-1.5 ${
      active
        ? 'border-primary bg-primary/20'
        : 'border-border bg-surface-elevated'
    }`}
  >
    <Text
      className={`text-xs font-semibold ${
        active ? 'text-primary' : 'text-muted-foreground'
      }`}
    >
      {label}
    </Text>
  </Pressable>
)

export const StudentListHeader = ({
  search,
  onSearchChange,
  totalCount,
  resultCount,
  cohorts,
  companies,
  roles,
  selectedCohort,
  selectedCompany,
  selectedRole,
  onSelectCohort,
  onSelectCompany,
  onSelectRole,
  onClearFilters,
}: StudentListHeaderProps) => {
  const insets = useSafeAreaInsets()
  const hasFilters = !!(selectedCohort || selectedCompany || selectedRole || search)

  return (
    <View
      className="border-b border-border bg-background pb-3"
      style={{ paddingTop: Math.max(insets.top, 8) }}
    >
      <View className="px-4 pb-3">
        <Text className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          Directory
        </Text>
        <Text className="mt-1 text-2xl font-bold tracking-tight text-foreground">
          Students
        </Text>
        <Text className="mt-1 text-sm text-muted-foreground">
          {resultCount}
          {totalCount != null && totalCount !== resultCount
            ? ` of ${totalCount}`
            : ''}{' '}
          member{resultCount === 1 ? '' : 's'}
        </Text>
        <View className="mt-3 h-0.5 w-16 bg-primary/40" />
      </View>

      <View className="mx-4 mb-3 flex-row items-center gap-2 rounded-xl border border-border bg-surface-elevated px-3">
        <Search size={18} color={colors.mutedForeground} />
        <TextInput
          value={search}
          onChangeText={onSearchChange}
          placeholder="Search by name…"
          placeholderTextColor={colors.mutedForeground}
          className="min-h-[44px] flex-1 text-base text-foreground"
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="never"
        />
        {search ? (
          <Pressable
            onPress={() => onSearchChange('')}
            hitSlop={8}
            accessibilityLabel="Clear search"
          >
            <X size={18} color={colors.mutedForeground} />
          </Pressable>
        ) : null}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        <Chip label="All" active={!selectedCohort && !selectedCompany && !selectedRole} onPress={onClearFilters} />
        {cohorts.slice(0, 8).map((c) => (
          <Chip
            key={c.id}
            label={c.label}
            active={selectedCohort === c.id}
            onPress={() => onSelectCohort(selectedCohort === c.id ? '' : c.id)}
          />
        ))}
        {roles.slice(0, 6).map((r) => (
          <Chip
            key={`role-${r.id}`}
            label={r.label}
            active={selectedRole === r.id}
            onPress={() => onSelectRole(selectedRole === r.id ? '' : r.id)}
          />
        ))}
        {companies.slice(0, 6).map((c) => (
          <Chip
            key={`co-${c.id}`}
            label={c.label}
            active={selectedCompany === c.id}
            onPress={() => onSelectCompany(selectedCompany === c.id ? '' : c.id)}
          />
        ))}
      </ScrollView>

      {hasFilters ? (
        <Pressable onPress={onClearFilters} className="mt-2 px-4">
          <Text className="text-xs font-medium text-primary">Clear filters</Text>
        </Pressable>
      ) : null}
    </View>
  )
}
