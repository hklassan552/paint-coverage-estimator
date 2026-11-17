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
import { TOUCH_MIN } from '../constants/config';
import { parseDecimalInput } from '../utils/units';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';

export interface NumericEditorSheetProps {
  visible: boolean;
  title: string;
  unitLabel: string;
  helper?: string;
  initialValue: string;
  min: number;
  max: number;
  reduceMotion?: boolean;
  onApply: (value: number) => void;
  onCancel: () => void;
}

/** 64 dp decimal entry with an explicit unit, APPLY and Cancel. */
function NumericEditorSheet({
  visible,
  title,
  unitLabel,
  helper,
  initialValue,
  min,
  max,
  reduceMotion,
  onApply,
  onCancel,
}: NumericEditorSheetProps) {
  const [text, setText] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setText(initialValue);
      setError(null);
    }
  }, [visible, initialValue]);

  const handleApply = () => {
    const parsed = parseDecimalInput(text);
    if (parsed == null) {
      setError('Use digits and one decimal mark, for example 2.5 or 2,5.');
      return;
    }
    if (parsed < min || parsed > max) {
      setError(
        'Enter a value between ' +
          min.toFixed(2) +
          ' and ' +
          max.toFixed(2) +
          ' ' +
          unitLabel +
          '.',
      );
      return;
    }
    onApply(parsed);
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
          accessibilityLabel="Close editor"
          onPress={onCancel}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.sheetWrap}>
          <View style={styles.sheet}>
            <Text style={styles.title}>{title}</Text>
            {helper ? <Text style={styles.helper}>{helper}</Text> : null}

            <View style={styles.fieldRow}>
              <TextInput
                value={text}
                onChangeText={value => {
                  setText(value);
                  setError(null);
                }}
                keyboardType="decimal-pad"
                autoFocus
                selectTextOnFocus
                maxLength={8}
                accessibilityLabel={title}
                placeholder="0"
                placeholderTextColor={theme.colors.text.tertiary}
                style={styles.input}
              />
              <Text style={styles.unit}>{unitLabel}</Text>
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <View style={styles.actions}>
              <PrimaryButton
                label="APPLY"
                onPress={handleApply}
                reduceMotion={reduceMotion}
              />
              <SecondaryButton
                label="Cancel"
                onPress={onCancel}
                reduceMotion={reduceMotion}
              />
            </View>
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
  helper: {
    fontSize: theme.typography.helper.fontSize,
    lineHeight: theme.typography.helper.lineHeight,
    color: theme.colors.text.tertiary,
  },
  fieldRow: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.radius.input,
    borderWidth: 1,
    borderColor: theme.colors.ui.borderStrong,
    backgroundColor: theme.colors.ui.inset,
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  input: {
    flex: 1,
    height: 64,
    fontSize: theme.typography.inputNumber.fontSize,
    fontWeight: '700',
    color: theme.colors.text.primary,
    padding: 0,
  },
  unit: {
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.lineHeight,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  error: {
    fontSize: theme.typography.helper.fontSize,
    lineHeight: theme.typography.helper.lineHeight,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  actions: { gap: theme.spacing.sm, minHeight: TOUCH_MIN },
});

export default React.memo(NumericEditorSheet);
