# Change Log

## 2026-07-23 — App Config Fixes: SettingsScreen Bug + BASE_URL Fixed
- **Fixed**: `SettingsScreen.js` — `appConfig?.features` → `appConfig?.config?.features` — dark mode `enableDarkMode` config value was never respected because `features` is nested under `.config` in the context object
- **Fixed**: `api.js` — `BASE_URL` default changed from `http://10.0.2.2:3000` (Android emulator only) to `http://localhost:3000` (works on all platforms). Custom backend WAS running on localhost:3000 but `10.0.2.2` doesn't resolve on Windows

## 2026-07-23 — API Fixes: Child Profile Data & Credential Fallbacks
- **Fixed**: `api.js` — exported `SUPABASE_ANON_KEY` for reuse across service modules
- **Fixed**: `auth.service.js` — replaced empty string ANON key fallback with `SUPABASE_ANON_KEY` imported from `api.js` (was crashing parent login on missing env var)
- **Fixed**: `video.service.js` — removed dynamic `require('./api')` inside `toggleFavorite`, replaced empty string fallbacks with `SUPABASE_ANON_KEY`/`SUPABASE_URL` imports, fixed `Authorization` header using empty token
- **Fixed**: `child.service.js` — added `status: 'eq.active'` and `deleted_at: 'is.null'` filters to `verifyAccessCode` query (was matching soft-deleted/inactive children)
- **Fixed**: `notification.service.js` — moved `require('./api')` from inside function to module top (consistent with all other services)
- **Added**: `quiz.service.js` — new service wrapping `supabaseRest('quizzes', ...)` with proper error handling
- **Fixed**: `GamesScreen.js` — replaced direct `supabaseRest` import with `quizService` (follows service-layer pattern)
- **Fixed**: `SettingsScreen.js` — decoupled profile loading from video loading so one failure doesn't block the other; `.catch()` resets to proper defaults
- **Fixed**: `api.js` — added in-memory `_cachedChild` cache + `setActiveChild()` function as belt-and-suspenders against storage write failures
- **Fixed**: `child.service.js` — `verifyAccessCode` and `selectChild` now use `setActiveChild()` (cache + persist) instead of direct `storage.setItem`
- **Fixed**: `auth.service.js` — `logout()` now calls `setActiveChild(null)` to clear the in-memory cache on logout

## 2026-07-23 — Poppins Font Integration
- **Added**: `expo-font`, `@expo-google-fonts/poppins` packages
- **Added**: `FontLoader` component in `App.js` — blocks render until 5 Poppins weights loaded (400/500/600/700/800)
- **Updated**: `theme.js` TYPOGRAPHY — all 14 presets now include `fontFamily` (Poppins weight-matched)
- **Updated**: `theme.js` SYSTEM_FONT → `'Poppins_400Regular'`
- **Updated**: `SplashScreen.js` — title/tagline/footerText now use Poppins font families
- **Updated**: `AccessCodeCard.js`, `SearchBar.js`, `SearchScreen.js` inputs use `SYSTEM_FONT` (Poppins)

## 2026-07-23 — Production Stability Audit & Fixes
- **Fixed**: `GamesScreen` crash (`SIZES.radius` → `SIZES.radiusLg`)
- **Fixed**: `theme.test.js` assertion mismatch (label fontWeight: 500 → 600)
- **Fixed**: `auth.service.js` wrong Supabase URL (lyvjygwygwlyygvw → uhqgqllpovhoesfvkgvv)
- **Fixed**: `storage.js` not using AsyncStorage (all native data lost on restart, critical)
- **Fixed**: `SplashScreen` race condition + dynamic require → static imports
- **Fixed**: `SearchScreen` broken favorite toggle + no debounce → 400ms debounce + useFavoritesContext
- **Fixed**: `FavoritesScreen` pull-to-refresh (fake 500ms → real `loadFavorites()`)
- **Fixed**: `ELEVATION` missing from `getTheme()` return (dark mode broken for shadows)
- **Fixed**: `.eslintrc.js` ignoring entire `src/` directory → removed from ignorePatterns
- **Fixed**: `PlaylistCard` NaN crash on bad playlist ID
- **Removed**: Duplicate `utils/analyticsService.js` (unused class-based analytics)
- **Removed**: Dead components: `CategoryRow`, `PlayerControls`, `ProfileCard`
- **Removed**: Obsolete `mock.test.js` (tested removed mock data)
- **Added**: `ErrorBoundary` component + wrapped in `App.js`
- **Added**: `GamesScreen` registered in `AppNavigator`
- **Cleaned**: All `console.log/warn/error` calls from 14 files (production pollution)
- **Cleaned**: Recreated `MaintenanceScreen` (was deleted with other dead components but referenced by App.js)

## 2026-07-23 — File Structure Cleanup
- **Moved**: 14 loose root `.md` files into `docs/` and `docs/reports/`
- **Kept in root**: `AGENTS.md`, `CHANGELOG.md`, `CLAUDE.md`
- **Updated**: `CHANGELOG.md` references to new paths, `.ai-memory/folder-structure.md`

## 2026-07-23 — Removed Default Access Key
- **Modified**: `src/components/AccessCodeCard.js`, `src/services/child.service.js`
- **Summary**: Removed hardcoded default PIN `1234` and all fallback validation that accepted arbitrary 4-6 digit codes. Access now requires a genuine access code validated against the Supabase `children` table. Offline mode only accepts a previously cached child session.

