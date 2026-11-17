import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Palette, Pencil, Trash2 } from 'lucide-react-native';
import theme from '../constants/theme';
import { ColorNote } from '../game/types';
import { previewHex } from '../utils/colorCode';
import SecondaryButton from './SecondaryButton';
import SurfaceCard from './SurfaceCard';

export interface ColorNoteCardProps {
  note: ColorNote;
  linkedRoomNames: string[];
  reduceMotion?: boolean;
  selectLabel?: string | null;
  onSelect?: (() => void) | null;
  onEdit: () => void;
  onDelete: () => void;
}

function ColorNoteCard({
  note,
  linkedRoomNames,
  reduceMotion,
  selectLabel,
  onSelect,
  onEdit,
  onDelete,
}: ColorNoteCardProps) {
  const hex = previewHex(note.colorCode);

  return (
    <SurfaceCard accessibilityLabel={note.name + ', code ' + note.colorCode}>
      <View style={styles.topRow}>
        <View
          style={[
            styles.tile,
            hex ? { backgroundColor: hex } : styles.tileNeutral,
          ]}>
          {hex ? null : (
            <Palette size={22} color={theme.colors.primary} strokeWidth={1.5} />
          )}
        </View>
        <View style={styles.textCol}>
          <Text style={styles.name} numberOfLines={1}>
            {note.name}
          </Text>
          <Text style={styles.code} numberOfLines={1}>
            {note.colorCode}
          </Text>
          {note.brand ? (
            <Text style={styles.meta} numberOfLines={1}>
              {note.brand}
            </Text>
          ) : null}
          {linkedRoomNames.length > 0 ? (
            <Text style={styles.meta} numberOfLines={1}>
              Linked to {linkedRoomNames.join(', ')}
            </Text>
          ) : null}
        </View>
      </View>

      {note.note ? (
        <Text style={styles.body} numberOfLines={3}>
          {note.note}
        </Text>
      ) : null}

      <View style={styles.actions}>
        {selectLabel && onSelect ? (
          <View style={styles.actionSlot}>
            <SecondaryButton
              label={selectLabel}
              onPress={onSelect}
              reduceMotion={reduceMotion}
            />
          </View>
        ) : null}
        <View style={styles.actionSlot}>
          <SecondaryButton
            label="Edit"
            Icon={Pencil}
            onPress={onEdit}
            reduceMotion={reduceMotion}
          />
        </View>
        <View style={styles.actionSlot}>
          <SecondaryButton
            label="Delete"
            Icon={Trash2}
            tone="danger"
            onPress={onDelete}
            reduceMotion={reduceMotion}
          />
        </View>
      </View>
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  topRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
  tile: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileNeutral: { backgroundColor: 'rgba(221,176,187,0.35)' },
  textCol: { flex: 1, minWidth: 0, gap: 1 },
  name: {
    fontSize: theme.typography.cardHeading.fontSize,
    lineHeight: theme.typography.cardHeading.lineHeight,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  code: {
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.lineHeight,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  meta: {
    fontSize: theme.typography.caption.fontSize,
    lineHeight: theme.typography.caption.lineHeight,
    color: theme.colors.text.tertiary,
  },
  body: {
    marginTop: theme.spacing.sm,
    fontSize: theme.typography.helper.fontSize,
    lineHeight: theme.typography.helper.lineHeight,
    color: theme.colors.text.secondary,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },
  actionSlot: { flex: 1, minWidth: 0 },
});

export default React.memo(ColorNoteCard);
