import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SIZES, ELEVATION } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

const FavoriteButton = React.memo(function FavoriteButton({ isFavorite, onPress, size = 'small' }) {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const heartAnim = useRef(new Animated.Value(isFavorite ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(heartAnim, { toValue: isFavorite ? 1 : 0, friction: 4, tension: 40, useNativeDriver: true }).start();
  }, [isFavorite]);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.8, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1.2, duration: 120, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
    onPress && onPress();
  };

  const iconSize = size === 'small' ? 22 : 28;
  const color = isFavorite ? colors.primary : '#FFFFFF';

  return (
    <TouchableOpacity onPress={handlePress} style={styles.button} accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'} accessibilityRole="button">
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <MaterialCommunityIcons name={isFavorite ? 'heart' : 'heart-outline'} size={iconSize} color={color} />
      </Animated.View>
    </TouchableOpacity>
  );
});

export default FavoriteButton;

const styles = StyleSheet.create({
  button: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center', ...ELEVATION.level1 },
});
