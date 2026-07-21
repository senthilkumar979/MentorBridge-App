/** MentorBridge brand tokens — light theme, primary pink matches web */
export const colors = {
  primary: '#d53f8c',
  primaryStrong: '#9d2765',
  primaryForeground: '#ffffff',
  secondary: '#111827',
  secondaryForeground: '#f9fafb',
  background: '#f8fafc',
  foreground: '#0f172a',
  muted: '#f1f5f9',
  mutedForeground: '#64748b',
  success: '#16a34a',
  successForeground: '#ecfdf3',
  error: '#dc2626',
  errorForeground: '#fef2f2',
  warning: '#cea500',
  warningForeground: '#1f2937',
  info: '#0ea5e9',
  infoForeground: '#ecfeff',
  surface: '#ffffff',
  surfaceElevated: '#f1f5f9',
  border: '#e2e8f0',
} as const

export type ColorToken = keyof typeof colors
