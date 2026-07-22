import React, { useRef, useCallback, useState, useMemo } from 'react';
import { TouchableOpacity, View, Text, Image, Animated, StyleSheet } from 'react-native';
import { SIZES, TYPOGRAPHY, ELEVATION } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { useCardSizes } from '../utils/responsive';
import FavoriteButton from './FavoriteButton';

const VideoCard = React.memo(function VideoCard({ video, onPress, onFavorite, style, large = false }) {
  const { colors } = useTheme();
  const { cardWidth, cardHeight } = useCardSizes();
  const cw = large ? cardWidth * 2 + SIZES.sm : cardWidth;
  const ch = large ? cw * 0.5625 : cardHeight;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imageOpacity = useRef(new Animated.Value(0)).current;

  const styles = useMemo(() => StyleSheet.create({
    container: { marginBottom: SIZES.sm },
    thumbnailContainer: { borderRadius: SIZES.radiusMd, overflow: 'hidden', backgroundColor: colors.surface, ...ELEVATION.level2 },
    thumbnail: { borderRadius: SIZES.radiusMd },
    placeholder: { position: 'absolute', top: 0, left: 0, backgroundColor: colors.shimmer, borderRadius: SIZES.radiusMd },
    errorPlaceholder: { backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center' },
    errorText: { fontSize: 24, color: colors.textSecondary },
    durationBadge: { position: 'absolute', bottom: SIZES.xs, right: SIZES.xs, backgroundColor: colors.overlay, paddingHorizontal: SIZES.xs, paddingVertical: 2, borderRadius: SIZES.radiusSm },
    durationText: { color: '#FFF', ...TYPOGRAPHY.captionBold },
    progressBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, backgroundColor: 'rgba(255,255,255,0.25)' },
    progressFill: { height: '100%', backgroundColor: colors.primary, borderTopRightRadius: 2, borderBottomRightRadius: 2 },
    favoriteOverlay: { position: 'absolute', top: SIZES.sm, right: SIZES.sm },
    info: { paddingTop: SIZES.xs },
    title: { color: colors.text, ...TYPOGRAPHY.label, marginBottom: 2 },
    meta: { flexDirection: 'row', alignItems: 'center' },
    metaText: { color: colors.textSecondary, ...TYPOGRAPHY.caption, flexShrink: 1 },
    dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.textSecondary, marginHorizontal: SIZES.xs },
  }), [colors]);

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, { toValue: 0.94, friction: 6, tension: 120, useNativeDriver: true }).start();
  }, []);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, { toValue: 1, friction: 6, tension: 120, useNativeDriver: true }).start();
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    Animated.timing(imageOpacity, { toValue: 1, duration: 250, useNativeDriver: true }).start();
  }, []);

  const formatViews = (views) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(0)}K`;
    return views.toString();
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <TouchableOpacity onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} activeOpacity={0.95} style={[styles.container, { width: cw }]} accessibilityLabel={`Watch ${video.title}`} accessibilityRole="button">
        <View style={[styles.thumbnailContainer, { width: cw, height: ch }]}>
          {!imageLoaded && !imageError && <View style={[styles.placeholder, { width: cw, height: ch }]} />}
          {imageError ? (
            <View style={[styles.placeholder, styles.errorPlaceholder, { width: cw, height: ch }]}>
              <Text style={styles.errorText}>▶</Text>
            </View>
          ) : (
            <Animated.Image source={{ uri: video.thumbnail }} style={[styles.thumbnail, { width: cw, height: ch, opacity: imageOpacity }]} resizeMode="cover" onLoad={handleImageLoad} onError={() => setImageError(true)} />
          )}
          <View style={styles.durationBadge}><Text style={styles.durationText}>{video.duration}</Text></View>
          {video.progress > 0 && (
            <View style={styles.progressBar}><View style={[styles.progressFill, { width: `${video.progress}%` }]} /></View>
          )}
          <View style={styles.favoriteOverlay}><FavoriteButton isFavorite={video.favorite} onPress={onFavorite} size="small" /></View>
        </View>
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{video.title}</Text>
          <View style={styles.meta}>
            <Text style={styles.metaText} numberOfLines={1}>{video.channel}</Text>
            <View style={styles.dot} />
            <Text style={[styles.metaText, { flexShrink: 0 }]} numberOfLines={1}>{formatViews(video.views)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

export default VideoCard;