## 2026-07-23 — Next.js Admin Backend Integration & Mock Cleanup
- **Added**: `src/services/api.js`, `auth.service.js`, `child.service.js`, `category.service.js`, `video.service.js`, `shorts.service.js`, `playlist.service.js`, `analytics.service.js`, `reports.service.js`, `search.service.js`, `notification.service.js`, `settings.service.js`
- **Removed**: Entire `src/mock/` folder (`categories.js`, `profile.js`, `shorts.js`, `videodata.json`, `videos.js`)
- **Modified**: `HomeScreen.js`, `AccessCodeScreen.js`, `AccessCodeCard.js`, `ShortsScreen.js`, `SearchScreen.js`, `PlaylistsScreen.js`, `FavoritesScreen.js`, `SettingsScreen.js`, `VideoPlayerScreen.js`, `SplashScreen.js`
- **Summary**: Fully connected mobile app to Next.js API & Supabase REST services. Removed 100% of dummy data. Added offline event queue for analytics. Verified with web build export.

## 2026-07-22 — Infinite Scroll Home Redesign
- **Modified**: `src/screens/HomeScreen.js` (rewritten)
- **Summary**: Replaced 13 horizontal CategoryRow sections with single virtualized FlatList. Header = greeting + search + chips + trending hero + Continue Watching (horizontal). Body = 2-col recommended grid with infinite scroll (onEndReached loads 10 more). Pull-to-refresh reshuffles. Tracks shown IDs to avoid duplicates.

## 2026-07-22 — Full Responsive Audit & Fix
- **Added**: `src/utils/responsive.js` (useResponsive, useCardSizes)
- **Modified**: VideoCard, CategoryRow, ShortCard, ShortsScreen, VideoPlayerScreen, HomeScreen
- **Summary**: Replaced all 5 module-level `Dimensions.get` calls with `useWindowDimensions`. Adaptive card grid (2/3/4 columns). Hero card height responsive. All components now update on rotation.

## 2026-07-22 — Memory System Created
- **Added**: AGENTS.md (constitution), .ai-memory/ (folder + all files)
- **Files**: AGENTS.md rewritten, .ai-memory/*.md created
- **Summary**: Repository now has permanent knowledge base for AI agents

## 2026-07-22 — Settings Simplified
- **Modified**: `src/screens/SettingsScreen.js`
- **Summary**: Removed Profile, Preferences. Added streak from AsyncStorage, dummy About/Privacy. 3 sections only.

## 2026-07-22 — Sticky Header Removed
- **Modified**: `src/screens/HomeScreen.js`
- **Summary**: Removed sticky "Hello" header, headerOpacity, scrollY, handleScroll

## 2026-07-22 — Tab Bar Height Fixed
- **Modified**: `src/navigation/BottomTabs.js`
- **Summary**: Changed from `44 + insets.bottom` to `72`. Fixed double-inset issue.

## 2026-07-22 — VideoCard View Text Removed
- **Modified**: `src/components/VideoCard.js`
- **Summary**: Removed " views" text suffix, now shows just "1K"

## 2026-07-22 — Video Player Favorite Fixed
- **Modified**: `src/screens/VideoPlayerScreen.js`
- **Summary**: Wired favorite to useFavoritesContext (AsyncStorage), not local useState

## 2026-07-22 — Shorts Audio Fix
- **Modified**: `src/screens/ShortsScreen.js`, `src/components/ShortCard.js`
- **Summary**: Added `isFocused` to renderItem deps + `extraData` to FlatList. Root cause: stale closure.

## 2026-07-22 — Home Screen Redesign
- **Modified**: `src/screens/HomeScreen.js`
- **Summary**: Hero greeting with avatar, gradient search pill, category chips, trending hero card

## 2026-07-22 — Shorts Heart = Favorites
- **Modified**: `src/screens/ShortsScreen.js`, `src/components/ShortCard.js`
- **Summary**: Heart icon on shorts toggles favorites. Removed bookmark icon. Wired to useFavoritesContext.

## 2026-07-22 — Tab Bar Visible on Video Player
- **Modified**: `src/navigation/BottomTabs.js`, `src/navigation/AppNavigator.js`
- **Summary**: Nested VideoPlayer + Search in Home stack. Tab bar stays visible.

## 2026-07-22 — Favorites Persisted
- **Added**: `src/hooks/useFavorites.js`, `src/context/FavoritesContext.js`
- **Modified**: `App.js`, `src/screens/FavoritesScreen.js`, `src/screens/HomeScreen.js`
- **Summary**: Favorites stored in AsyncStorage, survive app restarts

## 2026-07-22 — YouTube Data as Source
- **Added**: `src/mock/videodata.json`
- **Modified**: `src/mock/videos.js`, `src/mock/shorts.js`, `src/mock/categories.js`
- **Summary**: 12 real YouTube videos as seed data. Shuffled order.

## 2026-07-22 — App Icons Generated
- **Added**: `scripts/generate-icons.js`
- **Generated**: `assets/icon.png`, `adaptive-icon.png`, `splash-icon.png`, `favicon.png`
- **Summary**: Red (#FF4D4D) with white circle icons

## 2026-07-22 — Full UI Audit & Polish
- **Modified**: 31+ files across components, screens, navigation, constants
- **Summary**: TYPOGRAPHY/ELEVATION migration, SIZES fixes, React.memo on 28 components, unused imports removed, accessibility labels added

## 2026-07-22 — Initial App Build
- **Added**: All source files (14 components, 11 screens, 2 navigators, 4 mock files, 1 theme)
- **Summary**: Complete Kidora app with mock data, 50 videos, 50 shorts, full navigation

## 2026-07-22 — Initial App Build
- **Added**: All source files (14 components, 11 screens, 2 navigators, 4 mock files, 1 theme)
- **Summary**: Complete Kidora app with mock data, 50 videos, 50 shorts, full navigation
