import { useEffect, useMemo, useRef } from 'react';
import { Animated, View } from 'react-native';
import { createChatListSkeletonStyles } from './ChatListSkeleton.styles';
import { useThemedStyles } from '@/shared/theme/useThemedStyles';

const ROW_COUNT = 12;
const PULSE_MS = 700;
const DIM = 0.4;
const BRIGHT = 1;

const placeholderRows = Array.from({ length: ROW_COUNT }, (_, index) => index);

export function ChatListSkeleton() {
  const styles = useThemedStyles(createChatListSkeletonStyles);
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
      {placeholderRows.map(index => (
        <View key={index} style={styles.row}>
          <View style={styles.avatar} />
          <View style={styles.content}>
            <View style={styles.nameBar} />
            <View style={styles.previewBar} />
          </View>
        </View>
      ))}
    </Animated.View>
  );
}
