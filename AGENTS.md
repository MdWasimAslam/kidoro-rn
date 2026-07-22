# Kidoro — Project Constitution

## Pre-flight (read first)
- **Expo SDK 54**: All docs at https://docs.expo.dev/versions/v54.0.0/
- **Platform**: React Native + Expo + JavaScript (no TypeScript)
- **Package manager**: npm with `--legacy-peer-deps` (peer dep strictness causes failures)

## Rules
1. Read `.ai-memory/project-overview.md` before touching code
2. Never scan entire repo — use `search-index.md` to locate files
3. After every task: update `change-log.md` and relevant memory files
4. Run `npx expo export --platform web` to verify builds
5. Use `require()` for JSON imports (not `import` — Metro compat)
6. AsyncStorage key prefix: `@kidoro_`

## Coding Standards
- React.memo on every component
- useCallback with all deps listed (no stale closures)
- FlatList: always `keyExtractor`, `extraData` for dynamic content
- Theme tokens only: `COLORS`, `SIZES`, `TYPOGRAPHY`, `ELEVATION` from `src/constants/theme.js`
- No hardcoded hex colors in JSX
- `numberOfLines={1}` on all single-line text

## Known Pitfalls
- `SIZES.huge` = 60, `SIZES.radiusXs` = 4 (added tokens, not in original spec)
- `TYPOGRAPHY` has h1(28), h2(22), h3(18), h4(16), body(15), caption(12), label(13)
- `ELEVATION` has level0,1,2,3 (replaced old `SHADOWS`)
- `expo-av` Video for shorts; `react-native-youtube-iframe` for video player
- Favorites use `useFavoritesContext` from `src/context/FavoritesContext.js` (AsyncStorage)

## Verification
```bash
npx expo export --platform web --output-dir /tmp/verify
```

## Memory Updates
Update `.ai-memory/` after every change. Never delete it.
