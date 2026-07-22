import React, { useRef, useEffect, useMemo } from 'react';
import { TouchableOpacity, Animated, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SIZES, TYPOGRAPHY, ELEVATION } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

const CategoryChip = React.memo(function CategoryChip({ label, icon, color, selected, onPress }) {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const selectedAnim = useRef(new Animated.Value(selected ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(selectedAnim, { toValue: selected ? 1 : 0, friction: 6, tension: 100, useNativeDriver: true }).start();
  }, [selected]);

  const handlePressIn = () => { Animated.spring(scaleAnim, { toValue: 0.92, friction: 6, tension: 100, useNativeDriver: true }).start(); };
  const handlePressOut = () => { Animated.spring(scaleAnim, { toValue: 1, friction: 6, tension: 100, useNativeDriver: true }).start(); };

  const chipColor = color || colors.primary;
  const textColor = selected ? '#FFFFFF' : colors.text;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} style={[styles.chip, { backgroundColor: selected ? chipColor : colors.surface }]} accessibilityLabel={label} accessibilityRole="button" activeOpacity={0.8}>
        {icon && <MaterialCommunityIcons name={icon} size={18} color={textColor} style={styles.icon} />}
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
});

export default CategoryChip;

const styles = StyleSheet.create({
  chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SIZES.md, paddingVertical: SIZES.sm, borderRadius: 20, marginRight: SIZES.sm, ...ELEVATION.level1 },
  icon: { marginRight: SIZES.xs },
  label: { ...TYPOGRAPHY.label },
});
