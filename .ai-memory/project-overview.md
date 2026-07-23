# Project Overview

**Name**: Kidoro  
**Type**: Kids streaming/learning mobile app  
**Platform**: React Native + Expo SDK 54  
**Language**: JavaScript (no TypeScript)  
**DB**: Supabase PostgreSQL (direct REST) — see `docs/SUPABASE_SCHEMA.md` for full schema  
**Backend Services**: `src/services/` (api, auth, child, video, shorts, playlist, analytics, reports, search, settings)  
**Custom Backend (fallback only)**: Next.js REST API at `http://localhost:3000` — only used when Supabase direct insert fails  

## Key Features
- Home screen with live backend categories, trending hero card, search
- YouTube video player (react-native-youtube-iframe) with video playback analytics
- TikTok-style shorts (expo-av Video) fetched live from backend
- Favorites persisted to backend & synced locally
- Child PIN gate (validated against `children` database table)
- Settings with streak tracking
- Playlists screen

## App Flow
```
Splash → AccessCode (backend validated) → MainTabs
  ├── Home → VideoPlayer, Search
  ├── Shorts
  ├── Favorites
  └── Settings → Playlists, Logout
```

## State Management
- `FavoritesContext` — wraps app, provides `isFavorite(id)` + `toggleFavorite(id)`
- AsyncStorage keys: `@kidoro_favorites`, `@kidoro_streak`
- No Redux/MobX/other state libs

## Package Management
Always use `npm install --legacy-peer-deps` (npm peer dep strictness breaks Expo SDK 54).
