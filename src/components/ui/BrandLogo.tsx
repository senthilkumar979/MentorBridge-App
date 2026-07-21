import { Image } from 'expo-image'
import { View } from 'react-native'

import {
  MENTORBRIDGE_LONG_LOGO_URL,
  APP_DISPLAY_NAME,
} from '@/constants/brand'
import { Text } from 'react-native'

interface BrandLogoProps {
  height?: number
  showSubtitle?: boolean
}

export const BrandLogo = ({ height = 40, showSubtitle = false }: BrandLogoProps) => (
  <View className="items-center gap-2">
    <Image
      source={{ uri: MENTORBRIDGE_LONG_LOGO_URL }}
      style={{ width: height * 5.5, height }}
      contentFit="contain"
      accessibilityLabel="MentorBridge"
    />
    {showSubtitle ? (
      <Text className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
        {APP_DISPLAY_NAME}
      </Text>
    ) : null}
  </View>
)
