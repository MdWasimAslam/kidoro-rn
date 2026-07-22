# Folder Structure

```
├── App.js                          # Entry: FavoritesProvider + SafeAreaProvider + Navigator
├── index.js                        # Expo entry
├── app.json                        # Expo config (splash, icons, platforms)
├── babel.config.js                 # babel-preset-expo + reanimated plugin
├── package.json
├── AGENTS.md                       # Project constitution
├── .ai-memory/                     # Permanent knowledge base
├── assets/                         # icon.png, adaptive-icon.png, splash-icon.png, favicon.png
├── scripts/
│   └── generate-icons.js           # Generates branded PNG icons
└── src/
    ├── components/                 # 14 reusable components
    │   ├── AccessCodeCard.js       # Code input + validation
    │   ├── CategoryChip.js         # Animated category pill
    │   ├── CategoryRow.js          # Horizontal scroll section (SectionTitle + VideoCard list)
    │   ├── EmptyState.js           # Empty/error state placeholder
    │   ├── FavoriteButton.js       # Animated heart toggle
    │   ├── Header.js               # Reusable screen header
    │   ├── LoadingSkeleton.js      # Shimmer skeleton placeholders
    │   ├── PlayerControls.js       # Video player overlay controls (not currently used)
    │   ├── PlaylistCard.js         # Playlist list item
    │   ├── ProfileCard.js          # Avatar + XP badge (not currently used)
    │   ├── SearchBar.js            # Search input with voice icon
    │   ├── SectionTitle.js         # Section heading + See All
    │   ├── ShortCard.js            # Full-screen short (expo-av Video + overlay)
    │   └── VideoCard.js            # Thumbnail card with 16:9 ratio
    ├── screens/
    │   ├── SplashScreen.js         # Animated logo → auto-navigate
    │   ├── AccessCodeScreen.js     # Code gate (mock: 1234)
    │   ├── HomeScreen.js           # Hero + categories + search pill + chip filters
    │   ├── ShortsScreen.js         # Vertical paging FlatList (50 shorts)
    │   ├── VideoPlayerScreen.js    # YouTube iframe + suggested videos
    │   ├── FavoritesScreen.js      # 2-column grid from context
    │   ├── DownloadsScreen.js      # Mock downloads (not currently in tab bar)
    │   ├── SettingsScreen.js       # Simple: streak + content + info
    │   ├── SearchScreen.js         # Live search + trending chips
    │   ├── PlaylistsScreen.js      # Playlist cards
    │   └── GamesScreen.js          # Quiz game (not in navigation)
    ├── navigation/
    │   ├── AppNavigator.js         # Root stack: Splash, AccessCode, MainTabs, Playlists
    │   └── BottomTabs.js           # Tab bar (72px) + HomeStack (Home, VideoPlayer, Search)
    ├── constants/
    │   └── theme.js                # COLORS, SIZES, TYPOGRAPHY, ELEVATION, ANIMATION
    ├── context/
    │   └── FavoritesContext.js     # Favorite IDs context + AsyncStorage persistence
    ├── hooks/
    │   └── useFavorites.js         # useFavorites hook for AsyncStorage
    ├── mock/
    │   ├── videodata.json          # 12 real YouTube videos (source of truth)
    │   ├── videos.js               # 50 videos (12 real + 38 placeholder), shuffled
    │   ├── shorts.js               # 50 shorts (12 real + 38 placeholder), shuffled
    │   ├── categories.js           # 12 categories + home sections + trending searches
    │   └── profile.js              # Mock kid profile (name, xp, badges)
    ├── utils/
    │   └── responsive.js           # useResponsive() + useCardSizes() hooks
    └── __tests__/
        ├── mockSetup.js            # Jest mocks (LinearGradient, icons, navigation, etc.)
        ├── mock.test.js            # Validates 50 videos, 50 shorts, categories, profile
        └── theme.test.js           # Validates COLORS, SIZES, TYPOGRAPHY, ELEVATION
```
