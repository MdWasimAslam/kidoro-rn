import React, { useRef, useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, Animated, StyleSheet, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SIZES, TYPOGRAPHY, ELEVATION } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import childService from '../services/child.service';

const AccessCodeCard = React.memo(function AccessCodeCard({ onSubmit, loading }) {
  const { colors } = useTheme();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const styles = useMemo(() => StyleSheet.create({
    container: { backgroundColor: colors.card, borderRadius: SIZES.radius, padding: SIZES.xl, marginHorizontal: SIZES.lg, alignItems: 'center', ...ELEVATION.level3 },
    logoContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primary + '15', justifyContent: 'center', alignItems: 'center', marginBottom: SIZES.md, overflow: 'hidden' },
    logoImage: { width: 56, height: 56, borderRadius: 28 },
    title: { color: colors.text, ...TYPOGRAPHY.h1, marginBottom: SIZES.xs },
    subtitle: { color: colors.textSecondary, ...TYPOGRAPHY.body, textAlign: 'center', marginBottom: SIZES.lg },
    inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: SIZES.radiusSm, borderWidth: 2, borderColor: colors.border, paddingHorizontal: SIZES.md, height: 56, width: '100%', marginBottom: SIZES.sm },
    inputError: { borderColor: colors.error },
    input: { flex: 1, color: colors.text, ...TYPOGRAPHY.h4, marginLeft: SIZES.sm, letterSpacing: 4, height: '100%' },
    errorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SIZES.sm, alignSelf: 'flex-start', marginLeft: 4 },
    errorText: { color: colors.error, ...TYPOGRAPHY.label, marginLeft: 4 },
    button: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary, borderRadius: SIZES.radiusSm, height: 56, width: '100%', marginTop: SIZES.sm, ...ELEVATION.level2 },
    buttonDisabled: { opacity: 0.6 },
    buttonText: { color: '#FFF', ...TYPOGRAPHY.h4, marginRight: SIZES.sm },
  }), [colors]);

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, friction: 6, tension: 40, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleSubmit = async () => {
    if (!code.trim()) { setError('Please enter an access code'); shake(); return; }
    try {
      const res = await childService.verifyAccessCode(code.trim());
      if (res.success) {
        onSubmit && onSubmit(true);
      } else {
        setError(res.error || 'Invalid Access Code');
        shake();
      }
    } catch (e) {
      console.error('[AccessCodeCard] Error:', e.message);
      setError(e.message || 'Invalid Access Code');
      shake();
    }
  };

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleChange = (text) => { setCode(text); if (error) setError(''); };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ scale: scaleAnim }, { translateX: shakeAnim }] }]}>
      <View style={styles.logoContainer}><Image source={require('../../assets/icon.png')} style={styles.logoImage} resizeMode="contain" /></View>
      <Text style={styles.title}>Welcome to Kidoro</Text>
      <Text style={styles.subtitle}>Ask your parent for your access code</Text>
      <View style={[styles.inputContainer, error ? styles.inputError : null]}>
        <MaterialCommunityIcons name="lock-outline" size={20} color={error ? colors.error : colors.textSecondary} />
        <TextInput style={styles.input} placeholder="Enter Access Code" placeholderTextColor={colors.textSecondary} value={code} onChangeText={handleChange} keyboardType="number-pad" secureTextEntry maxLength={6} accessibilityLabel="Access code input" />
      </View>
      {error ? (
        <View style={styles.errorRow}>
          <MaterialCommunityIcons name="alert-circle" size={16} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
      <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleSubmit} disabled={loading} accessibilityLabel="Continue" activeOpacity={0.8}>
        {loading ? <Text style={styles.buttonText}>Checking...</Text> : <><Text style={styles.buttonText}>Continue</Text><MaterialCommunityIcons name="arrow-right" size={24} color="#FFF" /></>}
      </TouchableOpacity>
    </Animated.View>
  );
});

export default AccessCodeCard;
