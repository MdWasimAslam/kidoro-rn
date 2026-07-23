# Supabase Schema Reference

> **Last verified:** 2026-07-23 via `GET /rest/v1/<table>?select=*&limit=3`
> **Project URL:** `https://uhqgqllpovhoesfvkgvv.supabase.co`
> **Anon Key:** `sb_publishable_TI4B6oSjRgF1epWR5WUyog_C32HkewG`
> **Env vars (`.env.local`):** `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`

---

## Table Inventory

| Table | Exists? | Has Data? | Status |
|-------|---------|-----------|--------|
| `children` | ✅ Yes | ✅ Yes (2 records) | Active |
| `videos` | ✅ Yes | ✅ Yes (~21 records) | Active |
| `categories` | ✅ Yes | ✅ Yes (9 records) | Active |
| `analytics_events` | ✅ Yes | ✅ Yes (3+ records) | Active |
| `app_config` | ✅ Yes | ✅ Yes (1 record) | Active |
| `shorts` | ✅ Yes | ✅ Yes (12 records) | Active — created 2026-07-23 |
| `playlists` | ✅ Yes | ❌ Empty | No data yet |
| `notifications` | ❌ No | — | **Does not exist** |
| `quizzes` | ❌ No | — | **Does not exist** |

---

## 1. `children` — Kid Profiles

Verified via PIN authentication. **Do NOT hardcode access codes** — always validate against this table.

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | `uuid` | NOT NULL | `gen_random_uuid()` | Primary key |
| `parent_id` | `uuid` | NOT NULL | — | FK to parents table |
| `name` | `text` | NOT NULL | — | Display name (e.g. "Aariz") |
| `age` | `integer` | YES | — | Child's age |
| `avatar_url` | `text` | YES | — | Profile image URL |
| `access_code` | `text` | NOT NULL | — | PIN code (e.g. "3879") |
| `status` | `text` | NOT NULL | — | Must be `"active"` to authenticate |
| `created_at` | `timestamptz` | NOT NULL | `now()` | Auto-generated |
| `updated_at` | `timestamptz` | NOT NULL | `now()` | Auto-generated |
| `deleted_at` | `timestamptz` | YES | — | Soft delete; must be `null` to authenticate |

### Code Contracts

| File | What it uses |
|------|-------------|
| `src/services/child.service.js` | `verifyAccessCode(pin)` → `children?access_code=eq.{pin}&status=eq.active&deleted_at=is.null` |
| `src/services/settings.service.js` | `getSettings()` → reads cached child from `getActiveChild()` |
| `src/services/api.js` | `setActiveChild(child)` / `getActiveChild()` — stores in memory + AsyncStorage |

### Sample Data

```json
{
  "id": "858ae433-...",
  "parent_id": "e4441494-...",
  "name": "Aariz",
  "age": 4,
  "avatar_url": "https://i.pinimg.com/...",
  "access_code": "3879",
  "status": "active",
  "created_at": "2026-07-22T...",
  "updated_at": "2026-07-22T...",
  "deleted_at": null
}
```

---

## 2. `videos` — Video Content

Source of truth for all video data. **No `channel` or `views` columns exist** — the code gracefully defaults `v.channel || ''` and `v.views || 0`.

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | `uuid` | NOT NULL | `gen_random_uuid()` | Primary key |
| `parent_id` | `uuid` | NOT NULL | — | Owner/creator |
| `category_id` | `uuid` | YES | — | FK → `categories.id` |
| `video_id` | `text` | NOT NULL | — | YouTube video ID (e.g. `"020g-0hhCAU"`) |
| `title` | `text` | NOT NULL | — | Display title |
| `youtube_url` | `text` | YES | — | Full YouTube URL |
| `thumbnail_url` | `text` | YES | — | Custom thumbnail image URL |
| `duration` | `integer` | NOT NULL | `0` | Duration in seconds. Currently all `0`! |
| `description` | `text` | YES | — | Video description |
| `tags` | `jsonb` | YES | — | Array of tag strings |
| `age_group` | `text` | YES | — | E.g. "3-5", "6-8", nullable |
| `status` | `text` | NOT NULL | — | Must be `"active"` to display |
| `favorite` | `boolean` | NOT NULL | `false` | toggle via PATCH |
| `created_at` | `timestamptz` | NOT NULL | `now()` | Auto-generated |
| `updated_at` | `timestamptz` | NOT NULL | `now()` | Auto-generated |
| `deleted_at` | `timestamptz` | YES | — | Soft delete; must be `null` to display |

