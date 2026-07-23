import React, { useState, useCallback, useRef, useMemo } from 'react';
import { View, Text, Animated, RefreshControl, StyleSheet, StatusBar, FlatList, TouchableOpacity, ScrollView, useWindowDimensions, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, TYPOGRAPHY, ELEVATION } from '../constants/theme';
import { useFavoritesContext } from '../context/FavoritesContext';
import { useCardSizes } from '../utils/responsive';
import { normalizeIcon } from '../utils/icons';
import { useAppConfigContext } from '../context/AppConfigContext';
import videoService from '../services/video.service';
import categoryService from '../services/category.service';
import { getActiveChild } from '../services/api';
import { useContinueWatchingContext } from '../context/ContinueWatchingContext';
import VideoCard from '../components/VideoCard';

const PAGE_SIZE = 20;
const LOAD_MORE = 10;

function shuffleExcluding(arr, excludeSet, count) {
  const available = arr.filter(v => !excludeSet.has(v.id));
  for (let i = available.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [available[i], available[j]] = [available[j], available[i]];
  }
  return available.slice(0, count);
}

const HomeScreen = React.memo(function HomeScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const { cardWidth, cardHeight, gap, horizontalPadding } = useCardSizes();
  const heroH = Math.min(width * 0.45, 280);
  const insets = useSafeAreaInsets();
  const { isFavorite, toggleFavorite } = useFavoritesContext();
  const appConfig = useAppConfigContext();
  const homeConfig = appConfig?.config?.home || {};
  const featuresConfig = appConfig?.config?.features || {};
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const greetingAnim = useRef(new Animated.Value(0)).current;
  const shownIds = useRef(new Set());

  const { recentVideos: continueWatchVideos, loaded: continueWatchLoaded } = useContinueWatchingContext();

  const [recommendedList, setRecommendedList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [trending, setTrending] = useState([]);
  const [childName, setChildName] = useState('Explorer');
  const [avatarUrl, setAvatarUrl] = useState(null);

  const loadBackendData = useCallback(async () => {
    try {
      const activeChild = await getActiveChild();
      if (activeChild && activeChild.name) {
        setChildName(activeChild.name);
      }
      if (activeChild && activeChild.avatar_url) {
        setAvatarUrl(activeChild.avatar_url);
      }

      const [fetchedVideos, fetchedCategories, featured] = await Promise.all([
        videoService.getVideos(30),
        categoryService.getCategories(),
        videoService.getFeaturedVideos(),
      ]);

      const formattedVideos = fetchedVideos.map(v => ({
        id: v.id,
        title: v.title,
        thumbnail: v.thumbnail_url || `https://img.youtube.com/vi/${v.video_id}/hqdefault.jpg`,
        youtubeId: v.video_id,
        channel: v.channel || '',
        views: v.views || 0,
        category: v.categories?.name || 'General',
        favorite: v.favorite || false,
        duration: v.duration || '',
      }));

      for (let i = formattedVideos.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [formattedVideos[i], formattedVideos[j]] = [formattedVideos[j], formattedVideos[i]];
      }

      setRecommendedList(formattedVideos);
      setCategoriesList(fetchedCategories);
      setTrending(featured.length > 0 ? [featured[0]] : formattedVideos.slice(0, 1));
    } catch (e) {
      // data load error
    }
  }, []);

  React.useEffect(() => {
    loadBackendData();
    Animated.spring(greetingAnim, { toValue: 1, friction: 6, tension: 40, useNativeDriver: true }).start();
  }, [loadBackendData]);

  const continueWatching = useMemo(() => {
    if (!continueWatchLoaded) return [];
    return continueWatchVideos.slice(0, 5).map(v => ({ ...v, favorite: isFavorite(v.id) }));
  }, [continueWatchVideos, continueWatchLoaded, isFavorite]);
  const recommendedGrid = useMemo(() => {
    if (selectedCategory) return recommendedList.filter(v => v.category === selectedCategory);
    return recommendedList;
  }, [recommendedList, selectedCategory]);

  const handleSearch = useCallback(() => navigation.navigate('Search', {}), [navigation]);
  const handleVideoPress = useCallback((video) => navigation.navigate('VideoPlayer', { video }), [navigation]);
  const handleFavorite = useCallback((videoId) => toggleFavorite(videoId), [toggleFavorite]);

  const handleCategoryPress = useCallback((cat) => {
    setSelectedCategory(prev => prev === cat.name ? null : cat.name);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadBackendData();
    setRefreshing(false);
  }, [loadBackendData]);

  const onEndReached = useCallback(() => {}, []);

  const halfGap = gap / 2;
  const renderItem = useCallback(({ item, index }) => (
    <View style={{
      marginLeft: index % 2 === 0 ? horizontalPadding : halfGap,
      marginRight: index % 2 === 0 ? halfGap : horizontalPadding,
      marginBottom: SIZES.md,
    }}>
      <VideoCard video={{ ...item, favorite: isFavorite(item.id) }} onPress={() => handleVideoPress(item)} onFavorite={() => handleFavorite(item.id)} />
    </View>
  ), [horizontalPadding, halfGap, isFavorite, handleVideoPress, handleFavorite]);

  const ListHeader = useCallback(() => (
    <View>
      <View style={[styles.heroSection, { paddingTop: insets.top + SIZES.lg, paddingHorizontal: horizontalPadding }]}>
        <Animated.View style={{ opacity: greetingAnim, transform: [{ translateY: greetingAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}>
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              {avatarUrl ? <Image source={{ uri: avatarUrl }} style={styles.avatarImage} /> : <MaterialCommunityIcons name="account" size={28} color={COLORS.primary} />}
            </View>
            <View style={styles.greetingWrap}>
              <Text style={styles.greeting} numberOfLines={1}>Hello, {childName}! 👋</Text>
              <Text style={styles.greetingSub}>Ready to learn something fun today?</Text>
            </View>
          </View>
        </Animated.View>

        {featuresConfig.enableSearch !== false && (
        <Animated.View style={{ opacity: greetingAnim, transform: [{ translateY: greetingAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }] }}>
          <TouchableOpacity onPress={handleSearch} activeOpacity={0.9} accessibilityLabel="Search videos" style={styles.searchPill}>
            <LinearGradient colors={[COLORS.primary + '18', COLORS.blue + '12']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.searchGradient}>
              <MaterialCommunityIcons name="magnify" size={22} color={COLORS.primary} style={{ marginRight: SIZES.sm }} />
              <Text style={styles.searchPlaceholder}>Search videos...</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
        )}

        {homeConfig.showCategories !== false && (
        <Animated.View style={{ opacity: greetingAnim }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow} style={{ marginTop: SIZES.md }}>
            {categoriesList.slice(0, 8).map((cat) => {
              const isActive = selectedCategory === cat.name;
              return (
                <TouchableOpacity key={cat.id} onPress={() => handleCategoryPress(cat)} style={[styles.chip, isActive && styles.chipActive]} accessibilityLabel={`Filter by ${cat.name}`} activeOpacity={0.7}>
                  <MaterialCommunityIcons name={normalizeIcon(cat.icon)} size={16} color={isActive ? '#FFFFFF' : COLORS.textSecondary} style={{ marginRight: SIZES.xs }} />
                  <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{cat.name}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Animated.View>
        )}
      </View>

      {!selectedCategory && homeConfig.showFeatured !== false && homeConfig.showBanner !== false && (
      <View style={{ paddingHorizontal: horizontalPadding, marginBottom: SIZES.md }}>
        {trending.map((v) => (
          <TouchableOpacity key={v.id} onPress={() => handleVideoPress(v)} activeOpacity={0.95} accessibilityLabel={`Watch ${v.title}`}>
            <View style={[styles.heroCard, { height: heroH }]}>
              <Animated.Image source={{ uri: v.thumbnail }} style={styles.heroImage} resizeMode="cover" />
              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)']} style={styles.heroGradient}>
                <View style={styles.heroBadge}>
                  <MaterialCommunityIcons name="fire" size={14} color="#FFF" />
                  <Text style={styles.heroBadgeText}>{homeConfig.bannerTitle || 'Trending'}</Text>
                </View>
                <Text style={styles.heroTitle} numberOfLines={2}>{v.title}</Text>
                <Text style={styles.heroMeta}>{v.channel}</Text>
              </LinearGradient>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      )}

      {!selectedCategory && homeConfig.showContinueWatching !== false && continueWatching.length > 0 && (
        <View style={styles.continueSection}>
          <Text style={[styles.sectionTitle, { paddingHorizontal: horizontalPadding }]}>Continue Watching</Text>
          <FlatList
            data={continueWatching}
            keyExtractor={(item) => item.id}
            horizontal showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: horizontalPadding, paddingRight: horizontalPadding }}
            snapToInterval={cardWidth + gap} decelerationRate="fast"
            renderItem={({ item, index }) => (
              <View style={index < continueWatching.length - 1 && { marginRight: gap }}>
                <VideoCard video={item} onPress={() => handleVideoPress(item)} onFavorite={() => handleFavorite(item.id)} />
              </View>
            )}
          />
        </View>
      )}

      {!selectedCategory && (
      <View style={{ paddingHorizontal: horizontalPadding }}>
        <Text style={styles.sectionTitle}>Recommended For You</Text>
      </View>
      )}
    </View>
  ), [insets.top, horizontalPadding, cardWidth, gap, greetingAnim, heroH, trending, continueWatching, handleSearch, handleVideoPress, handleFavorite, isFavorite, childName, avatarUrl, categoriesList, selectedCategory, handleCategoryPress]);

  const ListFooter = useCallback(() => {
    if (!hasMore) return <Text style={styles.endText}>You're all caught up! 🎉</Text>;
    if (loadingMore) return <View style={{ padding: SIZES.xl, alignItems: 'center' }}><Text style={{ color: COLORS.textSecondary }}>Loading more...</Text></View>;
    return null;
  }, [hasMore, loadingMore]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <FlatList
        data={recommendedGrid}
        renderItem={renderItem}
        keyExtractor={(item) => `rec_${item.id}`}
        numColumns={2}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.3}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 90 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} colors={[COLORS.primary]} />}
        windowSize={5} initialNumToRender={10} maxToRenderPerBatch={10}
        extraData={isFavorite}
      />
    </View>
  );
});

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  heroSection: { paddingBottom: SIZES.lg },
  profileRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SIZES.lg },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: COLORS.primary + '15', justifyContent: 'center', alignItems: 'center', marginRight: SIZES.md, overflow: 'hidden' },
  avatarImage: { width: 52, height: 52, borderRadius: 26 },
  greetingWrap: { flex: 1 },
  greeting: { color: COLORS.text, ...TYPOGRAPHY.h3 },
  greetingSub: { color: COLORS.textSecondary, ...TYPOGRAPHY.body, marginTop: 2 },
  searchPill: { borderRadius: SIZES.radiusMd, overflow: 'hidden' },
  searchGradient: { flexDirection: 'row', alignItems: 'center', height: 52, paddingHorizontal: SIZES.lg, borderRadius: SIZES.radiusMd },
  searchPlaceholder: { color: COLORS.textSecondary, ...TYPOGRAPHY.body, flex: 1 },
  chipRow: { gap: SIZES.sm, paddingVertical: SIZES.xs },
  chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SIZES.md, paddingVertical: SIZES.sm, borderRadius: 20, backgroundColor: COLORS.surface, borderWidth: 1.5, borderColor: COLORS.border },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { color: COLORS.textSecondary, ...TYPOGRAPHY.caption },
  chipTextActive: { color: '#FFFFFF' },
  sectionTitle: { color: COLORS.text, ...TYPOGRAPHY.h3, marginBottom: SIZES.sm },
  continueSection: { marginBottom: SIZES.sm },
  heroCard: { borderRadius: SIZES.radiusLg, overflow: 'hidden', ...ELEVATION.level2 },
  heroImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  heroGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: SIZES.lg, paddingTop: SIZES.xxl },
  heroBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary, alignSelf: 'flex-start', paddingHorizontal: SIZES.sm, paddingVertical: 2, borderRadius: SIZES.radiusSm, marginBottom: SIZES.sm },
  heroBadgeText: { color: '#FFF', ...TYPOGRAPHY.captionBold, marginLeft: 4 },
  heroTitle: { color: '#FFF', ...TYPOGRAPHY.h2, marginBottom: 4 },
  heroMeta: { color: 'rgba(255,255,255,0.8)', ...TYPOGRAPHY.caption },
  endText: { textAlign: 'center', padding: SIZES.xl, color: COLORS.textSecondary, ...TYPOGRAPHY.body },
});
