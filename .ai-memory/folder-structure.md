# Folder Structure

```
├── App.js                          # Entry: FavoritesProvider + SafeAreaProvider + Navigator
├── index.js                        # Expo entry
├── app.json                        # Expo config (splash, icons, platforms)
├── babel.config.js                 # babel-preset-expo + reanimated plugin
├── package.json
├── AGENTS.md                       # Project constitution
├── CHANGELOG.md                    # Release changelog
├── CLAUDE.md                       # Claude pointer to AGENTS.md
├── .ai-memory/                     # Permanent knowledge base
├── assets/                         # icon.png, adaptive-icon.png, splash-icon.png, favicon.png
├── docs/                           # Documentation & reports
│   ├── DESIGN_SYSTEM.md
│   ├── COMPONENT_GUIDE.md
│   ├── APP_MANAGEMENT_API_DOCUMENTATION.md
│   ├── FINAL_RELEASE_CHECKLIST.md
│   └── reports/
│       ├── ACCESSIBILITY_REPORT.md
│       ├── BUG_REPORT.md
│       ├── CODE_QUALITY_REPORT.md
│       ├── IMPLEMENTATION_REPORT.md
│       ├── PERFORMANCE_REPORT.md
│       ├── QA_REPORT.md
│       ├── RESPONSIVENESS_AUDIT_REPORT.md
│       ├── TEST_RESULTS.md
│       ├── UI_AUDIT.md
│       └── UI_UX_REPORT.md
├── scripts/
│   └── generate-icons.js           # Generates branded PNG icons
└── src/
    ├── components/                 # 12 reusable components
    │   ├── AccessCodeCard.js       # Code input + validation
    │   ├── CategoryChip.js         # Animated category pill
    │   ├── EmptyState.js           # Empty/error state placeholder
    │   ├── ErrorBoundary.js        # React error boundary wrapper
    │   ├── FavoriteButton.js       # Animated heart toggle
    │   ├── Header.js               # Reusable screen header
    │   ├── LoadingSkeleton.js      # Shimmer skeleton placeholders
    │   ├── MaintenanceScreen.js    # Full-screen maintenance overlay
    │   ├── PlaylistCard.js         # Playlist list item
    │   ├── SearchBar.js            # Search input with voice icon
    │   ├── SectionTitle.js         # Section heading + See All
    │   ├── ShortCard.js            # Full-screen short (expo-av Video + overlay)
    │   └── VideoCard.js            # Thumbnail card with 16:9 ratio
    ├── screens/
    │   ├── SplashScreen.js         # Animated logo → auto-navigate
    │   ├── AccessCodeScreen.js     # Code gate (backend-validated)
    │   ├── HomeScreen.js           # Hero + categories + search pill + chip filters
    │   ├── ShortsScreen.js         # Vertical paging FlatList (12 shorts, MP4 URLs)
    │   ├── VideoPlayerScreen.js    # YouTube iframe + suggested videos + analytics
    │   ├── FavoritesScreen.js      # 2-column grid from context
    │   ├── SettingsScreen.js       # Streak + profile + dark mode + info
    │   ├── SearchScreen.js         # Live search + debounce
    │   ├── PlaylistsScreen.js      # Playlist cards (empty table)
    │   └── GamesScreen.js          # Quiz game (quizzes table missing)
    ├── navigation/
    │   ├── AppNavigator.js         # Root stack: Splash, AccessCode, MainTabs, Playlists, Games
    │   └── BottomTabs.js           # Tab bar (72px) + HomeStack (Home, VideoPlayer, Search)
    ├── constants/
    │   └── theme.js                # COLORS, SIZES, TYPOGRAPHY, ELEVATION, SYSTEM_FONT
    ├── context/
    │   ├── AppConfigContext.js     # App config from Supabase app_config table
    │   ├── ContinueWatchingContext.js # Recently watched AsyncStorage persistence
    │   ├── FavoritesContext.js     # Favorite IDs context + AsyncStorage persistence
    │   └── ThemeContext.js         # Dark/light theme context
    ├── hooks/
    │   ├── useAppConfig.js         # App config helper
    │   ├── useFavorites.js         # useFavorites hook for AsyncStorage
    │   ├── useStreak.js            # Streak tracking
    │   └── useYouTubeMode.js       # YT icon toggle
    ├── services/                   # 14 API service modules
    │   ├── api.js                  # Core: request(), supabaseRest(), getAppConfig()
    │   ├── analytics.service.js    # Analytics events → Supabase → backend → AsyncStorage
    │   ├── auth.service.js         # Parent login (Supabase Auth) + logout
    │   ├── category.service.js     # Categories from Supabase
    │   ├── child.service.js        # Access code verification + profile caching
    │   ├── config.service.js       # Remote app config (custom backend → Supabase → defaults)
    │   ├── notification.service.js # (Dead code — table doesn't exist)
    │   ├── playlist.service.js     # Playlists from Supabase (table empty)
    │   ├── quiz.service.js         # Quizzes from Supabase (table doesn't exist)
    │   ├── reports.service.js      # (Dead code — never called by any screen)
    │   ├── search.service.js       # Video search via ilike
    │   ├── settings.service.js     # Settings from cached child profile
    │   ├── shorts.service.js       # Shorts from Supabase
    │   └── video.service.js        # Videos + featured + toggle favorite (dead endpoint)
    ├── utils/
    │   ├── icons.js                # MaterialCommunityIcons name normalizer
    │   ├── responsive.js           # useResponsive() + useCardSizes() hooks
    │   └── storage.js              # Cross-platform: AsyncStorage → localStorage → memory
    └── __tests__/
        ├── mockSetup.js            # Jest mocks (LinearGradient, icons, navigation, etc.)
        └── theme.test.js           # Validates COLORS, SIZES, TYPOGRAPHY, ELEVATION
```
