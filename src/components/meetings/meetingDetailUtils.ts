import { Linking } from 'react-native'

/** Open a URL in the device’s default external browser. */
export function openExternalUrl(url?: string | null) {
  const raw = url?.trim()
  if (!raw) return
  const href = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
  void Linking.openURL(href)
}

export function isUpcomingMeeting(date: string) {
  const t = new Date(date).getTime()
  return !Number.isNaN(t) && t >= Date.now() - 60 * 60 * 1000
}

export function formatMeetingWhen(date: string) {
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return { dateLabel: date, timeLabel: '' }
  return {
    dateLabel: d.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    timeLabel: d.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    }),
  }
}
