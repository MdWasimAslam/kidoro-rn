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
2. **Favorites as context**: Single source of truth, persists to AsyncStorage (scoped by parent `access_key`)
3. **CommonJS `require()` for theme.json**: Metro ESM interop edge cases
4. **ShortCard always mounts Video**: Uses ref.pauseAsync() explicitly for reliable stop on tab switch
5. **FlatList extraData**: Required for `isFocused`/`currentIndex` changes to trigger re-renders
6. **Supabase direct REST (no SDK)**: Uses raw `fetch()` with `apikey` header — no Supabase JS client
7. **Analytics: Supabase-first**: Events POST directly to `analytics_events` table, fallback to custom backend API, then queue to AsyncStorage. Payloads include `access_key` for tenant isolation.
8. **No `channel`/`views` columns in Supabase**: Code gracefully defaults empty/0 — see `docs/SUPABASE_SCHEMA.md`
9. **Custom backend BASE_URL**: `http://localhost:3000` (was `http://10.0.2.2:3000` — Android-emulator-only, failed on Windows)
10. **Tenant Data Isolation**: All REST queries via `supabaseRest` dynamically append `access_key` filter using the active child's `access_key`.

## Data Flow
```
Supabase 'videos' table → video.service.js getVideos() → HomeScreen / SearchScreen
  Fields: id, title, video_id (YouTube), thumbnail_url, duration (int, currently all 0!),
          category_id (FK), categories.name (join), favorite (boolean), access_key
  NOTE: No 'channel' or 'views' columns exist — code falls back to '' and 0
  NOTE: Query automatically filtered by active child's access_key

Supabase 'shorts' table → shorts.service.js getShorts() → ShortsScreen
  12 shorts with direct MP4 URLs (youtube_url field has MP4 URLs now)
  NOTE: Query automatically filtered by active child's access_key

Supabase 'children' table → child.service.js verifyAccessCode() → cached in memory + AsyncStorage
  Used by: HomeScreen (greeting), SettingsScreen (profile display)
  NOTE: Validated online during SplashScreen boot to catch soft-deleted/deactivated accounts.

Supabase 'analytics_events' table → analytics.service.js trackEvent() → direct POST
  Fields: parent_id, access_key, child_id, event_name, video_id, duration_seconds, etc.
  Fallback: custom backend API /api/analytics/track → AsyncStorage queue

Supabase 'categories' table → category.service.js getCategories() → HomeScreen chips
  NOTE: Query automatically filtered by active child's access_key

Supabase 'app_config' table → api.js getAppConfig() → AppConfigContext
  Single-row table with JSONB config (home, theme, version, features, maintenance)
  NOTE: Fetched via Supabase fallback (custom backend at /api/app-config uses Android-emulator address)

FavoritesContext → useFavorites() → AsyncStorage(@kidoro_favorites_${accessKey})
                → favoriteIds[] → isFavorite / toggleFavorite
  NOTE: Scoped per parent access key. Automatically reloads on child profile changes.

ContinueWatchingContext → useContinueWatchingContext() → AsyncStorage(@kidoro_continue_watching_${accessKey})
  NOTE: Scoped per parent access key. Automatically reloads on child profile changes.
```

## Full Database Reference
See `docs/SUPABASE_SCHEMA.md` — comprehensive column-level documentation for all tables.
