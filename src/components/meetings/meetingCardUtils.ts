import { formatMeetingTimeIst } from '@/lib/meetingWeek'
import { MEETING_PLACEHOLDER_IMAGE_URL } from '@/constants/brand'

export function resolveMeetingCoverUrl(url?: string | null) {
  const trimmed = url?.trim()
  return trimmed || MEETING_PLACEHOLDER_IMAGE_URL
}

export function isUpcomingMeeting(date: string) {
  const t = new Date(date).getTime()
  return !Number.isNaN(t) && t >= Date.now() - 60 * 60 * 1000
}

export function isMeetingToday(date: string) {
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return false
  const now = new Date()
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  )
}

export function meetingDateParts(date: string) {
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) {
    return { weekday: '—', day: '—', month: '', time: date }
  }
  return {
    weekday: d.toLocaleDateString(undefined, { weekday: 'short' }),
    day: d.toLocaleDateString(undefined, { day: 'numeric' }),
    month: d.toLocaleDateString(undefined, { month: 'short' }),
    time: formatMeetingTimeIst(date),
  }
}

export function stripHtmlBlurb(value?: string) {
  return value
    ?.replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
