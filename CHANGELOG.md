# Kidora Changelog

All notable changes to the Kidora UI/UX codebase are documented here.

---

## [1.1.1] - App Config Fixes & Documentation Update

### Fixed
- **SettingsScreen Bug:** `appConfig?.features` → `appConfig?.config?.features` — the dark mode toggle was ignoring the `enableDarkMode` config value from Supabase because `features` is nested under `.config` in the context object.
- **BASE_URL Default:** Changed from `http://10.0.2.2:3000` (Android-emulator-only) to `http://localhost:3000` — the custom backend was unreachable on Windows, causing all custom API calls to fall through to Supabase.

### Updated
- All `.ai-memory/*.md` files synchronized with latest architecture, data flow, and known issues
- `docs/SUPABASE_SCHEMA.md` updated with correct shorts MP4 URL info, dead `toggleFavorite` note, and BASE_URL fix
- `docs/APP_MANAGEMENT_API_DOCUMENTATION.md` updated BASE_URL examples
- `CHANGELOG.md` — this entry added

---

## [1.1.0] - Complete UI/UX Redesign & Audit Fixes

### Added
- Comprehensive Design System (`docs/DESIGN_SYSTEM.md`) with 8-point spatial grid, 10-level typography scale, elevation shadows, and color tokens.
- Full UI/UX Audit report (`docs/reports/UI_AUDIT.md`) detailing observations, root causes, severities, and fixes.
- Performance optimization benchmarks (`docs/reports/PERFORMANCE_REPORT.md`).
- Component architecture guide (`docs/COMPONENT_GUIDE.md`).
- Implementation & Refactoring report (`docs/reports/IMPLEMENTATION_REPORT.md`).

### Fixed
- **Header Layout:** Resolved top safe area crowding, added hero greeting hierarchy, and aligned cast action buttons.
- **Search Bar:** Increased height to 52px, improved shadow elevation, and centered voice/clear action buttons.
- **Horizontal Cards Clipping:** Added right-edge padding to FlatList carousels and snap alignments.
- **Video Cards & Thumbnails:** Standardized 16:9 aspect ratios, 4px progress bar, 8px badge insets, image fallback views, and loading skeletons.
- **Bottom Navigation:** Replaced flat bottom tab bar with elevated floating navigation pill bar.
- **Typography & Spacing:** Replaced hardcoded values with 8-point spatial grid and typography tokens.
