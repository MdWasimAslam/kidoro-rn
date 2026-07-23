import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Animated, StyleSheet, StatusBar, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import YoutubeIframe from 'react-native-youtube-iframe';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SIZES, TYPOGRAPHY } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import videoService from '../services/video.service';
import analyticsService from '../services/analytics.service';
import { useFavoritesContext } from '../context/FavoritesContext';
import { useContinueWatchingContext } from '../context/ContinueWatchingContext';
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
  const rawVideo = route?.params?.video || null;
  const { isFavorite, toggleFavorite } = useFavoritesContext();
  const { recordWatched } = useContinueWatchingContext();
  const [playing, setPlaying] = useState(true);
  const [playerReady, setPlayerReady] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const thumbnailOpacity = useRef(new Animated.Value(1)).current;
  const [currentVideo, setCurrentVideo] = useState(rawVideo);
  const [suggestedVideos, setSuggestedVideos] = useState([]);

  // Play state tracking refs for analytics
  const startTimeRef = useRef(null);
  const accumulatedTimeRef = useRef(0);
  const isPlayingRef = useRef(false);
  const currentVideoRef = useRef(currentVideo);

  currentVideoRef.current = currentVideo;

  // Single source of truth for play/pause time tracking
  const handlePlayStateChange = useCallback((isPlaying) => {
    if (isPlaying === isPlayingRef.current) return;
    isPlayingRef.current = isPlaying;

    if (isPlaying) {
      startTimeRef.current = Date.now();
    } else {
      if (startTimeRef.current) {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        accumulatedTimeRef.current += elapsed;
        startTimeRef.current = null;
      }
    }
  }, []);

  // Sync play state to the callback on every change
  React.useEffect(() => {
    handlePlayStateChange(playing && playerReady);
  }, [playing, playerReady, handlePlayStateChange]);

  // Stable onChangeState handler — syncs playing state with YouTube player for all events
  const handleYoutubeStateChange = useCallback((e) => {
    if (e === 'playing') {
      setPlaying(true);
    } else if (e === 'paused') {
      setPlaying(false);
    } else if (e === 'ended') {
      setPlaying(false);
      const video = currentVideoRef.current;
      const totalDuration = video.duration || 0;
      analyticsService.trackEvent({
        event_name: 'video_completed',
        video_id: video.id,
        duration_seconds: totalDuration,
        completion_pct: 100,
      });
    }
  }, []);

  // Main analytics effect: track start, watch time on unmount, reset for new video
  React.useEffect(() => {
    let mounted = true;

    analyticsService.trackEvent({
      event_name: 'video_started',
      video_id: currentVideo.id,
      duration_seconds: 0,
      completion_pct: 0,
    });

    // Record in continue-watching history
    recordWatched({
      id: currentVideo.id,
      title: currentVideo.title,
      thumbnail: currentVideo.thumbnail,
      youtubeId: currentVideo.youtubeId,
      duration: currentVideo.duration || 0,
      channel: currentVideo.channel || '',
      views: currentVideo.views || 0,
      category: currentVideo.category || 'General',
    });

    // Reset accumulated time for the new video (play state managed by handlePlayStateChange)
    accumulatedTimeRef.current = 0;

    videoService.getVideos(10).then(res => {
      if (mounted && res) {
        const formatted = res.map(v => ({
          id: v.id,
          title: v.title,
          thumbnail: v.thumbnail_url || `https://img.youtube.com/vi/${v.video_id}/hqdefault.jpg`,
          youtubeId: v.video_id,
          channel: v.channel || '',
          views: v.views || 0,
          category: v.categories?.name || 'General',
          duration: v.duration,
        }));
        setSuggestedVideos(formatted.filter(v => v.id !== currentVideo.id));
      }
    });

    return () => {
      mounted = false;
      // Flush any remaining elapsed time before unmount
      let elapsed = 0;
      if (isPlayingRef.current && startTimeRef.current) {
        elapsed = (Date.now() - startTimeRef.current) / 1000;
      }
      const totalWatched = Math.round(accumulatedTimeRef.current + elapsed);
      const video = currentVideoRef.current;
      const totalDuration = parseFloat(video.duration) || 0;
      const completionPct = totalDuration > 0 ? Math.min(100, Math.round((totalWatched / totalDuration) * 100)) : 0;

      if (totalWatched > 0) {
        analyticsService.trackEvent({
          event_name: 'video_watched',
          video_id: video.id,
          duration_seconds: totalWatched,
          completion_pct: completionPct,
        });
      }
      // Clear refs so handlePlayStateChange doesn't double-count the same time
      isPlayingRef.current = false;
      startTimeRef.current = null;
    };
  }, [currentVideo.id, recordWatched]);

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
    category: { color: colors.primary, ...TYPOGRAPHY.label },
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
              {currentVideo && (
              <YoutubeIframe
                key={currentVideo.id}
                videoId={currentVideo.youtubeId}
                height={PLAYER_HEIGHT}
                width={width}
                play={playerReady}
                onReady={handlePlayerReady}
                onChangeState={handleYoutubeStateChange}
              />
              )}
              {currentVideo && !playerReady && (
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
              <Text style={styles.category}>{currentVideo.category || ''}</Text>
            </View>

            {currentVideo.description ? (
            <View style={styles.descriptionBox}>
              <Text style={styles.descriptionText}>{currentVideo.description}</Text>
            </View>
            ) : null}
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
