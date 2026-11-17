import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import theme from '../constants/theme';
import { CARD_GAP, GUTTER } from '../constants/config';
import assets from '../assets';
import { ColorNote, Room } from '../game/types';
import PaintedBackground from '../components/PaintedBackground';
import ScreenHeader from '../components/ScreenHeader';
import ColorNoteCard from '../components/ColorNoteCard';
import ColorNoteEditorSheet, {
  ColorNoteDraft,
  draftFromNote,
  emptyNoteDraft,
} from '../components/ColorNoteEditorSheet';
import BottomPanel from '../components/BottomPanel';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import EmptyState from '../components/EmptyState';
import ConfirmSheet from '../components/ConfirmSheet';

export interface ColorNotesScreenProps {
  notes: ColorNote[];
  rooms: Room[];
  scopedRoom: Room | null;
  reduceMotion?: boolean;
  onSaveNote: (draft: ColorNoteDraft) => ColorNote;
  onDeleteNote: (id: string) => void;
  onLinkNote: (roomId: string, noteId: string | null) => void;
  onBack: () => void;
}

function ColorNotesScreen({
  notes,
  rooms,
  scopedRoom,
  reduceMotion,
  onSaveNote,
  onDeleteNote,
  onLinkNote,
  onBack,
}: ColorNotesScreenProps) {
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState<ColorNoteDraft | null>(null);
  const [deleting, setDeleting] = useState<ColorNote | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return notes;
    }
    return notes.filter(note => {
      const haystack = [note.name, note.colorCode, note.brand, note.note]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.indexOf(q) >= 0;
    });
  }, [notes, query]);

  const linkedRoomNames = useCallback(
    (noteId: string) =>
      rooms.filter(r => r.linkedColorNoteId === noteId).map(r => r.name),
    [rooms],
  );

  const renderItem = useCallback(
    ({ item }: { item: ColorNote }) => (
      <ColorNoteCard
        note={item}
        linkedRoomNames={linkedRoomNames(item.id)}
        reduceMotion={reduceMotion}
        selectLabel={scopedRoom ? 'Use here' : null}
        onSelect={
          scopedRoom
            ? () => {
                onLinkNote(scopedRoom.id, item.id);
                onBack();
              }
            : null
        }
        onEdit={() => setDraft(draftFromNote(item))}
        onDelete={() => setDeleting(item)}
      />
    ),
    [linkedRoomNames, reduceMotion, scopedRoom, onLinkNote, onBack],
  );

  const searching = query.trim().length > 0;

  return (
    <PaintedBackground variant="notes">
      <View style={styles.root}>
        <ScreenHeader
          title="Color Notes"
          subtitle={scopedRoom ? scopedRoom.name : 'All saved colours'}
          onBack={onBack}
        />

        <View style={styles.searchWrap}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search name, brand or code"
            placeholderTextColor={theme.colors.text.tertiary}
            accessibilityLabel="Search colour notes"
            style={styles.search}
          />
        </View>

        <View style={styles.listArea}>
          <FlatList
            data={filtered}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            ItemSeparatorComponent={Separator}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            initialNumToRender={6}
            windowSize={7}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              searching ? (
                <View style={styles.emptySearch}>
                  <Text style={styles.emptyTitle}>No matching colours</Text>
                  <View style={styles.clearWrap}>
                    <SecondaryButton
                      label="Clear search"
                      onPress={() => setQuery('')}
                      reduceMotion={reduceMotion}
                    />
                  </View>
                </View>
              ) : (
                <EmptyState
                  illustration={assets.sprite4}
                  title="Keep your paint codes handy"
                  description="Save the exact code, the brand and where you used it."
                />
              )
            }
          />
        </View>

        <BottomPanel>
          <PrimaryButton
            label="ADD COLOR NOTE"
            onPress={() => setDraft(emptyNoteDraft())}
            reduceMotion={reduceMotion}
          />
        </BottomPanel>
      </View>

      <ColorNoteEditorSheet
        visible={!!draft}
        draft={draft}
        reduceMotion={reduceMotion}
        onCommit={value => {
          const saved = onSaveNote(value);
          if (scopedRoom) {
            onLinkNote(scopedRoom.id, saved.id);
          }
          setDraft(null);
        }}
        onCancel={() => setDraft(null)}
      />

      <ConfirmSheet
        visible={!!deleting}
        title={deleting ? 'Delete ' + deleting.name + '?' : 'Delete colour?'}
        description="Rooms using this colour keep their estimates; only the link is cleared."
        confirmLabel="DELETE COLOR"
        reduceMotion={reduceMotion}
        onConfirm={() => {
          if (deleting) {
            onDeleteNote(deleting.id);
          }
          setDeleting(null);
        }}
        onCancel={() => setDeleting(null)}
      />
    </PaintedBackground>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  searchWrap: { paddingHorizontal: GUTTER, paddingTop: GUTTER },
  search: {
    height: 56,
    borderRadius: theme.radius.input,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.lg,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.primary,
  },
  listArea: { flex: 1 },
  listContent: {
    paddingHorizontal: GUTTER,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  separator: { height: CARD_GAP },
  emptySearch: { alignItems: 'center', paddingVertical: theme.spacing.xxl, gap: theme.spacing.md },
  emptyTitle: {
    fontSize: theme.typography.cardHeading.fontSize,
    lineHeight: theme.typography.cardHeading.lineHeight,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  clearWrap: { width: 200 },
});

export default ColorNotesScreen;
