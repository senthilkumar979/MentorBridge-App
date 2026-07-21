export interface AdminDetailRow {
  label: string
  value: string
}

export interface AdminItemPresentation {
  title: string
  details: AdminDetailRow[]
}

function str(value: unknown) {
  if (typeof value === 'string' && value.trim()) return value.trim()
  if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  return ''
}

function formatDate(value: unknown) {
  const raw = str(value)
  if (!raw) return ''
  const d = new Date(raw)
  if (Number.isNaN(d.getTime())) return raw
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function rows(entries: Array<[string, string]>): AdminDetailRow[] {
  return entries
    .filter(([, value]) => Boolean(value))
    .map(([label, value]) => ({ label, value }))
}

export function presentAdminItem(
  module: string,
  item: Record<string, unknown>,
): AdminItemPresentation {
  switch (module) {
    case 'google-groups':
      return {
        title: str(item.name) || 'Untitled group',
        details: rows([
          ['Email', str(item.email)],
          ['Group ID', str(item.id)],
        ]),
      }
    case 'partners':
      return {
        title: str(item.name) || str(item.company) || 'Partner',
        details: rows([
          ['Company', str(item.company)],
          ['Location', str(item.location)],
          ['Category', str(item.category)],
          ['Designation', str(item.designation)],
          ['Primary email', str(item.primary_email)],
          ['Primary phone', str(item.primary_contact)],
          ['Secondary email', str(item.secondary_email)],
          ['Secondary phone', str(item.secondary_contact)],
          ['Notes', str(item.description)],
        ]),
      }
    case 'presenters':
      return {
        title: str(item.topic) || 'Presentation',
        details: rows([
          ['Presented by', str(item.presented_by)],
          ['Date', formatDate(item.presented_date)],
          ['Presenter ID', str(item.id)],
        ]),
      }
    case 'awards':
      return {
        title: str(item.awarded_to) || 'Award',
        details: rows([
          ['Description', str(item.description)],
          ['Awarded on', formatDate(item.awarded_on)],
          ['Category ID', str(item.award_category_id)],
          ['Award ID', str(item.id)],
        ]),
      }
    case 'award-categories':
      return {
        title: str(item.name) || 'Category',
        details: rows([['Category ID', str(item.id)]]),
      }
    case 'hall-of-fame':
      return {
        title: str(item.student_email) || 'Inductee',
        details: rows([
          ['Induction date', formatDate(item.date_of_induction)],
          ['Role', str(item.role)],
          ['Company', str(item.company)],
          ['Entry ID', str(item.id)],
        ]),
      }
    default:
      return {
        title:
          str(item.name) ||
          str(item.title) ||
          str(item.email) ||
          str(item.company) ||
          'Item',
        details: rows([
          ['Email', str(item.email)],
          ['Company', str(item.company)],
          ['Status', str(item.status)],
          ['ID', str(item.id)],
        ]),
      }
  }
}

export function buildCreatePayload(
  fields: Array<{ key: string; required?: boolean }>,
  values: Record<string, string>,
) {
  const payload: Record<string, unknown> = {}
  const missing: string[] = []

  for (const field of fields) {
    const raw = (values[field.key] ?? '').trim()
    if (!raw) {
      if (field.required) missing.push(field.key)
      continue
    }
    payload[field.key] = raw
  }

  if (missing.length) {
    throw new Error(`Missing required: ${missing.join(', ')}`)
  }

  if (fields.some((f) => f.key === 'primary_email')) {
    if (!payload.primary_email && !payload.primary_contact) {
      throw new Error('Provide a primary email or primary phone')
    }
  }

  return payload
}