### ⚠️ Known Issues

- `duration` is `0` for all records — the duration badge on video cards shows nothing until real durations populated
- No `views` column — UI renders `v.views || 0` (always 0)
- No `channel` column — UI renders `v.channel || ''` (empty)
- **`video.service.js toggleFavorite()` PATCH endpoint is DEAD CODE** — NO screen calls it. Favorites are LOCAL-ONLY (AsyncStorage via `useFavorites.js`). The `favorite` column in Supabase is never updated by the app.

### Code Contracts

| File | What it uses |
|------|-------------|
| `src/services/video.service.js` | `getVideos(limit)` → `videos?status=eq.active&deleted_at=is.null&select=*,categories(name)` |
| `src/services/search.service.js` | `searchVideos(q)` → `videos?title=ilike.%{q}%&status=eq.active` |
| `src/screens/HomeScreen.js` | Maps `videos` → `{ id, title, thumbnail: thumbnail_url, youtubeId: video_id, channel: channel || '', views: views || 0, duration, description, category: categories?.name, categoryId: category_id, favorite }` |
| `src/screens/VideoPlayerScreen.js` | Uses `currentVideo` object with same mapping |
| `src/screens/SearchScreen.js` | Same mapping as HomeScreen |

---

## 3. `categories` — Video Categories

Used for Home screen chip filters and category sections.

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | `uuid` | NOT NULL | `gen_random_uuid()` | Primary key |
| `parent_id` | `uuid` | YES | — | Parent category |
| `name` | `text` | NOT NULL | — | E.g. "Science & STEM", "Art & Creativity" |
| `icon` | `text` | YES | — | Icon identifier (e.g. `"FlaskConical"`, `"Calculator"`) — maps to MaterialCommunityIcons |
| `sort_order` | `integer` | NOT NULL | — | Sorting priority (ascending) |
| `status` | `text` | NOT NULL | — | Must be `"enabled"` to show |
| `created_at` | `timestamptz` | NOT NULL | `now()` | Auto-generated |
| `updated_at` | `timestamptz` | NOT NULL | `now()` | Auto-generated |
| `deleted_at` | `timestamptz` | YES | — | Soft delete; must be `null` to show |

### Code Contracts

| File | What it uses |
|------|-------------|
| `src/services/category.service.js` | `getCategories()` → `categories?status=eq.enabled&deleted_at=is.null&order=sort_order.asc` |
| `src/screens/HomeScreen.js` | Renders categories as `CategoryChip` components on Home |

### Sample Data

```json
{
  "id": "6eba1a14-...",
  "parent_id": null,
  "name": "Science & STEM",
  "icon": "FlaskConical",
  "sort_order": 1,
  "status": "enabled",
  "created_at": "2026-07-22T...",
  "updated_at": "2026-07-22T...",
  "deleted_at": null
}
```

---

## 4. `analytics_events` — Usage Analytics

Events are inserted via Supabase direct POST (preferred), falling back to custom backend API, then queued to AsyncStorage.

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | `uuid` | NOT NULL | `gen_random_uuid()` | Primary key (auto) |
| `parent_id` | `uuid` | YES | — | FK → child's parent |
| `child_id` | `uuid` | YES | — | FK → `children.id` |
| `video_id` | `uuid` | YES | — | FK → `videos.id` |
| `short_id` | `uuid` | YES | — | FK → `shorts.id` |
| `category_id` | `uuid` | YES | — | FK → `categories.id` |
| `playlist_id` | `uuid` | YES | — | FK → `playlists.id` |
| `creator_id` | `uuid` | YES | — | Not currently used |
| `session_id` | `uuid` | YES | — | Not currently used |
| `event_name` | `text` | NOT NULL | — | e.g. `"video_started"`, `"video_watched"`, `"video_paused"`, `"test_event"` |
| `duration_seconds` | `float` | YES | — | Watch time in seconds |
| `completion_pct` | `float` | YES | — | Percentage of video watched (0–100) |
| `device_type` | `text` | YES | — | Currently hardcoded `"mobile"` |
| `platform` | `text` | YES | — | Currently hardcoded `"react-native"` |
| `network_type` | `text` | YES | — | Not currently used |
| `metadata` | `jsonb` | YES | `{}` | Arbitrary JSON payload |
| `created_at` | `timestamptz` | NOT NULL | `now()` | Auto-generated (**do not send** in POST) |

