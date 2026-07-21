import { ChevronLeft } from 'lucide-react-native'
import { useRouter } from 'expo-router'
import { Pressable } from 'react-native'

import { colors } from '@/theme/colors'

interface HeaderBackButtonProps {
  className?: string
}

export const HeaderBackButton = ({ className }: HeaderBackButtonProps) => {
  const router = useRouter()
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Go back"
      onPress={() => router.back()}
      className={`h-11 w-11 items-center justify-center rounded-full border border-border bg-background active:opacity-80 ${className ?? ''}`}
      hitSlop={8}
    >
      <ChevronLeft size={22} color={colors.foreground} strokeWidth={2.25} />
    </Pressable>
  )
}
