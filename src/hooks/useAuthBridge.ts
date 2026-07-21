import { useAuth, useUser } from '@clerk/clerk-expo'
import { useQuery } from '@tanstack/react-query'

import { setApiTokenGetter } from '@/api/client'
import { fetchMe } from '@/api/endpoints'
import { isAdminFromMetadata } from '@/lib/isAdminFromMetadata'

/**
 * Keep the Axios bearer getter aligned with Clerk session.
 * Set during render (not only in useEffect) so /me cannot race ahead without a token.
 */
export function useApiAuthBridge() {
  const { getToken, isSignedIn } = useAuth()

  setApiTokenGetter(async () => {
    if (!isSignedIn) return null
    return getToken()
  })
}

export function useMe() {
  const { isSignedIn, isLoaded } = useAuth()
  return useQuery({
    queryKey: ['me'],
    queryFn: fetchMe,
    enabled: isLoaded && !!isSignedIn,
    staleTime: 60_000,
    retry: (failureCount, error) => {
      const status = (error as { status?: number }).status
      if (status === 401 && failureCount < 2) return true
      return failureCount < 1
    },
  })
}

/** Server `/me` flag, with Clerk client metadata fallback for admin provisioning. */
export function useIsAdminAccess(): {
  isLoaded: boolean
  isAdmin: boolean
  hasLinkedStudent: boolean
  meError: boolean
} {
  const { isLoaded: authLoaded, isSignedIn } = useAuth()
  const { user, isLoaded: userLoaded } = useUser()
  const me = useMe()

  const clientAdmin = isAdminFromMetadata(
    user?.publicMetadata as Record<string, unknown> | undefined,
  )
  const serverAdmin = Boolean(me.data?.isAdmin)
  const isAdmin = serverAdmin || clientAdmin

  // Admins can enter from Clerk metadata without waiting on /me.
  // Students must wait for /me so we know linkedStudent.
  const isLoaded =
    authLoaded &&
    (!isSignedIn ||
      (userLoaded && (clientAdmin || me.isSuccess || me.isError)))

  return {
    isLoaded,
    isAdmin,
    hasLinkedStudent: Boolean(me.data?.linkedStudent?.id),
    meError: me.isError,
  }
}
