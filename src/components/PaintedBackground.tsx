import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import assets from '../assets';
import theme from '../constants/theme';

export type BackgroundVariant =
  | 'loader'
  | 'rooms'
  | 'walls'
  | 'openings'
  | 'coats'
  | 'result'
  | 'notes'
  | 'settings';

type Point = { x: number; y: number };

interface VariantSpec {
  colors: string[];
  start: Point;
  end: Point;
}

const VARIANTS: Record<BackgroundVariant, VariantSpec> = {
  // Visibly darker than every other screen: an opaque diagonal ink-to-plum wash.
  loader: {
    colors: theme.gradients.loader as unknown as string[],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  rooms: {
    colors: theme.gradients.rooms as unknown as string[],
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
  },
  walls: {
    colors: theme.gradients.walls as unknown as string[],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  openings: {
    colors: theme.gradients.openings as unknown as string[],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  coats: {
    colors: theme.gradients.coats as unknown as string[],
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
  },
  result: {
    colors: theme.gradients.result as unknown as string[],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  notes: {
    colors: theme.gradients.notes as unknown as string[],
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
  },
  settings: {
    colors: theme.gradients.settings as unknown as string[],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
};

/**
 * One background asset for every screen; the screens are told apart by their
 * gradient overlay and by which margin roller strokes occupy. Strokes are
 * static and stay in the outer margins, clear of headings and controls.
 */
function PaintedBackground({
  variant,
  children,
}: {
  variant: BackgroundVariant;
  children: React.ReactNode;
}) {
  const spec = VARIANTS[variant];
  const dark = variant === 'loader';

  return (
    <ImageBackground
      source={assets.bgGame}
      style={styles.fill}
      resizeMode="cover">
      <LinearGradient
        colors={spec.colors}
        start={spec.start}
        end={spec.end}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.decorLayer} pointerEvents="none">
        {dark ? (
          <>
            <View style={[styles.strokeWide, styles.loaderStrokeTop]} />
            <View style={[styles.strokeWide, styles.loaderStrokeBottom]} />
          </>
        ) : (
          <>
            <View style={[styles.strokePlum, styles.strokeTopRight]} />
            <View style={[styles.washMint, styles.washBottomLeft]} />
          </>
        )}
      </View>
      <View style={styles.fill}>{children}</View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  decorLayer: { ...StyleSheet.absoluteFillObject },

  strokeWide: {
    position: 'absolute',
    height: 90,
    left: -40,
    right: -40,
    backgroundColor: theme.colors.secondary,
    opacity: 0.1,
    transform: [{ rotate: '-12deg' }],
  },
  loaderStrokeTop: { top: 70 },
  loaderStrokeBottom: { bottom: 90 },

  strokePlum: {
    position: 'absolute',
    width: 190,
    height: 64,
    right: -56,
    top: 150,
    borderRadius: 32,
    backgroundColor: theme.colors.primary,
    opacity: 0.05,
    transform: [{ rotate: '-18deg' }],
  },
  strokeTopRight: {},

  washMint: {
    position: 'absolute',
    width: 230,
    height: 230,
    left: -90,
    bottom: -70,
    borderRadius: 115,
    backgroundColor: theme.colors.accent,
    opacity: 0.07,
  },
  washBottomLeft: {},
});

export default React.memo(PaintedBackground);
