import React, { useMemo } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { SIZES } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { useCardSizes } from '../utils/responsive';
import SectionTitle from './SectionTitle';
import VideoCard from './VideoCard';

const CategoryRow = React.memo(function CategoryRow({ title, videos, loading, error, onVideoPress, onFavorite, seeAll }) {
  const { colors } = useTheme();
  const { cardWidth, gap, horizontalPadding } = useCardSizes();

  const styles = useMemo(() => StyleSheet.create({
    container: { marginBottom: SIZES.md },
    loadingRow: { flexDirection: 'row' },
    skeletonBox: { backgroundColor: colors.shimmer, borderRadius: SIZES.radiusMd },
    skeletonLine: { height: 12, backgroundColor: colors.shimmer, borderRadius: SIZES.radiusSm },
    errorBox: { height: 100, backgroundColor: colors.error + '15', borderRadius: SIZES.radiusMd, borderWidth: 1, borderColor: colors.error + '25' },
  }), [colors]);

  if (loading) {
    return (
      <View style={styles.container}>
        <SectionTitle title={title} />
        <View style={[styles.loadingRow, { paddingLeft: horizontalPadding, gap }]}>
          {Array.from({ length: 4 }, (_, i) => (
            <View key={i} style={{ width: cardWidth }}>
              <View style={[styles.skeletonBox, { width: cardWidth, height: cardWidth * 0.5625 }]} />
              <View style={[styles.skeletonLine, { width: '80%', marginTop: SIZES.sm }]} />
              <View style={[styles.skeletonLine, { width: '60%', marginTop: SIZES.xs }]} />
            </View>
          ))}
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <SectionTitle title={title} />
        <View style={{ paddingHorizontal: horizontalPadding }}>
          <View style={styles.errorBox} />
        </View>
      </View>
    );
  }

  if (!videos || videos.length === 0) return null;

  return (
    <View style={styles.container}>
      <SectionTitle title={title} seeAll={seeAll} />
      <FlatList
        data={videos}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: horizontalPadding, paddingRight: horizontalPadding }}
        decelerationRate="fast"
        snapToInterval={cardWidth + gap}
        snapToAlignment="start"
        renderItem={({ item, index }) => (
          <View style={index < videos.length - 1 && { marginRight: gap }}>
            <VideoCard video={item} onPress={() => onVideoPress && onVideoPress(item)} onFavorite={() => onFavorite && onFavorite(item)} />
          </View>
        )}
      />
    </View>
  );
});

export default CategoryRow;
