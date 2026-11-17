import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import assets from '../assets';
import { CanRow } from '../game/types';
import {
  formatCanSize,
  formatLiters,
  formatPurchased,
  pluralCans,
} from '../utils/format';
import SurfaceCard from './SurfaceCard';

export interface CanPlanCardProps {
  canRows: CanRow[];
  purchasedLiters: number;
  leftoverLiters: number;
}

function CanPlanCard({
  canRows,
  purchasedLiters,
  leftoverLiters,
}: CanPlanCardProps) {
  return (
    <SurfaceCard tone="raised">
      <View style={styles.head}>
        <View style={styles.headText}>
          <Text style={styles.title}>Buy this much</Text>
          <Text style={styles.total}>{formatPurchased(purchasedLiters)}</Text>
        </View>
        <Image
          source={assets.sprite3}
          style={styles.art}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
        />
      </View>

      <View style={styles.rows}>
        {canRows.map(row => (
          <View key={row.sizeL} style={styles.row}>
            <Text style={styles.rowLabel} numberOfLines={1}>
              {pluralCans(row.count)} · {formatCanSize(row.sizeL)}
            </Text>
            <Text style={styles.rowValue} numberOfLines={1}>
              {formatPurchased(row.count * row.sizeL)}
            </Text>
          </View>
        ))}

        <View style={[styles.row, styles.leftoverRow]}>
          <Text style={styles.rowLabel} numberOfLines={1}>
            Estimated paint left
          </Text>
          <Text style={styles.leftoverValue} numberOfLines={1}>
            {formatLiters(leftoverLiters)}
          </Text>
        </View>
      </View>

      <Text style={styles.helper}>Least extra paint, then fewest cans.</Text>
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  headText: { flex: 1, minWidth: 0 },
  art: { width: 56, height: 56 },
  title: {
    fontSize: theme.typography.cardHeading.fontSize,
    lineHeight: theme.typography.cardHeading.lineHeight,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  total: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  rows: {
    gap: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.ui.divider,
    paddingTop: theme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  rowLabel: {
    flex: 1,
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.lineHeight,
    color: theme.colors.text.primary,
  },
  rowValue: {
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.lineHeight,
    fontWeight: '700',
    color: theme.colors.text.secondary,
  },
  leftoverRow: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.ui.divider,
    paddingTop: theme.spacing.sm,
  },
  leftoverValue: {
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.lineHeight,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  helper: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.helper.fontSize,
    lineHeight: theme.typography.helper.lineHeight,
    color: theme.colors.text.tertiary,
  },
});

export default React.memo(CanPlanCard);
