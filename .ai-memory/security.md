# Security

## Data Storage
- All data stored locally via AsyncStorage
- No backend API, no server, no cloud storage
- Keys: `@kidoro_favorites`, `@kidoro_streak`
- No PII (no email, no accounts, no device IDs)
- No network requests (mock data only)

## Access Code
- Backend validation: PIN verified against `children` database table via Supabase REST API
- No default/hardcoded access keys
- Offline: falls back to cached child session; rejects unknown PINs
- Access code stored nowhere (user must re-enter on logout)

## Dependencies
- No tracking/analytics SDKs
- No ad networks
- All video data is mock/no real API calls
- YouTube iframe uses WebView (sandboxed)

## Recommendations for Production
- Add real authentication (Firebase/Auth0)
- Add content moderation for user-generated content
- Add SSL pinning for API calls
- Add rate limiting
- Move AsyncStorage to encrypted storage for production
