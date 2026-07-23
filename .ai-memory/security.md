# Security

## Data Storage
- Favorites stored locally via AsyncStorage (`@kidoro_favorites`)
- Child session cached in memory + AsyncStorage (`@kidoro_child_session`)
- Continue-watching history stored in AsyncStorage (`@kidoro_continue_watching`)
- Streak data stored in AsyncStorage (`@kidoro_streak`)
- Analytics events queued in AsyncStorage if network fails (`@kidoro_analytics_queue`)
- No PII beyond child name/age (no email, no accounts, no device IDs)

## Network Requests
- **Supabase REST API**: All content (videos, shorts, categories, children, config) fetched over HTTPS from `https://uhqgqllpovhoesfvkgvv.supabase.co`
- **Custom backend (fallback)**: Analytics POST to `http://localhost:3000/api/analytics/track` (only when Supabase direct insert fails)
- **YouTube embeds**: `react-native-youtube-iframe` WebView (sandboxed) for video playback
- **YouTube thumbnails**: `https://img.youtube.com/vi/{id}/hqdefault.jpg` for video/short thumbnails
- **Analytics events**: POST directly to `analytics_events` Supabase table (preferred path)

## Access Code
- Backend validation: PIN verified against `children` database table via Supabase REST API
- No default/hardcoded access keys
- Offline: falls back to cached child session; rejects unknown PINs
- Access code stored nowhere (user must re-enter on logout)

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
