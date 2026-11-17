import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';
import theme from '../constants/theme';

/**
 * Press feedback driven from a Pressable PARENT. The Animated.View always
 * lives INSIDE the Pressable, so Android release taps keep working.
 * Only transform is animated, so the native driver is safe.
 */
export function usePressScale(reduceMotion: boolean, to = 0.98) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = useCallback(() => {
    if (reduceMotion) {
      return;
    }
    Animated.timing(scale, {
      toValue: to,
      duration: theme.motion.fast,
      useNativeDriver: true,
    }).start();
  }, [reduceMotion, scale, to]);

  const onPressOut = useCallback(() => {
    if (reduceMotion) {
      return;
    }
    Animated.spring(scale, {
      toValue: 1,
      tension: theme.motion.spring.tension,
      friction: theme.motion.spring.friction,
      useNativeDriver: true,
    }).start();
  }, [reduceMotion, scale]);

  return { scale, onPressIn, onPressOut };
}

export default usePressScale;
