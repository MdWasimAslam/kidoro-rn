import React, { useRef, useEffect, useMemo } from 'react';
import { Animated, StyleSheet, View, useWindowDimensions } from 'react-native';
import { SIZES } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

const LoadingSkeleton = React.memo(function LoadingSkeleton({ count = 6, type = 'card', style }) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const cardW = type === 'card' ? (width - SIZES.md * 2 - SIZES.sm) / 2 : undefined;

  const styles = useMemo(() => StyleSheet.create({
    container: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: SIZES.md, gap: SIZES.sm },
    card: { borderRadius: SIZES.radius, overflow: 'hidden', marginBottom: SIZES.sm },
    imagePlaceholder: { width: '100%', height: 120, backgroundColor: colors.shimmer, borderRadius: SIZES.radius },
    textContainer: { padding: SIZES.sm },
    titleLine: { height: 14, backgroundColor: colors.shimmer, borderRadius: SIZES.radiusXs, marginBottom: SIZES.xs, width: '80%' },
    subtitleLine: { height: 10, backgroundColor: colors.shimmer, borderRadius: SIZES.radiusXs, width: '50%' },
    listItem: { flexDirection: 'row', paddingHorizontal: SIZES.md, marginBottom: SIZES.md },
    listImage: { width: 100, height: 60, backgroundColor: colors.shimmer, borderRadius: SIZES.radiusSm },
    listText: { flex: 1, marginLeft: SIZES.md, justifyContent: 'center' },
    shortPlaceholder: { width: '100%', height: '100%', backgroundColor: colors.shimmer },
  }), [colors]);

  return (
    <View style={styles.container}>
      {Array.from({ length: count }, (_, i) => <SkeletonItem key={i} type={type} style={style} styles={styles} />)}
    </View>
  );
});

const SkeletonItem = React.memo(function SkeletonItem({ type, style, styles: s }) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(shimmerAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const opacity = shimmerAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.7] });

  if (type === 'card') {
    return (
      <View style={[s.card, style]}>
        <Animated.View style={[s.imagePlaceholder, { opacity }]} />
        <View style={s.textContainer}>
          <Animated.View style={[s.titleLine, { opacity }]} />
          <Animated.View style={[s.subtitleLine, { opacity }]} />
        </View>
      </View>
    );
  }

  if (type === 'list') {
    return (
      <View style={[s.listItem, style]}>
        <Animated.View style={[s.listImage, { opacity }]} />
        <View style={s.listText}>
          <Animated.View style={[s.titleLine, { opacity }]} />
          <Animated.View style={[s.subtitleLine, { opacity }]} />
          <Animated.View style={[s.subtitleLine, { width: '60%', opacity }]} />
        </View>
      </View>
    );
  }

  if (type === 'short') return <Animated.View style={[s.shortPlaceholder, { opacity }]} />;

  return <View style={[s.card, style]}><Animated.View style={[s.imagePlaceholder, { opacity }]} /></View>;
});

export default LoadingSkeleton;
