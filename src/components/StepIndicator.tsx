import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import theme from '../constants/theme';
import { EDITOR_STEPS, EditorStep, STEP_LABELS, TOUCH_MIN } from '../constants/config';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

export interface StepIndicatorProps {
  currentStep: EditorStep;
  reachableSteps: EditorStep[];
  onSelect: (step: EditorStep) => void;
}

function StepIndicator({
  currentStep,
  reachableSteps,
  onSelect,
}: StepIndicatorProps) {
  const currentIndex = EDITOR_STEPS.indexOf(currentStep);

  return (
    <View style={styles.strip} accessibilityRole="tablist">
      {EDITOR_STEPS.map((step, index) => {
        const active = step === currentStep;
        const reachable = reachableSteps.indexOf(step) >= 0;
        const done = index < currentIndex;
        return (
          <Pressable
            key={step}
            onPress={reachable && !active ? () => onSelect(step) : undefined}
            disabled={!reachable || active}
            hitSlop={HIT}
            accessibilityRole="tab"
            accessibilityState={{ selected: active, disabled: !reachable }}
            accessibilityLabel={
              'Step ' + (index + 1) + ', ' + STEP_LABELS[step]
            }
            style={[styles.step, active ? styles.stepActive : null]}>
            <View style={styles.stepRow}>
              {done ? (
                <Check size={14} color={theme.colors.primary} strokeWidth={2} />
              ) : null}
              <Text
                style={[
                  styles.label,
                  active ? styles.labelActive : null,
                  !reachable ? styles.labelDisabled : null,
                ]}
                numberOfLines={1}>
                {STEP_LABELS[step]}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  step: {
    flex: 1,
    height: TOUCH_MIN,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: 'rgba(250,250,250,0.72)',
  },
  stepActive: {
    backgroundColor: theme.colors.ui.mintTint,
    borderColor: theme.colors.ui.borderStrong,
  },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  label: {
    fontSize: theme.typography.caption.fontSize,
    lineHeight: theme.typography.caption.lineHeight,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  labelActive: { color: theme.colors.primary, fontWeight: '800' },
  labelDisabled: { color: 'rgba(36,24,33,0.38)' },
});

export default React.memo(StepIndicator);
