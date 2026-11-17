import React from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../constants/theme';
import { PRIMARY_BTN_H } from '../constants/config';
import { usePressScale } from '../hooks/usePressScale';
import { IconComponent } from './iconTypes';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
export const BUTTON_ICON = 24;

export interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  busy?: boolean;
  reduceMotion?: boolean;
  accessibilityHint?: string;
  Icon?: IconComponent;
  style?: ViewStyle;
}

/**
 * 56 dp gradient CTA. The Pressable is the parent and the Animated.View is its
 * child, which is the arrangement that keeps onPress alive on Android release.
 */
function PrimaryButton({
  label,
  onPress,
  disabled,
  busy,
  reduceMotion,
  accessibilityHint,
  Icon,
  style,
}: PrimaryButtonProps) {
  const { scale, onPressIn, onPressOut } = usePressScale(!!reduceMotion);
  const inactive = !!disabled || !!busy;

  return (
    <Pressable
      onPress={inactive ? undefined : onPress}
      onPressIn={inactive ? undefined : onPressIn}
      onPressOut={inactive ? undefined : onPressOut}
      disabled={inactive}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: inactive, busy: !!busy }}
      style={[styles.press, style]}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.animated, { transform: [{ scale }] }]}>
        <LinearGradient
          colors={
            inactive
              ? ['#D9E7E1', '#CDDCD6']
              : (theme.gradients.primaryButton as unknown as string[])
          }
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.gradient}>
          <View style={styles.row}>
            {busy ? (
              <ActivityIndicator size="small" color={theme.colors.ink} />
            ) : Icon ? (
              <Icon size={BUTTON_ICON} color={theme.colors.ink} strokeWidth={1.5} />
            ) : null}
            <Text
              style={[styles.label, inactive ? styles.labelDisabled : null]}
              numberOfLines={2}>
              {label}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: '100%',
    minHeight: PRIMARY_BTN_H,
    borderRadius: theme.radius.card,
    ...theme.shadows.primaryButton,
  },
  animated: {
    width: '100%',
    minHeight: PRIMARY_BTN_H,
    borderRadius: theme.radius.card,
    overflow: 'hidden',
  },
  gradient: {
    width: '100%',
    minHeight: PRIMARY_BTN_H,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
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
    letterSpacing: 0.6,
    color: theme.colors.ink,
    textAlign: 'center',
  },
  labelDisabled: { color: 'rgba(36,24,33,0.45)' },
});

export default React.memo(PrimaryButton);
