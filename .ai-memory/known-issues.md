# Known Issues

## Current
| Issue | Severity | Status |
|-------|----------|--------|
| YouTube embed blocked for some kids videos (error 153) | Medium | Workaround: use direct MP4 URLs |
| `expo-av` audio may route to Bluetooth instead of speaker | Low | Config added, device-dependent |
| ShortCard Video stays mounted (memory) | Low | By design — prevents remount latency |
| `ProfileCard` component imported but unused | Low | Settings simplified |
| `PlayerControls` component unused | Low | Replaced by YouTube iframe |
| `GameScreen.js` exists but not in navigation | Low | Future feature |
| ESLint cannot parse JSX (Babel 8 vs ESLint 8 incompatibility) | Low | Metro bundler validates instead |

## Resolved
| Issue | Resolution |
|-------|------------|
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
