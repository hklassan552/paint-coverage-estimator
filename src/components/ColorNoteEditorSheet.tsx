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
import { ColorNote } from '../game/types';
import { previewHex, trimCode } from '../utils/colorCode';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';

export interface ColorNoteDraft {
  id?: string;
  name: string;
  colorCode: string;
  brand: string;
  note: string;
}

export interface ColorNoteEditorSheetProps {
  visible: boolean;
  draft: ColorNoteDraft | null;
  reduceMotion?: boolean;
  onCommit: (note: ColorNoteDraft) => void;
  onCancel: () => void;
}

export const emptyNoteDraft = (): ColorNoteDraft => ({
  name: '',
  colorCode: '',
  brand: '',
  note: '',
});

export const draftFromNote = (note: ColorNote): ColorNoteDraft => ({
  id: note.id,
  name: note.name,
  colorCode: note.colorCode,
  brand: note.brand || '',
  note: note.note || '',
});

function Field({
  label,
  value,
  placeholder,
  maxLength,
  multiline,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  maxLength: number;
  multiline?: boolean;
  onChange: (text: string) => void;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.text.tertiary}
        maxLength={maxLength}
        multiline={multiline}
        accessibilityLabel={label}
        style={[styles.input, multiline ? styles.inputMultiline : null]}
      />
    </View>
  );
}

function ColorNoteEditorSheet({
  visible,
  draft,
  reduceMotion,
  onCommit,
  onCancel,
}: ColorNoteEditorSheetProps) {
  const [local, setLocal] = useState<ColorNoteDraft>(draft || emptyNoteDraft());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setLocal(draft || emptyNoteDraft());
      setError(null);
    }
  }, [visible, draft]);

  const hex = previewHex(local.colorCode);

  const handleSave = () => {
    const name = local.name.trim();
    const code = trimCode(local.colorCode);
    if (!name) {
      setError('Give the colour a name.');
      return;
    }
    if (!code) {
      setError('Enter the exact colour code from the can or fan deck.');
      return;
    }
    onCommit({ ...local, name, colorCode: code });
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
            <View style={styles.headRow}>
              <View
                style={[
                  styles.preview,
                  hex ? { backgroundColor: hex } : styles.previewNeutral,
                ]}
              />
              <Text style={styles.title}>
                {local.id ? 'Edit colour note' : 'New colour note'}
              </Text>
            </View>

            <Field
              label="Name"
              value={local.name}
              placeholder="Morning plaster"
              maxLength={40}
              onChange={text => {
                setLocal({ ...local, name: text });
                setError(null);
              }}
            />
            <Field
              label="Colour code"
              value={local.colorCode}
              placeholder="RAL 9010 or #F6EDF4"
              maxLength={40}
              onChange={text => {
                setLocal({ ...local, colorCode: text });
                setError(null);
              }}
            />
            <Field
              label="Brand (optional)"
              value={local.brand}
              placeholder="Shop or manufacturer"
              maxLength={40}
              onChange={text => setLocal({ ...local, brand: text })}
            />
            <Field
              label="Notes (optional)"
              value={local.note}
              placeholder="Matt finish, two cans left in the shed"
              maxLength={240}
              multiline
              onChange={text => setLocal({ ...local, note: text })}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <PrimaryButton
              label="SAVE COLOR"
              onPress={handleSave}
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
    maxHeight: '88%',
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.card,
    borderTopRightRadius: theme.radius.card,
    padding: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
    gap: theme.spacing.md,
  },
  headRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
  preview: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  previewNeutral: { backgroundColor: 'rgba(221,176,187,0.35)' },
  title: {
    flex: 1,
    fontSize: theme.typography.cardHeading.fontSize,
    lineHeight: theme.typography.cardHeading.lineHeight,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  field: { gap: 4 },
  fieldLabel: {
    fontSize: theme.typography.caption.fontSize,
    lineHeight: theme.typography.caption.lineHeight,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: theme.colors.text.tertiary,
  },
  input: {
    minHeight: 56,
    borderRadius: theme.radius.input,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: theme.colors.ui.inset,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.primary,
  },
  inputMultiline: { minHeight: 80, textAlignVertical: 'top' },
  error: {
    fontSize: theme.typography.helper.fontSize,
    lineHeight: theme.typography.helper.lineHeight,
    fontWeight: '600',
    color: theme.colors.primary,
  },
});

export default React.memo(ColorNoteEditorSheet);
