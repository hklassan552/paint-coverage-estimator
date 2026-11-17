import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import theme from '../constants/theme';

export interface SurfaceCardProps {
  title?: string | null;
  caption?: string | null;
  tone?: 'default' | 'raised' | 'tinted';
  children?: React.ReactNode;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

/** SOFT_UI surface: light solid card, 18 dp corners, thin dusty-rose border. */
function SurfaceCard({
  title,
  caption,
  tone = 'default',
  children,
  style,
  accessibilityLabel,
}: SurfaceCardProps) {
  return (
    <View
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.card,
        tone === 'tinted' ? styles.tinted : null,
        tone === 'raised' ? styles.raised : null,
        style,
      ]}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {caption ? <Text style={styles.caption}>{caption}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    padding: theme.spacing.lg,
    ...theme.shadows.card,
  },
  raised: { padding: theme.spacing.xl, elevation: 3 },
  tinted: { backgroundColor: 'rgba(250,250,250,0.86)' },
  title: {
    fontSize: theme.typography.cardHeading.fontSize,
    lineHeight: theme.typography.cardHeading.lineHeight,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  caption: {
    fontSize: theme.typography.helper.fontSize,
    lineHeight: theme.typography.helper.lineHeight,
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing.xs,
  },
});

export default React.memo(SurfaceCard);
