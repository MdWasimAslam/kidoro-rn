import React, { useRef, useEffect, useMemo } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SIZES, TYPOGRAPHY } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

const EmptyState = React.memo(function EmptyState({ icon, title, message, action }) {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: SIZES.xl, paddingVertical: SIZES.huge },
    iconContainer: { width: 120, height: 120, borderRadius: 60, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center', marginBottom: SIZES.xl },
    title: { color: colors.text, ...TYPOGRAPHY.h2, marginBottom: SIZES.xs, textAlign: 'center' },
    message: { color: colors.textSecondary, ...TYPOGRAPHY.body, textAlign: 'center', lineHeight: 20 },
  }), [colors]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name={icon || 'heart-broken'} size={64} color={colors.border} />
      </View>
      <Text style={styles.title}>{title || 'Nothing here yet'}</Text>
      <Text style={styles.message}>{message || 'Items will appear here'}</Text>
      {action && action}
    </Animated.View>
  );
});

export default EmptyState;
