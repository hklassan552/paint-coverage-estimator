import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { LengthUnit } from '../utils/units';
import { formatArea } from '../utils/format';

export interface AreaSummaryProps {
  grossM2: number;
  openingsM2: number;
  netWallsM2: number;
  ceilingM2: number;
  displayUnit: LengthUnit;
  compact?: boolean;
}

interface RowSpec {
  key: string;
  label: string;
  value: string;
  strong?: boolean;
}

/** The same measurement summary wording on the editor and on the result. */
function AreaSummary({
  grossM2,
  openingsM2,
  netWallsM2,
  ceilingM2,
  displayUnit,
  compact,
}: AreaSummaryProps) {
  const rows: RowSpec[] = [
    { key: 'gross', label: 'Gross walls', value: formatArea(grossM2, displayUnit) },
    {
      key: 'openings',
      label: 'Openings deducted',
      value: '- ' + formatArea(openingsM2, displayUnit),
    },
    {
      key: 'net',
      label: 'Remaining walls',
      value: formatArea(netWallsM2, displayUnit),
    },
  ];

  if (ceilingM2 > 0) {
    rows.push({
      key: 'ceiling',
      label: 'Ceiling included',
      value: formatArea(ceilingM2, displayUnit),
    });
  }

  rows.push({
    key: 'total',
    label: 'Total paintable',
    value: formatArea(netWallsM2 + ceilingM2, displayUnit),
    strong: true,
  });

  const visible = compact ? rows.slice(-3) : rows;

  return (
    <View style={styles.wrap}>
      {visible.map(row => (
        <View key={row.key} style={styles.row}>
          <Text
            style={[styles.label, row.strong ? styles.labelStrong : null]}
            numberOfLines={1}>
            {row.label}
          </Text>
          <Text
            style={[styles.value, row.strong ? styles.valueStrong : null]}
            numberOfLines={1}>
            {row.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', gap: 6 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  label: {
    flex: 1,
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.lineHeight,
    color: theme.colors.text.secondary,
  },
  labelStrong: { fontWeight: '700', color: theme.colors.text.primary },
  value: {
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.lineHeight,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  valueStrong: { fontWeight: '800', color: theme.colors.primary, fontSize: 18 },
});

export default React.memo(AreaSummary);
