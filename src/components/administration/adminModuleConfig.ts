export interface AdminFormField {
  key: string
  label: string
  placeholder?: string
  required?: boolean
  multiline?: boolean
  keyboardType?: 'default' | 'email-address' | 'phone-pad'
}

export interface AdminModuleConfig {
  title: string
  eyebrow: string
  canCreate: boolean
  createLabel: string
  fields: AdminFormField[]
}

const f = (
  key: string,
  label: string,
  opts: Partial<AdminFormField> = {},
): AdminFormField => ({ key, label, ...opts })

export const ADMIN_MODULE_CONFIG: Record<string, AdminModuleConfig> = {
  'google-groups': {
    title: 'Google Groups',
    eyebrow: 'Administration',
    canCreate: true,
    createLabel: 'New group',
    fields: [
      f('name', 'Name', { placeholder: 'e.g. Frontend Team', required: true }),
      f('email', 'Email', {
        placeholder: 'group@mentorbridge.in',
        required: true,
        keyboardType: 'email-address',
      }),
    ],
  },
  partners: {
    title: 'Partners',
    eyebrow: 'Administration',
    canCreate: true,
    createLabel: 'New partner',
    fields: [
      f('name', 'Contact name', { placeholder: 'Full name', required: true }),
      f('company', 'Company', { placeholder: 'Company name', required: true }),
      f('location', 'Location', { placeholder: 'City / country', required: true }),
      f('primary_email', 'Primary email', {
        placeholder: 'name@company.com',
        keyboardType: 'email-address',
      }),
      f('primary_contact', 'Primary phone', {
        placeholder: '+91 …',
        keyboardType: 'phone-pad',
      }),
      f('designation', 'Designation', { placeholder: 'Role / title' }),
      f('category', 'Category', { placeholder: 'e.g. Hiring partner' }),
      f('description', 'Notes', { placeholder: 'Optional notes', multiline: true }),
    ],
  },
  presenters: {
    title: 'Presenters',
    eyebrow: 'Administration',
    canCreate: true,
    createLabel: 'New presenter',
    fields: [
      f('presented_by', 'Student email', {
        placeholder: 'student@email.com',
        required: true,
        keyboardType: 'email-address',
      }),
      f('presented_date', 'Presentation date', {
        placeholder: 'YYYY-MM-DD',
        required: true,
      }),
      f('topic', 'Topic', { placeholder: 'Session topic', required: true }),
    ],
  },
  awards: {
    title: 'Awards',
    eyebrow: 'Administration',
    canCreate: true,
    createLabel: 'New award',
    fields: [
      f('awarded_to', 'Recipient email', {
        placeholder: 'student@email.com',
        required: true,
        keyboardType: 'email-address',
      }),
      f('awarded_on', 'Awarded on', { placeholder: 'YYYY-MM-DD', required: true }),
      f('description', 'Description', {
        placeholder: 'What was awarded',
        required: true,
        multiline: true,
      }),
      f('award_category_id', 'Category ID', { placeholder: 'Optional category UUID' }),
    ],
  },
  'award-categories': {
    title: 'Award Categories',
    eyebrow: 'Administration',
    canCreate: true,
    createLabel: 'New category',
    fields: [f('name', 'Name', { placeholder: 'e.g. Best Performer', required: true })],
  },
  'hall-of-fame': {
    title: 'Hall of Fame',
    eyebrow: 'Administration',
    canCreate: false,
    createLabel: 'New entry',
    fields: [],
  },
  'visitor-queries': {
    title: 'Visitor Queries',
    eyebrow: 'Administration',
    canCreate: false,
    createLabel: 'New',
    fields: [],
  },
}

export function getAdminModuleConfig(module?: string): AdminModuleConfig {
  if (module && ADMIN_MODULE_CONFIG[module]) return ADMIN_MODULE_CONFIG[module]
  return {
    title: module ?? 'Module',
    eyebrow: 'Administration',
    canCreate: false,
    createLabel: 'New',
    fields: [],
  }
}
