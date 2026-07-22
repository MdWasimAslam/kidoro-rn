# Project Overview

**Name**: Kidoro  
**Type**: Kids streaming/learning mobile app  
**Platform**: React Native + Expo SDK 54  
**Language**: JavaScript (no TypeScript)  
**DB**: AsyncStorage (local only, no backend)  

## Key Features
- Home screen with categories, trending hero card, search
- YouTube video player (react-native-youtube-iframe)
- TikTok-style shorts (expo-av Video)
- Favorites persisted to AsyncStorage
- Access code gate (mock: code "1234")
- Settings with streak tracking
- Playlists screen

## App Flow
```
Splash → AccessCode (1234) → MainTabs
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
