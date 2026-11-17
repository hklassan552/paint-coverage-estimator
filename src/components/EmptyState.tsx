import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import SecondaryButton from './SecondaryButton';

export interface EmptyStateProps {
  illustration: ImageSourcePropType;
  size?: number;
  title: string;
  description: string;
  actionLabel?: string | null;
  onAction?: (() => void) | null;
  reduceMotion?: boolean;
}

/** Compact, meaningful empty state — illustration, wording, one clear action. */
function EmptyState({
  illustration,
  size = 128,
  title,
  description,
  actionLabel,
  onAction,
  reduceMotion,
}: EmptyStateProps) {
  return (
    <View style={styles.wrap}>
      <Image
        source={illustration}
        style={[styles.art, { width: size, height: size }]}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionLabel && onAction ? (
        <View style={styles.actionWrap}>
          <SecondaryButton
            label={actionLabel}
            onPress={onAction}
            reduceMotion={reduceMotion}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  art: { marginBottom: theme.spacing.xs },
  title: {
    fontSize: theme.typography.cardHeading.fontSize,
    lineHeight: theme.typography.cardHeading.lineHeight,
    fontWeight: '700',
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  description: {
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.lineHeight,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
    maxWidth: 300,
  },
  actionWrap: { width: 240, marginTop: theme.spacing.sm },
});

export default React.memo(EmptyState);
