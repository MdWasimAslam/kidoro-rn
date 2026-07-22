import React, { useRef, useEffect, useMemo } from 'react';
import { View, Text, Animated, StyleSheet, StatusBar, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const SplashScreen = React.memo(function SplashScreen({ navigation }) {
  // ── Main animations ──
  const logoScale = useRef(new Animated.Value(0.2)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const ringScale = useRef(new Animated.Value(0.6)).current;
  const ringOpacity = useRef(new Animated.Value(0)).current;
  const ringPulse = useRef(new Animated.Value(1)).current;
  const titleSlide = useRef(new Animated.Value(50)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const taglineSlide = useRef(new Animated.Value(30)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const barProgress = useRef(new Animated.Value(0)).current;
  const shimmerSlide = useRef(new Animated.Value(-1)).current;

  // ── Particle animations (8 particles with different behaviors) ──
  const particles = useMemo(() =>
    Array.from({ length: 8 }, () => ({
      y: useRef(new Animated.Value(0)).current,
      x: useRef(new Animated.Value(0)).current,
      o: useRef(new Animated.Value(0)).current,
      scale: useRef(new Animated.Value(0)).current,
    })),
  []);

  useEffect(() => {
    // Store animation refs for cleanup
    const runningAnimations = [];

    // ── Logo entrance ──
    const entranceAnim = Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1, friction: 3, tension: 28,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1, duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(ringScale, {
          toValue: 1, friction: 4, tension: 35,
          useNativeDriver: true,
        }),
        Animated.timing(ringOpacity, {
          toValue: 1, duration: 500,
          useNativeDriver: true,
        }),
      ]),
      // ── Title slides up ──
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1, duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(titleSlide, {
          toValue: 0, friction: 6, tension: 40,
          useNativeDriver: true,
        }),
      ]),
      // ── Tagline fades in ──
      Animated.parallel([
        Animated.timing(taglineOpacity, {
          toValue: 1, duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(taglineSlide, {
          toValue: 0, friction: 6, tension: 40,
          useNativeDriver: true,
        }),
      ]),
    ]);
    entranceAnim.start();
    runningAnimations.push(entranceAnim);

    // ── Ring pulse (starts after a short delay) ──
    const ringPulseAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(ringPulse, {
          toValue: 1.08, duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(ringPulse, {
          toValue: 1, duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );
    const ringPulseTimeout = setTimeout(() => ringPulseAnim.start(), 600);
    runningAnimations.push(ringPulseAnim);

    // ── Loading bar fill ──
    const barAnim = Animated.timing(barProgress, {
      toValue: 1, duration: 2500,
      useNativeDriver: false,
    });
    barAnim.start();
    runningAnimations.push(barAnim);

    // ── Shimmer on loading bar ──
    const shimmerAnim = Animated.loop(
      Animated.timing(shimmerSlide, {
        toValue: 2, duration: 1500,
        useNativeDriver: false,
      })
    );
    shimmerAnim.start();
    runningAnimations.push(shimmerAnim);

    // ── Particle loops: each with unique delay, speed, and behavior ──
    const particleConfigs = [
      { delay: 100, speedY: 3000, speedX: 2000, rangeY: -40, rangeX: 15 },
      { delay: 400, speedY: 2500, speedX: 1800, rangeY: -35, rangeX: -12 },
      { delay: 800, speedY: 3500, speedX: 2200, rangeY: -30, rangeX: 20 },
      { delay: 1200, speedY: 2800, speedX: 1900, rangeY: -45, rangeX: -18 },
      { delay: 1600, speedY: 3200, speedX: 2100, rangeY: -25, rangeX: 10 },
      { delay: 500, speedY: 2700, speedX: 1700, rangeY: -38, rangeX: -14 },
      { delay: 1000, speedY: 3400, speedX: 2300, rangeY: -42, rangeX: 16 },
      { delay: 1500, speedY: 2600, speedX: 2000, rangeY: -32, rangeX: -10 },
    ];

    const loops = particles.map((p, i) => {
      const cfg = particleConfigs[i];
      return Animated.loop(
        Animated.sequence([
          Animated.delay(cfg.delay),
          Animated.parallel([
            Animated.timing(p.scale, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.timing(p.o, { toValue: 1, duration: 400, useNativeDriver: true }),
            Animated.timing(p.y, { toValue: cfg.rangeY, duration: cfg.speedY, useNativeDriver: true }),
            Animated.timing(p.x, { toValue: cfg.rangeX, duration: cfg.speedX, useNativeDriver: true }),
          ]),
          Animated.timing(p.o, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.parallel([
            Animated.timing(p.y, { toValue: 0, duration: 0, useNativeDriver: true }),
            Animated.timing(p.x, { toValue: 0, duration: 0, useNativeDriver: true }),
            Animated.timing(p.scale, { toValue: 0, duration: 0, useNativeDriver: true }),
          ]),
        ])
      );
    });
    loops.forEach(l => l.start());

    // ── Navigate to main app ──
    const timeout = setTimeout(() => {
      navigation && navigation.replace('MainTabs');
    }, 2800);

    return () => {
      clearTimeout(timeout);
      clearTimeout(ringPulseTimeout);
      loops.forEach(l => l.stop());
      runningAnimations.forEach(anim => anim.stop());
    };
  }, []);

  // ── Interpolations ──
  const barWidth = barProgress.interpolate({
    inputRange: [0, 1], outputRange: ['0%', '100%'],
  });

  const shimmerTranslate = shimmerSlide.interpolate({
    inputRange: [-1, 2], outputRange: [-200, 400],
  });

  const logoRotation = logoRotate.interpolate({
    inputRange: [0, 1], outputRange: ['0deg', '360deg'],
  });

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1, justifyContent: 'center', alignItems: 'center',
    },

    // ── Animated light sweep overlay ──
    lightSweep: {
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
    },

    // ── Particles ──
    particle: {
      position: 'absolute',
      borderRadius: 999,
    },

    // ── Glowing Ring ──
    ringOuter: {
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    ringGlow: {
      width: 180, height: 180, borderRadius: 90,
      backgroundColor: 'rgba(255,255,255,0.04)',
    },
    ring: {
      position: 'absolute',
      width: 160, height: 160, borderRadius: 80,
      borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.15)',
    },
    ringInner: {
      position: 'absolute',
      width: 140, height: 140, borderRadius: 70,
      borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    },

    // ── Logo ──
    logoContainer: {
      alignItems: 'center', justifyContent: 'center',
    },
    logo: {
      width: 110, height: 110, borderRadius: 10,
    },
    logoGlow: {
      position: 'absolute',
      width: 130, height: 130, borderRadius: 15,
      backgroundColor: 'rgba(255,255,255,0.04)',
    },

    // ── Typography ──
    titleContainer: {
      marginTop: 32, alignItems: 'center',
    },
    title: {
      color: '#FFFFFF',
      fontSize: 48,
      fontWeight: '800',
      letterSpacing: 4,
      textShadowColor: 'rgba(0,0,0,0.12)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 8,
    },
    titleAccent: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '300',
      letterSpacing: 8,
      marginTop: 4,
      opacity: 0.5,
    },
    tagline: {
      color: 'rgba(255,255,255,0.65)',
      fontSize: 15,
      fontWeight: '500',
      letterSpacing: 2,
      marginTop: 20,
    },

    // ── Premium Loading Bar ──
    loadingContainer: {
      position: 'absolute',
      bottom: 100,
      alignItems: 'center',
    },
    loadingTrack: {
      width: 180,
      height: 4,
      borderRadius: 2,
      backgroundColor: 'rgba(255,255,255,0.08)',
      overflow: 'hidden',
    },
    loadingFill: {
      height: '100%',
      backgroundColor: '#FFFFFF',
      borderRadius: 2,
    },
    shimmerOverlay: {
      position: 'absolute',
      top: 0, left: 0,
      width: 60,
      height: '100%',
      backgroundColor: 'rgba(255,255,255,0.15)',
      borderRadius: 2,
    },
    loadingLabel: {
      color: 'rgba(255,255,255,0.30)',
      fontSize: 11,
      fontWeight: '600',
      letterSpacing: 3,
      marginTop: 14,
      textTransform: 'uppercase',
    },
  }), []);

  return (
    <LinearGradient
      colors={['#FF94AF', '#FE6C87', '#E8556E', '#C2304B']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1.2 }}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#FE6C87" />

      {/* ── Light Sweep Overlay ── */}
      <Animated.View
        style={[
          styles.lightSweep,
          {
            opacity: shimmerSlide.interpolate({
              inputRange: [0, 0.5, 1, 1.5, 2],
              outputRange: [0, 0.04, 0.06, 0.04, 0],
            }),
          },
        ]}
      >
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.03)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        />
      </Animated.View>

      {/* ── Floating Particles ── */}
      {/* Large soft particles */}
      <Animated.View
        style={[
          styles.particle,
          {
            top: '15%', left: '18%',
            width: 14, height: 14,
            backgroundColor: 'rgba(255,255,255,0.08)',
            opacity: particles[0].o,
            transform: [
              { translateY: particles[0].y },
              { translateX: particles[0].x },
              { scale: particles[0].scale },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.particle,
          {
            top: '22%', right: '15%',
            width: 8, height: 8,
            backgroundColor: 'rgba(255,255,255,0.12)',
            opacity: particles[1].o,
            transform: [
              { translateY: particles[1].y },
              { translateX: particles[1].x },
              { scale: particles[1].scale },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.particle,
          {
            bottom: '30%', left: '12%',
            width: 10, height: 10,
            backgroundColor: 'rgba(255,255,255,0.06)',
            opacity: particles[2].o,
            transform: [
              { translateY: particles[2].y },
              { translateX: particles[2].x },
              { scale: particles[2].scale },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.particle,
          {
            bottom: '25%', right: '20%',
            width: 6, height: 6,
            backgroundColor: 'rgba(255,255,255,0.10)',
            opacity: particles[3].o,
            transform: [
              { translateY: particles[3].y },
              { translateX: particles[3].x },
              { scale: particles[3].scale },
            ],
          },
        ]}
      />
      {/* Small sparkle particles */}
      <Animated.View
        style={[
          styles.particle,
          {
            top: '35%', left: '28%',
            width: 4, height: 4,
            backgroundColor: 'rgba(255,255,255,0.15)',
            opacity: particles[4].o,
            transform: [
              { translateY: particles[4].y },
              { translateX: particles[4].x },
              { scale: particles[4].scale },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.particle,
          {
            top: '18%', right: '28%',
            width: 4, height: 4,
            backgroundColor: 'rgba(255,255,255,0.12)',
            opacity: particles[5].o,
            transform: [
              { translateY: particles[5].y },
              { translateX: particles[5].x },
              { scale: particles[5].scale },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.particle,
          {
            bottom: '40%', left: '30%',
            width: 5, height: 5,
            backgroundColor: 'rgba(255,255,255,0.08)',
            opacity: particles[6].o,
            transform: [
              { translateY: particles[6].y },
              { translateX: particles[6].x },
              { scale: particles[6].scale },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.particle,
          {
            bottom: '20%', right: '15%',
            width: 3, height: 3,
            backgroundColor: 'rgba(255,255,255,0.14)',
            opacity: particles[7].o,
            transform: [
              { translateY: particles[7].y },
              { translateX: particles[7].x },
              { scale: particles[7].scale },
            ],
          },
        ]}
      />

      {/* ── Pulsing Glow Ring ── */}
      <Animated.View
        style={[
          styles.ringOuter,
          {
            opacity: ringOpacity,
            transform: [{ scale: Animated.multiply(ringScale, ringPulse) }],
          },
        ]}
      >
        <View style={styles.ringGlow} />
        <View style={styles.ring} />
        <View style={styles.ringInner} />
      </Animated.View>

      {/* ── Logo with glow ── */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <View style={styles.logoGlow} />
        <Image
          source={require('../../assets/splash-icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* ── Title ── */}
      <Animated.View
        style={[
          styles.titleContainer,
          {
            opacity: titleOpacity,
            transform: [{ translateY: titleSlide }],
          },
        ]}
      >
        <Text style={styles.title}>KIDORO</Text>
        <Text style={styles.titleAccent}>✦  LEARN & PLAY  ✦</Text>
      </Animated.View>

      {/* ── Tagline ── */}
      <Animated.Text
        style={[
          styles.tagline,
          {
            opacity: taglineOpacity,
            transform: [{ translateY: taglineSlide }],
          },
        ]}
      >
        Where Fun Meets Discovery
      </Animated.Text>

      {/* ── Premium Loading Bar with Shimmer ── */}
      <View style={styles.loadingContainer}>
        <View style={styles.loadingTrack}>
          <Animated.View style={[styles.loadingFill, { width: barWidth }]} />
          <Animated.View
            style={[
              styles.shimmerOverlay,
              { transform: [{ translateX: shimmerTranslate }] },
            ]}
          />
        </View>
        <Text style={styles.loadingLabel}>Getting Ready</Text>
      </View>
    </LinearGradient>
  );
});

export default SplashScreen;