### Code Contracts

| File | What it uses |
|------|-------------|
| `src/services/analytics.service.js` | `trackEvent(payload)` → POST to Supabase `analytics_events`, falls back to backend API, then queues to AsyncStorage. `flushQueue()` → batch POST to Supabase, falls back to backend API |
| `src/screens/VideoPlayerScreen.js` | Tracks `video_started`, `video_watched`, `video_paused` events with `currentVideo.id` as `video_id` |

---

## 5. `app_config` — App Configuration

A single-row table holding the app's runtime configuration as JSONB.

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | `integer` | NOT NULL | — | Primary key (always `1`) |
| `config` | `jsonb` | NOT NULL | — | Full app config object |
| `updated_at` | `timestamptz` | NOT NULL | `now()` | Last updated timestamp |

### Config JSON Structure

```json
{
  "home": {
    "showBanner": true,
    "bannerTitle": "Welcome to Kidoro",
    "showFeatured": true,
    "showCategories": true,
    "showContinueWatching": true
  },
  "theme": {
    "accentColor": "#3B82F6",
    "primaryColor": "#EF4444",
    "secondaryColor": "#F59E0B",
    "defaultTheme": "system"
  },
  "version": {
    "currentVersion": "1.0.0",
    "minSupportedVersion": "1.0.0",
    "forceUpdate": false,
    "updateMessage": "A new version is available!"
  },
  "features": {
    "enableSearch": true,
    "enableDarkMode": true,
    "enableDownloads": true,
    "enableNotifications": true
  },
  "maintenance": {
    "enabled": false,
    "message": ""
  }
}
```

### Code Contracts

| File | What it uses |
|------|-------------|
| `src/services/api.js` | `getAppConfig()` → `app_config?select=config&id=eq.1` → returns `res[0]?.config` |
| `src/context/AppConfigContext.js` | Loads config via `getAppConfig()`, provides `config` + `refetchConfig` |

---

## 6. `shorts` — TikTok-Style Short Videos

**12 kid-friendly shorts** were added on 2026-07-23 spanning 6 categories (Science, Animals, Art, Math, Phonics, Geography, Music, Stories).

The Shorts screen now has real content. The table mirrors the `videos` table structure.

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | `uuid` | NOT NULL | `gen_random_uuid()` | Primary key |
| `parent_id` | `uuid` | NOT NULL | — | FK to parents table |
| `title` | `text` | NOT NULL | — | Display title |
| `youtube_url` | `text` | YES | — | Now contains **direct MP4 URLs** (field name is misleading — was YouTube Shorts URLs but changed 2026-07-23 to playable MP4 URLs) |
| `video_id` | `text` | NOT NULL | — | YouTube video ID (e.g. `"o6p2GUQGFK8"` — still used for thumbnail fallback) |
| `thumbnail_url` | `text` | YES | — | Thumbnail image URL |
| `duration` | `integer` | NOT NULL | `0` | Duration in seconds |
| `category_id` | `uuid` | YES | — | FK → `categories.id` |
| `age_group` | `text` | YES | — | E.g. "3-5", "6-8", nullable |
| `description` | `text` | YES | — | Short description text |
| `tags` | `text` | YES | — | Comma-separated tags |
| `status` | `text` | NOT NULL | — | Must be `"active"` to display |
| `favorite` | `boolean` | NOT NULL | `false` | Favorite flag |
| `created_at` | `timestamptz` | NOT NULL | `now()` | Auto-generated |
| `updated_at` | `timestamptz` | NOT NULL | `now()` | Auto-generated |
| `deleted_at` | `timestamptz` | YES | — | Soft delete; must be `null` to display |

### Code Contracts

| File | What it uses |
|------|-------------|
| `src/services/shorts.service.js` | `getShorts(limit)` → `shorts?select=*&status=eq.active&deleted_at=is.null&order=created_at.desc` |
| `src/screens/ShortsScreen.js` | Maps `shorts` → `{ id, title, url: youtube_url, video_id, thumbnail: thumbnail_url || auto-generated, description, tags }` |
| `src/components/ShortCard.js` | Renders `short.url` (expo-av Video), `short.title`, `short.description`, `short.tags`, `short.thumbnail`, `short.favorite` |

