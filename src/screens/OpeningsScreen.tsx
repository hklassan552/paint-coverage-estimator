import React, { useCallback, useMemo, useState } from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import { DoorOpen, RectangleHorizontal } from 'lucide-react-native';
import theme from '../constants/theme';
import { CARD_GAP, GUTTER, MAX_OPENINGS } from '../constants/config';
import assets from '../assets';
import { LengthUnit } from '../utils/units';
import { formatArea } from '../utils/format';
import { Opening, Room } from '../game/types';
import {
  areaBreakdown,
  openingAreaM2,
  openingsOnWallM2,
  wallGrossM2,
  wallNetM2,
} from '../game/estimate';
import { newId } from '../game/rooms';
import { validateOpenings } from '../game/validate';
import PaintedBackground from '../components/PaintedBackground';
import ScreenHeader from '../components/ScreenHeader';
import StepIndicator from '../components/StepIndicator';
import OpeningCard from '../components/OpeningCard';
import OpeningEditorSheet, {
  OpeningDraft,
} from '../components/OpeningEditorSheet';
import BottomPanel from '../components/BottomPanel';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import ValidationMessage from '../components/ValidationMessage';
import EmptyState from '../components/EmptyState';

export interface OpeningsScreenProps {
  room: Room;
  displayUnit: LengthUnit;
  reduceMotion?: boolean;
  onUpdateRoom: (patch: Partial<Room>, invalidates: boolean) => void;
  onBack: () => void;
  onContinue: () => void;
  onStep: (step: 'walls' | 'openings' | 'coats' | 'result') => void;
}

interface Section {
  key: string;
  title: string;
  subtitle: string;
  data: Opening[];
}

