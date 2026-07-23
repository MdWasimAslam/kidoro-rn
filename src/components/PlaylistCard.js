import React, { useRef, useMemo } from 'react';
import { TouchableOpacity, View, Text, Animated, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SIZES, TYPOGRAPHY, ELEVATION } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

const PlaylistCard = React.memo(function PlaylistCard({ playlist, onPress }) {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const palette = useMemo(() => [colors.primary, colors.blue, colors.green, colors.purple, colors.secondary], [colors]);
  const bgColor = palette[(parseInt(playlist.id, 10) || 0) % palette.length] || colors.primary;

  const styles = useMemo(() => StyleSheet.create({
    container: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: SIZES.radius, padding: SIZES.md, marginHorizontal: SIZES.md, marginBottom: SIZES.sm, ...ELEVATION.level1 },
    iconContainer: { width: 60, height: 60, borderRadius: SIZES.radiusSm, justifyContent: 'center', alignItems: 'center', marginRight: SIZES.md },
    info: { flex: 1 },
    name: { color: colors.text, ...TYPOGRAPHY.h4 },
    count: { color: colors.textSecondary, ...TYPOGRAPHY.caption, marginTop: 2 },
  }), [colors]);

  const handlePressIn = () => { Animated.spring(scaleAnim, { toValue: 0.95, friction: 6, tension: 100, useNativeDriver: true }).start(); };
  const handlePressOut = () => { Animated.spring(scaleAnim, { toValue: 1, friction: 6, tension: 100, useNativeDriver: true }).start(); };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} style={styles.container} activeOpacity={0.9} accessibilityLabel={`Playlist: ${playlist.name}`}>
        <View style={[styles.iconContainer, { backgroundColor: bgColor + '20' }]}>
          <MaterialCommunityIcons name={playlist.icon || 'playlist-music'} size={32} color={bgColor} />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{playlist.name}</Text>
          <Text style={styles.count}>{playlist.count} videos</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textSecondary} />
      </TouchableOpacity>
    </Animated.View>
  );
});

export default PlaylistCard;
