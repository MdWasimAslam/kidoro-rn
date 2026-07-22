# Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-07-22 | `require()` for JSON imports | Metro ESM interop edge cases with `import` |
| 2026-07-22 | VideoPlayer + Search in Home stack | Keep tab bar visible during video viewing |
| 2026-07-22 | ShortCard Video always mounted, paused via ref | Conditional unmount caused stale audio issues |
| 2026-07-22 | FlatList `extraData` required | React.memo PureComponent skips renders without it |
| 2026-07-22 | `expo-av` for shorts, YouTube iframe for video player | YouTube iframe embeds fail for kids content (error 153) |
| 2026-07-22 | Favorites as React Context | Single source of truth, AsyncStorage sync |
| 2026-07-22 | No Redux/MobX | App too small for state management library |
| 2026-07-22 | `module.exports` in theme.js | ESM `export const` had Hermes bytecode edge cases |
| 2026-07-22 | TYPOGRAPHY/ELEVATION replacing FONTS/SHADOWS | Design system consistency |
| 2026-07-22 | 4 tabs (removed Downloads from nav) | Shorts, Home, Favorites, Settings — minimal |
| 2026-07-22 | `SIZES.huge = 60` added | Existing components used it (ShortCard, EmptyState) |
| 2026-07-22 | `SIZES.radiusXs = 4` added | Existing components used it (LoadingSkeleton, Downloads) |
| 2026-07-22 | `useWindowDimensions` for responsive layout | Replaced all 5 module-level `Dimensions.get` calls, created `useCardSizes()` for adaptive grid |
