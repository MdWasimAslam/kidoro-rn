import React, { useState, useCallback, useRef, useMemo } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SIZES, TYPOGRAPHY, ELEVATION } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { getSearchResults } from '../mock/videos';
import { trendingSearches } from '../mock/categories';
import VideoCard from '../components/VideoCard';
import EmptyState from '../components/EmptyState';
import LoadingSkeleton from '../components/LoadingSkeleton';

const SearchScreen = React.memo(function SearchScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { colors, statusBarStyle } = useTheme();
  const [query, setQuery] = useState(route?.params?.query || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

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
    searchInput: { flex: 1, color: colors.text, ...TYPOGRAPHY.body, marginLeft: SIZES.sm, height: '100%' },
    trendingSection: { padding: SIZES.lg },
    sectionTitle: { color: colors.text, ...TYPOGRAPHY.headingM, marginBottom: SIZES.md },
    trendingChips: { flexDirection: 'row', flexWrap: 'wrap', gap: SIZES.sm },
    trendingChip: {
      flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
      paddingHorizontal: SIZES.md, paddingVertical: SIZES.sm, borderRadius: SIZES.radiusLg, ...ELEVATION.level1,
    },
    trendingChipText: { color: colors.text, ...TYPOGRAPHY.label, marginLeft: SIZES.xs },
  }), [colors]);

  const handleSearch = useCallback((text) => {
    setQuery(text);
    if (text.trim()) {
      setLoading(true);
      setTimeout(() => { setResults(getSearchResults(text)); setLoading(false); }, 300);
    } else { setResults([]); }
  }, []);

  const handleTrendingPress = useCallback((term) => {
    setQuery(term); setLoading(true);
    setTimeout(() => { setResults(getSearchResults(term)); setLoading(false); }, 300);
  }, []);

  const handleVideoPress = useCallback((video) => {
    navigation.navigate('VideoPlayer', { video });
  }, [navigation]);

  const showTrending = !query.trim() && !loading;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
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

      {showTrending && (
        <View style={styles.trendingSection}>
          <Text style={styles.sectionTitle}>Trending Searches</Text>
          <View style={styles.trendingChips}>
            {trendingSearches.map((term, i) => (
              <TouchableOpacity key={i} style={styles.trendingChip} onPress={() => handleTrendingPress(term)} accessibilityLabel={term}>
                <MaterialCommunityIcons name="trending-up" size={16} color={colors.primary} />
                <Text style={styles.trendingChipText}>{term}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
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
          renderItem={({ item, index }) => (
            <VideoCard video={item} onPress={() => handleVideoPress(item)} onFavorite={() => item.favorite = !item.favorite} style={index % 2 === 0 ? { marginLeft: SIZES.lg } : { marginRight: SIZES.lg }} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: SIZES.sm, paddingBottom: 120 }}
        />
      )}
    </View>
  );
});

export default SearchScreen;
