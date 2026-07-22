# Search Index

## Quick Navigation
| What | Where |
|------|-------|
| App entry | `App.js` → wraps providers + navigator |
| Navigation setup | `src/navigation/AppNavigator.js`, `src/navigation/BottomTabs.js` |
| Theme tokens | `src/constants/theme.js` |
| Video data (source of truth) | `src/mock/videodata.json` |
| Video generator | `src/mock/videos.js` |
| Shorts generator | `src/mock/shorts.js` |
| Categories | `src/mock/categories.js` |
| Kid profile | `src/mock/profile.js` |
| Favorites logic | `src/context/FavoritesContext.js`, `src/hooks/useFavorites.js` |
| Responsive utils | `src/utils/responsive.js` — `useResponsive()`, `useCardSizes()` |
| Babel config | `babel.config.js` (expo + reanimated plugin) |
| Icon generator | `scripts/generate-icons.js` |
| Expo config | `app.json` |

## Screens (11)
```
src/screens/SplashScreen.js         — Logo animation → AccessCode after 2s
src/screens/AccessCodeScreen.js     — Code gate (1234 valid)
src/screens/HomeScreen.js           — Infinite scroll grid (hero + continue watching header, 2-col recommended)
src/screens/ShortsScreen.js         — Vertical paging, 50 shorts, auto-play
src/screens/VideoPlayerScreen.js    — YouTube iframe + suggested videos
src/screens/FavoritesScreen.js      — Grid from context
src/screens/DownloadsScreen.js      — Mock (not in tabs)
src/screens/SettingsScreen.js       — Streak + content + info
src/screens/SearchScreen.js         — Live search + trending chips
src/screens/PlaylistsScreen.js      — Playlist cards
src/screens/GameScreen.js           — Quiz (not in navigation)
```

## Key Hooks
- `useFavorites()` → AsyncStorage `@kidoro_favorites`, returns `{favoriteIds, loaded, isFavorite, toggleFavorite}`
- `useFavoritesContext()` → shortcut to context

## Key Patterns
- AsyncStorage keys: `@kidoro_favorites`, `@kidoro_streak`
- `require()` for JSON imports (not `import`)
- `React.memo` on all components
- `useCallback` with full dep arrays
- FlatList `extraData` for dynamic content
- `npx expo export --platform web` to verify builds
- All animations use `useNativeDriver: true`
