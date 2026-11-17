import React, { useCallback, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { CARD_GAP, GUTTER } from '../constants/config';
import assets from '../assets';
import { LengthUnit } from '../utils/units';
import { Room } from '../game/types';
import PaintedBackground from '../components/PaintedBackground';
import ScreenHeader from '../components/ScreenHeader';
import RoomCard from '../components/RoomCard';
import NewEstimateHub from '../components/NewEstimateHub';
import EmptyState from '../components/EmptyState';
import ConfirmSheet from '../components/ConfirmSheet';
import RoomActionsSheet from '../components/RoomActionsSheet';
import TextFieldSheet from '../components/TextFieldSheet';

export interface MenuScreenProps {
  rooms: Room[];
  displayUnit: LengthUnit;
  reduceMotion?: boolean;
  onStart: () => void;
  onTryExample: () => void;
  onEditRoom: (roomId: string) => void;
  onViewResult: (roomId: string) => void;
  onRenameRoom: (roomId: string, name: string) => void;
  onDuplicateRoom: (roomId: string) => void;
  onDeleteRoom: (roomId: string) => void;
  onNotes: () => void;
  onSettings: () => void;
}

/** Rooms — the M3 bento hub over the saved-room list. */
function MenuScreen({
  rooms,
  displayUnit,
  reduceMotion,
  onStart,
  onTryExample,
  onEditRoom,
  onViewResult,
  onRenameRoom,
  onDuplicateRoom,
  onDeleteRoom,
  onNotes,
  onSettings,
}: MenuScreenProps) {
  const [actionsFor, setActionsFor] = useState<Room | null>(null);
  const [renaming, setRenaming] = useState<Room | null>(null);
  const [deleting, setDeleting] = useState<Room | null>(null);

  const renderItem = useCallback(
    ({ item }: { item: Room }) => (
      <RoomCard
        room={item}
        displayUnit={displayUnit}
        reduceMotion={reduceMotion}
        onEdit={() => onEditRoom(item.id)}
        onViewResult={() => onViewResult(item.id)}
        onActions={() => setActionsFor(item)}
      />
    ),
    [displayUnit, reduceMotion, onEditRoom, onViewResult],
  );

  const keyExtractor = useCallback((item: Room) => item.id, []);

  return (
    <PaintedBackground variant="rooms">
      <View style={styles.root}>
        <ScreenHeader title="Rooms" subtitle="Plan your next coat" />

        <View style={styles.introRow}>
          <Image
            source={assets.iconHome}
            style={styles.introIcon}
            resizeMode="contain"
            accessibilityIgnoresInvertColors
          />
          <Text style={styles.introText}>Saved on this device</Text>
        </View>

        <View style={styles.listArea}>
          <FlatList
            data={rooms}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ItemSeparatorComponent={Separator}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            initialNumToRender={6}
            windowSize={7}
            removeClippedSubviews
            ListEmptyComponent={
              <EmptyState
                illustration={assets.sprite1}
                title="Your first room starts here"
                description="Add walls, subtract openings, then choose coats."
                actionLabel="TRY EXAMPLE"
                onAction={onTryExample}
                reduceMotion={reduceMotion}
              />
            }
          />
        </View>

        <NewEstimateHub
          onStart={onStart}
          onNotes={onNotes}
          onUnits={onSettings}
          currentUnit={displayUnit}
          reduceMotion={reduceMotion}
        />
      </View>

      <RoomActionsSheet
        visible={!!actionsFor}
        roomName={actionsFor ? actionsFor.name : ''}
        reduceMotion={reduceMotion}
        onRename={() => {
          setRenaming(actionsFor);
          setActionsFor(null);
        }}
        onDuplicate={() => {
          if (actionsFor) {
            onDuplicateRoom(actionsFor.id);
          }
          setActionsFor(null);
        }}
        onDelete={() => {
          setDeleting(actionsFor);
          setActionsFor(null);
        }}
        onCancel={() => setActionsFor(null)}
      />

      <TextFieldSheet
        visible={!!renaming}
        title="Rename room"
        label="Room name"
        initialValue={renaming ? renaming.name : ''}
        confirmLabel="SAVE NAME"
        reduceMotion={reduceMotion}
        onCommit={name => {
          if (renaming) {
            onRenameRoom(renaming.id, name);
          }
          setRenaming(null);
        }}
        onCancel={() => setRenaming(null)}
      />

      <ConfirmSheet
        visible={!!deleting}
        title={deleting ? 'Delete ' + deleting.name + '?' : 'Delete room?'}
        description="Its walls, openings and estimate are removed. Linked colour notes stay in Color Notes."
        confirmLabel="DELETE ROOM"
        reduceMotion={reduceMotion}
        onConfirm={() => {
          if (deleting) {
            onDeleteRoom(deleting.id);
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
  introRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: GUTTER,
    paddingTop: GUTTER,
    paddingBottom: theme.spacing.sm,
  },
  introIcon: { width: 28, height: 28 },
  introText: {
    fontSize: theme.typography.helper.fontSize,
    lineHeight: theme.typography.helper.lineHeight,
    fontWeight: '600',
    letterSpacing: 0.4,
    color: theme.colors.text.secondary,
  },
  listArea: { flex: 1 },
  listContent: {
    paddingHorizontal: GUTTER,
    paddingBottom: theme.spacing.md,
  },
  separator: { height: CARD_GAP },
});

export default MenuScreen;
