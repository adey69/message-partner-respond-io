import { View } from 'react-native';
import { createThreadSkeletonStyles } from './ThreadSkeleton.styles';
import { Pulse } from '@/shared/components/Pulse';
import { useThemedStyles } from '@/shared/theme/useThemedStyles';

export function ThreadSkeleton() {
  const styles = useThemedStyles(createThreadSkeletonStyles);

  return (
    <View style={styles.container}>
      <Pulse>
        <View style={styles.row}>
          <View style={[styles.bubble, styles.bubbleMd]} />
        </View>
        <View style={styles.row}>
          <View style={[styles.bubble, styles.bubbleSm]} />
        </View>
        <View style={[styles.row, styles.rowOutgoing]}>
          <View style={[styles.bubble, styles.bubbleLg]} />
        </View>
        <View style={styles.row}>
          <View style={[styles.bubble, styles.bubbleLg]} />
        </View>
        <View style={[styles.row, styles.rowOutgoing]}>
          <View style={[styles.bubble, styles.bubbleMd]} />
        </View>
        <View style={styles.row}>
          <View style={[styles.bubble, styles.bubbleSm]} />
        </View>
      </Pulse>
    </View>
  );
}
