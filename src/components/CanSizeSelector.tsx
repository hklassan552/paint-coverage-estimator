import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import theme from '../constants/theme';
import { CAN_SIZES_L, TOUCH_MIN } from '../constants/config';
import { formatCanSize } from '../utils/format';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

export interface CanSizeSelectorProps {
  availableSizesLiters: number[];
  onChange: (sizes: number[]) => void;
  error?: string | null;
}

/** Five independently selectable 48 dp chips. At least one stays selected. */
function CanSizeSelector({
  availableSizesLiters,
  onChange,
  error,
}: CanSizeSelectorProps) {
  const toggle = (size: number) => {
    const selected = availableSizesLiters.indexOf(size) >= 0;
    if (selected) {
      if (availableSizesLiters.length === 1) {
        return;
      }
      onChange(availableSizesLiters.filter(s => s !== size));
      return;
    }
    onChange(
      CAN_SIZES_L.filter(
        s => s === size || availableSizesLiters.indexOf(s) >= 0,
      ),
    );
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {CAN_SIZES_L.map(size => {
          const selected = availableSizesLiters.indexOf(size) >= 0;
          return (
            <Pressable
              key={size}
              onPress={() => toggle(size)}
              hitSlop={HIT}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: selected }}
              accessibilityLabel={formatCanSize(size) + ' can'}
              style={[styles.chip, selected ? styles.chipActive : null]}>
              {selected ? (
                <Check size={16} color={theme.colors.primary} strokeWidth={2.5} />
              ) : null}
              <Text
                style={[styles.chipText, selected ? styles.chipTextActive : null]}
                numberOfLines={1}>
                {formatCanSize(size)}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', gap: theme.spacing.sm },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  chip: {
    minHeight: TOUCH_MIN,
    minWidth: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.input,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: theme.colors.ui.inset,
  },
  chipActive: {
    backgroundColor: theme.colors.ui.mintTint,
    borderColor: theme.colors.ui.borderStrong,
  },
  chipText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  chipTextActive: { color: theme.colors.text.primary, fontWeight: '800' },
  error: {
    fontSize: theme.typography.helper.fontSize,
    lineHeight: theme.typography.helper.lineHeight,
    fontWeight: '600',
    color: theme.colors.primary,
  },
});

export default React.memo(CanSizeSelector);
