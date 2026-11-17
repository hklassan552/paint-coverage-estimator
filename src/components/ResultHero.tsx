import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../constants/theme';
import { LengthUnit, coverageSuffix, coverageToDisplay } from '../utils/units';
import { formatArea, num } from '../utils/format';

export interface ResultHeroProps {
  headlineLiters: number;
  paintableM2: number;
  coats: number;
  coverageM2PerLiter: number;
  displayUnit: LengthUnit;
}

/** The large-number composition that makes Result unmistakable. */
function ResultHero({
  headlineLiters,
  paintableM2,
  coats,
  coverageM2PerLiter,
  displayUnit,
}: ResultHeroProps) {
  return (
    <LinearGradient
      colors={theme.gradients.hero as unknown as string[]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}>
      <Text style={styles.kicker}>Paint needed</Text>
      <View style={styles.valueRow}>
        <Text style={styles.value} numberOfLines={1}>
          {num(headlineLiters)}
        </Text>
        <Text style={styles.unit}>L</Text>
      </View>
      <Text style={styles.coats}>
        For {coats} coat{coats === 1 ? '' : 's'}
      </Text>
      <Text style={styles.detail}>
        {formatArea(paintableM2, displayUnit)} paintable ·{' '}
        {num(coverageToDisplay(coverageM2PerLiter, displayUnit))}{' '}
        {coverageSuffix(displayUnit)}
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: theme.radius.card,
    padding: theme.spacing.xl,
    gap: theme.spacing.xs,
    ...theme.shadows.card,
  },
  kicker: {
    fontSize: theme.typography.caption.fontSize,
    lineHeight: theme.typography.caption.lineHeight,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: theme.colors.text.inverseSoft,
  },
  valueRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  value: {
    fontSize: theme.typography.heroNumber.fontSize,
    lineHeight: theme.typography.heroNumber.lineHeight,
    fontWeight: '800',
    color: theme.colors.text.inverse,
  },
  unit: {
    fontSize: 22,
    lineHeight: 40,
    fontWeight: '700',
    color: theme.colors.accent,
  },
  coats: {
    fontSize: theme.typography.bodyStrong.fontSize,
    lineHeight: theme.typography.bodyStrong.lineHeight,
    fontWeight: '700',
    color: theme.colors.text.inverse,
  },
  detail: {
    fontSize: theme.typography.helper.fontSize,
    lineHeight: theme.typography.helper.lineHeight,
    color: theme.colors.text.inverseSoft,
  },
});

export default React.memo(ResultHero);
