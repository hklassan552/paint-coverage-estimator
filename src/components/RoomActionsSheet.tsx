import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Copy, Pencil, Trash2 } from 'lucide-react-native';
import theme from '../constants/theme';
import SecondaryButton from './SecondaryButton';

export interface RoomActionsSheetProps {
  visible: boolean;
  roomName: string;
  reduceMotion?: boolean;
  onRename: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onCancel: () => void;
}

function RoomActionsSheet({
  visible,
  roomName,
  reduceMotion,
  onRename,
  onDuplicate,
  onDelete,
  onCancel,
}: RoomActionsSheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <Pressable
          style={styles.backdropFill}
          accessibilityLabel="Close"
          onPress={onCancel}
        />
        <View style={styles.sheet}>
          <Text style={styles.title} numberOfLines={1}>
            {roomName}
          </Text>
          <SecondaryButton
            label="Rename"
            Icon={Pencil}
            onPress={onRename}
            reduceMotion={reduceMotion}
          />
          <SecondaryButton
            label="Duplicate"
            Icon={Copy}
            onPress={onDuplicate}
            reduceMotion={reduceMotion}
          />
          <SecondaryButton
            label="Delete"
            Icon={Trash2}
            tone="danger"
            onPress={onDelete}
            reduceMotion={reduceMotion}
          />
          <SecondaryButton
            label="Close"
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
    marginBottom: theme.spacing.xs,
  },
});

export default React.memo(RoomActionsSheet);
