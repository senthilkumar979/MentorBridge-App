import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { Text, View } from 'react-native'

import { colors } from '@/theme/colors'

interface StudentAvatarProps {
  name: string
  picture?: string | null
  size?: number
  rounded?: 'full' | 'xl'
}

export const StudentAvatar = ({
  name,
  picture,
  size = 56,
  rounded = 'full',
}: StudentAvatarProps) => {
  const radius = rounded === 'full' ? size / 2 : 16
  const initial = (name?.trim()?.charAt(0) || '?').toUpperCase()

  if (picture) {
    return (
      <Image
        source={{ uri: picture }}
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: colors.muted,
        }}
        contentFit="cover"
        transition={200}
        accessibilityLabel={`${name} photo`}
      />
    )
  }

  return (
    <LinearGradient
      colors={['#d53f8c', '#9d2765', '#1e293b']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          color: colors.primaryForeground,
          fontSize: size * 0.38,
          fontWeight: '700',
        }}
      >
        {initial}
      </Text>
    </LinearGradient>
  )
}
