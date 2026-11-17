import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import theme from '../constants/theme';
import {
  COVERAGE_STEP_M2L,
  MAX_COVERAGE_M2L,
  MIN_COVERAGE_M2L,
  TOUCH_MIN,
} from '../constants/config';
import {
  LengthUnit,
  coverageSuffix,
  coverageToCanonical,
  coverageToDisplay,
  roundDisplay,
} from '../utils/units';
import { num } from '../utils/format';
import NumericEditorSheet from './NumericEditorSheet';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

export interface CoverageControlProps {
  coverageM2PerLiter: number;
  displayUnit: LengthUnit;
  reduceMotion?: boolean;
  onCommit: (m2PerLiter: number) => void;
  error?: string | null;
}

/**
 * Steppers always move the exact canonical 0.5 m²/L increment; in feet mode
 * that shows up as the converted 5.38 ft²/L step.
 */
function CoverageControl({
  coverageM2PerLiter,
  displayUnit,
  reduceMotion,
  onCommit,
  error,
}: CoverageControlProps) {
  const [editing, setEditing] = useState(false);
  const suffix = coverageSuffix(displayUnit);
  const display = roundDisplay(
    coverageToDisplay(coverageM2PerLiter, displayUnit),
  );

  const bump = (direction: 1 | -1) => {
    const next = coverageM2PerLiter + direction * COVERAGE_STEP_M2L;
    const clamped = Math.min(
      MAX_COVERAGE_M2L,
      Math.max(MIN_COVERAGE_M2L, Math.round(next * 100) / 100),
    );
    onCommit(clamped);
  };

  const canMinus = coverageM2PerLiter > MIN_COVERAGE_M2L + 1e-9;
  const canPlus = coverageM2PerLiter < MAX_COVERAGE_M2L - 1e-9;

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>Coverage for one coat</Text>

      <View style={[styles.control, error ? styles.controlError : null]}>
        <Pressable
          onPress={canMinus ? () => bump(-1) : undefined}
          disabled={!canMinus}
          hitSlop={HIT}
          accessibilityRole="button"
          accessibilityLabel="Decrease coverage"
          style={styles.end}>
          <Minus
            size={24}
            color={canMinus ? theme.colors.primary : 'rgba(36,24,33,0.35)'}
            strokeWidth={1.5}
          />
        </Pressable>

        <Pressable
          onPress={() => setEditing(true)}
          hitSlop={HIT}
          accessibilityRole="button"
          accessibilityLabel={'Coverage ' + num(display) + ' ' + suffix + '. Edit value'}
          style={styles.valueTarget}>
          <Text style={styles.value} numberOfLines={1}>
            {num(display)}
          </Text>
          <Text style={styles.unit} numberOfLines={1}>
            {suffix}
          </Text>
        </Pressable>

        <Pressable
          onPress={canPlus ? () => bump(1) : undefined}
          disabled={!canPlus}
          hitSlop={HIT}
          accessibilityRole="button"
          accessibilityLabel="Increase coverage"
          style={styles.end}>
          <Plus
            size={24}
            color={canPlus ? theme.colors.primary : 'rgba(36,24,33,0.35)'}
            strokeWidth={1.5}
          />
        </Pressable>
      </View>

      <Text style={styles.helper}>Use the can's coverage for one coat.</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <NumericEditorSheet
        visible={editing}
        title="Coverage for one coat"
        unitLabel={suffix}
        helper="A precise value in the unit shown."
        initialValue={num(display)}
        min={roundDisplay(coverageToDisplay(MIN_COVERAGE_M2L, displayUnit))}
        max={roundDisplay(coverageToDisplay(MAX_COVERAGE_M2L, displayUnit))}
        reduceMotion={reduceMotion}
        onCancel={() => setEditing(false)}
        onApply={value => {
          const canonical = coverageToCanonical(value, displayUnit);
          if (
            Number.isFinite(canonical) &&
            canonical >= MIN_COVERAGE_M2L - 1e-9 &&
            canonical <= MAX_COVERAGE_M2L + 1e-9
          ) {
            onCommit(canonical);
          }
          setEditing(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', gap: theme.spacing.xs },
  label: {
    fontSize: theme.typography.caption.fontSize,
    lineHeight: theme.typography.caption.lineHeight,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: theme.colors.text.tertiary,
  },
  control: {
    width: '100%',
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.radius.input,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: theme.colors.ui.inset,
  },
  controlError: { borderColor: theme.colors.primary },
  end: {
    width: TOUCH_MIN,
    height: 62,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueTarget: {
    flex: 1,
    minWidth: 72,
    height: 62,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  value: {
    fontSize: theme.typography.inputNumber.fontSize,
    lineHeight: theme.typography.inputNumber.lineHeight,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  unit: {
    fontSize: theme.typography.helper.fontSize,
    lineHeight: 20,
    fontWeight: '600',
    color: theme.colors.text.tertiary,
  },
  helper: {
    fontSize: theme.typography.helper.fontSize,
    lineHeight: theme.typography.helper.lineHeight,
    color: theme.colors.text.tertiary,
  },
  error: {
    fontSize: theme.typography.helper.fontSize,
    lineHeight: theme.typography.helper.lineHeight,
    fontWeight: '600',
    color: theme.colors.primary,
  },
});

export default React.memo(CoverageControl);
