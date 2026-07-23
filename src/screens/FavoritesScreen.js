import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, FlatList, RefreshControl, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SIZES, TYPOGRAPHY } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { useCardSizes } from '../utils/responsive';
import videoService from '../services/video.service';
import { useFavoritesContext } from '../context/FavoritesContext';
import VideoCard from '../components/VideoCard';
import EmptyState from '../components/EmptyState';
import LoadingSkeleton from '../components/LoadingSkeleton';

const FavoritesScreen = React.memo(function FavoritesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { colors, statusBarStyle } = useTheme();
  const { horizontalPadding, gap } = useCardSizes();
  const { favoriteIds, loaded, toggleFavorite } = useFavoritesContext();
  const [refreshing, setRefreshing] = useState(false);
  const [favoriteVideos, setFavoriteVideos] = useState([]);

  const loadFavorites = useCallback(async () => {
    try {
      const allVideos = await videoService.getVideos(100);
      const favs = allVideos
        .filter(v => v.favorite || favoriteIds.includes(v.id))
        .map(v => ({
          id: v.id,
          title: v.title,
          thumbnail: v.thumbnail_url || `https://img.youtube.com/vi/${v.video_id}/hqdefault.jpg`,
          youtubeId: v.video_id,
          channel: v.channel || '',
          views: v.views || 0,
          category: v.categories?.name || 'General',
          favorite: true,
          duration: v.duration,
        }));
      setFavoriteVideos(favs);
    } catch (e) {
      // load error, favorites unavailable
    }
  }, [favoriteIds]);

  React.useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
      paddingHorizontal: SIZES.lg, paddingVertical: SIZES.lg,
      borderBottomWidth: 1, borderBottomColor: colors.border,
    },
    headerTitle: { color: colors.text, ...TYPOGRAPHY.h2 },
    headerCount: { color: colors.textSecondary, ...TYPOGRAPHY.body },
    row: { paddingBottom: SIZES.sm },
    loading: { flex: 1 },
  }), [colors]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  }, [loadFavorites]);

  const handleVideoPress = useCallback((video) => {
    // Navigate to VideoPlayer via the root navigator
    navigation.getParent()?.navigate('Home', { screen: 'VideoPlayer', params: { video } });
  }, [navigation]);

  const renderItem = useCallback(({ item, index }) => (
    <VideoCard
      video={{ ...item, favorite: true }}
      onPress={() => handleVideoPress(item)}
      onFavorite={() => toggleFavorite(item.id)}
      style={{
        marginLeft: index % 2 === 0 ? horizontalPadding : gap / 2,
        marginRight: index % 2 === 0 ? gap / 2 : horizontalPadding,
      }}
    />
  ), [handleVideoPress, toggleFavorite]);

  const headerCount = loaded ? favoriteIds.length : '...';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle={statusBarStyle} backgroundColor={colors.background} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorites</Text>
        <Text style={styles.headerCount}>{headerCount} videos</Text>
      </View>
      {loaded && favoriteVideos.length === 0 ? (
        <EmptyState icon="heart-broken" title="No favorites yet" message="Tap the heart icon on any video to save it here" />
      ) : !loaded ? (
        <LoadingSkeleton count={6} type="card" />
      ) : (
        <FlatList
          data={favoriteVideos}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={renderItem}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </View>
  );
});

export default FavoritesScreen;
