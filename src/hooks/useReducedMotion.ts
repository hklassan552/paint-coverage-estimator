import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/** Reads the device accessibility preference once, then follows changes. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then(value => {
        if (active) {
          setReduced(!!value);
        }
      })
      .catch(() => {
        /* preference unavailable — keep motion on */
      });
    const sub = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      value => setReduced(!!value),
    );
    return () => {
      active = false;
      // RN returns a subscription object on supported versions.
      if (sub && typeof sub.remove === 'function') {
        sub.remove();
      }
    };
  }, []);

  return reduced;
}

export default useReducedMotion;
