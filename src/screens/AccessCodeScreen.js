import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/theme';
import AccessCodeCard from '../components/AccessCodeCard';

const AccessCodeScreen = React.memo(function AccessCodeScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (valid) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (valid) {
        navigation.replace('MainTabs');
      }
    }, 500);
  };

  return (
    <LinearGradient
      colors={[COLORS.primary, '#E83030', COLORS.primaryDark]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={styles.bubble1} />
      <View style={styles.bubble2} />
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <AccessCodeCard onSubmit={handleSubmit} loading={loading} />
      </KeyboardAvoidingView>
    </LinearGradient>
  );
});

export default AccessCodeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  bubble1: {
    position: 'absolute',
    top: '12%',
    left: '-10%',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  bubble2: {
    position: 'absolute',
    bottom: '10%',
    right: '-15%',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
});
