import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, StyleSheet, StatusBar, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

const { width } = Dimensions.get('window');

const SplashScreen = React.memo(function SplashScreen({ navigation }) {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.6)).current;
  const titleFade = useRef(new Animated.Value(0)).current;
  const titleSlide = useRef(new Animated.Value(30)).current;
  const taglineFade = useRef(new Animated.Value(0)).current;
  const dotsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, friction: 4, tension: 40, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(titleFade, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(titleSlide, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
      Animated.timing(taglineFade, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(dotsAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();

    const analyticsService = require('../services/analytics.service');
    analyticsService.flushQueue();

    const checkSessionAndNavigate = async () => {
      try {
        const { getActiveChild } = require('../services/api');
        const activeChild = await getActiveChild();
        if (activeChild && activeChild.id && activeChild.access_code) {
          navigation?.replace('MainTabs');
          return;
        }
      } catch (e) { /* ignore */ }
      navigation?.replace('AccessCode');
    };

    const t = setTimeout(checkSessionAndNavigate, 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <LinearGradient colors={[COLORS.primary, '#E83030', COLORS.primaryDark]} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} translucent />

      <Animated.View style={[styles.logoContainer, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
        <View style={styles.logoGlow}>
          <View style={styles.logoInner}>
            <Image source={require('../../assets/app-icon.webp')} style={styles.logoImage} resizeMode="contain" />
          </View>
        </View>
      </Animated.View>

      <Animated.View style={{ opacity: titleFade, transform: [{ translateY: titleSlide }], alignItems: 'center' }}>
        <Text style={styles.title}>Kidoro</Text>
      </Animated.View>

      <Animated.View style={{ opacity: taglineFade }}>
        <Text style={styles.tagline}>Safe Adventures Begin Here</Text>
      </Animated.View>

      <Animated.View style={[styles.pulseDot, { opacity: dotsAnim }]}>
        <View style={styles.dotInner} />
        <View style={[styles.dotRing, { opacity: 0.4 }]} />
      </Animated.View>

      <View style={styles.footer}>
        <Animated.Text style={[styles.footerText, { opacity: titleFade }]}>Fun Learning for Kids</Animated.Text>
      </View>
    </LinearGradient>
  );
});

export default SplashScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logoContainer: { marginBottom: 32 },
  logoGlow: {
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 12,
  },
  logoInner: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  logoImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  title: {
    fontSize: 44,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 2,
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 12,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  pulseDot: {
    position: 'absolute',
    bottom: 100,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  dotRing: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  footer: {
    position: 'absolute',
    bottom: 60,
  },
  footerText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1,
  },
});
