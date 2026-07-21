import { useRouter } from 'expo-router'
import { ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import {
  ADMIN_MODULES,
  AdministrationModuleCard,
} from '@/components/administration/AdministrationModules'
import { StudentModeToggle } from '@/components/administration/StudentModeToggle'
import { HeaderBackButton } from '@/components/ui/HeaderBackButton'
import { useAppStore } from '@/stores/appStore'

export default function AdministrationHub() {
  const router = useRouter()
  const featured = ADMIN_MODULES[0]
  const studentModePreview = useAppStore((s) => s.studentModePreview)
  const setStudentModePreview = useAppStore((s) => s.setStudentModePreview)

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-background">
      <ScrollView contentContainerClassName="pb-8" showsVerticalScrollIndicator={false}>
        <View className="border-b border-border px-4 pb-4 pt-2">
          <HeaderBackButton className="mb-3" />
          <Text className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Operations
          </Text>
          <Text className="mt-1 text-3xl font-bold tracking-tight text-foreground">
            Administration
          </Text>
          <Text className="mt-1 text-sm text-muted-foreground">
            Program tooling and content modules
          </Text>
          <View className="mt-3 h-0.5 w-16 bg-primary/40" />

          <View className="mt-4 flex-row gap-2">
            <View className="flex-1 rounded-2xl border border-border bg-surface px-3 py-3">
              <Text className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Modules
              </Text>
              <Text className="mt-1 text-2xl font-bold text-foreground">
                {ADMIN_MODULES.length}
              </Text>
            </View>
            <View className="flex-1 rounded-2xl border border-primary/20 bg-primary/5 px-3 py-3">
              <Text className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                Focus
              </Text>
              <Text className="mt-1 text-base font-bold text-foreground" numberOfLines={1}>
                {featured.label}
              </Text>
            </View>
          </View>
        </View>

        <View className="mt-4 px-4">
          <Text className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Preview
          </Text>
          <StudentModeToggle
            enabled={studentModePreview}
            onChange={(enabled) => {
              setStudentModePreview(enabled)
              if (enabled) router.replace('/(student)/(tabs)/home')
            }}
          />
        </View>

        <View className="mt-5 px-4">
          <Text className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            All modules
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {ADMIN_MODULES.map((module) => (
              <AdministrationModuleCard
                key={module.href}
                module={module}
                onPress={() => router.push(module.href as never)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
