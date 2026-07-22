import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, FlatList, RefreshControl, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SIZES, TYPOGRAPHY } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import videoService from '../services/video.service';
import { useFavoritesContext } from '../context/FavoritesContext';
import VideoCard from '../components/VideoCard';
import EmptyState from '../components/EmptyState';

const FavoritesScreen = React.memo(function FavoritesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { colors, statusBarStyle } = useTheme();
  const { favoriteIds, loaded, toggleFavorite } = useFavoritesContext();
  const [refreshing, setRefreshing] = useState(false);
  const [favoriteVideos, setFavoriteVideos] = useState([]);

  const loadFavorites = useCallback(async () => {
    try {
      const allVideos = await videoService.getVideos(50);
      const favs = allVideos
        .filter(v => v.favorite || favoriteIds.includes(v.id))
        .map(v => ({
          id: v.id,
          title: v.title,
          thumbnail: v.thumbnail_url || `https://img.youtube.com/vi/${v.video_id}/hqdefault.jpg`,
          youtubeId: v.video_id,
          category: v.categories?.name || 'General',
          favorite: true,
        }));
      setFavoriteVideos(favs);
    } catch (e) {
      console.error('[FavoritesScreen] Error:', e.message);
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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  }, []);

  const handleVideoPress = useCallback((video) => {
    navigation.navigate('VideoPlayer', { video });
  }, [navigation]);

  const renderItem = useCallback(({ item, index }) => (
    <VideoCard
      video={{ ...item, favorite: true }}
      onPress={() => handleVideoPress(item)}
      onFavorite={() => toggleFavorite(item.id)}
      style={index % 2 === 0 ? { marginLeft: SIZES.lg } : { marginRight: SIZES.lg }}
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
        <View style={styles.loading} />
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
