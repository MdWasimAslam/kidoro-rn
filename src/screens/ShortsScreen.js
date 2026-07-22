import React, { useRef, useCallback, useMemo } from 'react';
import { View, FlatList, StyleSheet, StatusBar, useWindowDimensions } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import shortsService from '../services/shorts.service';
import { useFavoritesContext } from '../context/FavoritesContext';
import ShortCard from '../components/ShortCard';

const ShortsScreen = React.memo(function ShortsScreen() {
  const { height } = useWindowDimensions();
  const flatListRef = useRef(null);
  const isFocused = useIsFocused();
  const { favoriteIds, toggleFavorite } = useFavoritesContext();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [shortsData, setShortsData] = React.useState([]);

  React.useEffect(() => {
    let mounted = true;
    shortsService.getShorts(30).then(data => {
      if (mounted && data) {
        const formatted = data.map(s => ({
          id: s.id,
          title: s.title,
          url: s.youtube_url,
          video_id: s.video_id,
          thumbnail: s.thumbnail_url || `https://img.youtube.com/vi/${s.video_id}/hqdefault.jpg`,
          description: s.description || '',
          tags: s.tags || '',
        }));
        setShortsData(formatted);
      }
    });
    return () => { mounted = false; };
  }, []);

  const shortsWithFav = useMemo(
    () => shortsData.map(s => ({ ...s, favorite: favoriteIds.includes(s.id) })),
    [shortsData, favoriteIds]
  );

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 80 }).current;

  const renderItem = useCallback(({ item, index }) => (
    <ShortCard short={item} active={isFocused && index === currentIndex} onFavorite={() => toggleFavorite(item.id)} />
  ), [isFocused, currentIndex, toggleFavorite]);

  const keyExtractor = useCallback((item) => item.id, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <FlatList
        ref={flatListRef}
        data={shortsWithFav}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        extraData={{ isFocused, currentIndex }}
        snapToInterval={height}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_, index) => ({ length: height, offset: height * index, index })}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={3}
        removeClippedSubviews={true}
      />
    </View>
  );
});

export default ShortsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
});
