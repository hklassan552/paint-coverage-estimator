import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';

export interface ConfirmSheetProps {
  visible: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  reduceMotion?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmSheet({
  visible,
  title,
  description,
  confirmLabel,
  reduceMotion,
  onConfirm,
  onCancel,
}: ConfirmSheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <Pressable
          style={styles.backdropFill}
          accessibilityLabel="Dismiss"
          onPress={onCancel}
        />
        <View style={styles.sheet}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          <PrimaryButton
            label={confirmLabel}
            onPress={onConfirm}
            reduceMotion={reduceMotion}
          />
          <SecondaryButton
            label="Cancel"
            onPress={onCancel}
            reduceMotion={reduceMotion}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end' },
  backdropFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.ui.overlay,
  },
  sheet: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.card,
    borderTopRightRadius: theme.radius.card,
    padding: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
    gap: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.cardHeading.fontSize,
    lineHeight: theme.typography.cardHeading.lineHeight,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  description: {
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.lineHeight,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
});

export default React.memo(ConfirmSheet);
