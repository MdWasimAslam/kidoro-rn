# Component Index

| Component | File | Props | States | Notes |
|-----------|------|-------|--------|-------|
| VideoCard | `components/VideoCard.js` | video, onPress, onFavorite, large? | loading, error, loaded | 16:9 ratio, React.memo |
| ShortCard | `components/ShortCard.js` | short, active, onLike, onFavorite | Video+Image overlay | expo-av, hidden when tab unfocused |
| CategoryRow | `components/CategoryRow.js` | title, videos, loading?, error?, onVideoPress, onFavorite | loading (skeleton), error | Horizontal FlatList with snap |
| SectionTitle | `components/SectionTitle.js` | title, seeAll?, animated? | — | Fade+slide animation |
| SearchBar | `components/SearchBar.js` | onSearch, onVoicePress?, placeholder? | focused state | Pill-shaped, no wasted anim |
| Header | `components/Header.js` | title, subtitle?, rightComponent? | — | Safe area padding |
| FavoriteButton | `components/FavoriteButton.js` | isFavorite, onPress, size? | — | Spring scale on press |
| CategoryChip | `components/CategoryChip.js` | label, icon?, color?, selected?, onPress | selected state | Color transition |
| ProfileCard | `components/ProfileCard.js` | profile | — | Avatar, XP bar (not currently used) |
| PlaylistCard | `components/PlaylistCard.js` | playlist, onPress | — | Icon + name + arrow |
| EmptyState | `components/EmptyState.js` | icon?, title?, message? | — | Fade+slide animation |
| LoadingSkeleton | `components/LoadingSkeleton.js` | count?, type? (card/list/short) | — | Shimmer loop |
| PlayerControls | `components/PlayerControls.js` | playing, onPlayPause, onForward, onBackward, onFullscreen, progress, duration | — | Not currently used (YouTube iframe instead) |
| AccessCodeCard | `components/AccessCodeCard.js` | onSubmit, loading? | error state | Shake animation |

## Status
- **Active**: VideoCard, ShortCard, CategoryRow, SectionTitle, SearchBar, Header, FavoriteButton, CategoryChip, EmptyState, LoadingSkeleton, AccessCodeCard
- **Unused**: ProfileCard, PlayerControls, PlaylistCard (playlists screen exists but cards not linked)
