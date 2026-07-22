# Performance

## Current Metrics
- **Web bundle**: ~2.49 MB (1183 modules)
- **iOS bundle**: ~4 MB (Hermes bytecode)
- **All components**: React.memo wrapped
- **Event handlers**: useCallback with deps

## Optimizations Applied
- FlatList `keyExtractor` on all lists
- Shorts FlatList: `windowSize={3}`, `removeClippedSubviews`, `maxToRenderPerBatch={3}`
- Animated API: `useNativeDriver: true` everywhere
- Image loading: opacity fade-in, error fallback
- Shimmer skeletons: `Animated.loop` opacity (not re-rendering)
- ShortCard Video: only plays when active + focused tab

## Bundle Size
- Largest contributor: MaterialCommunityIcons font (1.31 MB)
- react-native-youtube-iframe adds WebView dependency
- Recommended: strip unused icon sets in production

## Known Performance Considerations
- 50 ShortCard items in memory (no virtualization beyond windowSize=3)
- YouTube iframe WebView (heavy, but only 1 active at a time)
- CategoryRow maps favorites on every render (useCallback + useMemo should mitigate)
