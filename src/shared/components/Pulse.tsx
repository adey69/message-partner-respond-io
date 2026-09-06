import { useEffect, useMemo, useRef, type ReactNode } from 'react';
import { Animated } from 'react-native';

const PULSE_MS = 700;
const DIM = 0.4;
const BRIGHT = 1;

type PulseProps = {
  children: ReactNode;
};

/** Fades placeholder content in and out while the real content loads. */
export function Pulse({ children }: PulseProps) {
  const opacity = useRef(new Animated.Value(BRIGHT)).current;
  const pulseStyle = useMemo(() => ({ opacity }), [opacity]);

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: DIM,
          duration: PULSE_MS,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: BRIGHT,
          duration: PULSE_MS,
          useNativeDriver: true,
        }),
      ]),
    );

    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={pulseStyle}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {children}
    </Animated.View>
  );
}
