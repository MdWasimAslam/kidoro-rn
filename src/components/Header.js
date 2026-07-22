import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SIZES, TYPOGRAPHY } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

const Header = React.memo(function Header({ title, subtitle, rightComponent, leftComponent }) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const styles = useMemo(() => StyleSheet.create({
    container: { backgroundColor: colors.background, paddingBottom: SIZES.md },
    content: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SIZES.lg },
    left: { marginRight: SIZES.md },
    center: { flex: 1 },
    right: { marginLeft: SIZES.md },
    title: { color: colors.text, ...TYPOGRAPHY.headingL },
    subtitle: { color: colors.textSecondary, ...TYPOGRAPHY.body, marginTop: SIZES.xs },
  }), [colors]);

  return (
    <View style={[styles.container, { paddingTop: insets.top + SIZES.md }]}>
      <View style={styles.content}>
        {leftComponent && <View style={styles.left}>{leftComponent}</View>}
        <View style={styles.center}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        {rightComponent && <View style={styles.right}>{rightComponent}</View>}
      </View>
    </View>
  );
});

export default Header;
