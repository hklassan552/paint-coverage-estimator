import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DoorOpen, Pencil, RectangleHorizontal, Trash2 } from 'lucide-react-native';
import theme from '../constants/theme';
import { LengthUnit } from '../utils/units';
import { formatArea, formatLength } from '../utils/format';
import { Opening } from '../game/types';
import SecondaryButton from './SecondaryButton';
import SurfaceCard from './SurfaceCard';

export interface OpeningCardProps {
  opening: Opening;
  wallName: string;
  deductedM2: number;
  displayUnit: LengthUnit;
  reduceMotion?: boolean;
  error?: string | null;
  onEdit: () => void;
  onRemove: () => void;
}

function OpeningCard({
  opening,
  wallName,
  deductedM2,
  displayUnit,
  reduceMotion,
  error,
  onEdit,
  onRemove,
}: OpeningCardProps) {
  const Icon = opening.kind === 'door' ? DoorOpen : RectangleHorizontal;
  const kindLabel = opening.kind === 'door' ? 'Door' : 'Window';
  const dims =
    opening.widthM != null && opening.heightM != null
      ? formatLength(opening.widthM, displayUnit) +
        ' x ' +
        formatLength(opening.heightM, displayUnit)
      : 'Dimensions missing';

  return (
    <SurfaceCard
      style={error ? styles.flagged : undefined}
      accessibilityLabel={kindLabel + ' on ' + wallName}>
      <View style={styles.topRow}>
        <View style={styles.iconWrap}>
          <Icon size={22} color={theme.colors.primary} strokeWidth={1.5} />
        </View>
        <View style={styles.titleCol}>
          <Text style={styles.title} numberOfLines={1}>
            {kindLabel}
          </Text>
          <Text style={styles.sub} numberOfLines={1}>
            {wallName} · {dims}
          </Text>
        </View>
        <View style={styles.qtyPill}>
          <Text style={styles.qtyText}>x{opening.quantity}</Text>
        </View>
      </View>

      <View style={styles.deductRow}>
        <Text style={styles.deductLabel}>Deducted</Text>
        <Text style={styles.deductValue}>
          {formatArea(deductedM2, displayUnit)}
        </Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.actions}>
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
  topRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.ui.plumTint,
  },
  titleCol: { flex: 1, minWidth: 0 },
  title: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  sub: {
    fontSize: theme.typography.helper.fontSize,
    lineHeight: theme.typography.helper.lineHeight,
    color: theme.colors.text.tertiary,
  },
  qtyPill: {
    minWidth: 44,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.ui.mintTint,
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
    color: theme.colors.text.primary,
  },
  deductRow: {
    marginTop: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: theme.colors.ui.divider,
    paddingTop: theme.spacing.sm,
  },
  deductLabel: {
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.lineHeight,
    color: theme.colors.text.secondary,
  },
  deductValue: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  error: {
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

export default React.memo(OpeningCard);
