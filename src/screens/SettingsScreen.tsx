import React, { useCallback } from 'react';
import { FlatList, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { ShieldCheck } from 'lucide-react-native';
import theme from '../constants/theme';
import { CARD_GAP, GUTTER, TOUCH_MIN } from '../constants/config';
import { LengthUnit } from '../utils/units';
import { Settings } from '../game/types';
import PaintedBackground from '../components/PaintedBackground';
import ScreenHeader from '../components/ScreenHeader';
import SurfaceCard from '../components/SurfaceCard';
import UnitSelector from '../components/UnitSelector';
import BottomPanel from '../components/BottomPanel';
import PrimaryButton from '../components/PrimaryButton';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type CardKey = 'units' | 'volume' | 'preferences' | 'privacy';
const CARDS: CardKey[] = ['units', 'volume', 'preferences', 'privacy'];

export interface SettingsScreenProps {
  settings: Settings;
  reduceMotion?: boolean;
  onChange: (patch: Partial<Settings>) => void;
  onDone: () => void;
}

function ToggleRow({
  label,
  helper,
  value,
  onChange,
}: {
  label: string;
  helper: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <Pressable
      onPress={() => onChange(!value)}
      hitSlop={HIT}
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value }}
      style={styles.toggleRow}>
      <View style={styles.toggleText}>
        <Text style={styles.toggleLabel}>{label}</Text>
        <Text style={styles.toggleHelper}>{helper}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: theme.colors.secondary, true: theme.colors.accent }}
        thumbColor={theme.colors.surface}
        accessibilityLabel={label}
      />
    </Pressable>
  );
}

function SettingsScreen({
  settings,
  reduceMotion,
  onChange,
  onDone,
}: SettingsScreenProps) {
  const renderItem = useCallback(
    ({ item }: { item: CardKey }) => {
      if (item === 'units') {
        return (
          <SurfaceCard title="Length and area">
            <View style={styles.cardBody}>
              <UnitSelector
                currentUnit={settings.lengthUnit}
                onChange={(unit: LengthUnit) => onChange({ lengthUnit: unit })}
              />
              <Text style={styles.saved}>
                Saved · existing measurements are converted, never changed.
              </Text>
            </View>
          </SurfaceCard>
        );
      }
      if (item === 'volume') {
        return (
          <SurfaceCard title="Paint quantities: liters">
            <View style={styles.cardBody}>
              <Text style={styles.body}>
                Coverage uses m²/L or ft²/L to match your measurements.
              </Text>
              <Text style={styles.helper}>
                Changing length units keeps can sizes and paint volumes in
                liters.
              </Text>
            </View>
          </SurfaceCard>
        );
      }
      if (item === 'preferences') {
        return (
          <SurfaceCard title="Preferences">
            <View style={styles.cardBody}>
              <ToggleRow
                label="Haptic feedback"
                helper="One short pulse when something is saved."
                value={settings.hapticsEnabled}
                onChange={value => onChange({ hapticsEnabled: value })}
              />
              <View style={styles.divider} />
              <ToggleRow
                label="Reduce motion"
                helper="Removes nonessential movement across the app."
                value={settings.reduceMotionEnabled}
                onChange={value => onChange({ reduceMotionEnabled: value })}
              />
            </View>
          </SurfaceCard>
        );
      }
      return (
        <SurfaceCard>
          <View style={styles.privacyRow}>
            <View style={styles.privacyIcon}>
              <ShieldCheck size={24} color={theme.colors.primary} strokeWidth={1.5} />
            </View>
            <View style={styles.privacyText}>
              <Text style={styles.privacyTitle}>
                Your rooms stay on this device
              </Text>
              <Text style={styles.helper}>
                No account or internet connection needed.
              </Text>
            </View>
          </View>
        </SurfaceCard>
      );
    },
    [settings, onChange],
  );

  return (
    <PaintedBackground variant="settings">
      <View style={styles.root}>
        <ScreenHeader title="Settings" subtitle="Units and preferences" onBack={onDone} />

        <View style={styles.listArea}>
          <FlatList
            data={CARDS}
            keyExtractor={item => item}
            renderItem={renderItem}
            ItemSeparatorComponent={Separator}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <BottomPanel>
          <PrimaryButton
            label="DONE"
            onPress={onDone}
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
  listContent: {
    paddingHorizontal: GUTTER,
    paddingTop: GUTTER,
    paddingBottom: theme.spacing.lg,
  },
  separator: { height: CARD_GAP },
  cardBody: { marginTop: theme.spacing.md, gap: theme.spacing.md },
  body: {
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.lineHeight,
    color: theme.colors.text.secondary,
  },
  helper: {
    fontSize: theme.typography.helper.fontSize,
    lineHeight: theme.typography.helper.lineHeight,
    color: theme.colors.text.tertiary,
  },
  saved: {
    fontSize: theme.typography.helper.fontSize,
    lineHeight: theme.typography.helper.lineHeight,
    fontWeight: '600',
    // Ink, not mint: mint on a light surface never reaches 4.5:1 at this size.
    color: theme.colors.text.tertiary,
  },
  toggleRow: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  toggleText: { flex: 1, minWidth: 0 },
  toggleLabel: {
    fontSize: theme.typography.bodyStrong.fontSize,
    lineHeight: theme.typography.bodyStrong.lineHeight,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  toggleHelper: {
    fontSize: theme.typography.helper.fontSize,
    lineHeight: theme.typography.helper.lineHeight,
    color: theme.colors.text.tertiary,
  },
  divider: { height: 1, backgroundColor: theme.colors.ui.divider },
  privacyRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
  privacyIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.ui.plumTint,
  },
  privacyText: { flex: 1, minWidth: 0 },
  privacyTitle: {
    fontSize: theme.typography.bodyStrong.fontSize,
    lineHeight: theme.typography.bodyStrong.lineHeight,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  spacer: { height: TOUCH_MIN },
});

export default SettingsScreen;
