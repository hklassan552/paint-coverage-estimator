import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import theme from '../constants/theme';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';

export interface TextFieldSheetProps {
  visible: boolean;
  title: string;
  label: string;
  initialValue: string;
  confirmLabel: string;
  maxLength?: number;
  reduceMotion?: boolean;
  onCommit: (value: string) => void;
  onCancel: () => void;
}

/** One 64 dp field, used for the room name and for renaming. */
function TextFieldSheet({
  visible,
  title,
  label,
  initialValue,
  confirmLabel,
  maxLength = 40,
  reduceMotion,
  onCommit,
  onCancel,
}: TextFieldSheetProps) {
  const [text, setText] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setText(initialValue);
      setError(null);
    }
  }, [visible, initialValue]);

  const handleCommit = () => {
    const trimmed = text.trim();
    if (!trimmed) {
      setError('Enter a name.');
      return;
    }
    onCommit(trimmed);
  };

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
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.sheetWrap}>
          <View style={styles.sheet}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.label}>{label}</Text>
            <TextInput
              value={text}
              onChangeText={value => {
                setText(value);
                setError(null);
              }}
              maxLength={maxLength}
              autoFocus
              selectTextOnFocus
              accessibilityLabel={label}
              style={styles.input}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <PrimaryButton
              label={confirmLabel}
              onPress={handleCommit}
              reduceMotion={reduceMotion}
            />
            <SecondaryButton
              label="Cancel"
              onPress={onCancel}
              reduceMotion={reduceMotion}
            />
          </View>
        </KeyboardAvoidingView>
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
  sheetWrap: { width: '100%' },
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
  label: {
    fontSize: theme.typography.caption.fontSize,
    lineHeight: theme.typography.caption.lineHeight,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: theme.colors.text.tertiary,
  },
  input: {
    height: 64,
    borderRadius: theme.radius.input,
    borderWidth: 1,
    borderColor: theme.colors.ui.borderStrong,
    backgroundColor: theme.colors.ui.inset,
    paddingHorizontal: theme.spacing.lg,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  error: {
    fontSize: theme.typography.helper.fontSize,
    lineHeight: theme.typography.helper.lineHeight,
    fontWeight: '600',
    color: theme.colors.primary,
  },
});

export default React.memo(TextFieldSheet);
