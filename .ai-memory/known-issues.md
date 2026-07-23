# Known Issues

## Current
| Issue | Severity | Status |
|-------|----------|--------|
| `video.service.js toggleFavorite()` PATCH endpoint is dead code (NEVER called) | High | Favorites are local-only — data loss risk |
| `quizzes` Supabase table does NOT exist | High | GamesScreen shows "No quizzes available" |
| `notifications` Supabase table does NOT exist | Low | notification.service.js returns [] gracefully |
| Custom backend only accessible at `localhost:3000`; 10.0.2.2 removed | Medium | Android emulator users need `EXPO_PUBLIC_API_URL` env override |
| `SettingsScreen` dark mode toggle bug: was accessing `appConfig?.features` instead of `appConfig?.config?.features` | Medium | Fixed 2026-07-23 — config is now properly read |
| YouTube embed blocked for some kids videos (error 153) | Medium | Workaround: use direct MP4 URLs |
| `expo-av` audio may route to Bluetooth instead of speaker | Low | Config added, device-dependent |
| ShortCard Video stays mounted (memory) | Low | By design — prevents remount latency |
| `ProfileCard` component imported but unused | Low | Settings simplified |
| `PlayerControls` component unused | Low | Replaced by YouTube iframe |
| ESLint cannot parse JSX (Babel 8 vs ESLint 8 incompatibility) | Low | Metro bundler validates instead |

## Resolved
| Issue | Resolution |
|-------|------------|
| App config not reading from Supabase `app_config` table | Fixed — confirmed working via Supabase fallback path |
| SettingsScreen dark mode toggle ignoring config | Fixed — `appConfig?.features` → `appConfig?.config?.features` |
| BASE_URL default `10.0.2.2:3000` not resolving on Windows | Fixed — changed default to `localhost:3000` |
| SIZES.huge undefined → NaN crash | Added `huge: 60` to theme |
| SIZES.radiusXs undefined → NaN crash | Added `radiusXs: 4` to theme |
| `COLORS.overlayDark` undefined | Fixed to `COLORS.overlay` |
| `TYPOGRAPHY.headingS` undefined | Fixed to `TYPOGRAPHY.label` |
| `TYPOGRAPHY.headingXL` undefined | Fixed to `TYPOGRAPHY.h1` |
| Stale closure in ShortsScreen `renderItem` | Added `isFocused` to deps |
| Missing `extraData` on Shorts FlatList | Added `{isFocused, currentIndex}` |
| Tab bar double-insets (78px on iPhone) | Fixed to `height: 72` |
| Double header on home screen | Removed sticky header entirely |
| "1K views" wrapping to two lines | Added `numberOfLines={1}` |
| `CARD_HEIGHT` undefined after refactor | Added back constant |
| Module-level `Dimensions.get` stale on rotation | Replaced all with `useWindowDimensions` hook + `useCardSizes` util |
