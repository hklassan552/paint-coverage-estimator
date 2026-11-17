import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Palette, Ruler } from 'lucide-react-native';
import theme from '../constants/theme';
import { GUTTER, TOUCH_MIN } from '../constants/config';
import { LengthUnit } from '../utils/units';
import { usePressScale } from '../hooks/usePressScale';
import { IconComponent } from './iconTypes';
import PrimaryButton from './PrimaryButton';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

export interface NewEstimateHubProps {
  onStart: () => void;
  onNotes: () => void;
  onUnits: () => void;
  currentUnit: LengthUnit;
  reduceMotion?: boolean;
}

function SmallTile({
  label,
  value,
  Icon,
  onPress,
  reduceMotion,
}: {
  label: string;
  value: string;
  Icon: IconComponent;
  onPress: () => void;
  reduceMotion?: boolean;
}) {
  const { scale, onPressIn, onPressOut } = usePressScale(!!reduceMotion);
  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={label + ', ' + value}
      style={styles.smallPress}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.smallTile, { transform: [{ scale }] }]}>
        <Icon size={24} color={theme.colors.primary} strokeWidth={1.5} />
        <View style={styles.smallText}>
          <Text style={styles.smallLabel} numberOfLines={1}>
            {label}
          </Text>
          <Text style={styles.smallValue} numberOfLines={1}>
            {value}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

/** M3 bento action hub: one large tile plus two small ones, in thumb reach. */
function NewEstimateHub({
  onStart,
  onNotes,
  onUnits,
  currentUnit,
  reduceMotion,
}: NewEstimateHubProps) {
  return (
    <View style={styles.hub}>
      <LinearGradient
        colors={theme.gradients.hubTile as unknown as string[]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.bigTile}>
        <View style={styles.bigText}>
          <Text style={styles.bigHeading}>A fresh project</Text>
          <Text style={styles.bigHelper}>
            Measure walls, subtract openings, get litres.
          </Text>
        </View>
        <PrimaryButton
          label="START ESTIMATE"
          onPress={onStart}
          reduceMotion={reduceMotion}
          accessibilityHint="Creates a new room and opens the wall measurements"
        />
      </LinearGradient>

      <View style={styles.column}>
        <SmallTile
          label="Color Notes"
          value="Codes & brands"
          Icon={Palette}
          onPress={onNotes}
          reduceMotion={reduceMotion}
        />
        <SmallTile
          label="Units"
          value={currentUnit === 'feet' ? 'Feet · ft' : 'Metres · m'}
          Icon={Ruler}
          onPress={onUnits}
          reduceMotion={reduceMotion}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hub: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    paddingHorizontal: GUTTER,
    paddingBottom: GUTTER,
    paddingTop: theme.spacing.sm,
  },
  bigTile: {
    flex: 64,
    minHeight: 176,
    borderRadius: theme.radius.card,
    padding: theme.spacing.lg,
    justifyContent: 'space-between',
    gap: theme.spacing.md,
    ...theme.shadows.card,
  },
  bigText: { gap: theme.spacing.xs },
  bigHeading: {
    fontSize: theme.typography.cardHeading.fontSize,
    lineHeight: theme.typography.cardHeading.lineHeight,
    fontWeight: '800',
    color: theme.colors.text.inverse,
  },
  bigHelper: {
    fontSize: theme.typography.helper.fontSize,
    lineHeight: theme.typography.helper.lineHeight,
    color: theme.colors.text.inverseSoft,
  },
  column: { flex: 36, gap: theme.spacing.md },
  smallPress: { width: '100%', minHeight: 82 },
  smallTile: {
    width: '100%',
    minHeight: 82,
    borderRadius: theme.radius.card,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    padding: theme.spacing.md,
    justifyContent: 'space-between',
    gap: theme.spacing.xs,
    ...theme.shadows.card,
  },
  smallText: { gap: 1 },
  smallLabel: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  smallValue: {
    fontSize: theme.typography.caption.fontSize,
    lineHeight: theme.typography.caption.lineHeight,
    color: theme.colors.text.tertiary,
  },
  spacer: { height: TOUCH_MIN },
});

export default React.memo(NewEstimateHub);