function OpeningsScreen({
  room,
  displayUnit,
  reduceMotion,
  onUpdateRoom,
  onBack,
  onContinue,
  onStep,
}: OpeningsScreenProps) {
  const [draft, setDraft] = useState<OpeningDraft | null>(null);

  const area = useMemo(() => areaBreakdown(room), [room]);
  const issues = useMemo(() => validateOpenings(room), [room]);
  const errorFor = useCallback(
    (id: string) => {
      const found = issues.find(i => i.fieldId === id);
      return found ? found.message : null;
    },
    [issues],
  );

  const sections = useMemo<Section[]>(
    () =>
      room.walls
        .map(wall => ({
          key: wall.id,
          title: wall.label,
          subtitle:
            formatArea(wallGrossM2(wall), displayUnit) +
            ' gross · ' +
            formatArea(wallNetM2(wall, room.openings), displayUnit) +
            ' left',
          data: room.openings.filter(o => o.wallId === wall.id),
        }))
        .filter(section => section.data.length > 0),
    [room.walls, room.openings, displayUnit],
  );

  const wallName = useCallback(
    (wallId: string) => {
      const wall = room.walls.find(w => w.id === wallId);
      return wall ? wall.label : 'Unassigned wall';
    },
    [room.walls],
  );

  const openNew = useCallback(
    (kind: 'door' | 'window') => {
      if (room.walls.length === 0 || room.openings.length >= MAX_OPENINGS) {
        return;
      }
      setDraft({
        wallId: room.walls[0].id,
        kind,
        widthM: null,
        heightM: null,
        quantity: 1,
      });
    },
    [room.walls, room.openings.length],
  );

  const commitDraft = useCallback(
    (value: OpeningDraft) => {
      const next: Opening = {
        id: value.id || newId('open'),
        wallId: value.wallId,
        kind: value.kind,
        widthM: value.widthM,
        heightM: value.heightM,
        quantity: value.quantity,
      };
      const openings = value.id
        ? room.openings.map(o => (o.id === value.id ? next : o))
        : [...room.openings, next];
      onUpdateRoom({ openings }, true);
      setDraft(null);
    },
    [room.openings, onUpdateRoom],
  );

  const removeOpening = useCallback(
    (id: string) => {
      onUpdateRoom({ openings: room.openings.filter(o => o.id !== id) }, true);
    },
    [room.openings, onUpdateRoom],
  );

  const renderItem = useCallback(
    ({ item }: { item: Opening }) => (
      <OpeningCard
        opening={item}
        wallName={wallName(item.wallId)}
        deductedM2={openingAreaM2(item)}
        displayUnit={displayUnit}
        reduceMotion={reduceMotion}
        error={errorFor(item.id)}
        onEdit={() =>
          setDraft({
            id: item.id,
            wallId: item.wallId,
            kind: item.kind,
            widthM: item.widthM,
            heightM: item.heightM,
            quantity: item.quantity,
          })
        }
        onRemove={() => removeOpening(item.id)}
      />
    ),
    [wallName, displayUnit, reduceMotion, errorFor, removeOpening],
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: Section }) => {
      const wall = room.walls.find(w => w.id === section.key);
      const overfilled =
        wall != null &&
        openingsOnWallM2(wall.id, room.openings) > wallGrossM2(wall) + 1e-9;
      return (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle} numberOfLines={1}>
            {section.title}
          </Text>
          <Text
            style={[styles.sectionSub, overfilled ? styles.sectionWarn : null]}
            numberOfLines={1}>
            {section.subtitle}
          </Text>
        </View>
      );
    },
    [room.walls, room.openings],
  );

  const ceilingOnly = room.walls.length === 0;
  const canContinue = issues.length === 0;

  return (
    <PaintedBackground variant="openings">
      <View style={styles.root}>
        <ScreenHeader title="Openings" subtitle={room.name} onBack={onBack} />
        <StepIndicator
          currentStep="openings"
          reachableSteps={['walls', 'openings']}
          onSelect={onStep}
        />

        <View style={styles.listArea}>
          <SectionList
            sections={sections}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
            ItemSeparatorComponent={Separator}
            stickySectionHeadersEnabled={false}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            initialNumToRender={6}
            windowSize={7}
            ListEmptyComponent={
              ceilingOnly ? (
                <EmptyState
                  illustration={assets.sprite5}
                  title="No walls in this estimate"
                  description="Your ceiling has no door or window deductions."
                />
              ) : (
                <EmptyState
                  illustration={assets.sprite5}
                  title="No openings to subtract"
                  description="Continue if this room has no doors or windows to deduct."
                />
              )
            }
            ListFooterComponent={
              <View style={styles.addRow}>
                <View style={styles.addSlot}>
                  <SecondaryButton
                    label="ADD DOOR"
                    Icon={DoorOpen}
                    onPress={() => openNew('door')}
                    disabled={ceilingOnly}
                    reduceMotion={reduceMotion}
                  />
                </View>
                <View style={styles.addSlot}>
                  <SecondaryButton
                    label="ADD WINDOW"
                    Icon={RectangleHorizontal}
                    onPress={() => openNew('window')}
                    disabled={ceilingOnly}
                    reduceMotion={reduceMotion}
                  />
                </View>
              </View>
            }
          />
        </View>

        <BottomPanel>
          <View style={styles.summary}>
            <SummaryRow
              label="Gross walls"
              value={formatArea(area.grossWallsM2, displayUnit)}
            />
            <SummaryRow
              label="Openings deducted"
              value={'- ' + formatArea(area.openingsM2, displayUnit)}
            />
            <SummaryRow
              label="Remaining walls"
              value={formatArea(area.netWallsM2, displayUnit)}
              strong
            />
          </View>

          {issues.length > 0 ? (
            <ValidationMessage
              message={issues[0].message}
              actionLabel="Edit dimensions"
              onAction={() => onStep('walls')}
            />
          ) : null}

          <PrimaryButton
            label="CONTINUE TO COATS"
            onPress={onContinue}
            disabled={!canContinue}
            reduceMotion={reduceMotion}
          />
        </BottomPanel>
      </View>

      <OpeningEditorSheet
        visible={!!draft}
        draft={draft}
        walls={room.walls}
        displayUnit={displayUnit}
        reduceMotion={reduceMotion}
        onCommit={commitDraft}
        onCancel={() => setDraft(null)}
      />
    </PaintedBackground>
  );
}

function SummaryRow({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel} numberOfLines={1}>
        {label}
      </Text>
      <Text
        style={[styles.summaryValue, strong ? styles.summaryStrong : null]}
        numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  listArea: { flex: 1 },
  listContent: { paddingHorizontal: GUTTER, paddingBottom: theme.spacing.lg },
  separator: { height: CARD_GAP },
  sectionHeader: { paddingTop: theme.spacing.lg, paddingBottom: theme.spacing.sm },
  sectionTitle: {
    fontSize: theme.typography.cardHeading.fontSize,
    lineHeight: theme.typography.cardHeading.lineHeight,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  sectionSub: {
    fontSize: theme.typography.helper.fontSize,
    lineHeight: theme.typography.helper.lineHeight,
    color: theme.colors.text.tertiary,
  },
  sectionWarn: { color: theme.colors.primary, fontWeight: '700' },
  addRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    paddingTop: theme.spacing.lg,
  },
  addSlot: { flex: 1, minWidth: 0 },
  summary: { gap: 4 },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  summaryLabel: {
    flex: 1,
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.lineHeight,
    color: theme.colors.text.secondary,
  },
  summaryValue: {
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.lineHeight,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  summaryStrong: { fontWeight: '800', color: theme.colors.primary, fontSize: 18 },
});

export default OpeningsScreen;
