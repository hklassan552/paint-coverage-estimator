import React from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import theme from '../constants/theme';
import { TOUCH_MIN } from '../constants/config';
import { usePressScale } from '../hooks/usePressScale';
import { IconComponent } from './iconTypes';
import { BUTTON_ICON } from './PrimaryButton';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

export interface SecondaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  reduceMotion?: boolean;
  tone?: 'default' | 'danger';
  Icon?: IconComponent;
  style?: ViewStyle;
}

/** 48 dp outlined control. Same icon size and gap as PrimaryButton. */
function SecondaryButton({
  label,
  onPress,
  disabled,
  reduceMotion,
  tone = 'default',
  Icon,
  style,
}: SecondaryButtonProps) {
  const { scale, onPressIn, onPressOut } = usePressScale(!!reduceMotion);
  const color = disabled
    ? 'rgba(36,24,33,0.40)'
    : tone === 'danger'
    ? theme.colors.primary
    : theme.colors.ink;

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      onPressIn={disabled ? undefined : onPressIn}
      onPressOut={disabled ? undefined : onPressOut}
      disabled={disabled}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      style={[styles.press, style]}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.animated,
          tone === 'danger' ? styles.danger : null,
          disabled ? styles.disabled : null,
          { transform: [{ scale }] },
        ]}>
        <View style={styles.row}>
          {Icon ? (
            <Icon size={BUTTON_ICON} color={color} strokeWidth={1.5} />
          ) : null}
          <Text style={[styles.label, { color }]} numberOfLines={2}>
            {label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: '100%', minHeight: TOUCH_MIN },
  animated: {
    width: '100%',
    minHeight: TOUCH_MIN,
    borderRadius: theme.radius.input,
    borderWidth: 1,
    borderColor: theme.colors.ui.borderStrong,
    backgroundColor: theme.colors.ui.plumTint,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  danger: { borderColor: theme.colors.primary },
  disabled: { borderColor: theme.colors.ui.border, backgroundColor: 'transparent' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontSize: theme.typography.button.fontSize,
    lineHeight: BUTTON_ICON,
    fontWeight: '700',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});

export default React.memo(SecondaryButton);
