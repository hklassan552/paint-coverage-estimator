import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import theme from '../constants/theme';
import SecondaryButton from './SecondaryButton';

export type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export interface SaveStatusProps {
  state: SaveState;
  message?: string;
  reduceMotion?: boolean;
  onRetry?: () => void;
}

/** Announces the real write outcome — success is never shown optimistically. */
function SaveStatus({ state, message, reduceMotion, onRetry }: SaveStatusProps) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (state === 'saved') {
      opacity.setValue(reduceMotion ? 1 : 0);
      if (!reduceMotion) {
        Animated.timing(opacity, {
          toValue: 1,
          duration: theme.motion.base,
          useNativeDriver: true,
        }).start();
      }
    } else {
      opacity.setValue(0);
    }
  }, [state, opacity, reduceMotion]);

  if (state === 'idle' || state === 'saving') {
    return null;
  }

  if (state === 'error') {
    return (
      <View style={styles.errorWrap} accessibilityLiveRegion="assertive">
        <Text style={styles.errorText}>
          {message || "Couldn't save. Try again."}
        </Text>
        {onRetry ? (
          <SecondaryButton
            label="Retry"
            onPress={onRetry}
            reduceMotion={reduceMotion}
          />
        ) : null}
      </View>
    );
  }

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.savedWrap, { opacity }]}
      accessibilityLiveRegion="polite"
      accessibilityLabel={message || 'Estimate saved'}>
      <Check size={20} color={theme.colors.ink} strokeWidth={2.5} />
      <Text style={styles.savedText}>{message || 'Estimate saved'}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  savedWrap: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    minHeight: 40,
    borderRadius: theme.radius.input,
    backgroundColor: theme.colors.ui.mintTint,
    borderWidth: 1,
    borderColor: theme.colors.accent,
    paddingHorizontal: theme.spacing.md,
  },
  savedText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  errorWrap: {
    width: '100%',
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.radius.input,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.ui.plumTint,
  },
  errorText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
});

export default React.memo(SaveStatus);
