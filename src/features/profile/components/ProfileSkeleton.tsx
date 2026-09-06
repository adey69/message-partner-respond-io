import { View } from 'react-native';
import { createProfileSkeletonStyles } from './ProfileSkeleton.styles';
import { Pulse } from '@/shared/components/Pulse';
import { useThemedStyles } from '@/shared/theme/useThemedStyles';

export function ProfileSkeleton() {
  const styles = useThemedStyles(createProfileSkeletonStyles);

  return (
    <View style={styles.container}>
      <Pulse>
        <View style={styles.avatar} />
        <View style={[styles.line, styles.name]} />
        <View style={[styles.line, styles.phone]} />
        <View style={styles.button} />
      </Pulse>
    </View>
  );
}
