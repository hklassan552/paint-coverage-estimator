import React from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { Layers } from 'lucide-react-native';
import theme from '../constants/theme';
import { TOUCH_MIN } from '../constants/config';
import { LengthUnit, areaSuffix, m2ToDisplay } from '../utils/units';
import { fixed2 } from '../utils/format';
import { Ceiling } from '../game/types';
import DimensionControl from './DimensionControl';
import SurfaceCard from './SurfaceCard';
import SurfacePreview from './SurfacePreview';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

export interface CeilingCardProps {
  ceiling: Ceiling;
  areaM2: number;
  displayUnit: LengthUnit;
  reduceMotion?: boolean;
  onToggle: (enabled: boolean) => void;
  onChange: (patch: Partial<Ceiling>) => void;
}

function CeilingCard({
  ceiling,
  areaM2,
  displayUnit,
  reduceMotion,
  onToggle,
  onChange,
}: CeilingCardProps) {
  return (
    <SurfaceCard tone="raised" accessibilityLabel="Ceiling">
      <Pressable
        onPress={() => onToggle(!ceiling.enabled)}
        hitSlop={HIT}
        accessibilityRole="switch"
        accessibilityLabel="Include ceiling"
        accessibilityState={{ checked: ceiling.enabled }}
        style={styles.toggleRow}>
        <View style={styles.iconWrap}>
          <Layers size={24} color={theme.colors.primary} strokeWidth={1.5} />
        </View>
        <View style={styles.toggleText}>
          <Text style={styles.title}>Include ceiling</Text>
          <Text style={styles.helper}>
            Include the ceiling when using the same paint.
          </Text>
        </View>
        <Switch
          value={ceiling.enabled}
          onValueChange={onToggle}
          trackColor={{ false: theme.colors.secondary, true: theme.colors.accent }}
          thumbColor={theme.colors.surface}
          accessibilityLabel="Include ceiling"
        />
      </Pressable>

      {ceiling.enabled ? (
        <View style={styles.body}>
          <View style={styles.fields}>
            <View style={styles.field}>
              <DimensionControl
                label="Ceiling length"
                valueM={ceiling.lengthM}
                displayUnit={displayUnit}
                reduceMotion={reduceMotion}
                onCommit={value => onChange({ lengthM: value })}
              />
            </View>
            <View style={styles.field}>
              <DimensionControl
                label="Ceiling width"
                valueM={ceiling.widthM}
                displayUnit={displayUnit}
                reduceMotion={reduceMotion}
                onCommit={value => onChange({ widthM: value })}
              />
            </View>
          </View>

          <View style={styles.areaRow}>
            <Text style={styles.areaLabel}>Ceiling area</Text>
            <Text style={styles.areaValue}>
              {fixed2(m2ToDisplay(areaM2, displayUnit))}{' '}
              {areaSuffix(displayUnit)}
            </Text>
          </View>

          <SurfacePreview
            widthM={ceiling.lengthM}
            heightM={ceiling.widthM}
            label="Ceiling shape"
            displayUnit={displayUnit}
          />

          <Text style={styles.note}>
            Doors and windows are deducted from walls only.
          </Text>
        </View>
      ) : (
        <Text style={styles.note}>
          Dimensions are kept if you switch the ceiling off again.
        </Text>
      )}
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  toggleRow: {
    minHeight: TOUCH_MIN,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.ui.plumTint,
  },
  toggleText: { flex: 1, minWidth: 0 },
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
  body: { marginTop: theme.spacing.lg, gap: theme.spacing.lg },
  fields: { flexDirection: 'row', gap: theme.spacing.md },
  field: { flex: 1, minWidth: 0 },
  areaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  areaLabel: {
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.lineHeight,
    color: theme.colors.text.secondary,
  },
  areaValue: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  note: {
    marginTop: theme.spacing.sm,
    fontSize: theme.typography.helper.fontSize,
    lineHeight: theme.typography.helper.lineHeight,
    color: theme.colors.text.tertiary,
  },
});

export default React.memo(CeilingCard);
