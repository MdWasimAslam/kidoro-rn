import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SIZES, TYPOGRAPHY, ELEVATION, SYSTEM_FONT } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { useFavoritesContext } from '../context/FavoritesContext';
import searchService from '../services/search.service';
import VideoCard from '../components/VideoCard';
import EmptyState from '../components/EmptyState';
import LoadingSkeleton from '../components/LoadingSkeleton';

const SearchScreen = React.memo(function SearchScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { colors, statusBarStyle } = useTheme();
  const { isFavorite, toggleFavorite } = useFavoritesContext();
  const [query, setQuery] = useState(route?.params?.query || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    searchHeader: {
      flexDirection: 'row', alignItems: 'center', paddingHorizontal: SIZES.lg, paddingVertical: SIZES.sm,
      borderBottomWidth: 1, borderBottomColor: colors.border,
    },
    backBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
    searchInputContainer: {
      flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
      borderRadius: SIZES.radiusMd, paddingHorizontal: SIZES.md, height: 48, marginLeft: SIZES.sm,
    },
    searchInput: { flex: 1, color: colors.text, fontSize: 15, fontWeight: '400', fontFamily: SYSTEM_FONT, marginLeft: SIZES.sm, height: '100%', paddingVertical: 0 },
    trendingSection: { padding: SIZES.lg },
    sectionTitle: { color: colors.text, ...TYPOGRAPHY.headingM, marginBottom: SIZES.md },
    trendingChips: { flexDirection: 'row', flexWrap: 'wrap', gap: SIZES.sm },
    trendingChip: {
      flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
      paddingHorizontal: SIZES.md, paddingVertical: SIZES.sm, borderRadius: SIZES.radiusLg, ...ELEVATION.level1,
    },
    trendingChipText: { color: colors.text, ...TYPOGRAPHY.label, marginLeft: SIZES.xs },
  }), [colors]);

  const performSearch = useCallback(async (q) => {
    setLoading(true);
    try {
      const raw = await searchService.searchVideos(q);
      const formatted = (raw || []).map(v => ({
        id: v.id,
        title: v.title,
        thumbnail: v.thumbnail_url || `https://img.youtube.com/vi/${v.video_id}/hqdefault.jpg`,
        youtubeId: v.video_id,
        channel: v.channel || '',
        views: v.views || 0,
        category: v.categories?.name || '',
        duration: v.duration,
      }));
      setResults(formatted);
    } catch (e) {
      setResults([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

  const handleSearch = useCallback((text) => {
    setQuery(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!text.trim()) { setResults([]); return; }
    debounceRef.current = setTimeout(() => performSearch(text), 400);
  }, [performSearch]);

  const handleVideoPress = useCallback((video) => {
    navigation.navigate('VideoPlayer', { video });
  }, [navigation]);

  const showEmpty = !query.trim() && !loading;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <StatusBar barStyle={statusBarStyle} backgroundColor={colors.background} />
      <View style={styles.searchHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} accessibilityLabel="Go back" hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.searchInputContainer}>
          <MaterialCommunityIcons name="magnify" size={20} color={colors.textSecondary} />
          <TextInput ref={inputRef} style={styles.searchInput} placeholder="Search videos..." placeholderTextColor={colors.textSecondary} value={query} onChangeText={handleSearch} autoFocus returnKeyType="search" accessibilityLabel="Search" />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')} accessibilityLabel="Clear">
              <MaterialCommunityIcons name="close-circle" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {showEmpty && (
        <EmptyState icon="movie-search-outline" title="Search Videos" message="Type to find your favorite videos" />
      )}

      {loading && <LoadingSkeleton count={4} type="list" />}
      {!loading && query.trim() && results.length === 0 && (
        <EmptyState icon="file-search-outline" title="No results found" message={`No videos matching "${query}"`} />
      )}
      {!loading && results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          numColumns={2}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          renderItem={({ item, index }) => (
            <VideoCard
              video={{ ...item, favorite: isFavorite(item.id) }}
              onPress={() => handleVideoPress(item)}
              onFavorite={() => toggleFavorite(item.id)}
              style={{ marginLeft: index % 2 === 0 ? SIZES.lg : SIZES.sm, marginRight: index % 2 === 0 ? SIZES.sm : SIZES.lg }}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: SIZES.sm, paddingBottom: 120 }}
        />
      )}
    </KeyboardAvoidingView>
  );
});

export default SearchScreen;
