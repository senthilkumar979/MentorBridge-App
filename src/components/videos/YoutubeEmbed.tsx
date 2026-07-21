import { useCallback, useState } from 'react'
import { ActivityIndicator, View, useWindowDimensions } from 'react-native'
import YoutubePlayer from 'react-native-youtube-iframe'

import { colors } from '@/theme/colors'

interface YoutubeEmbedProps {
  videoId: string
  autoplay?: boolean
  height?: number
}

export const YoutubeEmbed = ({
  videoId,
  autoplay = false,
  height,
}: YoutubeEmbedProps) => {
  const { width } = useWindowDimensions()
  const playerHeight = height ?? Math.round(((width - 32) * 9) / 16)
  const [ready, setReady] = useState(false)

  const onReady = useCallback(() => setReady(true), [])

  return (
    <View
      className="overflow-hidden rounded-2xl border border-border bg-black"
      style={{ height: playerHeight }}
    >
      {!ready ? (
        <View className="absolute inset-0 z-10 items-center justify-center bg-surface">
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : null}
      <YoutubePlayer
        height={playerHeight}
        width={width - 32}
        videoId={videoId}
        play={autoplay}
        onReady={onReady}
        webViewProps={{
          allowsInlineMediaPlayback: true,
          mediaPlaybackRequiresUserAction: false,
        }}
      />
    </View>
  )
}
