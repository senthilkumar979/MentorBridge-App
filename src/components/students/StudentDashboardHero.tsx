import { LinearGradient } from 'expo-linear-gradient'
import { Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { BrandLogo } from '@/components/ui/BrandLogo'

interface StudentDashboardHeroProps {
  greetingName?: string | null
  batch?: string | null
  pendingCount?: number
}

export const StudentDashboardHero = ({
  greetingName,
  batch,
  pendingCount = 0,
}: StudentDashboardHeroProps) => {
  const insets = useSafeAreaInsets()
  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <View className="overflow-hidden">
      <LinearGradient
        colors={['#fdf2f8', '#f8fafc', '#ffffff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingHorizontal: 16,
          paddingTop: Math.max(insets.top, 8) + 4,
          paddingBottom: 20,
        }}
      >
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: -40,
            right: -24,
            width: 160,
            height: 160,
            borderRadius: 80,
            backgroundColor: 'rgba(213,63,140,0.12)',
          }}
        />
        <BrandLogo height={30} />
        <Text className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          Learning hub
        </Text>
        <Text className="mt-2 text-3xl font-bold tracking-tight text-foreground">
          {greeting}
          {greetingName ? `, ${greetingName}` : ''}
        </Text>
        <Text className="mt-1 text-sm text-muted-foreground">
          {batch ? `Batch ${batch} · ` : ''}Your MentorBridge dashboard
        </Text>

        <View className="mt-4 flex-row gap-2">
          <View className="flex-1 rounded-2xl border border-border bg-surface px-3 py-3">
            <Text className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Today
            </Text>
            <Text className="mt-1 text-sm font-semibold text-foreground">
              {new Date().toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </Text>
          </View>
          <View className="flex-1 rounded-2xl border border-primary/20 bg-primary/5 px-3 py-3">
            <Text className="text-[10px] font-semibold uppercase tracking-wider text-primary">
              Pending
            </Text>
            <Text className="mt-1 text-2xl font-bold text-foreground">
              {pendingCount}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  )
}
