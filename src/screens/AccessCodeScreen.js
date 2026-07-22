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
      colors={[COLORS.primary, COLORS.primaryDark]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
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
});
