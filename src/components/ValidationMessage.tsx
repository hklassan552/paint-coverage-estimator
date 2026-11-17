import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import theme from '../constants/theme';
import { TOUCH_MIN } from '../constants/config';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

export interface ValidationMessageProps {
  message: string;
  actionLabel?: string | null;
  onAction?: (() => void) | null;
}

/** Icon + text + plum outline: status is never carried by colour alone. */
function ValidationMessage({
  message,
  actionLabel,
  onAction,
}: ValidationMessageProps) {
  return (
    <View
      style={styles.wrap}
      accessibilityLiveRegion="polite"
      accessibilityLabel={message}>
      <AlertCircle size={20} color={theme.colors.primary} strokeWidth={1.5} />
      <View style={styles.textCol}>
        <Text style={styles.message}>{message}</Text>
        {actionLabel && onAction ? (
          <Pressable
            onPress={onAction}
            hitSlop={HIT}
            accessibilityRole="button"
            accessibilityLabel={actionLabel}
            style={styles.action}>
            <Text style={styles.actionLabel}>{actionLabel}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.ui.borderStrong,
    backgroundColor: theme.colors.ui.plumTint,
  },
  textCol: { flex: 1 },
  message: {
    fontSize: theme.typography.helper.fontSize,
    lineHeight: theme.typography.helper.lineHeight,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  action: {
    minHeight: TOUCH_MIN,
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: theme.typography.helper.fontSize,
    lineHeight: 20,
    fontWeight: '800',
    textDecorationLine: 'underline',
    color: theme.colors.primary,
  },
});

export default React.memo(ValidationMessage);
