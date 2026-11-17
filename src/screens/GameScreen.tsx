import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Plus, RectangleHorizontal } from 'lucide-react-native';
import theme from '../constants/theme';
import { CARD_GAP, GUTTER, MAX_WALLS } from '../constants/config';
import { LengthUnit } from '../utils/units';
import { formatArea } from '../utils/format';
import { Ceiling, Opening, Room, Wall } from '../game/types';
import { areaBreakdown, ceilingAreaM2, wallGrossM2 } from '../game/estimate';
import { makeWall, newId, relabelWalls } from '../game/rooms';
import { validateOpenings, validateWalls } from '../game/validate';
import PaintedBackground from '../components/PaintedBackground';
import ScreenHeader from '../components/ScreenHeader';
import StepIndicator from '../components/StepIndicator';
import WallCard from '../components/WallCard';
import CeilingCard from '../components/CeilingCard';
import SurfacePreview from '../components/SurfacePreview';
import BottomPanel from '../components/BottomPanel';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import ValidationMessage from '../components/ValidationMessage';
import ConfirmSheet from '../components/ConfirmSheet';
import RectangleRoomSheet from '../components/RectangleRoomSheet';
import TextFieldSheet from '../components/TextFieldSheet';

export interface GameScreenProps {
  room: Room;
  displayUnit: LengthUnit;
  reduceMotion?: boolean;
  onUpdateRoom: (patch: Partial<Room>, invalidates: boolean) => void;
  onRename: (name: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

/** Walls — the measurement form with a fixed lower action surface. */
function GameScreen({
  room,
  displayUnit,
  reduceMotion,
  onUpdateRoom,
  onRename,
  onBack,
  onContinue,
}: GameScreenProps) {
  const [rectangleOpen, setRectangleOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [removing, setRemoving] = useState<Wall | null>(null);

  const area = useMemo(() => areaBreakdown(room), [room]);
  const wallIssues = useMemo(() => validateWalls(room), [room]);
  const openingIssues = useMemo(() => validateOpenings(room), [room]);
  const blockedIds = useMemo(
    () => openingIssues.map(i => i.fieldId),
    [openingIssues],
  );

  const activeWall = room.walls.length > 0 ? room.walls[0] : null;

  const patchWall = useCallback(
    (wallId: string, patch: Partial<Wall>) => {
      onUpdateRoom(
        {
          walls: room.walls.map(w => (w.id === wallId ? { ...w, ...patch } : w)),
        },
        true,
      );
    },
    [room.walls, onUpdateRoom],
  );

  const addWall = useCallback(() => {
    if (room.walls.length >= MAX_WALLS) {
      return;
    }
    const last = room.walls[room.walls.length - 1];
    const wall = makeWall(room.walls.length + 1);
    if (last && last.heightM != null) {
      wall.heightM = last.heightM;
      wall.copiedHeight = true;
    }
    onUpdateRoom({ walls: relabelWalls([...room.walls, wall]) }, true);
  }, [room.walls, onUpdateRoom]);

  const duplicateWall = useCallback(
    (wall: Wall) => {
      if (room.walls.length >= MAX_WALLS) {
        return;
      }
      const copy: Wall = { ...wall, id: newId('wall'), copiedHeight: false };
      const index = room.walls.findIndex(w => w.id === wall.id);
      const next = room.walls.slice();
      next.splice(index + 1, 0, copy);
      onUpdateRoom({ walls: relabelWalls(next) }, true);
    },
    [room.walls, onUpdateRoom],
  );

  const removeWall = useCallback(
    (wall: Wall) => {
      const walls = relabelWalls(room.walls.filter(w => w.id !== wall.id));
      const openings = room.openings.filter(
        (o: Opening) => o.wallId !== wall.id,
      );
      onUpdateRoom({ walls, openings }, true);
    },
    [room.walls, room.openings, onUpdateRoom],
  );

  const requestRemoveWall = useCallback(
    (wall: Wall) => {
      const hasOpenings = room.openings.some(o => o.wallId === wall.id);
      if (hasOpenings) {
        setRemoving(wall);
        return;
      }
      removeWall(wall);
    },
    [room.openings, removeWall],
  );

  const applyRectangle = useCallback(
    (lengthM: number, widthM: number, heightM: number) => {
      const dims = [lengthM, widthM, lengthM, widthM];
      const walls = dims.map((d, i) => {
        const wall = makeWall(i + 1);
        wall.widthM = d;
        wall.heightM = heightM;
        return wall;
      });
      onUpdateRoom(
        {
          walls,
          openings: [],
          ceiling: {
            ...room.ceiling,
            lengthM,
            widthM,
          },
        },
        true,
      );
      setRectangleOpen(false);
    },
    [room.ceiling, onUpdateRoom],
  );

  const setCeiling = useCallback(
    (patch: Partial<Ceiling>) => {
      onUpdateRoom({ ceiling: { ...room.ceiling, ...patch } }, true);
    },
    [room.ceiling, onUpdateRoom],
  );

  const renderItem = useCallback(
    ({ item }: { item: Wall }) => (
      <WallCard
        wall={item}
        areaM2={wallGrossM2(item)}
        displayUnit={displayUnit}
        reduceMotion={reduceMotion}
        hasOpeningErrors={blockedIds.indexOf(item.id) >= 0}
        onChange={patch => patchWall(item.id, patch)}
        onDuplicate={() => duplicateWall(item)}
        onRemove={() => requestRemoveWall(item)}
      />
    ),
    [
      displayUnit,
      reduceMotion,
      blockedIds,
      patchWall,
      duplicateWall,
      requestRemoveWall,
    ],
  );

  const keyExtractor = useCallback((item: Wall) => item.id, []);

  const canContinue = wallIssues.length === 0;
  const firstIssue = wallIssues.length > 0 ? wallIssues[0].message : null;
  const reviewOpenings = canContinue && openingIssues.length > 0;

  const header = (
    <View style={styles.headerBlock}>
      <SurfacePreview
        widthM={activeWall ? activeWall.widthM : null}
        heightM={activeWall ? activeWall.heightM : null}
        label={activeWall ? activeWall.label : 'No walls yet'}
        displayUnit={displayUnit}
      />
      <SecondaryButton
        label="RECTANGULAR ROOM"
        Icon={RectangleHorizontal}
        onPress={() => setRectangleOpen(true)}
        reduceMotion={reduceMotion}
      />
    </View>
  );

  const footer = (
    <View style={styles.footerBlock}>
      <SecondaryButton
        label="ADD WALL"
        Icon={Plus}
        onPress={addWall}
        disabled={room.walls.length >= MAX_WALLS}
        reduceMotion={reduceMotion}
      />
      <CeilingCard
        ceiling={room.ceiling}
        areaM2={ceilingAreaM2(room.ceiling)}
        displayUnit={displayUnit}
        reduceMotion={reduceMotion}
        onToggle={enabled => setCeiling({ enabled })}
        onChange={setCeiling}
      />
    </View>
  );

  return (
    <PaintedBackground variant="walls">
      <View style={styles.root}>
        <ScreenHeader
          title={room.name}
          subtitle="Walls"
          onBack={onBack}
          actionLabel="Rename"
          onAction={() => setRenaming(true)}
        />
        <StepIndicator
          currentStep="walls"
          reachableSteps={['walls']}
          onSelect={() => {}}
        />

        <View style={styles.listArea}>
          <FlatList
            data={room.walls}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ItemSeparatorComponent={Separator}
            ListHeaderComponent={header}
            ListFooterComponent={footer}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            initialNumToRender={4}
            windowSize={7}
            keyboardShouldPersistTaps="handled"
          />
        </View>

        <BottomPanel>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Gross area</Text>
            <Text style={styles.summaryValue}>
              {formatArea(area.grossWallsM2 + area.ceilingM2, displayUnit)}
            </Text>
          </View>

          {firstIssue ? <ValidationMessage message={firstIssue} /> : null}
          {reviewOpenings ? (
            <ValidationMessage message="Review openings - one no longer fits its wall." />
          ) : null}

          <PrimaryButton
            label="CONTINUE TO OPENINGS"
            onPress={onContinue}
            disabled={!canContinue}
            reduceMotion={reduceMotion}
          />
        </BottomPanel>
      </View>

      <RectangleRoomSheet
        visible={rectangleOpen}
        existingSurfaceCount={room.walls.length}
        displayUnit={displayUnit}
        reduceMotion={reduceMotion}
        onApply={applyRectangle}
        onCancel={() => setRectangleOpen(false)}
      />

      <TextFieldSheet
        visible={renaming}
        title="Room name"
        label="Name"
        initialValue={room.name}
        confirmLabel="SAVE NAME"
        reduceMotion={reduceMotion}
        onCommit={name => {
          onRename(name);
          setRenaming(false);
        }}
        onCancel={() => setRenaming(false)}
      />

      <ConfirmSheet
        visible={!!removing}
        title="Remove this wall?"
        description="The doors and windows attached to it are removed as well."
        confirmLabel="REMOVE WALL"
        reduceMotion={reduceMotion}
        onConfirm={() => {
          if (removing) {
            removeWall(removing);
          }
          setRemoving(null);
        }}
        onCancel={() => setRemoving(null)}
      />
    </PaintedBackground>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  listArea: { flex: 1 },
  listContent: { paddingHorizontal: GUTTER, paddingBottom: theme.spacing.lg },
  headerBlock: { gap: theme.spacing.md, paddingBottom: CARD_GAP },
  footerBlock: { gap: CARD_GAP, paddingTop: CARD_GAP },
  separator: { height: CARD_GAP },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.lineHeight,
    color: theme.colors.text.secondary,
  },
  summaryValue: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '800',
    color: theme.colors.primary,
  },
});

export default GameScreen;
