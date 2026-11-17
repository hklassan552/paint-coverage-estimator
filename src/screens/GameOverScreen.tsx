import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Palette } from 'lucide-react-native';
import theme from '../constants/theme';
import {
  CARD_GAP,
  GUTTER,
  SAVED_MESSAGE_MS,
  EditorStep,
} from '../constants/config';
import { LengthUnit } from '../utils/units';
import { ColorNote, Room, SavedResult } from '../game/types';
import { headlineLiters } from '../game/rooms';
import PaintedBackground from '../components/PaintedBackground';
import ScreenHeader from '../components/ScreenHeader';
import StepIndicator from '../components/StepIndicator';
import ResultHero from '../components/ResultHero';
import CanPlanCard from '../components/CanPlanCard';
import CalculationBreakdown from '../components/CalculationBreakdown';
import SurfaceCard from '../components/SurfaceCard';
import BottomPanel from '../components/BottomPanel';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import SaveStatus, { SaveState } from '../components/SaveStatus';

type CardKey = 'hero' | 'plan' | 'breakdown' | 'note';
const CARDS: CardKey[] = ['hero', 'plan', 'breakdown', 'note'];

export interface GameOverScreenProps {
  room: Room;
  result: SavedResult;
  linkedNote: ColorNote | null;
  displayUnit: LengthUnit;
  reduceMotion?: boolean;
  hapticsEnabled?: boolean;
  onSave: () => void;
  onAgain: () => void;
  onMenu: () => void;
  onBack: () => void;
  onEditStep: (step: EditorStep) => void;
  onColorNote: () => void;
  onHaptic: () => void;
}

/** Result — the distinct large-number screen with the shopping plan. */
function GameOverScreen({
  room,
  result,
  linkedNote,
  displayUnit,
  reduceMotion,
  onSave,
  onAgain,
  onMenu,
  onBack,
  onEditStep,
  onColorNote,
  onHaptic,
}: GameOverScreenProps) {
  const [expanded, setExpanded] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    },
    [],
  );

  const handleSave = useCallback(() => {
    if (saveState === 'saving') {
      return;
    }
    setSaveState('saving');
    // The write is committed first; success feedback follows the write.
    onSave();
    onHaptic();
    setSaveState('saved');
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(
      () => setSaveState('idle'),
      SAVED_MESSAGE_MS,
    );
  }, [saveState, onSave, onHaptic]);

  const renderItem = useCallback(
    ({ item }: { item: CardKey }) => {
      if (item === 'hero') {
        return (
          <ResultHero
            headlineLiters={headlineLiters(result)}
            paintableM2={result.paintableM2}
            coats={result.coats}
            coverageM2PerLiter={result.coverageM2PerLiter}
            displayUnit={displayUnit}
          />
        );
      }
      if (item === 'plan') {
        return (
          <CanPlanCard
            canRows={result.rows}
            purchasedLiters={result.purchasedLiters}
            leftoverLiters={result.leftoverLiters}
          />
        );
      }
      if (item === 'breakdown') {
        return (
          <CalculationBreakdown
            result={result}
            displayUnit={displayUnit}
            expanded={expanded}
            onToggle={() => setExpanded(value => !value)}
            onEditStep={onEditStep}
          />
        );
      }
      return (
        <SurfaceCard title="Colour for this room">
          <View style={styles.noteBody}>
            {linkedNote ? (
              <>
                <Text style={styles.noteName} numberOfLines={1}>
                  {linkedNote.name}
                </Text>
                <Text style={styles.noteCode} numberOfLines={1}>
                  {linkedNote.colorCode}
                </Text>
                <SecondaryButton
                  label="Edit colour note"
                  Icon={Palette}
                  onPress={onColorNote}
                  reduceMotion={reduceMotion}
                />
              </>
            ) : (
              <>
                <Text style={styles.noteHelper}>
                  Keep the exact code with this room. It does not change the
                  quantity.
                </Text>
                <SecondaryButton
                  label="ADD COLOR NOTE"
                  Icon={Palette}
                  onPress={onColorNote}
                  reduceMotion={reduceMotion}
                />
              </>
            )}
          </View>
        </SurfaceCard>
      );
    },
    [result, displayUnit, expanded, linkedNote, reduceMotion, onEditStep, onColorNote],
  );

  return (
    <PaintedBackground variant="result">
      <View style={styles.root}>
        <ScreenHeader
          title="Your paint estimate"
          subtitle={room.name}
          onBack={onBack}
          actionLabel="Rooms"
          onAction={onMenu}
        />
        <StepIndicator
          currentStep="result"
          reachableSteps={['walls', 'openings', 'coats', 'result']}
          onSelect={onEditStep}
        />

        <View style={styles.listArea}>
          <FlatList
            data={CARDS}
            keyExtractor={item => item}
            renderItem={renderItem}
            ItemSeparatorComponent={Separator}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <BottomPanel>
          <SaveStatus state={saveState} reduceMotion={reduceMotion} />
          <PrimaryButton
            label="SAVE ESTIMATE"
            onPress={handleSave}
            busy={saveState === 'saving'}
            reduceMotion={reduceMotion}
          />
          <SecondaryButton
            label="CALCULATE AGAIN"
            onPress={onAgain}
            reduceMotion={reduceMotion}
          />
        </BottomPanel>
      </View>
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
  separator: { height: CARD_GAP },
  noteBody: { marginTop: theme.spacing.md, gap: theme.spacing.sm },
  noteName: {
    fontSize: theme.typography.bodyStrong.fontSize,
    lineHeight: theme.typography.bodyStrong.lineHeight,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  noteCode: {
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.lineHeight,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  noteHelper: {
    fontSize: theme.typography.helper.fontSize,
    lineHeight: theme.typography.helper.lineHeight,
    color: theme.colors.text.tertiary,
  },
});

export default GameOverScreen;
