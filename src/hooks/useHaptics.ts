import { useCallback } from 'react';
import { Vibration } from 'react-native';
import { HAPTIC_MS } from '../constants/config';

/**
 * One short pulse, only when the user has haptics enabled.
 * Uses the normal VIBRATE permission — there is no runtime request.
 */
export function useHaptics(enabled: boolean) {
  return useCallback(() => {
    if (!enabled) {
      return;
    }
    try {
      Vibration.vibrate(HAPTIC_MS);
    } catch (e) {
      /* vibrator unavailable — feedback is optional */
    }
  }, [enabled]);
}

export default useHaptics;
