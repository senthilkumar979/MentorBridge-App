import type { SignInResource } from '@clerk/types'

export type CodeStrategy = 'email_code' | 'totp'

export async function startSecondFactor(
  signIn: SignInResource,
): Promise<CodeStrategy | null> {
  const factors = signIn.supportedSecondFactors ?? []
  const emailFactor = factors.find((f) => f.strategy === 'email_code')

  if (emailFactor && emailFactor.strategy === 'email_code') {
    await signIn.prepareSecondFactor({
      strategy: 'email_code',
      emailAddressId: emailFactor.emailAddressId,
    })
    return 'email_code'
  }

  if (factors.some((f) => f.strategy === 'totp')) return 'totp'
  return null
}

export function needsAdditionalVerification(status: string | null | undefined) {
  return status === 'needs_second_factor' || status === 'needs_client_trust'
}
