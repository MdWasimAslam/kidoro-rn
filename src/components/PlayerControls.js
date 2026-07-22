import React, { useRef, useState } from 'react';
import { View, TouchableOpacity, Text, Animated, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SIZES, TYPOGRAPHY } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

const PlayerControls = React.memo(function PlayerControls({ playing, onPlayPause, onForward, onBackward, onFullscreen, progress, duration }) {
  const { colors } = useTheme();
  const controlsOpacity = useRef(new Animated.Value(1)).current;
  const [showControls, setShowControls] = useState(true);

  const toggleControls = () => {
    const toValue = showControls ? 0 : 1;
    Animated.timing(controlsOpacity, { toValue, duration: 200, useNativeDriver: true }).start();
    setShowControls(!showControls);
  };

  const formatTime = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const parseDuration = (dur) => {
    if (!dur) return 0;
    const parts = dur.split(':');
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  };

  const totalSeconds = parseDuration(duration);
  const progressSeconds = (progress / 100) * totalSeconds;

  return (
    <Animated.View style={[styles.container, { opacity: controlsOpacity }]}>
      <TouchableOpacity style={styles.tapArea} onPress={toggleControls} activeOpacity={1}>
        <View style={styles.controlsRow}>
          <TouchableOpacity onPress={onBackward} style={styles.controlBtn} accessibilityLabel="Rewind 10 seconds">
            <MaterialCommunityIcons name="rewind-10" size={32} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onPlayPause} style={styles.playBtn} accessibilityLabel={playing ? 'Pause' : 'Play'}>
            <MaterialCommunityIcons name={playing ? 'pause-circle' : 'play-circle'} size={64} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onForward} style={styles.controlBtn} accessibilityLabel="Forward 10 seconds">
            <MaterialCommunityIcons name="fast-forward-10" size={32} color="#FFF" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      <View style={styles.bottomBar}>
        <Text style={styles.timeText}>{formatTime(progressSeconds)}</Text>
        <View style={styles.sliderContainer}>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: colors.primary }]} />
          </View>
        </View>
        <Text style={styles.timeText}>{duration}</Text>
        <TouchableOpacity onPress={onFullscreen} style={styles.fullscreenBtn} accessibilityLabel="Fullscreen">
          <MaterialCommunityIcons name="fullscreen" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
});

export default PlayerControls;

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
  tapArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  controlsRow: { flexDirection: 'row', alignItems: 'center', gap: SIZES.xl },
  controlBtn: { padding: SIZES.sm },
  playBtn: { padding: 0 },
  bottomBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SIZES.md, paddingBottom: SIZES.sm },
  timeText: { color: '#FFF', ...TYPOGRAPHY.captionBold },
  sliderContainer: { flex: 1, marginHorizontal: SIZES.sm },
  progressBg: { height: 4, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
  fullscreenBtn: { padding: SIZES.xs },
});
