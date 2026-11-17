import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import theme from '../constants/theme';

/**
 * The fixed lower action surface shared by every editor screen:
 * its own raised Surface backing with 18 dp upper corners.
 */
function BottomPanel({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[styles.panel, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  panel: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.card,
    borderTopRightRadius: theme.radius.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.ui.border,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.md,
    ...theme.shadows.panel,
  },
});

export default React.memo(BottomPanel);
