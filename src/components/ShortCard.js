import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet, useWindowDimensions } from 'react-native';
import { Video, ResizeMode, Audio } from 'expo-av';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SIZES, TYPOGRAPHY } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

const ShortCard = React.memo(function ShortCard({ short, active, onFavorite }) {
  const { width, height } = useWindowDimensions();
  const { colors } = useTheme();
  const videoRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;
    if (active) {
      Audio.setAudioModeAsync({
        playsInSilentModeIOS: true, staysActiveInBackground: false, shouldDuckAndroid: true,
        interruptionModeIOS: 1, interruptionModeAndroid: 1,
      });
      videoRef.current.playAsync();
    } else { videoRef.current.pauseAsync(); }
  }, [active]);

  return (
    <View style={[styles.container, { width, height }]}>
      <Video ref={videoRef} source={{ uri: short.url }} style={[styles.background, { width, height }]} resizeMode={ResizeMode.COVER} shouldPlay={false} isLooping isMuted={false} useNativeControls={false} volume={1.0} />
      {!active && short.thumbnail ? <Image source={{ uri: short.thumbnail }} style={[styles.background, { width, height }]} resizeMode="cover" /> : null}
      <View style={styles.overlay} />
      <View style={styles.content}>
        <View style={styles.leftContent}>
          <Text style={styles.title} numberOfLines={2}>{short.title}</Text>
          {short.description ? <Text style={styles.description} numberOfLines={2}>{short.description}</Text> : null}
          {short.tags ? (
          <View style={styles.musicTag}>
            <MaterialCommunityIcons name="tag" size={14} color="#FFF" />
            <Text style={styles.musicText}>{short.tags}</Text>
          </View>
          ) : null}
        </View>
        <View style={styles.actions}>
          <TouchableOpacity onPress={onFavorite} style={styles.actionButton} accessibilityLabel={short.favorite ? 'Remove favorite' : 'Add favorite'}>
            <MaterialCommunityIcons name={short.favorite ? 'heart' : 'heart-outline'} size={28} color={short.favorite ? colors.primary : '#FFF'} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

export default ShortCard;

const styles = StyleSheet.create({
  container: {},
  background: { ...StyleSheet.absoluteFillObject },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.25)' },
  content: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', paddingHorizontal: SIZES.lg, paddingBottom: SIZES.xxl + 60, alignItems: 'flex-end' },
  leftContent: { flex: 1, marginRight: SIZES.md },
  title: { color: '#FFF', ...TYPOGRAPHY.h3, marginBottom: SIZES.xs },
  channel: { color: '#FFF', ...TYPOGRAPHY.label, marginBottom: SIZES.xs },
  description: { color: 'rgba(255,255,255,0.8)', ...TYPOGRAPHY.caption, marginBottom: SIZES.sm },
  musicTag: { flexDirection: 'row', alignItems: 'center' },
  musicText: { color: '#FFF', ...TYPOGRAPHY.caption, marginLeft: SIZES.xs },
  actions: { alignItems: 'center', gap: SIZES.lg },
  actionButton: { alignItems: 'center', minWidth: 48, minHeight: 48, justifyContent: 'center' },
  actionText: { color: '#FFF', ...TYPOGRAPHY.captionBold, marginTop: 2 },
});
