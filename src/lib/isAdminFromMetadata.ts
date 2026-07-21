/**
 * Shared admin detection — mirrors web `useIsAdmin` / navbar checks.
 * Accepts boolean or string flags and case-insensitive `role`.
 */
export function isAdminFromMetadata(
  metadata: Record<string, unknown> | null | undefined,
): boolean {
  if (!metadata) return false

  const role = metadata.role
  if (typeof role === 'string' && role.trim().toLowerCase() === 'admin') {
    return true
  }

  const flag = metadata.isAdmin
  return flag === true || flag === 'true' || flag === 1 || flag === '1'
}
