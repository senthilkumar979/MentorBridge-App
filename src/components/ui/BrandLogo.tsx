import { Image } from "expo-image";
import { View } from "react-native";

import {
  MENTORBRIDGE_LONG_LOGO_URL,
  APP_DISPLAY_NAME,
} from "@/constants/brand";
import { Text } from "react-native";

interface BrandLogoProps {
  height?: number;
  showSubtitle?: boolean;
}

export const BrandLogo = ({
  height = 60,
  showSubtitle = false,
}: BrandLogoProps) => (
  <View className="items-center gap-2">
    <Image
      source={{ uri: MENTORBRIDGE_LONG_LOGO_URL }}
      style={{ width: height * 7.5, height }}
      contentFit="contain"
      accessibilityLabel="MentorBridge"
    />
  </View>
);