### Sample Data (1 of 12 — using MP4 URL)

```json
{
  "id": "0a4f22c1-7449-4564-9c89-b819a9a27a78",
  "title": "Flower Time Lapse",
  "video_id": "_deprecated_",
  "youtube_url": "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  "thumbnail_url": "",
  "duration": 0,
  "status": "active",
  "favorite": false
}
```

> ⚠️ **Note**: `youtube_url` field now contains direct MP4 URLs, not YouTube links. The `video_id` is no longer functional for playback (used only for YouTube thumbnail fallback).

---

## 7. `playlists` — Content Playlists

**Table exists but is empty.** No data means the Playlists screen shows no content.

| Column | Type (inferred from service query) |
|--------|-----------------------------------|
| `id` | `uuid` (likely PK) |
| `name` | `text` |
| `created_at` | `timestamptz` |

The service also performs a join: `select=*,playlist_videos(*,videos(*))` — this expects a `playlist_videos` junction table with FK to `videos`. This junction table may or may not exist.

> **Full schema not yet visible** because the table has no rows.

---

## 8. Tables That Do NOT Exist

| Table | Code That References It | Behavior |
|-------|------------------------|----------|
| `notifications` | `src/services/notification.service.js` | Catches error, returns `[]` gracefully |
| `quizzes` | `src/services/quiz.service.js` | Catches error, returns `[]` gracefully |

---

## Key Integration Rules

### Query Filters
- **Active records only:** Always query `status=eq.active` (videos) or `status=eq.enabled` (categories)
- **Soft delete:** Always query `deleted_at=is.null` on tables that have this column
- **Ordering:** Use `order=created_at.desc` for recent-first, `order=sort_order.asc` for categories

### Field Mapping (videos → UI)
```
id               →  video.id
title            →  video.title
video_id         →  video.youtubeId   (YouTube ID string)
thumbnail_url    →  video.thumbnail
duration         →  video.duration    (integer seconds, currently all 0!)
category_id      →  video.categoryId
categories.name  →  video.category    (via join `select=*,categories(name)`)
favorite         →  video.favorite    (boolean, toggle via PATCH)
```

### Fields that DON'T exist in Supabase
| Missing Field | Code Fallback | Impact |
|--------------|--------------|--------|
| `channel` | `v.channel \|\| ''` | Channel name always empty |
| `views` | `v.views \|\| 0` | Views always 0 |
| `description` | Actually EXISTS in Supabase | ✅ Works correctly |

### Analytics Event Insertion Priority
1. **Supabase direct POST** to `analytics_events` table (preferred — no backend server needed)
2. **Custom backend API** at `/api/analytics/track` (fallback)
3. **AsyncStorage queue** `@kidoro_analytics_queue` (last resort, flushed later)

### Authentication Flow
```
Access Code Input → GET /rest/v1/children?access_code=eq.{pin}&status=eq.active&deleted_at=is.null
  → If found: cache in memory + AsyncStorage (@kidoro_child_session)
  → If not found: check AsyncStorage cache (offline mode)
    → If cached child has matching PIN, allow offline access
    → Otherwise: "Invalid PIN code"
```

---

## API Endpoints Used

### Supabase REST (direct)
| Method | Endpoint | Used By |
|--------|----------|---------|
| GET | `/rest/v1/children?select=*&...` | `child.service.js` |
| GET | `/rest/v1/videos?select=*,categories(name)&...` | `video.service.js`, `search.service.js` |
| PATCH | `/rest/v1/videos?id=eq.{id}` | `video.service.js` (toggle favorite) |
| GET | `/rest/v1/categories?select=*&...` | `category.service.js` |
| POST | `/rest/v1/analytics_events` | `analytics.service.js` |
| GET | `/rest/v1/app_config?select=config&id=eq.1` | `api.js` (getAppConfig) |
| GET | `/rest/v1/shorts?select=*&...` | `shorts.service.js` |
| GET | `/rest/v1/playlists?select=*...` | `playlist.service.js` |

### Custom Backend API (fallback — `http://localhost:3000`)
> Changed from `10.0.2.2:3000` (Android-emulator-only) to `localhost:3000`. Android emulator users can override with `EXPO_PUBLIC_API_URL=http://10.0.2.2:3000`
| Method | Endpoint | Used By |
|--------|----------|---------|
| POST | `/api/analytics/track` | `analytics.service.js` (fallback) |
