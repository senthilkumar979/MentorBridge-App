# MentorBridge Admin (Mobile)

Expo (React Native) admin app for MentorBridge. Authenticates with Clerk, calls the Mobile BFF at `/api/mobile/v1/*` on `https://www.mentorbridge.in`.

## Stack

- Expo SDK 57 + Expo Router
- NativeWind (Tailwind) theme matching web brand tokens
- Clerk Expo + SecureStore
- TanStack Query + Zustand
- Axios BFF client with Bearer JWT

## Setup

```bash
cp .env.example .env
# set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY and EXPO_PUBLIC_API_BASE_URL
npm install
npm start
```

## Theme

Tokens live in `src/theme/colors.ts` and `tailwind.config.js` — primary `#d53f8c`, canvas `#0b1120`.

## Backend prerequisite

Ship Bearer auth + `/api/mobile/v1` routes in the **MentorBridge Web** Next.js repo before feature screens work against production.

## Release (Android)

```bash
npx expo prebuild --platform android
cd android && ./gradlew bundleRelease
# Upload AAB to Play Console (Internal → Production)
```

iOS is personal/device-only (no public App Store listing).

## Security

- Never ship Supabase service role or Clerk secret in the app
- Admin gates are enforced server-side on every BFF route
