# Change Log

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
