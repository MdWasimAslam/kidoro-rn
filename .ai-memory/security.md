# Security

## Data Storage
- Favorites stored locally via AsyncStorage scoped by parent access key (`@kidoro_favorites_${accessKey}`)
- Child session cached in memory + AsyncStorage (`@kidoro_child_session`)
- Continue-watching history stored in AsyncStorage scoped by parent access key (`@kidoro_continue_watching_${accessKey}`)
- Streak data stored in AsyncStorage (`@kidoro_streak`)
- Analytics events queued in AsyncStorage if network fails (`@kidoro_analytics_queue`)
- No PII beyond child name/age (no email, no accounts, no device IDs)

## Network Requests
- **Supabase REST API**: All content (videos, shorts, categories, children, config) fetched over HTTPS from `https://uhqgqllpovhoesfvkgvv.supabase.co` with automatic `access_key` query filters
- **Custom backend (fallback)**: Analytics POST to `http://localhost:3000/api/analytics/track` (only when Supabase direct insert fails)
- **YouTube embeds**: `react-native-youtube-iframe` WebView (sandboxed) for video playback
- **YouTube thumbnails**: `https://img.youtube.com/vi/{id}/hqdefault.jpg` for video/short thumbnails
- **Analytics events**: POST directly to `analytics_events` Supabase table (preferred path)

## Access Code & Tenant Isolation
- Every parent account has a unique `access_key` (tenant identifier)
- Every resource is isolated and filtered using the authenticated parent's `access_key`
- Database triggers automatically populate `access_key` from `profiles` based on `parent_id`
- Direct REST API queries from the mobile app automatically append `access_key=eq.${activeChild.access_key}` for tenant isolation
- **Server-Side JWT Enforcement**: Next.js dashboard route handlers resolve access keys securely from the authenticated JWT session or database, ignoring arbitrary client-supplied keys to prevent data injection/leakage.
- PIN validation: child profile is verified against database
- **Cache Isolation**: The mobile app clears all in-memory cache and AsyncStorage (child sessions, continue-watching, favorites) during logout or child profile switches to prevent data leaking between parents/children.
- Offline mode: falls back to cached child session; rejects unknown PINs

## Dependencies
- No ad networks
- No third-party tracking SDKs (analytics is self-hosted to Supabase)
- YouTube iframe uses WebView (sandboxed)
- Supabase anon key is publishable and visible in the app bundle (by design — Row Level Security protects data)

## Recommendations for Production
- Add real authentication (Firebase/Auth0)
- Add content moderation for user-generated content
- Add SSL pinning for API calls
- Add rate limiting
- Move AsyncStorage to encrypted storage for production
- Replace publishable anon key with user-scoped JWTs via Supabase Auth
