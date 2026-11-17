import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Check } from 'lucide-react-native';
import theme from '../constants/theme';
import { MAX_QTY, MIN_QTY, TOUCH_MIN } from '../constants/config';
import { LengthUnit } from '../utils/units';
import { formatLength } from '../utils/format';
import { Opening, OpeningKind, Wall } from '../game/types';
import DimensionControl from './DimensionControl';
import IntegerStepper from './IntegerStepper';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

export interface OpeningDraft {
  id?: string;
  wallId: string;
  kind: OpeningKind;
  widthM: number | null;
  heightM: number | null;
  quantity: number;
}

export interface OpeningEditorSheetProps {
  visible: boolean;
  draft: OpeningDraft | null;
  walls: Wall[];
  displayUnit: LengthUnit;
  reduceMotion?: boolean;
  onCommit: (draft: OpeningDraft) => void;
  onCancel: () => void;
}

function OpeningEditorSheet({
  visible,
  draft,
  walls,
  displayUnit,
  reduceMotion,
  onCommit,
  onCancel,
}: OpeningEditorSheetProps) {
  const [local, setLocal] = useState<OpeningDraft | null>(draft);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setLocal(draft);
      setError(null);
    }
  }, [visible, draft]);

  if (!local) {
    return null;
  }

  const kindLabel = local.kind === 'door' ? 'door' : 'window';
  const isEdit = !!local.id;
  const wall = walls.find(w => w.id === local.wallId) || null;

  const handleCommit = () => {
    if (local.widthM == null || local.heightM == null) {
      setError('Enter both a width and a height for this ' + kindLabel + '.');
      return;
    }
    if (!wall) {
      setError('Choose the wall this ' + kindLabel + ' belongs to.');
      return;
    }
    if (wall.widthM != null && local.widthM > wall.widthM + 1e-9) {
      setError('It is wider than ' + wall.label + '.');
      return;
    }
    if (wall.heightM != null && local.heightM > wall.heightM + 1e-9) {
      setError('It is taller than ' + wall.label + '.');
      return;
    }
    onCommit(local);
  };

  const renderWall = ({ item }: { item: Wall }) => {
    const selected = item.id === local.wallId;
    const dims =
      item.widthM != null && item.heightM != null
        ? formatLength(item.widthM, displayUnit) +
          ' x ' +
          formatLength(item.heightM, displayUnit)
        : 'Not measured yet';
    return (
      <Pressable
        onPress={() => setLocal({ ...local, wallId: item.id })}
        hitSlop={HIT}
        accessibilityRole="radio"
        accessibilityState={{ selected }}
        accessibilityLabel={item.label + ', ' + dims}
        style={[styles.wallRow, selected ? styles.wallRowActive : null]}>
        <View style={styles.wallText}>
          <Text style={styles.wallName} numberOfLines={1}>
            {item.label}
          </Text>
          <Text style={styles.wallDims} numberOfLines={1}>
            {dims}
          </Text>
        </View>
        {selected ? (
          <Check size={20} color={theme.colors.primary} strokeWidth={2} />
        ) : null}
      </Pressable>
    );
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
        <View style={styles.sheet}>
          <Text style={styles.title}>
            {isEdit ? 'Edit ' : 'Add '}
            {kindLabel}
          </Text>
          <Text style={styles.helper}>Enter each opening once.</Text>

          <Text style={styles.sectionLabel}>Wall</Text>
          <View style={styles.wallList}>
            <FlatList
              data={walls}
              keyExtractor={item => item.id}
              renderItem={renderWall}
              ItemSeparatorComponent={Separator}
              showsVerticalScrollIndicator={false}
              initialNumToRender={6}
              windowSize={5}
            />
          </View>

          <View style={styles.fields}>
            <View style={styles.field}>
              <DimensionControl
                label="Width"
                valueM={local.widthM}
                displayUnit={displayUnit}
                reduceMotion={reduceMotion}
                onCommit={value => {
                  setLocal({ ...local, widthM: value });
                  setError(null);
                }}
              />
            </View>
            <View style={styles.field}>
              <DimensionControl
                label="Height"
                valueM={local.heightM}
                displayUnit={displayUnit}
                reduceMotion={reduceMotion}
                onCommit={value => {
                  setLocal({ ...local, heightM: value });
                  setError(null);
                }}
              />
            </View>
          </View>

          <IntegerStepper
            label="How many"
            value={local.quantity}
            min={MIN_QTY}
            max={MAX_QTY}
            onChange={value => setLocal({ ...local, quantity: value })}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <PrimaryButton
            label={isEdit ? 'SAVE OPENING' : 'ADD OPENING'}
            onPress={handleCommit}
            reduceMotion={reduceMotion}
          />
          <SecondaryButton
            label="Cancel"
            onPress={onCancel}
            reduceMotion={reduceMotion}
          />
        </View>
      </View>
    </Modal>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end' },
  backdropFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.ui.overlay,
  },
  sheet: {
    maxHeight: '85%',
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
  sectionLabel: {
    fontSize: theme.typography.caption.fontSize,
    lineHeight: theme.typography.caption.lineHeight,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: theme.colors.text.tertiary,
  },
  wallList: {
    maxHeight: 160,
    borderRadius: theme.radius.input,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: theme.colors.ui.inset,
  },
  wallRow: {
    minHeight: TOUCH_MIN,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  wallRowActive: { backgroundColor: theme.colors.ui.mintTint },
  wallText: { flex: 1, minWidth: 0 },
  wallName: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  wallDims: {
    fontSize: theme.typography.caption.fontSize,
    lineHeight: theme.typography.caption.lineHeight,
    color: theme.colors.text.tertiary,
  },
  separator: { height: 1, backgroundColor: theme.colors.ui.divider },
  fields: { flexDirection: 'row', gap: theme.spacing.md },
  field: { flex: 1, minWidth: 0 },
  error: {
    fontSize: theme.typography.helper.fontSize,
    lineHeight: theme.typography.helper.lineHeight,
    fontWeight: '600',
    color: theme.colors.primary,
  },
});

export default React.memo(OpeningEditorSheet);
