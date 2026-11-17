import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import theme from '../constants/theme';
import { MAX_DIM_M, MIN_DIM_M, TOUCH_MIN } from '../constants/config';
import {
  LengthUnit,
  dimensionStep,
  displayToMeters,
  lengthSuffix,
  maxDisplayDimension,
  metersToDisplay,
  minDisplayDimension,
  roundDisplay,
  spokenLength,
} from '../utils/units';
import { num } from '../utils/format';
import NumericEditorSheet from './NumericEditorSheet';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

export interface DimensionControlProps {
  label: string;
  valueM: number | null;
  displayUnit: LengthUnit;
  reduceMotion?: boolean;
  onCommit: (meters: number | null) => void;
  error?: string | null;
}

/**
 * 64 dp control with 48 dp stepper ends and a 72 dp+ central numeric target.
 * The display string is never reparsed back into the canonical value — only
 * explicit stepper taps and the editor commit a new number.
 */
function DimensionControl({
  label,
  valueM,
  displayUnit,
  reduceMotion,
  onCommit,
  error,
}: DimensionControlProps) {
  const [editing, setEditing] = useState(false);
  const step = dimensionStep(displayUnit);
  const suffix = lengthSuffix(displayUnit);
  const display = valueM == null ? null : roundDisplay(metersToDisplay(valueM, displayUnit));

  const bump = useCallback(
    (direction: 1 | -1) => {
      if (valueM == null) {
        if (direction === 1) {
          onCommit(displayToMeters(step, displayUnit));
        }
        return;
      }
      const current = metersToDisplay(valueM, displayUnit);
      const next = roundDisplay(current + direction * step);
      if (next <= 0) {
        return; // minus never produces zero or a negative dimension
      }
      const clamped = Math.min(next, maxDisplayDimension(displayUnit));
      onCommit(displayToMeters(clamped, displayUnit));
    },
    [valueM, displayUnit, step, onCommit],
  );

  const a11yValue =
    display == null
      ? 'not set'
      : num(display) + ' ' + spokenLength(displayUnit);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>

      <View style={[styles.control, error ? styles.controlError : null]}>
        <Pressable
          onPress={() => bump(-1)}
          hitSlop={HIT}
          disabled={valueM == null}
          accessibilityRole="button"
          accessibilityLabel={'Decrease ' + label}
          style={styles.end}>
          <Minus
            size={24}
            color={valueM == null ? 'rgba(36,24,33,0.35)' : theme.colors.primary}
            strokeWidth={1.5}
          />
        </Pressable>

        <Pressable
          onPress={() => setEditing(true)}
          hitSlop={HIT}
          accessibilityRole="button"
          accessibilityLabel={label + ', ' + a11yValue + '. Edit value'}
          style={styles.valueTarget}>
          <Text style={styles.value} numberOfLines={1}>
            {display == null ? '—' : num(display)}
          </Text>
          <Text style={styles.unit}>{suffix}</Text>
        </Pressable>

        <Pressable
          onPress={() => bump(1)}
          hitSlop={HIT}
          accessibilityRole="button"
          accessibilityLabel={'Increase ' + label}
          style={styles.end}>
          <Plus size={24} color={theme.colors.primary} strokeWidth={1.5} />
        </Pressable>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <NumericEditorSheet
        visible={editing}
        title={label}
        unitLabel={suffix}
        helper={'Up to two decimals, in ' + spokenLength(displayUnit) + '.'}
        initialValue={display == null ? '' : num(display)}
        min={roundDisplay(minDisplayDimension(displayUnit))}
        max={roundDisplay(maxDisplayDimension(displayUnit))}
        reduceMotion={reduceMotion}
        onCancel={() => setEditing(false)}
        onApply={value => {
          const meters = displayToMeters(value, displayUnit);
          if (meters >= MIN_DIM_M && meters <= MAX_DIM_M) {
            onCommit(meters);
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
  error: {
    fontSize: theme.typography.helper.fontSize,
    lineHeight: theme.typography.helper.lineHeight,
    color: theme.colors.primary,
    fontWeight: '600',
  },
});

export default React.memo(DimensionControl);
