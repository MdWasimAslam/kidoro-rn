import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SIZES, TYPOGRAPHY } from '../constants/theme';

const MaintenanceScreen = React.memo(function MaintenanceScreen({ message }) {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="tools" size={64} color="#FF4D4D" />
      <Text style={styles.title}>Under Maintenance</Text>
      <Text style={styles.message}>{message || "We're making things better. Check back soon."}</Text>
    </View>
  );
});

export default MaintenanceScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', padding: SIZES.xxl },
  title: { ...TYPOGRAPHY.h2, color: '#121212', marginTop: SIZES.lg },
  message: { ...TYPOGRAPHY.body, color: '#6B7280', textAlign: 'center', marginTop: SIZES.sm, maxWidth: 280 },
});
