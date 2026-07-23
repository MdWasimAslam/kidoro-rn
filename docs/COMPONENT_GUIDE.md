# Kidora Component Architecture Guide

## Core Reusable Components

### 1. `Header` / `HeroHeader`
- **Location:** `src/components/Header.js`
- **Description:** Premium header featuring greeting hierarchy, user avatar, cast action button, and safe area dynamic padding.
- **Props:**
  - `title`: String (Primary heading text)
  - `subtitle`: String (Secondary greeting or category tag)
  - `rightComponent`: ReactNode (Optional action buttons)
  - `leftComponent`: ReactNode (Optional back button or brand icon)

---

### 2. `SearchBar`
- **Location:** `src/components/SearchBar.js`
- **Description:** Integrated search input with shadow elevation, voice search trigger, clear button, and accessible 52px height.
- **Props:**
  - `onSearch`: Function (Triggered on query text change)
  - `onVoicePress`: Function (Voice search handler)
  - `placeholder`: String (Custom placeholder text)

---

### 3. `SectionHeader`
- **Location:** `src/components/SectionHeader.js`
- **Description:** Standardized section header with 8pt grid spacing, clear section title, and animated "See All" button.
- **Props:**
  - `title`: String
  - `seeAll`: Boolean
  - `onSeeAll`: Function

---

### 4. `VideoCard`
- **Location:** `src/components/VideoCard.js`
- **Description:** 16:9 aspect ratio video card with image caching, skeleton loading states, floating favorite button, duration badge, and watch progress bar.
- **Props:**
  - `video`: Object (Contains `title`, `thumbnail`, `duration`, `views`, `progress`, `favorite`)
  - `onPress`: Function
  - `onFavorite`: Function
  - `large`: Boolean (Full width vs. grid width)

---

### 5. `BottomNavigation` / `BottomTabs`
- **Location:** `src/navigation/BottomTabs.js`
- **Description:** Floating bottom navigation bar with level 3 elevation, safe area inset handling, active indicator dot/pill, and 48x48px touch areas.

---

### 6. `FavoriteButton`
- **Location:** `src/components/FavoriteButton.js`
- **Description:** Animated spring heart icon button with dark background pill overlay for video thumbnails.
- **Props:**
  - `isFavorite`: Boolean
  - `onPress`: Function
  - `size`: 'small' | 'medium' | 'large'

---

### 7. `LoadingSkeleton`
- **Location:** `src/components/LoadingSkeleton.js`
- **Description:** Animated shimmer loading state placeholder for video cards, rows, and detailed screens.
