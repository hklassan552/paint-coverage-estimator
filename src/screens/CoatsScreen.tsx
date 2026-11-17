import React, { useCallback, useMemo, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Ruler } from 'lucide-react-native';
import theme from '../constants/theme';
import {
  CARD_GAP,
  GUTTER,
  MAX_COATS,
  MIN_COATS,
} from '../constants/config';
import { LengthUnit } from '../utils/units';
import { formatArea } from '../utils/format';
import { Room } from '../game/types';
import { areaBreakdown } from '../game/estimate';
import { validateCoats, validateRoom } from '../game/validate';
import PaintedBackground from '../components/PaintedBackground';
import ScreenHeader from '../components/ScreenHeader';
import StepIndicator from '../components/StepIndicator';
import SurfaceCard from '../components/SurfaceCard';
import AreaSummary from '../components/AreaSummary';
import IntegerStepper from '../components/IntegerStepper';
import CoverageControl from '../components/CoverageControl';
import CanSizeSelector from '../components/CanSizeSelector';
import BottomPanel from '../components/BottomPanel';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import ValidationMessage from '../components/ValidationMessage';

type CardKey = 'area' | 'coats' | 'coverage' | 'cans';
const CARDS: CardKey[] = ['area', 'coats', 'coverage', 'cans'];

export interface CoatsScreenProps {
  room: Room;
  displayUnit: LengthUnit;
  reduceMotion?: boolean;
  onUpdateRoom: (patch: Partial<Room>, invalidates: boolean) => void;
  onBack: () => void;
  onCalculate: () => void;
  onUnits: () => void;
  onStep: (step: 'walls' | 'openings' | 'coats' | 'result') => void;
}

function CoatsScreen({
  room,
  displayUnit,
  reduceMotion,
  onUpdateRoom,
  onBack,
  onCalculate,
  onUnits,
  onStep,
}: CoatsScreenProps) {
  const [calculating, setCalculating] = useState(false);
  const busyRef = useRef(false);

  const area = useMemo(() => areaBreakdown(room), [room]);
  const coatIssues = useMemo(() => validateCoats(room), [room]);
  const allIssues = useMemo(() => validateRoom(room), [room]);
  const blocking = allIssues.length > 0;

  const handleCalculate = useCallback(() => {
    if (busyRef.current || blocking) {
      return;
    }
    busyRef.current = true;
    setCalculating(true);
    onCalculate();
    // The transition unmounts this screen; the guard is released defensively.
    setTimeout(() => {
      busyRef.current = false;
      setCalculating(false);
    }, 400);
  }, [blocking, onCalculate]);

  const renderItem = useCallback(
    ({ item }: { item: CardKey }) => {
      if (item === 'area') {
        return (
          <SurfaceCard title="This room">
            <View style={styles.cardBody}>
              <AreaSummary
                grossM2={area.grossWallsM2}
                openingsM2={area.openingsM2}
                netWallsM2={area.netWallsM2}
                ceilingM2={area.ceilingM2}
                displayUnit={displayUnit}
              />
            </View>
          </SurfaceCard>
        );
      }
      if (item === 'coats') {
        return (
          <SurfaceCard title="Coats" caption="How many coats of the same paint.">
            <View style={styles.cardBody}>
              <IntegerStepper
                label="Coats"
                value={room.coats}
                min={MIN_COATS}
                max={MAX_COATS}
                size="large"
                onChange={value => onUpdateRoom({ coats: value }, true)}
              />
            </View>
          </SurfaceCard>
        );
      }
      if (item === 'coverage') {
        return (
          <SurfaceCard title="Coverage">
            <View style={styles.cardBody}>
              <CoverageControl
                coverageM2PerLiter={room.coverageM2PerLiter}
                displayUnit={displayUnit}
                reduceMotion={reduceMotion}
                onCommit={value =>
                  onUpdateRoom({ coverageM2PerLiter: value }, true)
                }
                error={
                  coatIssues.find(i => i.fieldId === 'coverage')?.message || null
                }
              />
              <View style={styles.unitsRow}>
                <SecondaryButton
                  label="Units"
                  Icon={Ruler}
                  onPress={onUnits}
                  reduceMotion={reduceMotion}
                />
              </View>
            </View>
          </SurfaceCard>
        );
      }
      return (
        <SurfaceCard
          title="Can sizes at your shop"
          caption="Only the sizes you can actually buy are used.">
          <View style={styles.cardBody}>
            <CanSizeSelector
              availableSizesLiters={room.availableCanSizesLiters}
              onChange={sizes =>
                onUpdateRoom({ availableCanSizesLiters: sizes }, true)
              }
              error={coatIssues.find(i => i.fieldId === 'cans')?.message || null}
            />
          </View>
        </SurfaceCard>
      );
    },
    [
      area,
      displayUnit,
      reduceMotion,
      room.coats,
      room.coverageM2PerLiter,
      room.availableCanSizesLiters,
      coatIssues,
      onUpdateRoom,
      onUnits,
    ],
  );

  return (
    <PaintedBackground variant="coats">
      <View style={styles.root}>
        <ScreenHeader
          title="Coats & coverage"
          subtitle={room.name}
          onBack={onBack}
        />
        <StepIndicator
          currentStep="coats"
          reachableSteps={['walls', 'openings', 'coats']}
          onSelect={onStep}
        />

        <View style={styles.listArea}>
          <FlatList
            data={CARDS}
            keyExtractor={item => item}
            renderItem={renderItem}
            ItemSeparatorComponent={Separator}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        </View>

        <BottomPanel>
          <View style={styles.readyRow}>
            <Text style={styles.readyLabel}>Ready to estimate</Text>
            <Text style={styles.readyValue}>
              {formatArea(area.paintableM2, displayUnit)} · {room.coats} coat
              {room.coats === 1 ? '' : 's'}
            </Text>
          </View>

          {blocking ? (
            <ValidationMessage
              message={allIssues[0].message}
              actionLabel={
                allIssues[0].step === 'coats' ? null : 'Go to that step'
              }
              onAction={
                allIssues[0].step === 'coats'
                  ? null
                  : () => onStep(allIssues[0].step)
              }
            />
          ) : null}

          <PrimaryButton
            label="CALCULATE"
            onPress={handleCalculate}
            disabled={blocking}
            busy={calculating}
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
  cardBody: { marginTop: theme.spacing.md, gap: theme.spacing.md },
  unitsRow: { width: 160 },
  readyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  readyLabel: {
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.lineHeight,
    color: theme.colors.text.secondary,
  },
  readyValue: {
    fontSize: theme.typography.bodyStrong.fontSize,
    lineHeight: theme.typography.bodyStrong.lineHeight,
    fontWeight: '800',
    color: theme.colors.primary,
  },
});

export default CoatsScreen;
