import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import theme from '../constants/theme';
import { LengthUnit } from '../utils/units';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

export interface UnitSelectorProps {
  currentUnit: LengthUnit;
  onChange: (unit: LengthUnit) => void;
}

const OPTIONS: Array<{ key: LengthUnit; label: string; a11y: string }> = [
  { key: 'metres', label: 'Metres · m and m²', a11y: 'Metres, metres and square metres' },
  { key: 'feet', label: 'Feet · ft and ft²', a11y: 'Feet, feet and square feet' },
];

function UnitSelector({ currentUnit, onChange }: UnitSelectorProps) {
  return (
    <View style={styles.wrap} accessibilityRole="radiogroup">
      {OPTIONS.map(option => {
        const selected = option.key === currentUnit;
        return (
          <Pressable
            key={option.key}
            onPress={() => onChange(option.key)}
            hitSlop={HIT}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={option.a11y}
            style={[styles.row, selected ? styles.rowActive : null]}>
            <Text
              style={[styles.label, selected ? styles.labelActive : null]}
              numberOfLines={1}>
              {option.label}
            </Text>
            {selected ? (
              <Check size={24} color={theme.colors.primary} strokeWidth={2} />
            ) : null}
          </Pressable>
        );
      })}
      <Text style={styles.helper}>
        Feet are decimal feet, for example 8.25 ft.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', gap: theme.spacing.sm },
  row: {
    width: '100%',
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.input,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: theme.colors.ui.inset,
  },
  rowActive: {
    backgroundColor: theme.colors.ui.mintTint,
    borderColor: theme.colors.ui.borderStrong,
  },
  label: {
    flex: 1,
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.lineHeight,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  labelActive: { color: theme.colors.text.primary, fontWeight: '800' },
  helper: {
    fontSize: theme.typography.helper.fontSize,
    lineHeight: theme.typography.helper.lineHeight,
    color: theme.colors.text.tertiary,
  },
});

export default React.memo(UnitSelector);
