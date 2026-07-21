import { useEffect, useRef } from 'react'
import { Animated, View, type ViewProps } from 'react-native'

import { colors } from '@/theme/colors'

interface SkeletonProps extends ViewProps {
  className?: string
  height?: number
  width?: number | `${number}%`
  rounded?: number
}

/** Pulsing bone used to compose skeleton screens. */
export const Skeleton = ({
  className,
  height = 16,
  width = '100%',
  rounded = 10,
  style,
  ...props
}: SkeletonProps) => {
  const opacity = useRef(new Animated.Value(0.45)).current

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    )
    loop.start()
    return () => loop.stop()
  }, [opacity])

  return (
    <Animated.View
      className={className}
      style={[
        {
          height,
          width,
          borderRadius: rounded,
          backgroundColor: colors.muted,
          opacity,
        },
        style,
      ]}
      {...props}
    />
  )
}

const SkeletonCard = () => (
  <View className="mx-4 mb-3 overflow-hidden rounded-2xl border border-border bg-surface">
    <Skeleton height={128} rounded={0} />
    <View className="flex-row">
      <View className="w-[72px] items-center gap-2 border-r border-border py-4">
        <Skeleton height={10} width={36} />
        <Skeleton height={22} width={28} />
        <Skeleton height={10} width={32} />
      </View>
      <View className="flex-1 gap-2 px-3.5 py-3.5">
        <Skeleton height={16} width="78%" />
        <Skeleton height={12} width="42%" />
        <Skeleton height={12} width="90%" />
        <View className="mt-1 flex-row gap-2">
          <Skeleton height={10} width={64} />
          <Skeleton height={10} width={56} />
        </View>
      </View>
    </View>
  </View>
)

const SkeletonDetail = () => (
  <View className="flex-1 bg-background">
    <Skeleton height={224} rounded={0} />
    <View className="flex-row gap-2 px-4 py-4">
      <Skeleton height={72} width="31%" rounded={16} />
      <Skeleton height={72} width="31%" rounded={16} />
      <Skeleton height={72} width="31%" rounded={16} />
    </View>
    <View className="gap-3 px-4">
      <Skeleton height={48} rounded={16} />
      <Skeleton height={120} rounded={16} />
      <Skeleton height={56} rounded={16} />
      <Skeleton height={56} rounded={16} />
    </View>
  </View>
)

const SkeletonDashboard = () => (
  <View className="flex-1 bg-background pt-2">
    <View className="gap-3 px-4 pb-4">
      <Skeleton height={24} width={120} />
      <Skeleton height={32} width="70%" />
      <Skeleton height={14} width="45%" />
      <View className="mt-2 flex-row gap-2">
        <Skeleton height={72} width="48%" rounded={16} />
        <Skeleton height={72} width="48%" rounded={16} />
      </View>
    </View>
    <SkeletonCard />
    <View className="mt-2 flex-row flex-wrap justify-between px-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} height={108} width="48%" rounded={16} style={{ marginBottom: 12 }} />
      ))}
    </View>
  </View>
)

const SkeletonList = () => (
  <View className="flex-1 bg-background pt-3">
    <View className="mb-4 gap-2 px-4">
      <Skeleton height={12} width={88} />
      <Skeleton height={28} width="55%" />
      <Skeleton height={12} width="40%" />
    </View>
    <SkeletonCard />
    <SkeletonCard />
    <SkeletonCard />
  </View>
)

export type LoadingVariant = 'list' | 'detail' | 'dashboard'

interface LoadingStateProps {
  variant?: LoadingVariant
}

/** Full-screen skeleton used by pages while data loads. */
export const SkeletonLoadingState = ({ variant = 'list' }: LoadingStateProps) => {
  if (variant === 'detail') return <SkeletonDetail />
  if (variant === 'dashboard') return <SkeletonDashboard />
  return <SkeletonList />
}
