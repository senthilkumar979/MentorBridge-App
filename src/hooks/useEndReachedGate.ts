import { useCallback, useRef } from 'react'

/** Prevents FlatList/FlashList from firing pagination until the user is near the bottom. */
export function useEndReachedGate(options?: {
  minOffset?: number
  cooldownMs?: number
}) {
  const minOffset = options?.minOffset ?? 80
  const cooldownMs = options?.cooldownMs ?? 600
  const nearBottom = useRef(false)
  const lastFire = useRef(0)

  const onScroll = useCallback(
    (event: {
      nativeEvent: {
        contentOffset: { y: number }
        contentSize: { height: number }
        layoutMeasurement: { height: number }
      }
    }) => {
      const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent
      const distanceFromBottom =
        contentSize.height - (contentOffset.y + layoutMeasurement.height)
      nearBottom.current = distanceFromBottom <= minOffset
    },
    [minOffset],
  )

  const onEndReached = useCallback(
    (loadMore: () => void) => {
      if (!nearBottom.current) return
      const now = Date.now()
      if (now - lastFire.current < cooldownMs) return
      lastFire.current = now
      loadMore()
    },
    [cooldownMs],
  )

  return { onScroll, onEndReached }
}
