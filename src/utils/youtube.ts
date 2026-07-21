/** Extract a YouTube video id from common URL shapes or a raw id. */
export function extractYoutubeVideoId(
  youtubeUrl?: string | null,
  youtubeVideoId?: string | null,
): string | null {
  if (youtubeVideoId?.trim()) return youtubeVideoId.trim()
  if (!youtubeUrl?.trim()) return null

  const value = youtubeUrl.trim()
  if (/^[A-Za-z0-9_-]{6,}$/.test(value) && !value.includes('/')) return value

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{6,})/,
    /[?&]v=([A-Za-z0-9_-]{6,})/,
  ]

  for (const pattern of patterns) {
    const match = value.match(pattern)
    if (match?.[1]) return match[1]
  }

  return null
}

export function youtubeThumbnailUrl(videoId: string) {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
}
