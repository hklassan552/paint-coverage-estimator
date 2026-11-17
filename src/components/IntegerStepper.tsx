import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import theme from '../constants/theme';
import { TOUCH_MIN } from '../constants/config';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

export interface IntegerStepperProps {
  label: string;
  value: number;
  min: number;
  max: number;
  size?: 'normal' | 'large';
  onChange: (value: number) => void;
}

function IntegerStepper({
  label,
  value,
  min,
  max,
  size = 'normal',
  onChange,
}: IntegerStepperProps) {
  const canMinus = value > min;
  const canPlus = value < max;

  return (
    <View style={styles.wrap}>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      <View style={styles.control}>
        <Pressable
          onPress={canMinus ? () => onChange(value - 1) : undefined}
          disabled={!canMinus}
          hitSlop={HIT}
          accessibilityRole="button"
          accessibilityLabel={'Decrease ' + label}
          accessibilityState={{ disabled: !canMinus }}
          style={styles.end}>
          <Minus
            size={24}
            color={canMinus ? theme.colors.primary : 'rgba(36,24,33,0.35)'}
            strokeWidth={1.5}
          />
        </Pressable>

        <View
          style={styles.valueBox}
          accessibilityLabel={label + ', ' + value}>
          <Text
            style={[styles.value, size === 'large' ? styles.valueLarge : null]}>
            {value}
          </Text>
        </View>

        <Pressable
          onPress={canPlus ? () => onChange(value + 1) : undefined}
          disabled={!canPlus}
          hitSlop={HIT}
          accessibilityRole="button"
          accessibilityLabel={'Increase ' + label}
          accessibilityState={{ disabled: !canPlus }}
          style={styles.end}>
          <Plus
            size={24}
            color={canPlus ? theme.colors.primary : 'rgba(36,24,33,0.35)'}
            strokeWidth={1.5}
          />
        </Pressable>
      </View>
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
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.radius.input,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: theme.colors.ui.inset,
  },
  end: {
    width: TOUCH_MIN,
    height: 62,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueBox: {
    flex: 1,
    minWidth: 72,
    height: 62,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: theme.typography.inputNumber.fontSize,
    lineHeight: theme.typography.inputNumber.lineHeight,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  valueLarge: { fontSize: 40, lineHeight: 48 },
});

export default React.memo(IntegerStepper);
