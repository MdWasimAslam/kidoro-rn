# Architecture

## Navigation Tree
```
App.js → FavoritesProvider → GestureHandlerRootView → SafeAreaProvider → AppNavigator
  AppNavigator (Stack)
    ├── Splash
    ├── AccessCode
    ├── MainTabs (TabNavigator)
    │   ├── Home (Stack) → HomeMain, VideoPlayer, Search
    │   ├── Shorts
    │   ├── Favorites
    │   └── Settings
    └── Playlists
```

## Key Decisions
1. **VideoPlayer in Home stack**: Keeps tab bar visible (not root stack)
2. **Favorites as context**: Single source of truth, persists to AsyncStorage
3. **CommonJS `require()` for theme.json**: Metro ESM interop edge cases
4. **ShortCard always mounts Video**: Uses ref.pauseAsync() explicitly for reliable stop on tab switch
5. **FlatList extraData**: Required for `isFocused`/`currentIndex` changes to trigger re-renders

## Data Flow
```
videodata.json → mock/videos.js → buildVideos() → export videos[]
                                → getVideosByCategory / getTrendingVideos / getSearchResults

shorts.js → buildShorts() → export shorts[]
         → 12 real YouTube shorts + 38 placeholder shorts

FavoritesContext → useFavorites() → AsyncStorage(@kidoro_favorites)
                → favoriteIds[] → isFavorite / toggleFavorite
```
