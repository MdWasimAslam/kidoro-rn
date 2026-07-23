import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const MaintenanceScreen = React.memo(function MaintenanceScreen({ message }) {
  const { colors } = useTheme();

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background, padding: 32 },
    title: { color: colors.text, fontSize: 24, fontWeight: '700', marginTop: 20 },
    message: { color: colors.textSecondary, fontSize: 15, marginTop: 8, textAlign: 'center', lineHeight: 22 },
  }), [colors]);

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="wrench-outline" size={80} color={colors.primary} />
      <Text style={styles.title}>Under Maintenance</Text>
      <Text style={styles.message}>{message || 'We\'ll be back soon!'}</Text>
    </View>
  );
});

export default MaintenanceScreen;
