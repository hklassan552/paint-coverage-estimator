import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { LOADER_DURATION_MS } from '../constants/config';
import assets from '../assets';
import PaintedBackground from '../components/PaintedBackground';

export interface LoaderScreenProps {
  onReady: () => void;
  reduceMotion?: boolean;
}

const BAR_W = 200;

/**
 * Branded splash. Deliberately darker than every other screen: no room cards,
 * no chips and no primary CTA appear here.
 */
function LoaderScreen({ onReady, reduceMotion }: LoaderScreenProps) {
  const logoOpacity = useRef(new Animated.Value(reduceMotion ? 1 : 0)).current;
  const logoScale = useRef(new Animated.Value(reduceMotion ? 1 : 0.94)).current;
  const titleOpacity = useRef(new Animated.Value(reduceMotion ? 1 : 0)).current;
  // Width is NOT native-driver eligible, so this one runs on the JS driver.
  const progress = useRef(new Animated.Value(0)).current;

  const readyRef = useRef(onReady);
  readyRef.current = onReady;

  useEffect(() => {
    if (!reduceMotion) {
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: theme.motion.base,
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: theme.motion.base,
          useNativeDriver: true,
        }),
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: theme.motion.base,
          delay: 60,
          useNativeDriver: true,
        }),
      ]).start();
    }

    const bar = Animated.timing(progress, {
      toValue: 1,
      duration: LOADER_DURATION_MS,
      useNativeDriver: false,
    });
    bar.start();

    const timer = setTimeout(() => readyRef.current(), LOADER_DURATION_MS);
    return () => {
      clearTimeout(timer);
      bar.stop();
    };
  }, [logoOpacity, logoScale, titleOpacity, progress, reduceMotion]);

  const fillWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, BAR_W],
  });

  return (
    <PaintedBackground variant="loader">
      <View style={styles.root}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.logoWrap,
            { opacity: logoOpacity, transform: [{ scale: logoScale }] },
          ]}>
          <Image
            source={assets.logo}
            style={styles.logo}
            resizeMode="contain"
            accessibilityIgnoresInvertColors
          />
        </Animated.View>

        <Animated.View
          pointerEvents="none"
          style={[styles.titleWrap, { opacity: titleOpacity }]}>
          <Text style={styles.title} accessibilityRole="header">
            Paint{'\n'}Coverage{'\n'}Estimator
          </Text>
          <Text style={styles.subtitle}>The right amount for your room.</Text>
        </Animated.View>

        <View style={styles.progressWrap}>
          <View style={styles.track}>
            <Animated.View style={[styles.fill, { width: fillWidth }]} />
          </View>
          <Text style={styles.loadingLabel}>Opening your rooms</Text>
        </View>
      </View>
    </PaintedBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xxl,
  },
  logoWrap: {
    width: 112,
    height: 112,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(250,250,250,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(250,250,250,0.18)',
  },
  logo: { width: 84, height: 84 },
  titleWrap: { alignItems: 'center', marginTop: theme.spacing.xxl },
  title: {
    maxWidth: 280,
    textAlign: 'center',
    fontSize: theme.typography.splashTitle.fontSize,
    lineHeight: theme.typography.splashTitle.lineHeight,
    fontWeight: '800',
    color: theme.colors.surface,
  },
  subtitle: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.lineHeight,
    color: theme.colors.text.inverseSoft,
    textAlign: 'center',
  },
  progressWrap: {
    position: 'absolute',
    bottom: 96,
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  track: {
    width: BAR_W,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(221,176,187,0.30)',
    overflow: 'hidden',
  },
  fill: { height: 6, borderRadius: 3, backgroundColor: theme.colors.accent },
  loadingLabel: {
    fontSize: theme.typography.caption.fontSize,
    lineHeight: theme.typography.caption.lineHeight,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: theme.colors.text.inverseSoft,
  },
});

export default LoaderScreen;
