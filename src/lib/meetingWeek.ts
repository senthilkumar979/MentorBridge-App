const IST_TIMEZONE = 'Asia/Kolkata'

export const WEEK_DAY_NAMES = [
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
  'Sun',
] as const

export type WeekDayName = (typeof WEEK_DAY_NAMES)[number]

export interface WeekDay {
  key: string
  day: string
  month: string
  label: string
  dayName: WeekDayName
}

export function getTodayKeyIst(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: IST_TIMEZONE })
}

export function getDateKeyIst(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-CA', { timeZone: IST_TIMEZONE })
}

export function formatMeetingTimeIst(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleTimeString('en-IN', {
    timeZone: IST_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** Monday–Sunday bounds for the current week in Asia/Kolkata. */
export function getCurrentWeekBoundsIst(): {
  fromIso: string
  toIso: string
  weekDays: WeekDay[]
  monthLabel: string
  rangeLabel: string
} {
  const now = new Date()
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: IST_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  }).formatToParts(now)

  const get = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? '0'
  const year = Number(get('year'))
  const month = Number(get('month'))
  const day = Number(get('day'))
  const weekday = get('weekday')

  const weekdayToOffset: Record<string, number> = {
    Mon: 0,
    Tue: 1,
    Wed: 2,
    Thu: 3,
    Fri: 4,
    Sat: 5,
    Sun: 6,
  }
  const daysFromMonday = weekdayToOffset[weekday] ?? 0

  // Build calendar dates in local arithmetic from IST Y-M-D parts
  const mondayUtc = Date.UTC(year, month - 1, day - daysFromMonday)
  const weekDays: WeekDay[] = []

  for (let i = 0; i < 7; i++) {
    const d = new Date(mondayUtc + i * 24 * 60 * 60 * 1000)
    const y = d.getUTCFullYear()
    const m = d.getUTCMonth() + 1
    const dd = d.getUTCDate()
    const pad = (n: number) => n.toString().padStart(2, '0')
    const key = `${y}-${pad(m)}-${pad(dd)}`
    weekDays.push({
      key,
      day: pad(dd),
      month: pad(m),
      label: `${pad(dd)}/${pad(m)}`,
      dayName: WEEK_DAY_NAMES[i]!,
    })
  }

  const fromIso = `${weekDays[0]!.key}T00:00:00.000+05:30`
  const toIso = `${weekDays[6]!.key}T23:59:59.999+05:30`
  const monthLabel = new Date(fromIso).toLocaleDateString('en-IN', {
    month: 'long',
    timeZone: IST_TIMEZONE,
  })
  const rangeLabel = `${weekDays[0]!.label} – ${weekDays[6]!.label}`

  return { fromIso, toIso, weekDays, monthLabel, rangeLabel }
}
