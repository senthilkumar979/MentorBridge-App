import { LinearGradient } from 'expo-linear-gradient'
import { Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { BrandLogo } from '@/components/ui/BrandLogo'
import { colors } from '@/theme/colors'

interface DashboardHeroProps {
  greetingName?: string | null
  subtitle?: string
}

export const DashboardHero = ({
  greetingName,
  subtitle = 'Operational pulse for MentorBridge',
}: DashboardHeroProps) => {
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
            top: -50,
            right: -20,
            width: 180,
            height: 180,
            borderRadius: 90,
            backgroundColor: 'rgba(213,63,140,0.12)',
          }}
        />
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            bottom: 10,
            left: -40,
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: 'rgba(14,165,233,0.08)',
          }}
        />

        <BrandLogo height={30} />
        <Text className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          Command center
        </Text>
        <Text className="mt-2 text-3xl font-bold tracking-tight text-foreground">
          {greeting}
          {greetingName ? `, ${greetingName}` : ''}
        </Text>
        <Text className="mt-1 text-sm text-muted-foreground">{subtitle}</Text>
        <View className="mt-4 self-start rounded-full border border-border bg-surface/70 px-3 py-1.5">
          <Text className="text-xs font-medium" style={{ color: colors.mutedForeground }}>
            {new Date().toLocaleDateString(undefined, {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>
      </LinearGradient>
    </View>
  )
}
