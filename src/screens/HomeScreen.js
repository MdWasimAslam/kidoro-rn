import React, { useState, useCallback, useRef, useMemo } from 'react';
import { View, Text, Animated, RefreshControl, StyleSheet, StatusBar, FlatList, TouchableOpacity, ScrollView, ActivityIndicator, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SIZES, TYPOGRAPHY, ELEVATION } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { useFavoritesContext } from '../context/FavoritesContext';
import { useCardSizes } from '../utils/responsive';
import useStreak from '../hooks/useStreak';
import { categories } from '../mock/categories';
import { profile } from '../mock/profile';
import { videos, getContinueWatching, getTrendingVideos } from '../mock/videos';
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
  const insets = useSafeAreaInsets();
  const { colors, statusBarStyle } = useTheme();
  const { isFavorite, toggleFavorite } = useFavoritesContext();
  // Auto-increment daily streak on app launch
  useStreak();
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const greetingAnim = useRef(new Animated.Value(0)).current;
  const shownIds = useRef(new Set());
  const flatListRef = useRef(null);

  const [recommendedList, setRecommendedList] = useState(() => {
    const batch = shuffleExcluding(videos, shownIds.current, PAGE_SIZE);
    batch.forEach(v => shownIds.current.add(v.id));
    return batch;
  });

  React.useEffect(() => {
    Animated.spring(greetingAnim, { toValue: 1, friction: 6, tension: 40, useNativeDriver: true }).start();
  }, []);

  const heroH = Math.min(width * 0.45, 280);
  const continueWatching = useMemo(() => getContinueWatching().slice(0, 6).map(v => ({ ...v, favorite: isFavorite(v.id) })), [isFavorite]);
  const trending = useMemo(() => getTrendingVideos().slice(0, 1).map(v => ({ ...v, favorite: isFavorite(v.id) })), [isFavorite]);

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    heroSection: { paddingBottom: SIZES.lg },
    profileRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SIZES.lg },
    avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.primary + '15', justifyContent: 'center', alignItems: 'center', marginRight: SIZES.md },
    greetingWrap: { flex: 1 },
    greeting: { color: colors.text, ...TYPOGRAPHY.h3 },
    greetingSub: { color: colors.textSecondary, ...TYPOGRAPHY.body, marginTop: 2 },
    searchPill: { borderRadius: SIZES.radiusMd, overflow: 'hidden' },
    searchGradient: { flexDirection: 'row', alignItems: 'center', height: 52, paddingHorizontal: SIZES.lg, borderRadius: SIZES.radiusMd },
    searchPlaceholder: { color: colors.textSecondary, ...TYPOGRAPHY.body, flex: 1 },
    chipRow: { gap: SIZES.sm, paddingVertical: SIZES.xs },
    chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SIZES.md, paddingVertical: SIZES.sm, borderRadius: 20, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border },
    chipText: { color: colors.textSecondary, ...TYPOGRAPHY.caption },
    sectionTitle: { color: colors.text, ...TYPOGRAPHY.h3, marginBottom: SIZES.sm },
    continueSection: { marginBottom: SIZES.sm },
    heroCard: { borderRadius: SIZES.radiusLg, overflow: 'hidden', ...ELEVATION.level2 },
    heroImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
    heroGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: SIZES.lg, paddingTop: SIZES.xxl },
    heroBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary, alignSelf: 'flex-start', paddingHorizontal: SIZES.sm, paddingVertical: 2, borderRadius: SIZES.radiusSm, marginBottom: SIZES.sm },
    heroBadgeText: { color: '#FFF', ...TYPOGRAPHY.captionBold, marginLeft: 4 },
    heroTitle: { color: '#FFF', ...TYPOGRAPHY.h2, marginBottom: 4 },
    heroMeta: { color: 'rgba(255,255,255,0.8)', ...TYPOGRAPHY.caption },
    endText: { textAlign: 'center', padding: SIZES.xl, color: colors.textSecondary, ...TYPOGRAPHY.body },
  }), [colors]);

  const handleSearch = useCallback(() => navigation.navigate('Search', {}), [navigation]);
  const handleVideoPress = useCallback((video) => navigation.navigate('VideoPlayer', { video }), [navigation]);
  const handleFavorite = useCallback((videoId) => toggleFavorite(videoId), [toggleFavorite]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      shownIds.current.clear();
      const batch = shuffleExcluding(videos, shownIds.current, PAGE_SIZE);
      batch.forEach(v => shownIds.current.add(v.id));
      setRecommendedList(batch);
      setHasMore(true);
      setRefreshing(false);
    }, 800);
  }, []);

  const onEndReached = useCallback(() => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      const batch = shuffleExcluding(videos, shownIds.current, LOAD_MORE);
      if (batch.length === 0) setHasMore(false);
      else { batch.forEach(v => shownIds.current.add(v.id)); setRecommendedList(prev => [...prev, ...batch]); }
      setLoadingMore(false);
    }, 500);
  }, [hasMore, loadingMore]);

  const renderItem = useCallback(({ item, index }) => {
    const isEven = index % 2 === 0;
    return (
      <View style={{ marginLeft: isEven ? horizontalPadding : 0, marginRight: isEven ? 0 : horizontalPadding, marginBottom: SIZES.md }}>
        <VideoCard video={{ ...item, favorite: isFavorite(item.id) }} onPress={() => handleVideoPress(item)} onFavorite={() => handleFavorite(item.id)} />
      </View>
    );
  }, [horizontalPadding, isFavorite, handleVideoPress, handleFavorite]);

  const ListHeader = useCallback(() => (
    <View>
      <View style={[styles.heroSection, { paddingTop: insets.top + SIZES.lg, paddingHorizontal: horizontalPadding }]}>
        <Animated.View style={{ opacity: greetingAnim, transform: [{ translateY: greetingAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}>
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <MaterialCommunityIcons name="account" size={28} color={colors.primary} />
            </View>
            <View style={styles.greetingWrap}>
              <Text style={styles.greeting} numberOfLines={1}>Hello, {profile.name}! 👋</Text>
              <Text style={styles.greetingSub}>Ready to learn something fun today?</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={{ opacity: greetingAnim, transform: [{ translateY: greetingAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }] }}>
          <TouchableOpacity onPress={handleSearch} activeOpacity={0.9} accessibilityLabel="Search videos" style={styles.searchPill}>
            <LinearGradient colors={[colors.primary + '18', colors.blue + '12']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.searchGradient}>
              <MaterialCommunityIcons name="magnify" size={22} color={colors.primary} style={{ marginRight: SIZES.sm }} />
              <Text style={styles.searchPlaceholder}>Search videos...</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={{ opacity: greetingAnim }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow} style={{ marginTop: SIZES.md }}>
            {categories.slice(0, 8).map((cat) => (
              <TouchableOpacity key={cat.id} style={[styles.chip]} accessibilityLabel={cat.name} activeOpacity={0.7}>
                <MaterialCommunityIcons name={cat.icon} size={16} color={colors.textSecondary} style={{ marginRight: SIZES.xs }} />
                <Text style={styles.chipText}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      </View>

      <View style={{ paddingHorizontal: horizontalPadding, marginBottom: SIZES.md }}>
        {trending.map((v) => (
          <TouchableOpacity key={v.id} onPress={() => handleVideoPress(v)} activeOpacity={0.95} accessibilityLabel={`Watch ${v.title}`}>
            <View style={[styles.heroCard, { height: heroH }]}>
              <Animated.Image source={{ uri: v.thumbnail }} style={styles.heroImage} resizeMode="cover" />
              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)']} style={styles.heroGradient}>
                <View style={styles.heroBadge}>
                  <MaterialCommunityIcons name="fire" size={14} color="#FFF" />
                  <Text style={styles.heroBadgeText}>Trending</Text>
                </View>
                <Text style={styles.heroTitle} numberOfLines={2}>{v.title}</Text>
                <Text style={styles.heroMeta}>{v.channel}</Text>
              </LinearGradient>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {continueWatching.length > 0 && (
        <View style={styles.continueSection}>
          <Text style={[styles.sectionTitle, { paddingHorizontal: horizontalPadding }]}>Continue Watching</Text>
          <FlatList
            data={continueWatching}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: horizontalPadding, paddingRight: horizontalPadding }}
            snapToInterval={cardWidth + gap}
            decelerationRate="fast"
            renderItem={({ item, index }) => (
              <View style={index < continueWatching.length - 1 && { marginRight: gap }}>
                <VideoCard video={item} onPress={() => handleVideoPress(item)} onFavorite={() => handleFavorite(item.id)} />
              </View>
            )}
          />
        </View>
      )}

      <View style={{ paddingHorizontal: horizontalPadding, marginTop: SIZES.lg, marginBottom: SIZES.md }}>
        <Text style={styles.sectionTitle}>Recommended For You</Text>
      </View>
    </View>
  ), [insets.top, horizontalPadding, cardWidth, gap, greetingAnim, heroH, trending, continueWatching, handleSearch, handleVideoPress, handleFavorite, isFavorite, colors, styles]);

  const ListFooter = useCallback(() => {
    if (!hasMore) return <Text style={styles.endText}>You're all caught up! 🎉</Text>;
    if (loadingMore) return <ActivityIndicator size="small" color={colors.primary} style={{ padding: SIZES.xl }} />;
    return null;
  }, [hasMore, loadingMore, colors, styles]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={statusBarStyle} backgroundColor={colors.background} />
      <FlatList
        ref={flatListRef}
        data={recommendedList}
        renderItem={renderItem}
        keyExtractor={(item) => `rec_${item.id}`}
        numColumns={2}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.3}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 90 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />}
        removeClippedSubviews={false}
        windowSize={5}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        extraData={isFavorite}
      />
    </View>
  );
});

export default HomeScreen;
