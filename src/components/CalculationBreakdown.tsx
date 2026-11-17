import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import theme from '../constants/theme';
import { TOUCH_MIN, EditorStep } from '../constants/config';
import {
  LengthUnit,
  coverageSuffix,
  coverageToDisplay,
} from '../utils/units';
import { formatArea, formatLiters, num } from '../utils/format';
import { SavedResult } from '../game/types';
import SurfaceCard from './SurfaceCard';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

export interface CalculationBreakdownProps {
  result: SavedResult;
  displayUnit: LengthUnit;
  expanded: boolean;
  onToggle: () => void;
  onEditStep: (step: EditorStep) => void;
}

interface Row {
  key: string;
  label: string;
  value: string;
  step?: EditorStep;
}

function CalculationBreakdown({
  result,
  displayUnit,
  expanded,
  onToggle,
  onEditStep,
}: CalculationBreakdownProps) {
  const rows: Row[] = [
    {
      key: 'gross',
      label: 'Gross walls',
      value: formatArea(result.grossWallsM2, displayUnit),
      step: 'walls',
    },
    {
      key: 'openings',
      label: 'Doors and windows deducted',
      value: '- ' + formatArea(result.openingsM2, displayUnit),
      step: 'openings',
    },
    {
      key: 'net',
      label: 'Net walls',
      value: formatArea(result.netWallsM2, displayUnit),
    },
    {
      key: 'ceiling',
      label: 'Ceiling included',
      value: formatArea(result.ceilingM2, displayUnit),
      step: 'walls',
    },
    {
      key: 'total',
      label: 'Total area',
      value: formatArea(result.paintableM2, displayUnit),
    },
    {
      key: 'coats',
      label: 'Coats',
      value: String(result.coats),
      step: 'coats',
    },
    {
      key: 'coverage',
      label: 'Coverage, one coat',
      value:
        num(coverageToDisplay(result.coverageM2PerLiter, displayUnit)) +
        ' ' +
        coverageSuffix(displayUnit),
      step: 'coats',
    },
    {
      key: 'required',
      label: 'Required paint',
      value: formatLiters(result.requiredLiters, 3),
    },
    { key: 'extra', label: 'Extra allowance', value: 'none' },
  ];

  return (
    <SurfaceCard>
      <Pressable
        onPress={onToggle}
        hitSlop={HIT}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel="How it adds up"
        style={styles.head}>
        <Text style={styles.title}>How it adds up</Text>
        {expanded ? (
          <ChevronUp size={24} color={theme.colors.primary} strokeWidth={1.5} />
        ) : (
          <ChevronDown size={24} color={theme.colors.primary} strokeWidth={1.5} />
        )}
      </Pressable>

      {expanded ? (
        <View style={styles.rows}>
          {rows.map(row => (
            <View key={row.key} style={styles.row}>
              <Text style={styles.label} numberOfLines={2}>
                {row.label}
              </Text>
              <Text style={styles.value} numberOfLines={1}>
                {row.value}
              </Text>
              {row.step ? (
                <Pressable
                  onPress={() => onEditStep(row.step as EditorStep)}
                  hitSlop={HIT}
                  accessibilityRole="button"
                  accessibilityLabel={'Edit ' + row.label}
                  style={styles.edit}>
                  <Text style={styles.editLabel}>Edit</Text>
                </Pressable>
              ) : (
                <View style={styles.editSpacer} />
              )}
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.collapsed}>
          Open to see every area, the coats and the coverage behind the number.
        </Text>
      )}
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  head: {
    minHeight: TOUCH_MIN,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  title: {
    flex: 1,
    fontSize: theme.typography.cardHeading.fontSize,
    lineHeight: theme.typography.cardHeading.lineHeight,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  collapsed: {
    fontSize: theme.typography.helper.fontSize,
    lineHeight: theme.typography.helper.lineHeight,
    color: theme.colors.text.tertiary,
  },
  rows: {
    marginTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.ui.divider,
    paddingTop: theme.spacing.sm,
  },
  row: {
    minHeight: TOUCH_MIN,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  label: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    color: theme.colors.text.secondary,
  },
  value: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  edit: {
    width: 56,
    minHeight: TOUCH_MIN,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  editSpacer: { width: 56 },
  editLabel: {
    fontSize: theme.typography.helper.fontSize,
    lineHeight: 20,
    fontWeight: '800',
    textDecorationLine: 'underline',
    color: theme.colors.primary,
  },
});

export default React.memo(CalculationBreakdown);
