import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Copy, Trash2 } from 'lucide-react-native';
import theme from '../constants/theme';
import { IS_NARROW } from '../constants/config';
import { LengthUnit, areaSuffix, m2ToDisplay } from '../utils/units';
import { fixed2 } from '../utils/format';
import { Wall } from '../game/types';
import DimensionControl from './DimensionControl';
import SecondaryButton from './SecondaryButton';
import SurfaceCard from './SurfaceCard';

export interface WallCardProps {
  wall: Wall;
  areaM2: number;
  displayUnit: LengthUnit;
  reduceMotion?: boolean;
  hasOpeningErrors?: boolean;
  onChange: (patch: Partial<Wall>) => void;
  onDuplicate: () => void;
  onRemove: () => void;
}

function WallCard({
  wall,
  areaM2,
  displayUnit,
  reduceMotion,
  hasOpeningErrors,
  onChange,
  onDuplicate,
  onRemove,
}: WallCardProps) {
  return (
    <SurfaceCard
      style={hasOpeningErrors ? styles.flagged : undefined}
      accessibilityLabel={wall.label}>
      <View style={styles.headRow}>
        <Text style={styles.name} numberOfLines={1}>
          {wall.label}
        </Text>
        <Text style={styles.area} numberOfLines={1}>
          {fixed2(m2ToDisplay(areaM2, displayUnit))} {areaSuffix(displayUnit)}
        </Text>
      </View>

      {wall.copiedHeight ? (
        <Text style={styles.copied}>Copied height from the previous wall</Text>
      ) : null}

      <View style={[styles.fields, IS_NARROW ? styles.fieldsStacked : null]}>
        <View style={IS_NARROW ? styles.fieldStacked : styles.field}>
          <DimensionControl
            label="Width"
            valueM={wall.widthM}
            displayUnit={displayUnit}
            reduceMotion={reduceMotion}
            onCommit={value => onChange({ widthM: value, copiedHeight: false })}
          />
        </View>
        <View style={IS_NARROW ? styles.fieldStacked : styles.field}>
          <DimensionControl
            label="Height"
            valueM={wall.heightM}
            displayUnit={displayUnit}
            reduceMotion={reduceMotion}
            onCommit={value => onChange({ heightM: value, copiedHeight: false })}
          />
        </View>
      </View>

      {hasOpeningErrors ? (
        <Text style={styles.flagNote}>
          An opening on this wall no longer fits. Review it on the Openings step.
        </Text>
      ) : null}

      <View style={styles.actions}>
        <View style={styles.actionSlot}>
          <SecondaryButton
            label="Duplicate"
            Icon={Copy}
            onPress={onDuplicate}
            reduceMotion={reduceMotion}
          />
        </View>
        <View style={styles.actionSlot}>
          <SecondaryButton
            label="Remove"
            Icon={Trash2}
            tone="danger"
            onPress={onRemove}
            reduceMotion={reduceMotion}
          />
        </View>
      </View>
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  flagged: { borderColor: theme.colors.primary, borderWidth: 2 },
  headRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  name: {
    flex: 1,
    fontSize: theme.typography.cardHeading.fontSize,
    lineHeight: theme.typography.cardHeading.lineHeight,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  area: {
    fontSize: theme.typography.bodyStrong.fontSize,
    lineHeight: theme.typography.bodyStrong.lineHeight,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  copied: {
    fontSize: theme.typography.caption.fontSize,
    lineHeight: theme.typography.caption.lineHeight,
    fontWeight: '600',
    color: theme.colors.text.tertiary,
    marginBottom: theme.spacing.sm,
  },
  fields: { flexDirection: 'row', gap: theme.spacing.md },
  fieldsStacked: { flexDirection: 'column' },
  field: { flex: 1, minWidth: 0 },
  // Stacked in a column the slot must take its intrinsic height, never flex:1
  // inside an auto-height parent — that collapses the control.
  fieldStacked: { width: '100%' },
  flagNote: {
    marginTop: theme.spacing.sm,
    fontSize: theme.typography.helper.fontSize,
    lineHeight: theme.typography.helper.lineHeight,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  actionSlot: { flex: 1, minWidth: 0 },
});

export default React.memo(WallCard);
