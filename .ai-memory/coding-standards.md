# Coding Standards

## React
- `React.memo` on every component (28 total)
- `useCallback` with all deps listed — no stale closures
- FlatList: always `keyExtractor`, `extraData` for dynamic content, `windowSize={3}` for shorts
- No `useState` for derived values — compute from context

## Styling
- **Theme tokens only**: `COLORS`, `SIZES`, `TYPOGRAPHY`, `ELEVATION` from `src/constants/theme.js`
- No hardcoded hex colors in JSX (exceptions: `#FFF` for white text, `#000` for black backgrounds)
- Use `StyleSheet.create` for all styles
- `numberOfLines={1}` on all single-line text (prevents wrapping)

## Imports
- `require()` for JSON files (Metro compat — `import` can fail)
- Named imports from theme: `{ COLORS, SIZES, TYPOGRAPHY, ELEVATION }`
- React always first import

## Animation
- All animations use `useNativeDriver: true`
- Spring for press feedback, timing for transitions
- No `LayoutAnimation` (uses Animated API directly)

## Data
- Supabase tables (`videos`, `shorts`, `categories`, `children`) are source of truth — all data fetched via REST API
- `src/services/api.js` provides `supabaseRest()` for direct table queries and `request()` for custom backend endpoints
- All service modules use CommonJS `require()` pattern for Metro compatibility
- AsyncStorage keys prefixed: `@kidoro_` (`@kidoro_favorites`, `@kidoro_streak`, `@kidoro_child_session`, `@kidoro_continue_watching`, `@kidoro_analytics_queue`)
- Favorites are LOCAL-ONLY (AsyncStorage) — `video.service.js toggleFavorite()` PATCH endpoint is dead code

## Testing
- Jest + `jest-expo` preset
- Test mocks in `__tests__/mockSetup.js`
- All tests use `describe`/`test` blocks

## Build Verification
```bash
npx expo export --platform web --output-dir /tmp/verify
```
