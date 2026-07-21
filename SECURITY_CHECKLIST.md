# Security checklist (pre-release)

- [ ] Production Clerk publishable key only in prod builds
- [ ] No Supabase service role / Clerk secret in the bundle
- [ ] All admin writes go through BFF with `requireAdmin` / `authenticateMobileAdmin`
- [ ] SecureStore used for Clerk tokens
- [ ] ProGuard/R8 enabled for Android release
- [ ] Sentry scrubbing configured for PII
- [ ] Play App Signing SHA256 set in `assetlinks.json` on web
- [ ] Penetration test before public Play release
