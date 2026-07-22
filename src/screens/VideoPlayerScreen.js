import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Animated, StyleSheet, StatusBar, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import YoutubeIframe from 'react-native-youtube-iframe';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SIZES, TYPOGRAPHY } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { videos } from '../mock/videos';
import { useFavoritesContext } from '../context/FavoritesContext';
import VideoCard from '../components/VideoCard';

const PulseLoader = React.memo(function PulseLoader() {
  const ringScale = useRef(new Animated.Value(1)).current;
  const ringOpacity = useRef(new Animated.Value(0.6)).current;
  const innerScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const ringAnim = Animated.loop(
      Animated.parallel([
        Animated.timing(ringScale, { toValue: 1.6, duration: 1200, useNativeDriver: true }),
        Animated.timing(ringOpacity, { toValue: 0, duration: 1200, useNativeDriver: true }),
      ])
    );
    const innerAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(innerScale, { toValue: 1.08, duration: 600, useNativeDriver: true }),
        Animated.timing(innerScale, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    );
    ringAnim.start();
    innerAnim.start();
    return () => { ringAnim.stop(); innerAnim.stop(); };
  }, []);

  return (
    <View style={{ width: 96, height: 96, justifyContent: 'center', alignItems: 'center' }}>
      <Animated.View style={{
        position: 'absolute', width: 72, height: 72, borderRadius: 36,
        borderWidth: 3, borderColor: '#FF4D4D',
        opacity: ringOpacity, transform: [{ scale: ringScale }],
      }} />
      <Animated.View style={{
        width: 56, height: 56, borderRadius: 28,
        backgroundColor: 'rgba(255,77,77,0.5)',
        justifyContent: 'center', alignItems: 'center',
        transform: [{ scale: innerScale }],
      }}>
        <MaterialCommunityIcons name="play" size={28} color="#FFF" style={{ marginLeft: 3 }} />
      </Animated.View>
    </View>
  );
});

