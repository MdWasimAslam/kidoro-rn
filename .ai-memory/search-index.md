# Search Index

## Quick Navigation
| What | Where |
|------|-------|
| App entry | `App.js` → wraps providers + navigator |
| Navigation setup | `src/navigation/AppNavigator.js`, `src/navigation/BottomTabs.js` |
| Theme tokens | `src/constants/theme.js` |
| Video data (source of truth) | Supabase `videos` table via `src/services/video.service.js` |
| Video generator | Supabase `videos` table via `src/services/video.service.js` |
| Shorts generator | Supabase `shorts` table via `src/services/shorts.service.js` |
| Categories | Supabase `categories` table via `src/services/category.service.js` |
| Kid profile | Supabase `children` table via `src/services/child.service.js` |
| Profile/Settings | Supabase `children` table (cached in memory + AsyncStorage) via `src/services/settings.service.js` |
| App config | Supabase `app_config` table via `src/services/api.js` (getAppConfig) |
| Favorites logic | `src/context/FavoritesContext.js`, `src/hooks/useFavorites.js` |
| Continue watching | `src/context/ContinueWatchingContext.js` — AsyncStorage persistence |
| Analytics | `src/services/analytics.service.js` (Supabase direct insert → backend API → queue) |
| Full DB Schema | `docs/SUPABASE_SCHEMA.md` — complete column-level reference for all tables |
| Error boundary | `src/components/ErrorBoundary.js` |
| Responsive utils | `src/utils/responsive.js` — `useResponsive()`, `useCardSizes()` |
| Storage | `src/utils/storage.js` — Cross-platform (AsyncStorage → localStorage → memory) |
| Babel config | `babel.config.js` (expo + reanimated plugin) |
| Icon generator | `scripts/generate-icons.js` |
| ESLint config | `.eslintrc.js` |
| Expo config | `app.json` |

## Screens (10)
```
src/screens/SplashScreen.js         — Logo animation → AccessCode after 2s
src/screens/AccessCodeScreen.js     — Code gate (backend validated)
src/screens/HomeScreen.js           — Infinite scroll grid (hero + continue watching header, 2-col recommended)
src/screens/ShortsScreen.js         — Vertical paging, 12 shorts, auto-play (MP4 URLs)
src/screens/VideoPlayerScreen.js    — YouTube iframe + suggested videos
src/screens/FavoritesScreen.js      — Grid from context
src/screens/SettingsScreen.js       — Streak + profile + content + info
src/screens/SearchScreen.js         — Live search + debounce
src/screens/PlaylistsScreen.js      — Playlist cards (table exists, empty)
src/screens/GamesScreen.js          — Quiz (quizzes table does NOT exist)
```

## Key Hooks
- `useFavorites()` → AsyncStorage `@kidoro_favorites`, returns `{favoriteIds, loaded, isFavorite, toggleFavorite}`
- `useFavoritesContext()` → shortcut to context
- `useContinueWatchingContext()` → `{recentVideos, recordWatched, loadHistory}`
- `useStreak()` → streak tracking in AsyncStorage
- `useYouTubeMode()` → YT icon toggle

## Key Patterns
- AsyncStorage keys: `@kidoro_favorites`, `@kidoro_streak`, `@kidoro_continue_watching`, `@kidoro_analytics_queue`
- `require()` for JSON imports (not `import`)
- `React.memo` on all components
- `useCallback` with full dep arrays
- FlatList `extraData` for dynamic content
- `npx expo export --platform web` to verify builds
- All animations use `useNativeDriver: true`
