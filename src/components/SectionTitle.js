import React, { useRef, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { SIZES, TYPOGRAPHY } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

const SectionTitle = React.memo(function SectionTitle({ title, seeAll, onSeeAll, animated = true }) {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;

  const styles = useMemo(() => StyleSheet.create({
    container: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SIZES.lg, paddingTop: SIZES.md, paddingBottom: SIZES.sm },
    title: { color: colors.text, ...TYPOGRAPHY.headingM },
    seeAll: { color: colors.primary, ...TYPOGRAPHY.labelBold },
  }), [colors]);

  useEffect(() => {
    if (animated) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
    } else { fadeAnim.setValue(1); slideAnim.setValue(0); }
  }, [title]);

  return (
    <Animated.View style={[styles.container, animated ? { opacity: fadeAnim, transform: [{ translateX: slideAnim }] } : null]}>
      <Text style={styles.title}>{title}</Text>
      {seeAll && (
        <TouchableOpacity onPress={onSeeAll} activeOpacity={0.7} accessibilityLabel={`See all ${title}`} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
});

export default SectionTitle;