const VideoPlayerScreen = React.memo(function VideoPlayerScreen({ route, navigation }) {
  const { width } = useWindowDimensions();
  const PLAYER_HEIGHT = width * 0.5625;
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { video } = route.params;
  const { isFavorite, toggleFavorite } = useFavoritesContext();
  const [playing, setPlaying] = useState(true);
  const [playerReady, setPlayerReady] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const thumbnailOpacity = useRef(new Animated.Value(1)).current;
  const [currentVideo, setCurrentVideo] = useState(video);

  const styles = useMemo(() => StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#000' },
    container: { flex: 1, backgroundColor: colors.background },
    scroll: { flex: 1 },
    playerContainer: { backgroundColor: '#000', position: 'relative' },
    playerArea: { backgroundColor: '#000' },
    backButton: { position: 'absolute', left: SIZES.sm, width: 40, height: 40, borderRadius: 20, backgroundColor: colors.overlay, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
    infoContainer: { padding: SIZES.md },
    title: { color: colors.text, ...TYPOGRAPHY.h2, lineHeight: 26 },
    metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: SIZES.xs },
    views: { color: colors.textSecondary, ...TYPOGRAPHY.caption },
    dot: { color: colors.textSecondary, marginHorizontal: SIZES.xs },
    category: { color: colors.primary, ...TYPOGRAPHY.label },
    actionRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: SIZES.md, borderTopWidth: 1, borderTopColor: colors.border, marginTop: SIZES.md },
    actionBtn: { alignItems: 'center', padding: SIZES.sm },
    actionText: { color: colors.textSecondary, ...TYPOGRAPHY.labelBold, marginTop: 4 },
    channelRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: SIZES.md, borderTopWidth: 1, borderTopColor: colors.border },
    channelAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface },
    channelInfo: { flex: 1, marginLeft: SIZES.sm },
    channelName: { color: colors.text, ...TYPOGRAPHY.h4 },
    channelSubs: { color: colors.textSecondary, ...TYPOGRAPHY.caption },
    descriptionBox: { backgroundColor: colors.surface, borderRadius: SIZES.radiusSm, padding: SIZES.md },
    descriptionText: { color: colors.text, ...TYPOGRAPHY.body, lineHeight: 20 },
    suggestedSection: { paddingTop: SIZES.md },
    suggestedTitle: { color: colors.text, ...TYPOGRAPHY.h3, paddingHorizontal: SIZES.md, marginBottom: SIZES.md },
    suggestedGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: SIZES.md, gap: SIZES.sm },
    thumbnailOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
    thumbnailFull: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  }), [colors]);

  React.useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  }, []);

  const handlePlayerReady = () => {
    setPlayerReady(true);
    Animated.timing(thumbnailOpacity, { toValue: 0, duration: 300, useNativeDriver: true }).start();
  };

  const favorite = isFavorite(currentVideo.id);
  const suggestedVideos = videos.filter(v => v.id !== currentVideo.id).slice(0, 6);

  const handleFavorite = () => { toggleFavorite(currentVideo.id); };

  const handleVideoPress = (v) => {
    setCurrentVideo(v); setPlaying(true); setPlayerReady(false);
    thumbnailOpacity.setValue(1);
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <ScrollView showsVerticalScrollIndicator={false} bounces={false} style={styles.scroll}>
          <View style={[styles.playerContainer, { height: PLAYER_HEIGHT + insets.top }]}>
            <View style={[styles.playerArea, { width, height: PLAYER_HEIGHT, marginTop: insets.top }]}>
              <YoutubeIframe
                videoId={currentVideo.youtubeId || 'XqZsoesa55w'}
                height={PLAYER_HEIGHT}
                width={width}
                play={playing && playerReady}
                onReady={handlePlayerReady}
                onChangeState={(e) => { if (e === 'ended') setPlaying(false); }}
              />
              {!playerReady && (
                <Animated.View style={[styles.thumbnailOverlay, { opacity: thumbnailOpacity }]} pointerEvents="none">
                  <Image source={{ uri: currentVideo.thumbnail }} style={styles.thumbnailFull} resizeMode="cover" />
                  <View style={{ ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' }}>
                    <PulseLoader />
                  </View>
                </Animated.View>
              )}
            </View>
            <TouchableOpacity style={[styles.backButton, { top: insets.top + SIZES.sm }]} onPress={() => navigation.goBack()} accessibilityLabel="Go back">
              <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.title}>{currentVideo.title}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.views}>{currentVideo.views >= 1000000 ? `${(currentVideo.views / 1000000).toFixed(1)}M` : currentVideo.views >= 1000 ? `${(currentVideo.views / 1000).toFixed(0)}K` : currentVideo.views} views</Text>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.category}>{currentVideo.category}</Text>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.actionBtn} onPress={() => setPlaying(!playing)} accessibilityLabel={playing ? 'Pause' : 'Play'}>
                <MaterialCommunityIcons name={playing ? 'pause-circle' : 'play-circle'} size={28} color={colors.text} />
                <Text style={styles.actionText}>{playing ? 'Pause' : 'Play'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={handleFavorite} accessibilityLabel={favorite ? 'Remove from favorites' : 'Add to favorites'}>
                <MaterialCommunityIcons name={favorite ? 'heart' : 'heart-outline'} size={28} color={favorite ? colors.primary : colors.text} />
                <Text style={styles.actionText}>{favorite ? 'Favorited' : 'Favorite'}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.channelRow}>
              <Image source={{ uri: currentVideo.channelAvatar }} style={styles.channelAvatar} />
              <View style={styles.channelInfo}>
                <Text style={styles.channelName}>{currentVideo.channel}</Text>
                <Text style={styles.channelSubs}>Kidoro Channel</Text>
              </View>
            </View>

            <View style={styles.descriptionBox}>
              <Text style={styles.descriptionText}>{currentVideo.description}</Text>
            </View>
          </View>

          <View style={styles.suggestedSection}>
            <Text style={styles.suggestedTitle}>Suggested Videos</Text>
            <View style={styles.suggestedGrid}>
              {suggestedVideos.map((v) => (
                <VideoCard
                  key={v.id}
                  video={{ ...v, favorite: isFavorite(v.id) }}
                  onPress={() => handleVideoPress(v)}
                  onFavorite={() => toggleFavorite(v.id)}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
});

export default VideoPlayerScreen;
