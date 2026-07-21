import { describe, expect, it } from 'vitest'

import { getErrorMessage } from './errors'
import { colors } from '../theme/colors'

describe('theme tokens', () => {
  it('matches MentorBridge web primary pink', () => {
    expect(colors.primary).toBe('#d53f8c')
    expect(colors.background).toBe('#f8fafc')
    expect(colors.primaryStrong).toBe('#9d2765')
  })
})

describe('api error helper', () => {
  it('extracts Error messages', () => {
    expect(getErrorMessage(new Error('boom'))).toBe('boom')
  })

  it('falls back for unknown values', () => {
    expect(getErrorMessage(null)).toBe('Something went wrong')
  })
})
