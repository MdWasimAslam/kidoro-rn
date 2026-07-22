import React, { useRef, useEffect, useMemo } from 'react';
import { View, Text, Image, Animated, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SIZES, TYPOGRAPHY, ELEVATION } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

const ProfileCard = React.memo(function ProfileCard({ profile }) {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const styles = useMemo(() => StyleSheet.create({
    container: { flexDirection: 'row', backgroundColor: colors.card, borderRadius: SIZES.radius, padding: SIZES.md, marginHorizontal: SIZES.md, marginVertical: SIZES.sm, ...ELEVATION.level2 },
    avatarContainer: { position: 'relative', marginRight: SIZES.md },
    avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.surface },
    levelBadge: { position: 'absolute', bottom: -4, right: -4, backgroundColor: colors.purple, width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },
    levelText: { color: '#FFF', ...TYPOGRAPHY.captionBold },
    info: { flex: 1, justifyContent: 'center' },
    name: { color: colors.text, ...TYPOGRAPHY.h2 },
    xpRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    xpText: { color: colors.textSecondary, ...TYPOGRAPHY.label, marginLeft: 4 },
    progressBar: { height: 6, backgroundColor: colors.border, borderRadius: 3, marginTop: SIZES.sm, overflow: 'hidden' },
    progressFill: { height: '100%', backgroundColor: colors.secondary, borderRadius: 3 },
    statsRow: { flexDirection: 'row', marginTop: SIZES.sm, gap: SIZES.md },
    stat: { flexDirection: 'row', alignItems: 'center' },
    statText: { color: colors.textSecondary, ...TYPOGRAPHY.caption, marginLeft: 4 },
  }), [colors]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 6, tension: 40, useNativeDriver: true }),
    ]).start();
  }, []);

  const levelProgress = (profile.xp % 500) / 500;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: profile.avatar }} style={styles.avatar} />
        <View style={styles.levelBadge}><Text style={styles.levelText}>{profile.level}</Text></View>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{profile.name}</Text>
        <View style={styles.xpRow}>
          <MaterialCommunityIcons name="star" size={16} color={colors.secondary} />
          <Text style={styles.xpText}>{profile.xp} XP</Text>
        </View>
        <View style={styles.progressBar}><View style={[styles.progressFill, { width: `${levelProgress * 100}%` }]} /></View>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <MaterialCommunityIcons name="fire" size={16} color={colors.primary} />
            <Text style={styles.statText}>{profile.streak} day streak</Text>
          </View>
          <View style={styles.stat}>
            <MaterialCommunityIcons name="heart" size={16} color={colors.primary} />
            <Text style={styles.statText}>{profile.favoriteCategory}</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
});

export default ProfileCard;
