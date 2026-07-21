import { LinearGradient } from 'expo-linear-gradient'
import { Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { HeaderBackButton } from '@/components/ui/HeaderBackButton'
import { colors } from '@/theme/colors'

export interface SubpageHeaderOptions {
  title: string
  eyebrow?: string
  subtitle?: string
}

interface StackHeaderProps {
  options: {
    title?: string
    headerTitle?: string | ((props: unknown) => React.ReactNode)
  }
  back?: { title?: string } | undefined
}

interface SubpageHeaderProps extends StackHeaderProps {
  eyebrow?: string
  subtitle?: string
  titleOverride?: string
}

export const SubpageHeader = ({
  options,
  back,
  eyebrow,
  subtitle,
  titleOverride,
}: SubpageHeaderProps) => {
  const insets = useSafeAreaInsets()
  const title =
    titleOverride ||
    (typeof options.headerTitle === 'string' ? options.headerTitle : null) ||
    options.title ||
    ''

  return (
    <View style={{ backgroundColor: colors.surface, paddingTop: insets.top }}>
      <LinearGradient
        colors={['rgba(213,63,140,0.10)', 'rgba(255,255,255,0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ paddingBottom: 14, paddingHorizontal: 12, paddingTop: 8 }}
      >
        <View className="flex-row items-center gap-3">
          {back ? <HeaderBackButton /> : <View className="h-11 w-11" />}

          <View className="min-w-0 flex-1 pr-2">
            {eyebrow ? (
              <Text className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                {eyebrow}
              </Text>
            ) : null}
            <Text
              className="text-lg font-bold tracking-tight text-foreground"
              numberOfLines={1}
            >
              {title}
            </Text>
            {subtitle ? (
              <Text className="mt-0.5 text-xs text-muted-foreground" numberOfLines={1}>
                {subtitle}
              </Text>
            ) : null}
          </View>
        </View>
      </LinearGradient>
      <View className="h-px bg-border" />
      <View className="h-0.5 w-16 bg-primary/40" />
    </View>
  )
}

export function subpageScreenOptions({
  title,
  eyebrow,
  subtitle,
}: SubpageHeaderOptions) {
  return {
    title,
    headerShadowVisible: false,
    header: (props: StackHeaderProps) => (
      <SubpageHeader
        {...props}
        titleOverride={title}
        eyebrow={eyebrow}
        subtitle={subtitle}
      />
    ),
    // Expo Router's NativeStack options are stricter than our local header props.
  } as Parameters<typeof import('expo-router').Stack.Screen>[0]['options']
}
